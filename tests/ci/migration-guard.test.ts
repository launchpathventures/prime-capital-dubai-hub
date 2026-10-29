/**
 * CATALYST - Expand/contract migration guard tests
 *
 * Historical migrations are not re-litigated. A changed file that drops data
 * must say so and carry rollback SQL under supabase/rollback/. Routine trigger/policy replacements must
 * stay silent so the existing 34 migrations can still be edited safely when
 * they only recreate functions.
 */

import { describe, expect, it } from "vitest"
import {
  evaluateMigration,
  parseChangedPaths,
  parseDeletedPaths,
  parseMisplacedRollbacks,
  rollbackPathFor,
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

  it("rejects a marker with no rollback file", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_no_rollback.sql",
      sql: `-- expand-contract: destructive\nDROP TABLE public.widgets;\n`,
    })
    expect(result.ok).toBe(false)
    expect(result.problems?.join(" ")).toContain("supabase/rollback/20261027_no_rollback.sql")
  })

  it("rejects a rollback file that is empty or only comments", () => {
    for (const rollbackSql of ["", "  \n", "-- todo\n/* later */"]) {
      const result = evaluateMigration({
        filename: "supabase/migrations/20261027_empty_rollback.sql",
        sql: `-- expand-contract: destructive\nDROP TABLE public.widgets;\n`,
        rollbackSql,
      })
      expect(result.ok).toBe(false)
      expect(result.problems?.join(" ")).toMatch(/rollback/)
    }
  })

  it("accepts a marker plus a rollback file", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_drop.sql",
      sql: `-- expand-contract: destructive\n${dropTable}`,
      rollbackSql: "CREATE TABLE public.legacy_widgets (id uuid);",
    })
    expect(result.ok).toBe(true)
    expect(result.hits).toContain("drop-table")
  })

  it("requires the marker even when a rollback file exists", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_drop.sql",
      sql: "ALTER TABLE public.widgets DROP COLUMN title;",
      rollbackSql: "ALTER TABLE public.widgets ADD COLUMN title text;",
    })
    expect(result.ok).toBe(false)
    expect(result.problems?.join(" ")).toMatch(/expand-contract: destructive/)
  })

  it("does not accept undo statements inside the forward file as a rollback", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_drop.sql",
      sql: `-- expand-contract: destructive\nALTER TABLE public.widgets DROP COLUMN title;\nALTER TABLE public.widgets ADD COLUMN title text;\n`,
    })
    expect(result.ok).toBe(false)
    expect(result.problems?.join(" ")).toContain("supabase/rollback/")
  })

  it("flags table and column renames", () => {
    for (const [sql, id] of [
      ["ALTER TABLE public.widgets RENAME TO gadgets;", "rename-table"],
      ["ALTER TABLE IF EXISTS public.widgets RENAME COLUMN title TO name;", "rename-column"],
      ["alter table public.widgets rename title to name;", "rename-column"],
    ] as const) {
      const result = evaluateMigration({ filename: "supabase/migrations/20261027_rename.sql", sql })
      expect(result.ok).toBe(false)
      expect(result.hits).toContain(id)
    }
  })

  it("does not flag renaming a constraint or an index", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_rename_constraint.sql",
      sql: "ALTER TABLE public.widgets RENAME CONSTRAINT old_pk TO new_pk;\nALTER INDEX old_idx RENAME TO new_idx;",
    })
    expect(result.ok).toBe(true)
  })

  it("flags SET NOT NULL on an existing column", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_not_null.sql",
      sql: "ALTER TABLE public.widgets ALTER COLUMN title SET NOT NULL;",
    })
    expect(result.ok).toBe(false)
    expect(result.hits).toContain("set-not-null")
  })

  it("allows DROP NOT NULL and new NOT NULL columns", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_relax.sql",
      sql: "ALTER TABLE public.widgets ALTER COLUMN title DROP NOT NULL;\nALTER TABLE public.widgets ADD COLUMN slug text NOT NULL DEFAULT '';",
    })
    expect(result.ok).toBe(true)
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

describe("evaluateMigration: widened rules", () => {
  const hits = (sql: string) =>
    evaluateMigration({ filename: "supabase/migrations/20261027_x.sql", sql }).hits

  it("flags DROP VIEW, DROP MATERIALIZED VIEW, DROP INDEX and DROP CONSTRAINT", () => {
    expect(hits("DROP VIEW public.v;")).toContain("drop-view")
    expect(hits("DROP MATERIALIZED VIEW IF EXISTS public.mv;")).toContain("drop-view")
    expect(hits("DROP INDEX IF EXISTS public.idx;")).toContain("drop-index")
    expect(hits("ALTER TABLE public.widgets DROP CONSTRAINT widgets_pkey;")).toContain("drop-constraint")
  })

  it("flags UPDATE without WHERE, including a multi-line statement and an aliased table", () => {
    expect(hits("UPDATE public.widgets SET title = 'x';")).toContain("update-without-where")
    expect(hits("UPDATE public.widgets\n  SET a = 1,\n      b = 2;")).toContain("update-without-where")
    expect(hits("UPDATE ONLY public.widgets AS w SET a = 1;")).toContain("update-without-where")
    expect(hits("UPDATE public.a SET x = 1 WHERE y = 2; UPDATE public.b SET x = 1;")).toContain("update-without-where")
  })

  it("allows UPDATE with WHERE and ignores upserts, foreign key actions and trigger events", () => {
    expect(hits("UPDATE public.widgets SET title = 'x' WHERE id = 1;")).toEqual([])
    expect(hits("UPDATE public.widgets SET title = 'x'\nWHERE id IN (SELECT id FROM public.o);")).toEqual([])
    expect(hits("INSERT INTO public.w (id) VALUES (1) ON CONFLICT (id) DO UPDATE SET title = excluded.title;")).toEqual([])
    expect(hits("ALTER TABLE public.w ADD FOREIGN KEY (o) REFERENCES public.o (id) ON UPDATE SET NULL;")).toEqual([])
    expect(hits("CREATE TRIGGER t BEFORE UPDATE ON public.w FOR EACH ROW EXECUTE FUNCTION public.f();")).toEqual([])
  })

  it("accepts a widened hit with the marker and a rollback, like any other", () => {
    const result = evaluateMigration({
      filename: "supabase/migrations/20261027_x.sql",
      sql: "-- expand-contract: destructive\nDROP INDEX public.idx;",
      rollbackSql: "CREATE INDEX idx ON public.widgets (title);",
    })
    expect(result.ok).toBe(true)
  })
})

describe("parseDeletedPaths", () => {
  it("reports deleted migration SQL, including a rollback-named one, and nothing else", () => {
    const stdout = [
      "supabase/migrations/20260101_old.sql",
      "supabase/migrations/20260102_old.rollback.sql",
      "supabase/rollback/20260101_old.sql",
      "docs/x.md",
      "",
    ].join("\n")
    expect(parseDeletedPaths(stdout)).toEqual([
      "supabase/migrations/20260101_old.sql",
      "supabase/migrations/20260102_old.rollback.sql",
    ])
  })
})

describe("parseChangedPaths", () => {
  const stdout = [
    "supabase/migrations/20261027_drop.sql",
    "supabase/migrations/20261027_drop.rollback.sql",
    "supabase/migrations/20261028_undo_rollback.sql",
    "supabase/rollback/20261027_drop.sql",
    "docs/runbooks/migration-expand-contract.md",
    "supabase/migrations/nested/nope.txt",
    "",
  ].join("\n")

  it("keeps changed forward migrations only", () => {
    expect(parseChangedPaths(stdout)).toEqual(["supabase/migrations/20261027_drop.sql"])
  })

  it("reports rollback-named files inside supabase/migrations", () => {
    expect(parseMisplacedRollbacks(stdout)).toEqual([
      "supabase/migrations/20261027_drop.rollback.sql",
      "supabase/migrations/20261028_undo_rollback.sql",
    ])
  })

  it("maps a migration to its rollback file outside supabase/migrations", () => {
    expect(rollbackPathFor("supabase/migrations/20261027_drop.sql")).toBe(
      "supabase/rollback/20261027_drop.sql",
    )
  })
})
