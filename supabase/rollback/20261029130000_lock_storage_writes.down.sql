-- CATALYST - Rollback for 20261029130000_lock_storage_writes.sql (serviceos#2011)
--
-- Recreates the previous (insecure) policies exactly as they were in prod before
-- the lock. Run manually, only if the lock breaks a legitimate flow. Not a
-- migration: it lives outside supabase/migrations on purpose.
-- Safe to run more than once.

BEGIN;

-- lms-audio
DROP POLICY IF EXISTS "Service role can upload audio" ON storage.objects;
CREATE POLICY "Service role can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lms-audio');
DROP POLICY IF EXISTS "Service role can update audio" ON storage.objects;
CREATE POLICY "Service role can update audio"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'lms-audio');
DROP POLICY IF EXISTS "Service role can delete audio" ON storage.objects;
CREATE POLICY "Service role can delete audio"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'lms-audio');

-- cms
DROP POLICY IF EXISTS "Admins can upload to cms bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update cms files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete cms files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to cms bucket" ON storage.objects;
CREATE POLICY "Authenticated users can upload to cms bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'cms' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update cms files" ON storage.objects;
CREATE POLICY "Authenticated users can update cms files"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'cms' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can delete cms files" ON storage.objects;
CREATE POLICY "Authenticated users can delete cms files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'cms' AND auth.role() = 'authenticated');

-- voice-recordings
DROP POLICY IF EXISTS "Users can read their own voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own voice recordings" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read voice recordings" ON storage.objects;
CREATE POLICY "Anyone can read voice recordings"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'voice-recordings');
DROP POLICY IF EXISTS "Authenticated users can upload voice recordings" ON storage.objects;
CREATE POLICY "Authenticated users can upload voice recordings"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'voice-recordings' AND auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Users can delete their own voice recordings" ON storage.objects;
CREATE POLICY "Users can delete their own voice recordings"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'voice-recordings'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMIT;
