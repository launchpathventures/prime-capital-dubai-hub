# Database Migration Guide

## How to Apply Migrations

Since the MCP connection timed out, you'll need to apply these migrations manually through the Supabase Dashboard.

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project: **iwyxaluaiskdxzolkwit**
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Apply Migrations in Order

Run these migrations **one at a time** in the SQL Editor:

#### Migration 1: CMS Schema (Website Content)
```
supabase/migrations/20260106_cms_schema.sql
```
- Creates: properties, team_members, testimonials, stats, services, site_settings
- ~300 lines
- ⏱️ Takes: ~10 seconds

#### Migration 2: LMS Schema (Learning Portal)
```
supabase/migrations/20260106_lms_schema.sql
```
- Creates: user_profiles, competencies, learning_modules, quiz_questions, learning_progress, quiz_attempts
- ~450 lines
- ⏱️ Takes: ~15 seconds

#### Migration 3: Seed Data
```
supabase/migrations/20260106_seed_data.sql
```
- Inserts sample data for all tables
- ~800 lines
- ⏱️ Takes: ~20 seconds

### Step 3: Verify Tables Were Created

In the Supabase Dashboard:
1. Go to **Table Editor**
2. You should see these new tables:
   - ✅ properties
   - ✅ team_members
   - ✅ testimonials
   - ✅ stats
   - ✅ services
   - ✅ site_settings
   - ✅ user_profiles
   - ✅ competencies
   - ✅ learning_modules
   - ✅ quiz_questions
   - ✅ learning_progress
   - ✅ quiz_attempts

### Step 4: Check Sample Data

Click on any table to verify seed data was inserted:
- **properties** should have 3 sample properties
- **team_members** should have 3 team members
- **competencies** should have 6 competencies
- **testimonials** should have 3 testimonials
- etc.

## Alternative: Command Line (if you have Supabase CLI)

```bash
# Apply all migrations at once
supabase db push

# Or apply individual migrations
psql $DATABASE_URL -f supabase/migrations/20260106_cms_schema.sql
psql $DATABASE_URL -f supabase/migrations/20260106_lms_schema.sql
psql $DATABASE_URL -f supabase/migrations/20260106_seed_data.sql
```

## Troubleshooting

### "relation already exists"
Some tables may already exist from previous work. The migrations use `CREATE TABLE IF NOT EXISTS` so they won't fail, but you may see notices. This is expected.

### "permission denied"
Make sure you're using an account with proper database permissions in Supabase.

### RLS policies fail
The CMS and LMS migrations reference `user_profiles` table. Make sure you apply the LMS migration (which creates user_profiles) **before** testing the CMS tables with non-admin users.

## What's Next?

After migrations are applied:
1. ✅ Create your first admin user profile
2. ✅ Set up `.env.local` with Supabase credentials
3. ✅ Test admin CRUD operations on properties
4. ✅ Verify public pages can read published content
