-- =============================================================================
-- Reconcile team_members schema with application code
-- =============================================================================
-- The original CMS migration (20260106000000) created columns with different
-- names than the application code expects. This migration renames columns and
-- adds missing ones to match the TeamMemberRow type used throughout the app.
--
-- Column renames:
--   bio        → full_bio  (full biography for profile pages)
--   image_url  → photo     (profile image URL)
--   linkedin_url → linkedin (LinkedIn profile URL)
--
-- New columns:
--   short_bio   TEXT         — summary for cards/listings
--   is_founder  BOOLEAN      — founder/leadership flag
--   background  JSONB        — array of background items
-- =============================================================================

-- Rename existing columns (idempotent — skip if already renamed)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'bio') THEN
    ALTER TABLE team_members RENAME COLUMN bio TO full_bio;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'image_url') THEN
    ALTER TABLE team_members RENAME COLUMN image_url TO photo;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'team_members' AND column_name = 'linkedin_url') THEN
    ALTER TABLE team_members RENAME COLUMN linkedin_url TO linkedin;
  END IF;
END $$;

-- Add new columns
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS short_bio TEXT;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT false;
ALTER TABLE team_members ADD COLUMN IF NOT EXISTS background JSONB DEFAULT '[]';
