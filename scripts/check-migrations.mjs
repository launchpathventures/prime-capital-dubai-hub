/**
 * CATALYST - Expand/contract guard for supabase/migrations.
 *
 * Checks migrations added or modified relative to a base commit. The existing
 * history is left alone. Destructive forward SQL must carry a marker and a
 * rollback file under supabase/rollback/ with the same name. The rollback is
 * never executed by the CLI or this script; it is there for the reviewer.
 * Rollback SQL must stay out of supabase/migrations, which `supabase db push` applies.
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
  { id: "set-not-null", re: /\bALTER\s+COLUMN\b[^;]{0,200}\bSET\s+NOT\s+NULL\b/i },
  { id: "rename-table", re: /\bALTER\s+TABLE\b[^;]*?\bRENAME\s+TO\b/i },
  {
    id: "rename-column",
    re: /\bALTER\s+TABLE\b[^;]*?\bRENAME\s+(?:COLUMN\s+)?(?!TO\b|CONSTRAINT\b)[\w"]+\s+TO\b/i,
  },
]

export const MIGRATIONS_DIR = "supabase/migrations/"
export const ROLLBACK_DIR = "supabase/rollback/"

function changedSql(stdout) {
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith(MIGRATIONS_DIR) && line.endsWith(".sql"))
}

/** Rollback-named files in the migrations directory would be applied as migrations. */
export function isMisplacedRollback(file) {
  return /rollback/i.test(file.slice(MIGRATIONS_DIR.length))
}

export function parseChangedPaths(stdout) {
  return changedSql(stdout).filter((file) => !isMisplacedRollback(file))
}

export function parseMisplacedRollbacks(stdout) {
  return changedSql(stdout).filter(isMisplacedRollback)
}

export function rollbackPathFor(file) {
  return ROLLBACK_DIR + file.slice(MIGRATIONS_DIR.length)
}

export function stripSqlComments(sql) {
  return sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ")
}

function hasMarker(sql) {
  return /--[^\n]*expand-contract:\s*destructive/i.test(sql)
}

function findDestructive(sql) {
  const stripped = stripSqlComments(sql)
  return DESTRUCTIVE_RULES.filter((rule) => rule.re.test(stripped)).map((rule) => rule.id)
}

/**
 * @param {{ filename: string, sql: string, rollbackSql?: string | null }} input
 */
export function evaluateMigration(input) {
  const { filename, sql, rollbackSql = null } = input
  const hits = findDestructive(sql)
  if (hits.length === 0) return { ok: true, filename, hits }

  const problems = []
  if (!hasMarker(sql)) problems.push("missing marker `-- expand-contract: destructive`")
  const hasRollback = Boolean(rollbackSql && stripSqlComments(rollbackSql).trim().length > 0)
  if (!hasRollback) {
    problems.push(`missing rollback SQL in \`${rollbackPathFor(filename)}\` (outside supabase/migrations)`)
  }
  return {
    ok: problems.length === 0,
    filename,
    hits,
    ...(problems.length ? { problems } : {}),
  }
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
  const failures = parseMisplacedRollbacks(stdout).map((filename) => ({
    filename,
    hits: ["rollback-in-migrations"],
    problems: ["rollback SQL must live under supabase/rollback/, not supabase/migrations/"],
  }))
  for (const file of files) {
    const sql = readFileSync(file, "utf8")
    const rollbackFile = rollbackPathFor(file)
    const rollbackSql = existsSync(rollbackFile) ? readFileSync(rollbackFile, "utf8") : null
    const result = evaluateMigration({ filename: file, sql, rollbackSql })
    if (!result.ok) failures.push(result)
    else if (result.hits.length) console.log(`ok ${file} (${result.hits.join(", ")})`)
  }
  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`${failure.filename}: ${failure.hits.join(", ")}`)
      for (const problem of failure.problems) console.error(`  - ${problem}`)
    }
    console.error(
      `::error::${failures.length} migration(s) need an expand/contract marker and rollback SQL under supabase/rollback/`,
    )
    process.exit(1)
  }
  console.log(`migration guard: ${files.length} changed migration(s), no unmarked destructive SQL`)
}

if (isDirectRun()) main()
