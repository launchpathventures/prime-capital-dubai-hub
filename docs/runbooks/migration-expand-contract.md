# Migration expand/contract guard

`supabase/migrations` has 34 historical SQL files. Several of them drop tables, truncate data, or delete rows. The pull-request CI job does **not** re-review that history.

`scripts/check-migrations.mjs` runs inside the CI job. It diffs `supabase/migrations` against the pull request base and inspects only added or modified forward migrations.

## What counts as destructive

In the forward SQL, outside comments:

- `DROP TABLE`
- `DROP COLUMN`
- `TRUNCATE`
- `DELETE FROM`
- `DROP SCHEMA`
- `DROP TYPE`
- `ALTER COLUMN ... TYPE` (including `SET DATA TYPE`)
- `ALTER COLUMN ... SET NOT NULL`
- `ALTER TABLE ... RENAME TO` (table) and `ALTER TABLE ... RENAME [COLUMN] a TO b` (column)

Replacing a trigger, policy, or function (`DROP TRIGGER`, `DROP POLICY`, `DROP FUNCTION`, then `CREATE`) is not treated as destructive. Those statements are how this repo updates functions today.

## What a destructive change must include

1. A comment marker on its own line, or at the end of a comment line:

   ```sql
   -- expand-contract: destructive
   ```

2. A rollback file with the same name as the migration, in `supabase/rollback/`:

   `supabase/migrations/20261027_drop_title.sql`
   `supabase/rollback/20261027_drop_title.sql`

   Rollback SQL must **not** go inside `supabase/migrations/`. `supabase db push` applies every `.sql` file in that directory, so a rollback placed there would run as a migration. The guard fails any changed file under `supabase/migrations/` whose name contains `rollback`. SQL inside the migration file itself also runs when the migration is applied, so do not add rollback statements to the forward file.

The guard checks that the rollback file has SQL beyond comments. It does **not** execute it, and it does not connect to Supabase. Applying the rollback is a manual step: instant deployment rollback does not reverse schema changes. Prefer expand then contract (ship the code that stops reading a column, then drop the column in a later migration) so the previous production deployment still runs against the new schema.

## Example

`supabase/migrations/20261027_drop_legacy_name.sql`:

```sql
-- expand-contract: destructive
-- Contract: the app no longer reads legacy_name.
ALTER TABLE public.widgets DROP COLUMN legacy_name;
```

`supabase/rollback/20261027_drop_legacy_name.sql`:

```sql
ALTER TABLE public.widgets ADD COLUMN legacy_name text;
```
