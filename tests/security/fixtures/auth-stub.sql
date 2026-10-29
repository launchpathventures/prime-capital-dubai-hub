-- CATALYST - Minimal Supabase auth stub for the sign-up domain tests (serviceos#2011, F3)
--
-- Just enough of auth.users and the roles GoTrue uses. The test then loads the
-- real handle_new_user() migration, creates the on_auth_user_created trigger,
-- and applies the migration under test.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN
    CREATE ROLE authenticated NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'supabase_auth_admin') THEN
    CREATE ROLE supabase_auth_admin NOLOGIN;
  END IF;
END
$$;

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
