// @vitest-environment node
/**
 * CATALYST - Sign-up domain enforcement tests (serviceos#2011, F3)
 *
 * Runs against a LOCAL Postgres only (see scratch-db.ts). Account creation is
 * simulated the way GoTrue does it: INSERT INTO auth.users as supabase_auth_admin.
 * Covers both layers: the BEFORE INSERT trigger and the before-user-created hook
 * function. Also checks the TS domain list in lib/auth/config.ts matches the DB.
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Client } from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { SIGNUP_EMAIL_DOMAINS } from "@/lib/auth/config"
import { ADMIN_URL, createScratchDb } from "./scratch-db"

const read = (rel: string) => readFileSync(path.join(__dirname, rel), "utf8")
const STUB_SQL = read("fixtures/auth-stub.sql")
const HANDLE_NEW_USER_SQL = read("../../supabase/migrations/20260410000000_fix_handle_new_user_trigger.sql")
const MIGRATION_SQL = read("../../supabase/migrations/20261029140000_enforce_signup_domain.sql")
const ROLLBACK_SQL = read("../../supabase/rollback/20261029140000_enforce_signup_domain.down.sql")

const GOOGLE_APP_META = JSON.stringify({ provider: "google", providers: ["google"] })

// Placeholder addresses only; no real people.
const EXISTING_ADMIN_ID = "00000000-0000-4000-8000-0000000000a1"
const EXISTING_ADMIN_EMAIL = "existing.admin@launchpathventures.com"

describe.skipIf(!ADMIN_URL)("sign-up domain enforcement (serviceos#2011, F3)", () => {
  let db: Client
  let dropDb: () => Promise<void>

  /** INSERT a Google-provider user as GoTrue would; always rolled back. */
  async function signUp(
    email: string | null,
    inspect?: (c: Client) => Promise<void>
  ): Promise<"created" | "refused"> {
    await db.query("BEGIN")
    try {
      await db.query("SET LOCAL ROLE supabase_auth_admin")
      await db.query(
        `INSERT INTO auth.users (email, raw_app_meta_data, raw_user_meta_data)
         VALUES ($1, $2, '{"full_name": "Test Person"}')`,
        [email, GOOGLE_APP_META]
      )
      if (inspect) {
        await db.query("RESET ROLE")
        await inspect(db)
      }
      return "created"
    } catch (err) {
      if ((err as { code?: string }).code === "23514") return "refused" // check_violation
      throw err
    } finally {
      await db.query("ROLLBACK")
    }
  }

  async function hook(email: string | null, role = "supabase_auth_admin") {
    await db.query("BEGIN")
    try {
      await db.query(`SET LOCAL ROLE ${role}`)
      const { rows } = await db.query(
        "SELECT public.hook_before_user_created($1::jsonb) AS result",
        [JSON.stringify({ user: { email }, metadata: { name: "signup" } })]
      )
      return rows[0].result as { error?: { http_code: number; message: string } }
    } finally {
      await db.query("ROLLBACK")
    }
  }

  beforeAll(async () => {
    const scratch = await createScratchDb("signup_domain_test")
    db = scratch.db
    dropDb = scratch.drop
    await db.query(STUB_SQL)
    await db.query(HANDLE_NEW_USER_SQL)
    await db.query(
      `CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
         FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()`
    )
    // An account that predates the migration (the one existing launchpathventures.com admin)
    await db.query(
      `INSERT INTO auth.users (id, email, raw_app_meta_data) VALUES ($1, $2, $3)`,
      [EXISTING_ADMIN_ID, EXISTING_ADMIN_EMAIL, GOOGLE_APP_META]
    )
    await db.query(MIGRATION_SQL)
  })

  afterAll(async () => {
    await dropDb?.()
  })

  const REFUSED: [string, string | null][] = [
    ["other domain", "someone@gmail.com"],
    ["other domain, mixed case", "Someone@Gmail.COM"],
    ["NULL email (phone-only / anonymous)", null],
    ["empty email", ""],
    ["domain as a prefix lookalike", "a@primecapitaldubai.com.evil.example"],
    ["domain as a suffix lookalike", "a@evilprimecapitaldubai.com"],
    ["domain as the local part", "primecapitaldubai.com@evil.example"],
    ["two @ signs", "a@evil.example@primecapitaldubai.com"],
    ["no local part", "@primecapitaldubai.com"],
    ["subdomain", "a@mail.primecapitaldubai.com"],
    // Documented pending Tim's decision (QUESTION on serviceos#2011)
    ["launchpathventures.com (pending QUESTION)", "new.person@launchpathventures.com"],
  ]

  describe("BEFORE INSERT trigger", () => {
    it.each(REFUSED)("refuses %s", async (_label, email) => {
      expect(await signUp(email)).toBe("refused")
    })

    it("refuses with a clear message", async () => {
      await db.query("BEGIN")
      try {
        await db.query("SET LOCAL ROLE supabase_auth_admin")
        await expect(
          db.query("INSERT INTO auth.users (email) VALUES ('x@gmail.com')")
        ).rejects.toThrow(/limited to @primecapitaldubai\.com/)
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it("allows a primecapitaldubai.com sign-up and gives it a learner profile", async () => {
      const outcome = await signUp("new.hire@primecapitaldubai.com", async (c) => {
        const { rows } = await c.query(
          `SELECT p.role, p.certification_status FROM public.user_profiles p
             JOIN auth.users u ON u.id = p.id WHERE u.email = 'new.hire@primecapitaldubai.com'`
        )
        expect(rows).toEqual([{ role: "learner", certification_status: "in_progress" }])
      })
      expect(outcome).toBe("created")
    })

    it("matches the domain case-insensitively, and still creates the profile", async () => {
      const outcome = await signUp("New.Hire@PrimeCapitalDubai.com", async (c) => {
        const { rows } = await c.query(
          `SELECT p.role FROM public.user_profiles p
             JOIN auth.users u ON u.id = p.id WHERE u.email = 'New.Hire@PrimeCapitalDubai.com'`
        )
        expect(rows).toEqual([{ role: "learner" }])
      })
      expect(outcome).toBe("created")
    })
  })

  describe("before-user-created hook function", () => {
    it.each(REFUSED)("rejects %s with a 403", async (_label, email) => {
      const result = await hook(email)
      expect(result.error?.http_code).toBe(403)
      expect(result.error?.message).toMatch(/primecapitaldubai\.com/)
    })

    it.each([["new.hire@primecapitaldubai.com"], ["New.Hire@PrimeCapitalDubai.com"]])(
      "allows %s",
      async (email) => {
        expect(await hook(email)).toEqual({})
      }
    )

    it.each(["anon", "authenticated"])("is not callable by %s", async (role) => {
      await expect(hook("new.hire@primecapitaldubai.com", role)).rejects.toMatchObject({
        code: "42501",
      })
    })
  })

  describe("existing users are untouched", () => {
    it("keeps the pre-existing launchpathventures.com account and lets it be updated", async () => {
      await db.query("BEGIN")
      try {
        await db.query("SET LOCAL ROLE supabase_auth_admin")
        // e.g. a Google re-login only UPDATEs the row; the insert-only trigger must not interfere
        const upd = await db.query(
          "UPDATE auth.users SET last_sign_in_at = now() WHERE id = $1",
          [EXISTING_ADMIN_ID]
        )
        expect(upd.rowCount).toBe(1)
      } finally {
        await db.query("ROLLBACK")
      }
      const { rows } = await db.query("SELECT email FROM auth.users WHERE id = $1", [
        EXISTING_ADMIN_ID,
      ])
      expect(rows).toEqual([{ email: EXISTING_ADMIN_EMAIL }])
    })
  })

  describe("domain list parity with lib/auth/config.ts", () => {
    it("SIGNUP_EMAIL_DOMAINS equals public.allowed_signup_domains()", async () => {
      const { rows } = await db.query("SELECT public.allowed_signup_domains() AS domains")
      expect([...rows[0].domains].sort()).toEqual([...SIGNUP_EMAIL_DOMAINS].sort())
    })
  })

  describe("rollback", () => {
    it("removes the enforcement, and the migration restores it", async () => {
      await db.query(ROLLBACK_SQL)
      expect(await signUp("someone@gmail.com")).toBe("created")

      await db.query(MIGRATION_SQL)
      expect(await signUp("someone@gmail.com")).toBe("refused")
    })
  })
})
