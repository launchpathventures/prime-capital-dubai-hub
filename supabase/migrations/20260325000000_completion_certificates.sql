-- CATALYST - Completion Certificates Schema
--
-- Tracks pre-assessment completion certificates issued to learners
-- who have completed all modules and passed all quizzes.
-- Certificates are shareable via public URLs.

-- =============================================================================
-- Completion Certificates
-- =============================================================================

CREATE TABLE IF NOT EXISTS completion_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id TEXT UNIQUE NOT NULL,        -- Human-readable: "PCD-2026-0001"
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,                      -- NULL = active, set = revoked
  revoked_by UUID REFERENCES auth.users(id),
  revoke_reason TEXT,
  modules_completed INTEGER NOT NULL,
  quizzes_passed INTEGER NOT NULL,
  course_name TEXT NOT NULL DEFAULT 'Prime Capital Consultant Training Programme',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE completion_certificates IS 'Pre-assessment completion certificates issued when learners finish all modules and quizzes';
COMMENT ON COLUMN completion_certificates.certificate_id IS 'Human-readable certificate ID: PCD-{YEAR}-{NNNN}';
COMMENT ON COLUMN completion_certificates.revoked_at IS 'When set, certificate is revoked and should not be displayed publicly';

CREATE INDEX IF NOT EXISTS idx_completion_certificates_user ON completion_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_completion_certificates_cert_id ON completion_certificates(certificate_id);

-- Sequence for generating certificate numbers
CREATE SEQUENCE IF NOT EXISTS certificate_seq START 1;

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE completion_certificates ENABLE ROW LEVEL SECURITY;

-- Public can view active certificates by certificate_id (shareable URLs)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view certificates by certificate_id' AND tablename = 'completion_certificates') THEN
    CREATE POLICY "Anyone can view certificates by certificate_id"
      ON completion_certificates FOR SELECT
      USING (true);
  END IF;
END $$;

-- Authenticated users can view their own certificates
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own certificates' AND tablename = 'completion_certificates') THEN
    CREATE POLICY "Users can view own certificates"
      ON completion_certificates FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Authenticated users can insert their own certificates
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can create own certificates' AND tablename = 'completion_certificates') THEN
    CREATE POLICY "Users can create own certificates"
      ON completion_certificates FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Admins can manage all certificates
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage all certificates' AND tablename = 'completion_certificates') THEN
    CREATE POLICY "Admins can manage all certificates"
      ON completion_certificates FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid()
          AND user_profiles.role = 'admin'
        )
      );
  END IF;
END $$;
