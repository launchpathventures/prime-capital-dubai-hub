-- CATALYST - Minimal Supabase storage/auth stub for the storage policy tests (serviceos#2011)
--
-- Plain Postgres has no Supabase schemas, so this recreates just enough of them
-- (roles, auth.uid()/role(), storage.objects with RLS, storage.foldername()) plus
-- the storage policies that existed in prod BEFORE the lock migration. The
-- migration under test is applied on top of this.

-- Roles are created by scratch-db.ts (cluster-wide, so parallel test files would race).

CREATE SCHEMA auth;
GRANT USAGE ON SCHEMA auth TO anon, authenticated, service_role;

CREATE FUNCTION auth.jwt() RETURNS jsonb LANGUAGE sql STABLE AS $$
  SELECT coalesce(nullif(current_setting('request.jwt.claims', true), ''), '{}')::jsonb
$$;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(auth.jwt() ->> 'sub', '')::uuid
$$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$
  SELECT nullif(auth.jwt() ->> 'role', '')
$$;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA auth TO anon, authenticated, service_role;

CREATE SCHEMA storage;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, service_role;

CREATE TABLE storage.buckets (
  id text PRIMARY KEY,
  name text NOT NULL,
  public boolean NOT NULL DEFAULT false
);

CREATE TABLE storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text REFERENCES storage.buckets (id),
  name text,
  owner uuid,
  metadata jsonb
);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
-- Supabase grants full table privileges and relies on RLS alone; without this
-- every refusal would be "permission denied" and prove nothing about policies.
GRANT ALL ON storage.buckets, storage.objects TO anon, authenticated, service_role;

CREATE FUNCTION storage.foldername(name text) RETURNS text[] LANGUAGE plpgsql AS $$
DECLARE
  _parts text[];
BEGIN
  SELECT string_to_array(name, '/') INTO _parts;
  RETURN _parts[1:array_length(_parts, 1) - 1];
END
$$;

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY,
  role text NOT NULL DEFAULT 'learner'
);
GRANT SELECT ON public.user_profiles TO anon, authenticated, service_role;

INSERT INTO storage.buckets (id, name, public) VALUES
  ('lms-audio', 'lms-audio', true),
  ('cms', 'cms', true),
  ('voice-recordings', 'voice-recordings', false);

-- Pre-lock policies, as read from prod (roles = {public}, i.e. incl. anon).
CREATE POLICY "LMS audio is publicly accessible" ON storage.objects FOR SELECT
  USING (bucket_id = 'lms-audio');
CREATE POLICY "Service role can upload audio" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lms-audio');
CREATE POLICY "Service role can update audio" ON storage.objects FOR UPDATE
  USING (bucket_id = 'lms-audio');
CREATE POLICY "Service role can delete audio" ON storage.objects FOR DELETE
  USING (bucket_id = 'lms-audio');

CREATE POLICY "Public read access for cms bucket" ON storage.objects FOR SELECT
  USING (bucket_id = 'cms');
CREATE POLICY "Authenticated users can upload to cms bucket" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update cms files" ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete cms files" ON storage.objects FOR DELETE
  USING (bucket_id = 'cms' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can read voice recordings" ON storage.objects FOR SELECT
  USING (bucket_id = 'voice-recordings');
CREATE POLICY "Authenticated users can upload voice recordings" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'voice-recordings' AND auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own voice recordings" ON storage.objects FOR DELETE
  USING (bucket_id = 'voice-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
