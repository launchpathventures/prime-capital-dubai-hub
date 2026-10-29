/**
 * CATALYST - Scratch Postgres database for the security policy tests (serviceos#2011)
 *
 * Creates a throwaway database on a LOCAL Postgres (superuser URL in
 * STORAGE_POLICY_TEST_DATABASE_URL) and drops it afterwards. Non-local hosts are
 * refused so the tests can never touch a shared or prod database.
 */
import { Client } from "pg"

export const ADMIN_URL = process.env.STORAGE_POLICY_TEST_DATABASE_URL

function assertLocal(url: string) {
  const u = new URL(url)
  const host = u.searchParams.get("host") ?? u.hostname
  const isLocal =
    ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host) || host.startsWith("/")
  if (!isLocal) {
    throw new Error("STORAGE_POLICY_TEST_DATABASE_URL must point at a local Postgres")
  }
}

function withDatabase(url: string, db: string) {
  const u = new URL(url)
  u.pathname = `/${db}`
  return u.toString()
}

export async function createScratchDb(prefix: string) {
  assertLocal(ADMIN_URL!)
  const name = `${prefix}_${process.pid}_${Date.now()}`
  const root = new Client({ connectionString: ADMIN_URL })
  await root.connect()
  // Roles are cluster-wide and survive DROP DATABASE; test files run in parallel,
  // so create them idempotently under an advisory lock.
  await root.query("SELECT pg_advisory_lock(2011)")
  try {
    await root.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
          CREATE ROLE anon NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
          CREATE ROLE authenticated NOLOGIN;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'service_role') THEN
          CREATE ROLE service_role NOLOGIN BYPASSRLS;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
          CREATE ROLE supabase_auth_admin NOLOGIN;
        END IF;
      END
      $$`)
  } finally {
    await root.query("SELECT pg_advisory_unlock(2011)")
  }
  await root.query(`CREATE DATABASE ${name}`)
  const db = new Client({ connectionString: withDatabase(ADMIN_URL!, name) })
  await db.connect()
  return {
    db,
    async drop() {
      await db.end()
      await root.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`)
      await root.end()
    },
  }
}
