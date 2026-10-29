-- CATALYST - Lock hub storage writes (serviceos#2011)
--
-- Before: lms-audio writes were open to every role (incl. anon), cms writes to
-- any signed-in user, and the voice-recordings policies allowed public read and
-- upload to any path.
-- After:
--   lms-audio         no write policies (service_role bypasses RLS); public read kept
--   cms               writes admin-only (user_profiles.role = 'admin'); public read kept
--   voice-recordings  each user's own folder only, all commands (bucket must be PRIVATE)
--
-- Rollback: supabase/rollback/20261029130000_lock_storage_writes.down.sql

-- =============================================================================
-- lms-audio: system (service_role) writes only
-- =============================================================================
-- Policies are intentionally NOT recreated: scripts/generate-audio.ts uses the
-- service-role key, which bypasses RLS. "LMS audio is publicly accessible"
-- (SELECT) is untouched.
DROP POLICY IF EXISTS "Service role can upload audio" ON storage.objects;
DROP POLICY IF EXISTS "Service role can update audio" ON storage.objects;
DROP POLICY IF EXISTS "Service role can delete audio" ON storage.objects;

-- =============================================================================
-- cms: admin-only writes
-- =============================================================================
-- Marketing intentionally has no storage write access (decided on serviceos#2011).
-- "Public read access for cms bucket" (SELECT) is untouched.
DROP POLICY IF EXISTS "Authenticated users can upload to cms bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cms files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete cms files" ON storage.objects;

DROP POLICY IF EXISTS "Admins can upload to cms bucket" ON storage.objects;
CREATE POLICY "Admins can upload to cms bucket"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update cms files" ON storage.objects;
CREATE POLICY "Admins can update cms files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  )
  WITH CHECK (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete cms files" ON storage.objects;
CREATE POLICY "Admins can delete cms files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cms'
    AND EXISTS (
      SELECT 1 FROM public.user_profiles p
      WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
    )
  );

-- =============================================================================
-- voice-recordings: each user's own folder only (bucket must be PRIVATE)
-- =============================================================================
-- The bucket does not exist in prod yet and is NOT created here. When it is
-- created it must be private; the policies below assume object paths of the form
-- "<auth.uid()>/<file>".
DROP POLICY IF EXISTS "Anyone can read voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own voice recordings" ON storage.objects;

DROP POLICY IF EXISTS "Users can read their own voice recordings" ON storage.objects;
CREATE POLICY "Users can read their own voice recordings"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'voice-recordings'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can upload their own voice recordings" ON storage.objects;
CREATE POLICY "Users can upload their own voice recordings"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'voice-recordings'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

DROP POLICY IF EXISTS "Users can update their own voice recordings" ON storage.objects;
CREATE POLICY "Users can update their own voice recordings"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'voice-recordings'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  )
  WITH CHECK (
    bucket_id = 'voice-recordings'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );

CREATE POLICY "Users can delete their own voice recordings"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'voice-recordings'
    AND (storage.foldername(name))[1] = (SELECT auth.uid())::text
  );
