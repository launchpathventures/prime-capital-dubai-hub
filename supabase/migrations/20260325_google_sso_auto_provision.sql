-- =============================================================================
-- Google Workspace SSO: Auto-Provisioning Trigger + Backfill
-- =============================================================================
-- Creates user_profiles automatically when new auth users are created.
-- Fixes the gap where self-registration and Google OAuth didn't create profiles.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Trigger function: auto-create user_profiles on auth.users insert
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, certification_status)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    'learner',
    'in_progress'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 2. Trigger: fires after every new user creation
-- -----------------------------------------------------------------------------

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 3. RLS policy: allow users to insert their own profile (fallback provisioning)
-- -----------------------------------------------------------------------------

CREATE POLICY "Users can create own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- -----------------------------------------------------------------------------
-- 4. Backfill: create profiles for existing users who are missing one
-- -----------------------------------------------------------------------------

INSERT INTO user_profiles (id, full_name, role, certification_status)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'learner',
  'in_progress'
FROM auth.users u
LEFT JOIN user_profiles p ON p.id = u.id
WHERE p.id IS NULL;
