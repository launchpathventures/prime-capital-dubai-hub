-- CATALYST - Certificate schema drift repair
--
-- Remote migration history marked 20260326000000 (generate_certificate_id RPC)
-- and 20260326100000 (RLS tighten) as applied, but the objects were not present
-- in the database — certificate issuance (auto + backfill) failed with PGRST202
-- "Could not find the function public.generate_certificate_id".
--
-- This forward migration re-applies those objects idempotently so repo and DB
-- agree again. Safe to run whether or not they already exist.

-- Sequence backing the human-readable certificate IDs (PCD-{YEAR}-{NNNN}).
CREATE SEQUENCE IF NOT EXISTS certificate_seq START 1;

-- Atomic, collision-free certificate ID generator (from 20260326000000).
CREATE OR REPLACE FUNCTION generate_certificate_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  seq_num BIGINT;
  cert_year INT;
BEGIN
  seq_num := nextval('certificate_seq');
  cert_year := EXTRACT(YEAR FROM NOW())::INT;
  RETURN 'PCD-' || cert_year || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$;

-- Restrict public SELECT to active certificates only (from 20260326100000).
DROP POLICY IF EXISTS "Anyone can view certificates by certificate_id" ON completion_certificates;
DROP POLICY IF EXISTS "Users can view own certificates" ON completion_certificates;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE policyname = 'Public can view active certificates'
      AND tablename = 'completion_certificates'
  ) THEN
    CREATE POLICY "Public can view active certificates"
      ON completion_certificates FOR SELECT
      USING (revoked_at IS NULL);
  END IF;
END $$;

-- Make the restored RPC visible to the REST API immediately.
NOTIFY pgrst, 'reload schema';
