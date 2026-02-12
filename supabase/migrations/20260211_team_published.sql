-- Add published column to team_members
-- Allows hiding team members from the public website without deleting them.
-- Default TRUE so all existing members remain visible.

ALTER TABLE team_members
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

-- Add an index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members (published);
