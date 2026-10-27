# Migration expand/contract guard

`supabase/migrations` has 34 historical SQL files. Several of them drop tables, truncate data, or delete rows. The pull-request CI job does **not** re-review that history.

`scripts/check-migrations.mjs` runs inside the CI job. It diffs `supabase/migrations` against the pull request base and inspects only added or modified forward migrations (sibling `*.rollback.sql` files are companions, not forward migrations).

## What counts as destructive

In the forward SQL, outside comments and outside a rollback block:

- `DROP TABLE`
- `DROP COLUMN`
- `TRUNCATE`
- `DELETE FROM`
- `DROP SCHEMA`
- `DROP TYPE`
- `ALTER COLUMN ... TYPE` (including `SET DATA TYPE`)

Replacing a trigger, policy, or function (`DROP TRIGGER`, `DROP POLICY`, `DROP FUNCTION`, then `CREATE`) is not treated as destructive. Those statements are how this repo updates functions today.

## What a destructive change must include

1. A comment marker on its own line, or at the end of a comment line:

   ```sql
   -- expand-contract: destructive
   ```

2. Rollback SQL that a human can run if the migration has to be undone. Either:

   - an in-file block (the guard ignores this block when it looks for destructive forward SQL):

     ```sql
     -- rollback-begin
     ALTER TABLE public.widgets ADD COLUMN title text;
     -- rollback-end
     ```

   - or a sibling file next to the migration, same name with `.rollback.sql` inserted before `.sql`:

     `supabase/migrations/20261027_drop_title.sql`
     `supabase/migrations/20261027_drop_title.rollback.sql`

The guard checks that the rollback text is non-empty. It does **not** execute it, and it does not connect to Supabase. Applying the rollback is a manual step: instant deployment rollback does not reverse schema changes. Prefer expand then contract (ship the code that stops reading a column, then drop the column in a later migration) so the previous production deployment still runs against the new schema.

## Example

```sql
-- expand-contract: destructive
-- Contract: the app no longer reads legacy_name.
ALTER TABLE public.widgets DROP COLUMN legacy_name;

-- rollback-begin
ALTER TABLE public.widgets ADD COLUMN legacy_name text;
-- rollback-end
```
