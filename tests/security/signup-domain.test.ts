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
import { SIGNUP_EMAIL_DOMAINS, isAllowedSignupEmail } from "@/lib/auth/config"
import { ADMIN_URL, createScratchDb } from "./scratch-db"

const read = (rel: string) => readFileSync(path.join(__dirname, rel), "utf8")
const STUB_SQL = ["auth-stub", "profiles-stub"].map((f) => read(`fixtures/${f}.sql`)).join("\n")
const HANDLE_NEW_USER_SQL = read("../../supabase/migrations/20260410000000_fix_handle_new_user_trigger.sql")
const BASE_MIGRATION_SQL = read("../../supabase/migrations/20261029140000_enforce_signup_domain.sql")
const LPV_MIGRATION_SQL = read("../../supabase/migrations/20261029160000_allow_launchpathventures_signup.sql")
const MIGRATION_SQL = `${BASE_MIGRATION_SQL}\n${LPV_MIGRATION_SQL}`
const ROLLBACK_SQL = read("../../supabase/rollback/20261029140000_enforce_signup_domain.down.sql")
const LPV_ROLLBACK_SQL = read("../../supabase/rollback/20261029160000_allow_launchpathventures_signup.down.sql")

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

  /** Payload shaped like GoTrue's before-user-created event. */
  const gotruePayload = (email: string | null, extra: Record<string, unknown> = {}) => ({
    metadata: {
      uuid: "",
      time: "2026-10-29T00:00:00.000000Z",
      name: "before-user-created",
      ip_address: "203.0.113.7",
    },
    user: {
      id: "00000000-0000-4000-8000-0000000000f1",
      aud: "authenticated",
      role: "",
      email: email ?? "",
      phone: "",
      app_metadata: { provider: "google", providers: ["google"] },
      user_metadata: { full_name: "Test Person", iss: "https://accounts.google.com" },
      identities: [
        {
          identity_id: "00000000-0000-4000-8000-0000000000f2",
          id: "1234567890",
          user_id: "00000000-0000-4000-8000-0000000000f1",
          identity_data: { email: email ?? "", email_verified: true, provider_id: "1234567890" },
          provider: "google",
        },
      ],
      is_anonymous: false,
      ...extra,
    },
  })

  async function hook(email: string | null, role = "supabase_auth_admin", payload?: unknown) {
    await db.query("BEGIN")
    try {
      await db.query(`SET LOCAL ROLE ${role}`)
      const { rows } = await db.query(
        "SELECT public.hook_before_user_created($1::jsonb) AS result",
        [JSON.stringify(payload ?? gotruePayload(email))]
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
    // U+0130 (capital I with dot) lower-cases to "i" in some locales (Turkish)
    ["U+0130 lookalike domain", "a@PR\u0130MECAPITALDUBAI.com"],
    ["non-ASCII local part", "j\u00fcrgen@primecapitaldubai.com"],
    ["control character", "a\u0007@primecapitaldubai.com"],
    // Lookalikes of launchpathventures.com
    ["launchpathventures.com as a subdomain", "a@mail.launchpathventures.com"],
    ["launchpathventures.com as a suffix lookalike", "a@evillaunchpathventures.com"],
    ["launchpathventures.com as a prefix lookalike", "a@launchpathventures.com.evil.example"],
    ["launchpathventures.com U+0130 lookalike", "a@launchpath\u0130ventures.com"],
    ["launchpathventures.com Cyrillic lookalike", "a@launchpathventur\u0435s.com"],
    ["launchpathventures.com as the local part", "launchpathventures.com@evil.example"],
    ["launchpathventures.com with two @ signs", "a@evil.example@launchpathventures.com"],
  ]

  // Allowed on both layers; everyone gets a learner profile, nobody is auto-admin.
  const ALLOWED: [string, string][] = [
    ["primecapitaldubai.com", "new.hire@primecapitaldubai.com"],
    ["primecapitaldubai.com, mixed case", "New.Hire@PrimeCapitalDubai.com"],
    ["launchpathventures.com", "new.person@launchpathventures.com"],
    ["launchpathventures.com, mixed case", "New.Person@LaunchPathVentures.com"],
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
        ).rejects.toThrow(/limited to @primecapitaldubai\.com or @launchpathventures\.com/)
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it.each(ALLOWED)("allows %s and gives it a learner profile", async (_label, email) => {
      const outcome = await signUp(email, async (c) => {
        const { rows } = await c.query(
          `SELECT p.role, p.certification_status FROM public.user_profiles p
             JOIN auth.users u ON u.id = p.id WHERE u.email = $1`,
          [email]
        )
        expect(rows).toEqual([{ role: "learner", certification_status: "in_progress" }])
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

    it.each(ALLOWED)("allows %s", async (_label, email) => {
      expect(await hook(email)).toEqual({})
    })

    it("rejects an anonymous sign-in payload (no email, is_anonymous)", async () => {
      const payload = gotruePayload(null, { is_anonymous: true, app_metadata: { provider: "anonymous" }, identities: [] })
      const result = await hook(null, "supabase_auth_admin", payload)
      expect(result.error?.http_code).toBe(403)
    })

    it("rejects a payload with no email key at all (phone sign-up)", async () => {
      const payload = { metadata: { name: "before-user-created" }, user: { phone: "+15550100", app_metadata: { provider: "phone" } } }
      const result = await hook(null, "supabase_auth_admin", payload)
      expect(result.error?.http_code).toBe(403)
    })

    it.each(["anon", "authenticated"])("is not callable by %s", async (role) => {
      await expect(hook("new.hire@primecapitaldubai.com", role)).rejects.toMatchObject({
        code: "42501",
      })
    })
  })

  describe("email changes (BEFORE UPDATE OF email)", () => {
    async function updateEmail(id: string, email: string | null) {
      await db.query("BEGIN")
      try {
        await db.query("SET LOCAL ROLE supabase_auth_admin")
        const r = await db.query("UPDATE auth.users SET email = $2 WHERE id = $1", [id, email])
        return r.rowCount ? "updated" : "none"
      } catch (err) {
        if ((err as { code?: string }).code === "23514") return "refused"
        throw err
      } finally {
        await db.query("ROLLBACK")
      }
    }

    it("refuses moving an existing account to an other-domain email", async () => {
      expect(await updateEmail(EXISTING_ADMIN_ID, "someone@gmail.com")).toBe("refused")
      expect(await updateEmail(EXISTING_ADMIN_ID, null)).toBe("refused")
    })
    it("allows moving to a company address", async () => {
      expect(await updateEmail(EXISTING_ADMIN_ID, "moved@primecapitaldubai.com")).toBe("updated")
      expect(await updateEmail(EXISTING_ADMIN_ID, "moved@launchpathventures.com")).toBe("updated")
    })
    it("allows an UPDATE that leaves the email unchanged (existing launchpathventures.com account)", async () => {
      expect(await updateEmail(EXISTING_ADMIN_ID, EXISTING_ADMIN_EMAIL)).toBe("updated")
    })
  })

  describe("hardening", () => {
    it("company sign-up still works with PUBLIC execute and schema usage revoked (explicit grants)", async () => {
      await db.query("BEGIN")
      try {
        await db.query("REVOKE USAGE ON SCHEMA public FROM PUBLIC")
        await db.query("REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC")
        await db.query("SET LOCAL ROLE supabase_auth_admin")
        await db.query("SAVEPOINT s")
        await db.query("INSERT INTO auth.users (email) VALUES ('hardened@primecapitaldubai.com')")
        await db.query("RELEASE SAVEPOINT s")
        await expect(
          db.query("INSERT INTO auth.users (email) VALUES ('hardened@gmail.com')")
        ).rejects.toMatchObject({ code: "23514" })
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it("builds the refusal message from the domain list, and adding a domain is a one-line change", async () => {
      await db.query("BEGIN")
      try {
        await db.query(
          `CREATE OR REPLACE FUNCTION public.allowed_signup_domains() RETURNS text[]
             LANGUAGE sql STABLE SET search_path = '' AS $$ SELECT ARRAY['a.example','b.example'] $$`
        )
        const call = async (email: string) =>
          (
            await db.query("SELECT public.hook_before_user_created($1::jsonb) AS r", [
              JSON.stringify(gotruePayload(email)),
            ])
          ).rows[0].r
        expect((await call("x@gmail.com")).error?.message).toBe(
          "Sign-up is limited to @a.example or @b.example email addresses."
        )
        expect(await call("x@b.example")).toEqual({})
      } finally {
        await db.query("ROLLBACK")
      }
    })

    it("is_allowed_signup_email agrees with isAllowedSignupEmail() in lib/auth/config.ts", async () => {
      const samples = [
        "new.hire@primecapitaldubai.com",
        "New.Hire@PrimeCapitalDubai.COM",
        "someone@gmail.com",
        "",
        "@primecapitaldubai.com",
        "a@primecapitaldubai.com.evil.example",
        "a@evil.example@primecapitaldubai.com",
        "a@evilprimecapitaldubai.com",
        "a@PR\u0130MECAPITALDUBAI.com",
        "j\u00fcrgen@primecapitaldubai.com",
        "new.person@launchpathventures.com",
        "New.Person@LaunchPathVentures.COM",
        "a@mail.launchpathventures.com",
        "a@evillaunchpathventures.com",
        "a@launchpathventures.com.evil.example",
        "a@launchpath\u0130ventures.com",
      ]
      for (const email of samples) {
        const { rows } = await db.query("SELECT public.is_allowed_signup_email($1) AS ok", [email])
        expect([email, rows[0].ok]).toEqual([email, isAllowedSignupEmail(email)])
      }
      expect(isAllowedSignupEmail(null)).toBe(false)
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
    it("the follow-up rollback returns to primecapitaldubai.com only, and the migration re-allows launchpathventures.com", async () => {
      await db.query(LPV_ROLLBACK_SQL)
      await db.query(LPV_ROLLBACK_SQL) // re-runnable
      expect(await signUp("new.person@launchpathventures.com")).toBe("refused")
      expect(await signUp("new.hire@primecapitaldubai.com")).toBe("created")

      await db.query(LPV_MIGRATION_SQL)
      expect(await signUp("new.person@launchpathventures.com")).toBe("created")
    })

    it("removes the enforcement, and the migrations restore it", async () => {
      await db.query(ROLLBACK_SQL)
      await db.query(ROLLBACK_SQL) // re-runnable
      expect(await signUp("someone@gmail.com")).toBe("created")

      await db.query(MIGRATION_SQL)
      expect(await signUp("someone@gmail.com")).toBe("refused")
      expect(await signUp("new.person@launchpathventures.com")).toBe("created")
    })
  })
})
