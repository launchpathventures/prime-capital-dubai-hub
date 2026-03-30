-- =============================================================================
-- Add marketing role to user_profiles
-- =============================================================================
-- Expands the role CHECK constraint to allow 'marketing' in addition to
-- 'admin' and 'learner'. Marketing users can manage website content but
-- cannot access user management or learning admin.
-- =============================================================================

ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('admin', 'marketing', 'learner'));
