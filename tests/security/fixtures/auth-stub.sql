-- CATALYST - Minimal Supabase auth stub for the security tests (serviceos#2011)
--
-- auth.users plus auth.uid()/role()/jwt() reading request.jwt.claims, as on
-- Supabase. Roles are created by scratch-db.ts (cluster-wide, so parallel test
-- files would race).

CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role, supabase_auth_admin;

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

CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(auth.jwt() ->> 'sub', '')::uuid
$$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$
  SELECT nullif(auth.jwt() ->> 'role', '')
$$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated, service_role, supabase_auth_admin;
