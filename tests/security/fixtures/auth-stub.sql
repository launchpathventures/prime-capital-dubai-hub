-- CATALYST - Minimal Supabase auth stub for the sign-up domain tests (serviceos#2011, F3)
--
-- Just enough of auth.users and the roles GoTrue uses. The test then loads the
-- real handle_new_user() migration, creates the on_auth_user_created trigger,
-- and applies the migration under test.

-- Roles are created by scratch-db.ts (cluster-wide, so parallel test files would race).

CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA auth TO supabase_auth_admin;

CREATE TABLE auth.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone text,
  is_anonymous boolean NOT NULL DEFAULT false,
  raw_app_meta_data jsonb,
  raw_user_meta_data jsonb,
  last_sign_in_at timestamptz
);
GRANT SELECT, INSERT, UPDATE ON auth.users TO supabase_auth_admin;

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY,
  full_name text,
  role text NOT NULL DEFAULT 'learner',
  certification_status text
);
