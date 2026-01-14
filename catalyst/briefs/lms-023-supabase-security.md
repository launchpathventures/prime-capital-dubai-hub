# LMS-023: Supabase Security Fixes

**Status:** 📋 READY  
**Priority:** P0 Critical (blocks PROD)  
**Estimated Time:** 1-2 hours  
**Dependencies:** None  

---

## Objective

Resolve all Supabase security advisor warnings. Fix function search_path issues, review RLS policies, enable leaked password protection, and create missing migration for `scenario_progress` table.

---

## Context

The Supabase security advisor flagged 6 issues:

1. **Function search_path mutable (4 functions)**
   - `get_learner_progress`
   - `check_coach_rate_limit`
   - `update_user_certification_status`
   - `update_updated_at_column`

2. **RLS policy always true (1 table)**
   - `audio_transcripts` — "Service role can modify" is too permissive

3. **Leaked password protection disabled (1 config)**
   - HaveIBeenPwned check not enabled

4. **Missing migration (1 table)**
   - `scenario_progress` table exists but has no tracked migration

---

## Deliverables

### 1. Fix Function Search Path

Create migration to update functions with explicit search_path:

```sql
-- supabase/migrations/20260115_fix_function_search_path.sql

-- Fix get_learner_progress
CREATE OR REPLACE FUNCTION public.get_learner_progress(p_user_id UUID)
RETURNS TABLE (/* existing return type */)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- existing function body
END;
$$;

-- Fix check_coach_rate_limit
CREATE OR REPLACE FUNCTION public.check_coach_rate_limit(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- existing function body
END;
$$;

-- Fix update_user_certification_status
CREATE OR REPLACE FUNCTION public.update_user_certification_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- existing function body
END;
$$;

-- Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
```

### 2. Review Audio Transcripts RLS Policy

Update the RLS policy to be more restrictive:

```sql
-- In same migration or separate

-- Drop overly permissive policy
DROP POLICY IF EXISTS "Service role can modify audio transcripts" ON audio_transcripts;

-- Replace with admin-only write policy
CREATE POLICY "Admins can manage audio transcripts"
  ON audio_transcripts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Keep read policy for authenticated users
-- (should already exist from earlier migration)
```

### 3. Enable Leaked Password Protection

In Supabase Dashboard:
1. Go to **Authentication** → **Providers** → **Email**
2. Enable **"Check if password has been leaked"**
3. Save changes

Document in `SETUP_SUPABASE.md`:
```markdown
## Security Settings

### Leaked Password Protection
Enable in Dashboard → Authentication → Providers → Email:
- Check "Check if password has been leaked"
```

### 4. Create Migration for scenario_progress

```sql
-- supabase/migrations/20260115_scenario_progress.sql

-- Table already exists, this migration just documents schema
-- If table doesn't exist in fresh install, create it:

CREATE TABLE IF NOT EXISTS scenario_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario_category TEXT NOT NULL,
  scenario_id TEXT NOT NULL,
  reflection_learned TEXT NOT NULL,
  reflection_improve TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, scenario_category, scenario_id)
);

COMMENT ON TABLE scenario_progress IS 'Tracks scenario completion via learning reflections';
COMMENT ON COLUMN scenario_progress.reflection_learned IS 'User reflection on key learnings from practice';
COMMENT ON COLUMN scenario_progress.reflection_improve IS 'User reflection on improvements for next time';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_scenario_progress_user ON scenario_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_category ON scenario_progress(scenario_category);

-- RLS
ALTER TABLE scenario_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scenario progress"
  ON scenario_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scenario progress"
  ON scenario_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own scenario progress"
  ON scenario_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all scenario progress"
  ON scenario_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Updated at trigger
CREATE TRIGGER update_scenario_progress_updated_at
  BEFORE UPDATE ON scenario_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## Acceptance Criteria

- [ ] `pnpm supabase db push` applies migrations without error
- [ ] Supabase security advisor shows 0 warnings for these items
- [ ] Functions have `SET search_path = public`
- [ ] Audio transcripts RLS policy restricts writes to admins
- [ ] Leaked password protection is enabled
- [ ] `scenario_progress` table has tracked migration

---

## Testing

```bash
# Run security advisor check
# Dashboard → Database → Linter → Security

# Verify function search_path
SELECT proname, prosecdef, proconfig 
FROM pg_proc 
WHERE proname IN (
  'get_learner_progress', 
  'check_coach_rate_limit',
  'update_user_certification_status',
  'update_updated_at_column'
);
# Should show search_path=public in proconfig
```

---

## Notes

- Run migrations in order: function fixes first, then table creation
- Test with non-admin user to verify audio_transcripts write is blocked
- Dashboard changes (leaked password) must be done manually
