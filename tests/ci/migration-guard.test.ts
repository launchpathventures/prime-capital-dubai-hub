/**
 * CATALYST - Expand/contract migration guard tests
 *
 * Historical migrations are not re-litigated. A changed file that drops data
 * must say so and carry rollback SQL. Routine trigger/policy replacements must
 * stay silent so the existing 34 migrations can still be edited safely when
 * they only recreate functions.
 */

import { describe, expect, it } from "vitest"
import {
  evaluateMigration,
  parseChangedPaths,
} from "../../scripts/check-migrations.mjs"

const dropTable = `
ALTER TABLE public.widgets ADD COLUMN title text;
DROP TABLE public.legacy_widgets;
`

describe("evaluateMigration", () => {
  it("allows additive SQL with no marker", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_add_widget.sql",
      sql: "CREATE TABLE public.widgets (id uuid PRIMARY KEY);",
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toEqual([])
  })

  it("ignores destructive text that is commented out", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_comment.sql",
      sql: "-- DROP TABLE public.widgets;\nCREATE TABLE public.widgets (id uuid);",
    })
    expect(result.ok).toBe(true)
  })

  it("does not treat trigger, policy, or function replacement as destructive", () => {
    const sql = `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      DROP POLICY IF EXISTS "read" ON public.widgets;
      DROP FUNCTION IF EXISTS public.touch();
      CREATE FUNCTION public.touch() RETURNS trigger AS $$ BEGIN RETURN NEW; END $$ LANGUAGE plpgsql;
    `
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_replace_trigger.sql",
      sql,
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toEqual([])
  })

  it("rejects DROP TABLE, DELETE, and TRUNCATE without a marker and rollback SQL", () => {
    for (const sql of [dropTable, "DELETE FROM public.widgets;", "TRUNCATE public.widgets;"]) {
      const result = evaluateMigration({
        filename: "supabase/migrations/20261027_bad.sql",
        sql,
      })
      expect(result.ok).toBe(false)
      expect(result.problems?.join(" ")).toMatch(/expand-contract: destructive/)
      expect(result.problems?.join(" ")).toMatch(/rollback/)
    }
  })

  it("rejects a marker that has an empty rollback block", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_empty_rollback.sql",
      sql: `-- expand-contract: destructive\nDROP TABLE public.widgets;\n-- rollback-begin\n-- rollback-end\n`,
    })
    expect(result.ok).toBe(false)
    expect(result.problems?.join(" ")).toMatch(/rollback/)
  })

  it("accepts a marker plus an in-file rollback block", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_drop.sql",
      sql: `-- expand-contract: destructive\n${dropTable}\n-- rollback-begin\nCREATE TABLE public.legacy_widgets (id uuid);\n-- rollback-end\n`,
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toContain("drop-table")
  })

  it("accepts a marker plus a sibling rollback file", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_drop.sql",
      sql: `-- expand-contract: destructive\nALTER TABLE public.widgets DROP COLUMN title;`,
      siblingRollbackSql: "ALTER TABLE public.widgets ADD COLUMN title text;",
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toContain("drop-column")
  })

  it("does not flag rollback SQL that only runs when the forward migration is additive", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_add.sql",
      sql: `
        ALTER TABLE public.widgets ADD COLUMN title text;
        -- rollback-begin
        ALTER TABLE public.widgets DROP COLUMN title;
        -- rollback-end
      `,
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toEqual([])
  })

  it("flags an in-place column type change", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_type.sql",
      sql: "ALTER TABLE public.widgets ALTER COLUMN title TYPE integer USING title::integer;",
    })
    expect(result.ok).toBe(false)
    expect(result.hits).toContain("alter-type")
  })
})

describe("parseChangedPaths", () => {
  it("keeps changed forward migrations and skips rollback companions", () => {
    const stdout = [
      "supabase/migrations/20261027_drop.sql",
      "supabase/migrations/20261027_drop.rollback.sql",
      "docs/runbooks/migration-expand-contract.md",
      "supabase/migrations/nested/nope.txt",
      "",
    ].join("\n")
    expect(parseChangedPaths(stdout)).toEqual(["supabase/migrations/20261027_drop.sql"])
  })
})
