// @vitest-environment node
/**
 * CATALYST - user_profiles role self-promotion tests (serviceos#2011)
 *
 * Prod let any signed-in user set their own user_profiles.role = 'admin' (UPDATE
 * own row, or INSERT own row with any role), which satisfies every admin check,
 * including the admin-only cms storage policies. The stub carries prod's real
 * user_profiles RLS policies (fixtures/profiles-stub.sql); the migration under
 * test removes the hole. Runs against a LOCAL Postgres only (see scratch-db.ts).
 */
import { readFileSync } from "node:fs"
import path from "node:path"
import type { Client } from "pg"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { ADMIN_URL, createScratchDb } from "./scratch-db"

const read = (rel: string) => readFileSync(path.join(__dirname, rel), "utf8")
const STUB_SQL = ["auth-stub", "profiles-stub", "storage-stub"]
  .map((f) => read(`fixtures/${f}.sql`))
  .join("\n")
const STORAGE_MIGRATION_SQL = read("../../supabase/migrations/20261029130000_lock_storage_writes.sql")
const MIGRATION_SQL = read("../../supabase/migrations/20261029150000_block_role_self_promotion.sql")
const ROLLBACK_SQL = read("../../supabase/rollback/20261029150000_block_role_self_promotion.down.sql")

const LEARNER = "00000000-0000-4000-8000-00000000000a"
const OTHER_LEARNER = "00000000-0000-4000-8000-00000000000b"
const NO_PROFILE = "00000000-0000-4000-8000-00000000000c"
const ADMIN = "00000000-0000-4000-8000-00000000000e"

type DbRole = "anon" | "authenticated" | "service_role"
const claimsFor = (role: DbRole, sub?: string) => ({ role, ...(sub ? { sub } : {}) })

describe.skipIf(!ADMIN_URL)("user_profiles role guard (serviceos#2011)", () => {
  let db: Client
  let dropDb: () => Promise<void>

  /**
   * Run `fn` as `role` (+ JWT sub) in one transaction that is always rolled back.
   * `attempt` inside fn returns "ok" or "refused" (42501) and keeps the txn alive.
   */
  async function as<T>(
    role: DbRole | "postgres",
    sub: string | undefined,
    fn: (attempt: (sql: string, params?: unknown[]) => Promise<"ok" | "refused">) => Promise<T>
  ): Promise<T> {
    await db.query("BEGIN")
    try {
      if (role !== "postgres") {
        await db.query(`SET LOCAL ROLE ${role}`)
        await db.query("SELECT set_config('request.jwt.claims', $1, true)", [
          JSON.stringify(claimsFor(role, sub)),
        ])
      }
      const attempt = async (sql: string, params: unknown[] = []) => {
        await db.query("SAVEPOINT a")
        try {
          const r = await db.query(sql, params)
          await db.query("RELEASE SAVEPOINT a")
          // UPDATE/DELETE that RLS filters to zero rows count as refused too
          return r.command === "INSERT" || r.rowCount ? "ok" : "refused"
        } catch (err) {
          if ((err as { code?: string }).code !== "42501") throw err
          await db.query("ROLLBACK TO SAVEPOINT a")
          return "refused"
        }
      }
      return await fn(attempt)
    } finally {
      await db.query("ROLLBACK")
    }
  }

  const roleOf = async (id: string) =>
    (await db.query("SELECT role FROM public.user_profiles WHERE id = $1", [id])).rows[0]?.role

  const CMS_INSERT = "INSERT INTO storage.objects (bucket_id, name) VALUES ('cms', 'properties/pwned.jpg')"
  const SELF_PROMOTE = (to: string) =>
    `UPDATE public.user_profiles SET role = '${to}' WHERE id = '${LEARNER}'`

  beforeAll(async () => {
    const scratch = await createScratchDb("profile_guard_test")
    db = scratch.db
    dropDb = scratch.drop
    await db.query(STUB_SQL)
    await db.query(STORAGE_MIGRATION_SQL) // cms is admin-only, via user_profiles.role
    await db.query(
      `INSERT INTO public.user_profiles (id, role) VALUES ($1, 'learner'), ($2, 'learner'), ($3, 'admin')`,
      [LEARNER, OTHER_LEARNER, ADMIN]
    )
  })

  afterAll(async () => {
    await dropDb?.()
  })

  describe("BEFORE the fix (documents the hole)", () => {
    it("a learner can promote themselves to admin and then write to cms", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt(SELF_PROMOTE("admin"))).toBe("ok")
        expect(await attempt(CMS_INSERT)).toBe("ok")
      })
    })
    it("a user with no profile can insert an admin row and then write to cms", async () => {
      await as("authenticated", NO_PROFILE, async (attempt) => {
        expect(
          await attempt(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', 'admin')`)
        ).toBe("ok")
        expect(await attempt(CMS_INSERT)).toBe("ok")
      })
    })
  })

  describe("AFTER the fix", () => {
    beforeAll(async () => {
      await db.query(MIGRATION_SQL)
    })

    it("refuses a learner promoting themselves to admin or marketing, and cms stays closed", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt(SELF_PROMOTE("admin"))).toBe("refused")
        expect(await attempt(SELF_PROMOTE("marketing"))).toBe("refused")
        expect(await attempt(CMS_INSERT)).toBe("refused")
      })
      expect(await roleOf(LEARNER)).toBe("learner")
    })

    it("refuses setting role to NULL", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt(SELF_PROMOTE("x").replace("'x'", "NULL"))).toBe("refused")
      })
    })

    it("refuses a user with no profile inserting an admin or marketing row, and cms stays closed", async () => {
      await as("authenticated", NO_PROFILE, async (attempt) => {
        for (const role of ["admin", "marketing"]) {
          expect(
            await attempt(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', '${role}')`)
          ).toBe("refused")
        }
        expect(await attempt(CMS_INSERT)).toBe("refused")
      })
    })

    it("still lets a user create their own learner profile (callback fallback), explicit or default role", async () => {
      await as("authenticated", NO_PROFILE, async (attempt) => {
        expect(
          await attempt(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', 'learner')`)
        ).toBe("ok")
      })
      await as("authenticated", NO_PROFILE, async (attempt) => {
        expect(await attempt(`INSERT INTO public.user_profiles (id) VALUES ('${NO_PROFILE}')`)).toBe("ok")
      })
    })

    it("refuses creating a profile for someone else, and anon inserts", async () => {
      await as("authenticated", NO_PROFILE, async (attempt) => {
        expect(
          await attempt(
            "INSERT INTO public.user_profiles (id, role) VALUES ('00000000-0000-4000-8000-0000000000ff', 'learner')"
          )
        ).toBe("refused")
      })
      await as("anon", undefined, async (attempt) => {
        expect(
          await attempt(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', 'learner')`)
        ).toBe("refused")
      })
    })

    it("still lets a learner edit other columns of their own profile (role unchanged)", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(
          await attempt(`UPDATE public.user_profiles SET full_name = 'New Name' WHERE id = '${LEARNER}'`)
        ).toBe("ok")
        expect(await attempt(SELF_PROMOTE("learner"))).toBe("ok") // no-op role write
      })
    })

    it("refuses a learner changing another user's role (RLS)", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(
          await attempt(`UPDATE public.user_profiles SET role = 'admin' WHERE id = '${OTHER_LEARNER}'`)
        ).toBe("refused")
      })
    })

    // Belt and braces: even if the old permissive policies came back, the trigger holds.
    it("refuses self-promotion even with permissive INSERT/UPDATE policies present", async () => {
      await db.query("BEGIN")
      try {
        await db.query(
          "CREATE POLICY tmp_insert ON public.user_profiles FOR INSERT TO public WITH CHECK (true)"
        )
        await db.query(
          "CREATE POLICY tmp_update ON public.user_profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true)"
        )
        await db.query("SET LOCAL ROLE authenticated")
        await db.query("SELECT set_config('request.jwt.claims', $1, true)", [
          JSON.stringify(claimsFor("authenticated", LEARNER)),
        ])
        await db.query("SAVEPOINT a")
        await expect(
          db.query(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', 'admin')`)
        ).rejects.toMatchObject({ code: "42501" })
        await db.query("ROLLBACK TO SAVEPOINT a")
        await expect(
          db.query(`UPDATE public.user_profiles SET role = 'admin' WHERE id = '${LEARNER}'`)
        ).rejects.toMatchObject({ code: "42501" })
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it("lets service_role (lib/actions/users.ts) change another user's role, and postgres too", async () => {
      await as("service_role", undefined, async (attempt) => {
        expect(
          await attempt(`UPDATE public.user_profiles SET role = 'marketing' WHERE id = '${OTHER_LEARNER}'`)
        ).toBe("ok")
        expect(
          await attempt(`INSERT INTO public.user_profiles (id, role) VALUES ('${NO_PROFILE}', 'admin')`)
        ).toBe("ok")
      })
      await as("postgres", undefined, async (attempt) => {
        expect(
          await attempt(`UPDATE public.user_profiles SET role = 'admin' WHERE id = '${OTHER_LEARNER}'`)
        ).toBe("ok")
      })
      expect(await roleOf(OTHER_LEARNER)).toBe("learner")
    })

    it("lets an admin change another user's role when RLS allows it, and the admin still writes cms", async () => {
      await db.query("BEGIN")
      try {
        // prod has no admin-manage policy on user_profiles; the repo's original
        // 20260106100000 migration did. Add it here to prove the trigger permits admins.
        await db.query(
          `CREATE POLICY tmp_admin_manage ON public.user_profiles FOR ALL TO authenticated
             USING (public.is_admin()) WITH CHECK (public.is_admin())`
        )
        await db.query("SET LOCAL ROLE authenticated")
        await db.query("SELECT set_config('request.jwt.claims', $1, true)", [
          JSON.stringify(claimsFor("authenticated", ADMIN)),
        ])
        const r = await db.query(
          `UPDATE public.user_profiles SET role = 'marketing' WHERE id = '${OTHER_LEARNER}'`
        )
        expect(r.rowCount).toBe(1)
        const c = await db.query(CMS_INSERT)
        expect(c.rowCount).toBe(1)
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it("migration is idempotent", async () => {
      await db.query(MIGRATION_SQL)
    })

    it("guard function is not executable by anon or authenticated", async () => {
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt("SELECT public.guard_user_profile_role()")).toBe("refused")
      })
    })
  })

  describe("rollback", () => {
    it("re-opens the hole (re-runnable), and the migration closes it again", async () => {
      await db.query(ROLLBACK_SQL)
      await db.query(ROLLBACK_SQL)
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt(SELF_PROMOTE("admin"))).toBe("ok")
      })
      await db.query(MIGRATION_SQL)
      await as("authenticated", LEARNER, async (attempt) => {
        expect(await attempt(SELF_PROMOTE("admin"))).toBe("refused")
      })
    })
  })
})
