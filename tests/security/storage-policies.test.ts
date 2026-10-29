// @vitest-environment node
/**
 * CATALYST - Storage policy tests for lms-audio, cms and voice-recordings (serviceos#2011)
 *
 * Runs against a LOCAL Postgres only: it creates a scratch database, loads a
 * minimal Supabase stub (fixtures/storage-stub.sql) holding the pre-lock prod
 * policies, applies the lock migration, then impersonates each actor with
 * `SET LOCAL ROLE` + `request.jwt.claims` (what PostgREST/Storage do).
 *
 * Set STORAGE_POLICY_TEST_DATABASE_URL to a superuser URL on localhost, e.g.
 *   postgres://postgres@localhost:5432/postgres
 * Without it the suite is skipped (see scratch-db.ts for the local-only guard).
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Client } from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { ADMIN_URL, createScratchDb } from "./scratch-db"

const STUB_SQL = ["auth-stub", "profiles-stub", "storage-stub"]
  .map((f) => readFileSync(path.join(__dirname, `fixtures/${f}.sql`), "utf8"))
  .join("\n")
const MIGRATION_SQL = readFileSync(
  path.join(__dirname, "../../supabase/migrations/20261029130000_lock_storage_writes.sql"),
  "utf8"
)
const ROLLBACK_SQL = readFileSync(
  path.join(__dirname, "../../supabase/rollback/20261029130000_lock_storage_writes.down.sql"),
  "utf8"
)

// Fixed ids so folder paths are readable in failures
const LEARNER = "00000000-0000-4000-8000-00000000000a"
const OTHER_LEARNER = "00000000-0000-4000-8000-00000000000b"
const OTHER_DOMAIN = "00000000-0000-4000-8000-00000000000c" // auth user, no profile
const MARKETING = "00000000-0000-4000-8000-00000000000d"
const ADMIN = "00000000-0000-4000-8000-00000000000e"

type Cmd = "SELECT" | "INSERT" | "UPDATE" | "DELETE"
type Outcome = "allowed" | "refused"
type Actor = {
  role: "anon" | "authenticated" | "service_role"
  claims: Record<string, unknown>
}

const anon: Actor = { role: "anon", claims: { role: "anon" } }
const authed = (sub: string, email: string): Actor => ({
  role: "authenticated",
  claims: { role: "authenticated", sub, email },
})
// Emails are example.com placeholders; the policies never look at the email.
const learner = authed(LEARNER, "learner@company.example")
const otherDomainLearner = authed(OTHER_DOMAIN, "someone@other.example")
const marketing = authed(MARKETING, "marketing@company.example")
const admin = authed(ADMIN, "admin@company.example")
const serviceRole: Actor = { role: "service_role", claims: { role: "service_role" } }

const SEEDED = {
  "lms-audio": "seed/a.mp3",
  cms: "properties/seed.jpg",
} as const

describe.skipIf(!ADMIN_URL)("storage policies (serviceos#2011)", () => {
  let db: Client
  let dropDb: () => Promise<void>

  /** Run one statement as `actor` inside a transaction that is always rolled back. */
  async function attempt(
    actor: Actor,
    cmd: Cmd,
    bucket: string,
    objectPath: string,
    moveTo?: { name?: string; bucket?: string }
  ): Promise<Outcome> {
    await db.query("BEGIN")
    try {
      await db.query(`SET LOCAL ROLE ${actor.role}`)
      await db.query("SELECT set_config('request.jwt.claims', $1, true)", [
        JSON.stringify(actor.claims),
      ])
      let result
      if (cmd === "INSERT") {
        result = await db.query(
          "INSERT INTO storage.objects (bucket_id, name) VALUES ($1, $2)",
          [bucket, objectPath]
        )
      } else if (cmd === "UPDATE") {
        result = await db.query(
          "UPDATE storage.objects SET name = $3, bucket_id = $4 WHERE bucket_id = $1 AND name = $2",
          [bucket, objectPath, moveTo?.name ?? objectPath, moveTo?.bucket ?? bucket]
        )
      } else if (cmd === "DELETE") {
        result = await db.query(
          "DELETE FROM storage.objects WHERE bucket_id = $1 AND name = $2",
          [bucket, objectPath]
        )
      } else {
        result = await db.query(
          "SELECT 1 FROM storage.objects WHERE bucket_id = $1 AND name = $2",
          [bucket, objectPath]
        )
      }
      // INSERT either errors (WITH CHECK) or inserts; UPDATE/DELETE/SELECT that
      // RLS filters out simply touch zero rows.
      return result.rowCount ? "allowed" : "refused"
    } catch (err) {
      // 42501 = insufficient_privilege, which is what a failed RLS check raises.
      // Any other error means the test setup is wrong, not that access was refused.
      if ((err as { code?: string }).code === "42501") return "refused"
      throw err
    } finally {
      await db.query("ROLLBACK")
    }
  }

  beforeAll(async () => {
    const scratch = await createScratchDb("storage_policy_test")
    db = scratch.db
    dropDb = scratch.drop
    await db.query(STUB_SQL)
    await db.query(MIGRATION_SQL)

    await db.query(
      `INSERT INTO public.user_profiles (id, role) VALUES
         ($1, 'learner'), ($2, 'learner'), ($3, 'marketing'), ($4, 'admin')`,
      [LEARNER, OTHER_LEARNER, MARKETING, ADMIN]
    )
    // OTHER_DOMAIN deliberately has no profile row.
    await db.query(
      `INSERT INTO storage.objects (bucket_id, name) VALUES
         ('lms-audio', $1), ('cms', $2),
         ('voice-recordings', $3), ('voice-recordings', $4), ('voice-recordings', $5)`,
      [
        SEEDED["lms-audio"],
        SEEDED.cms,
        `${LEARNER}/seed.webm`,
        `${OTHER_LEARNER}/seed.webm`,
        `${OTHER_DOMAIN}/seed.webm`,
      ]
    )
  })

  afterAll(async () => {
    await dropDb?.()
  })

  const WRITES: Cmd[] = ["INSERT", "UPDATE", "DELETE"]
  const objectFor = (bucket: keyof typeof SEEDED, cmd: Cmd) =>
    cmd === "INSERT" ? `new/${cmd}.bin` : SEEDED[bucket]

  describe.each([
    ["anon", anon],
    ["learner (company domain)", learner],
    ["other-domain learner (no profile)", otherDomainLearner],
    ["marketing", marketing],
  ] as const)("%s", (_label, actor) => {
    it.each(WRITES)("is refused %s on lms-audio", async (cmd) => {
      expect(await attempt(actor, cmd, "lms-audio", objectFor("lms-audio", cmd))).toBe("refused")
    })
    it.each(WRITES)("is refused %s on cms", async (cmd) => {
      expect(await attempt(actor, cmd, "cms", objectFor("cms", cmd))).toBe("refused")
    })
  })

  it.each(WRITES)("admin is refused %s on lms-audio (system only)", async (cmd) => {
    expect(await attempt(admin, cmd, "lms-audio", objectFor("lms-audio", cmd))).toBe("refused")
  })

  describe("anon on voice-recordings", () => {
    it.each(["SELECT", ...WRITES] as Cmd[])("is refused %s", async (cmd) => {
      const target = cmd === "INSERT" ? `${LEARNER}/new.webm` : `${LEARNER}/seed.webm`
      expect(await attempt(anon, cmd, "voice-recordings", target)).toBe("refused")
    })
  })

  describe("voice-recordings folders", () => {
    it.each([
      ["SELECT", `${LEARNER}/seed.webm`],
      ["INSERT", `${LEARNER}/new.webm`],
      ["UPDATE", `${LEARNER}/seed.webm`],
      ["DELETE", `${LEARNER}/seed.webm`],
    ] as [Cmd, string][])("learner is allowed %s in their own folder", async (cmd, target) => {
      expect(await attempt(learner, cmd, "voice-recordings", target)).toBe("allowed")
    })

    it.each([
      ["SELECT", `${OTHER_LEARNER}/seed.webm`],
      ["INSERT", `${OTHER_LEARNER}/new.webm`],
      ["UPDATE", `${OTHER_LEARNER}/seed.webm`],
      ["DELETE", `${OTHER_LEARNER}/seed.webm`],
    ] as [Cmd, string][])("learner is refused %s in another user's folder", async (cmd, target) => {
      expect(await attempt(learner, cmd, "voice-recordings", target)).toBe("refused")
    })

    it("learner cannot move their own object into another user's folder", async () => {
      expect(
        await attempt(
          learner,
          "UPDATE",
          "voice-recordings",
          `${LEARNER}/seed.webm`,
          { name: `${OTHER_LEARNER}/stolen.webm` }
        )
      ).toBe("refused")
    })

    it.each([
      ["SELECT", `${LEARNER}/seed.webm`],
      ["INSERT", `${LEARNER}/new.webm`],
      ["UPDATE", `${LEARNER}/seed.webm`],
      ["DELETE", `${LEARNER}/seed.webm`],
    ] as [Cmd, string][])("other-domain learner is refused %s in another user's folder", async (cmd, target) => {
      expect(await attempt(otherDomainLearner, cmd, "voice-recordings", target)).toBe("refused")
    })

    it.each(["SELECT", "INSERT", "UPDATE", "DELETE"] as Cmd[])(
      "marketing and admin get no cross-user %s",
      async (cmd) => {
        const target = cmd === "INSERT" ? `${LEARNER}/new.webm` : `${LEARNER}/seed.webm`
        expect(await attempt(marketing, cmd, "voice-recordings", target)).toBe("refused")
        expect(await attempt(admin, cmd, "voice-recordings", target)).toBe("refused")
      }
    )
  })

  describe("admin on cms", () => {
    it("can insert", async () => {
      expect(await attempt(admin, "INSERT", "cms", "properties/new.jpg")).toBe("allowed")
    })
    it("can update", async () => {
      expect(await attempt(admin, "UPDATE", "cms", SEEDED.cms)).toBe("allowed")
    })
    it("can delete", async () => {
      expect(await attempt(admin, "DELETE", "cms", SEEDED.cms)).toBe("allowed")
    })
  })

  describe("admin moving objects between buckets", () => {
    it("cannot move a cms object into lms-audio (UPDATE WITH CHECK)", async () => {
      expect(await attempt(admin, "UPDATE", "cms", SEEDED.cms, { bucket: "lms-audio" })).toBe(
        "refused"
      )
    })
    it("cannot move a cms object into voice-recordings", async () => {
      expect(
        await attempt(admin, "UPDATE", "cms", SEEDED.cms, {
          bucket: "voice-recordings",
          name: `${LEARNER}/moved.webm`,
        })
      ).toBe("refused")
    })
  })

  describe("service_role on lms-audio", () => {
    it.each(WRITES)("is allowed %s (bypasses RLS)", async (cmd) => {
      expect(await attempt(serviceRole, cmd, "lms-audio", objectFor("lms-audio", cmd))).toBe(
        "allowed"
      )
    })
  })

  describe("public reads are preserved", () => {
    it.each([
      ["anon", anon],
      ["learner", learner],
    ] as const)("%s can still read lms-audio and cms", async (_label, actor) => {
      expect(await attempt(actor, "SELECT", "lms-audio", SEEDED["lms-audio"])).toBe("allowed")
      expect(await attempt(actor, "SELECT", "cms", SEEDED.cms)).toBe("allowed")
    })
  })

  describe("policy inventory", () => {
    it("has no write policy left on lms-audio or any non-admin write on cms", async () => {
      const { rows } = await db.query(
        `SELECT policyname, cmd, roles::text AS roles, coalesce(qual, '') || coalesce(with_check, '') AS expr
           FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'`
      )
      const writes = rows.filter((r) => r.cmd !== "SELECT")
      expect(writes.filter((r) => r.expr.includes("lms-audio"))).toEqual([])
      for (const r of writes.filter((r) => r.expr.includes("'cms'"))) {
        expect(r.roles).toBe("{authenticated}")
        expect(r.expr).toContain("'admin'")
      }
      for (const r of writes.filter((r) => r.expr.includes("voice-recordings"))) {
        expect(r.roles).toBe("{authenticated}")
      }
      expect(rows.filter((r) => r.expr.includes("voice-recordings") && r.cmd === "SELECT")).toHaveLength(1)
    })

    it("migration is idempotent", async () => {
      await db.query(MIGRATION_SQL)
    })
  })

  describe("rollback", () => {
    // Runs last (file order): restores the pre-lock state, then re-applies the lock.
    it("restores the old open policies, and the migration re-locks them", async () => {
      await db.query(ROLLBACK_SQL)
      await db.query(ROLLBACK_SQL) // re-runnable
      expect(await attempt(anon, "INSERT", "lms-audio", "rollback/probe.bin")).toBe("allowed")
      expect(await attempt(learner, "INSERT", "cms", "rollback/probe.jpg")).toBe("allowed")
      expect(await attempt(anon, "SELECT", "voice-recordings", `${LEARNER}/seed.webm`)).toBe(
        "allowed"
      )

      await db.query(MIGRATION_SQL)
      expect(await attempt(anon, "INSERT", "lms-audio", "rollback/probe.bin")).toBe("refused")
      expect(await attempt(learner, "INSERT", "cms", "rollback/probe.jpg")).toBe("refused")
    })
  })
})
