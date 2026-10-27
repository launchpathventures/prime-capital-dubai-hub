/**
 * CATALYST - Expand/contract guard for supabase/migrations.
 *
 * Checks migrations added or modified relative to a base commit. The existing
 * history is left alone. Destructive forward SQL must carry a marker and
 * rollback SQL. The rollback is not executed; it is there for the reviewer.
 */

import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, realpathSync } from "node:fs"
import { pathToFileURL } from "node:url"

const DESTRUCTIVE_RULES = [
  { id: "drop-table", re: /\bDROP\s+TABLE\b/i },
  { id: "drop-column", re: /\bDROP\s+COLUMN\b/i },
  { id: "truncate", re: /\bTRUNCATE\b/i },
  { id: "delete-from", re: /\bDELETE\s+FROM\b/i },
  { id: "drop-schema", re: /\bDROP\s+SCHEMA\b/i },
  { id: "drop-type", re: /\bDROP\s+TYPE\b/i },
  { id: "alter-type", re: /\bALTER\s+COLUMN\b[^;]{0,200}\b(?:SET\s+DATA\s+)?TYPE\b/i },
]

export function parseChangedPaths(stdout) {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.startsWith("supabase/migrations/") &&
        line.endsWith(".sql") &&
        !line.endsWith(".rollback.sql"),
    )
}

export function stripSqlComments(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ")
}

export function extractRollbackBlock(sql) {
  const match = sql.match(/--\s*rollback-begin\s*([\s\S]*?)--\s*rollback-end/i)
  if (!match) return null
  return match[1].trim()
}

function hasMarker(sql) {
  return /--[^\n]*expand-contract:\s*destructive/i.test(sql)
}

function findDestructive(sql) {
  const stripped = stripSqlComments(sql)
  return DESTRUCTIVE_RULES.filter((rule) => rule.re.test(stripped)).map((rule) => rule.id)
}

/**
 * @param {{ filename: string, sql: string, siblingRollbackSql?: string | null }} input
 */
export function evaluateMigration(input) {
  const { filename, sql, siblingRollbackSql = null } = input
  const rollbackBlock = extractRollbackBlock(sql)
  const forward = sql.replace(/--\s*rollback-begin[\s\S]*?--\s*rollback-end/gi, " ")
  const hits = findDestructive(forward)
  if (hits.length === 0) return { ok: true, filename, hits }

  const problems = []
  if (!hasMarker(sql)) problems.push("missing marker `-- expand-contract: destructive`")
  const inline = Boolean(rollbackBlock && rollbackBlock.length > 0)
  const sibling = Boolean(siblingRollbackSql && siblingRollbackSql.trim().length > 0)
  if (!inline && !sibling) {
    problems.push(
      "missing rollback SQL (`-- rollback-begin` / `-- rollback-end`, or a sibling `*.rollback.sql`)",
    )
  }
  return {
    ok: problems.length === 0,
    filename,
    hits,
    ...(problems.length ? { problems } : {}),
  }
}

function siblingRollbackPath(file) {
  return file.replace(/\.sql$/, ".rollback.sql")
}

function isDirectRun() {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href
  } catch {
    return false
  }
}

function main() {
  const base = process.argv[2]
  if (!base) {
    console.error("usage: node scripts/check-migrations.mjs <base-sha>")
    process.exit(2)
  }
  const stdout = execFileSync(
    "git",
    ["diff", "--name-only", "--diff-filter=AMR", base, "HEAD", "--", "supabase/migrations"],
    { encoding: "utf8" },
  )
  const files = parseChangedPaths(stdout)
  const failures = []
  for (const file of files) {
    const sql = readFileSync(file, "utf8")
    const sibling = siblingRollbackPath(file)
    const siblingRollbackSql = existsSync(sibling) ? readFileSync(sibling, "utf8") : null
    const result = evaluateMigration({ filename: file, sql, siblingRollbackSql })
    if (!result.ok) failures.push(result)
    else if (result.hits.length) console.log(`ok ${file} (${result.hits.join(", ")})`)
  }
  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`${failure.filename}: ${failure.hits.join(", ")}`)
      for (const problem of failure.problems) console.error(`  - ${problem}`)
    }
    console.error(
      `::error::${failures.length} migration(s) need an expand/contract marker and rollback SQL`,
    )
    process.exit(1)
  }
  console.log(`migration guard: ${files.length} changed migration(s), no unmarked destructive SQL`)
}

if (isDirectRun()) main()
