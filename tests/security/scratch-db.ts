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
