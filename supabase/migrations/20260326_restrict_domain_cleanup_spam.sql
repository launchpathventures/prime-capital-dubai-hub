-- =============================================================================
-- Domain Restriction + Spam Account Cleanup
-- =============================================================================
-- 1. Update handle_new_user() for allowed domains with role assignment
-- 2. Delete data referencing non-company users
-- 3. Delete non-company auth users
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Update trigger: allowed domains with admin role for launchpathventures
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Only create profiles for allowed domains
  IF NEW.email IS NOT NULL
     AND NEW.email NOT LIKE '%@primecapitaldubai.com'
     AND NEW.email NOT LIKE '%@launchpathventures.com'
  THEN
    RETURN NEW;
  END IF;

  -- Assign role based on domain
  IF NEW.email LIKE '%@launchpathventures.com' THEN
    user_role := 'admin';
  ELSE
    user_role := 'learner';
  END IF;

  INSERT INTO public.user_profiles (id, full_name, role, certification_status)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    user_role,
    'in_progress'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 2. Clean up: delete all data referencing non-company users
--    Order matters — child tables first to satisfy FK constraints.
-- -----------------------------------------------------------------------------

-- LMS progress tables
DELETE FROM learning_progress
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email NOT LIKE '%@primecapitaldubai.com'
    AND email NOT LIKE '%@launchpathventures.com'
);

DELETE FROM quiz_attempts
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email NOT LIKE '%@primecapitaldubai.com'
    AND email NOT LIKE '%@launchpathventures.com'
);

-- Coach usage (FK without CASCADE)
DELETE FROM coach_usage
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email NOT LIKE '%@primecapitaldubai.com'
    AND email NOT LIKE '%@launchpathventures.com'
);

-- Conditionally clean tables that may or may not exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'scenario_progress' AND table_schema = 'public') THEN
    DELETE FROM scenario_progress WHERE user_id IN (SELECT id FROM auth.users WHERE email NOT LIKE '%@primecapitaldubai.com' AND email NOT LIKE '%@launchpathventures.com');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hub_tasks' AND table_schema = 'public') THEN
    UPDATE hub_tasks SET assignee_id = NULL WHERE assignee_id IN (SELECT id FROM auth.users WHERE email NOT LIKE '%@primecapitaldubai.com' AND email NOT LIKE '%@launchpathventures.com');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hub_notes' AND table_schema = 'public') THEN
    UPDATE hub_notes SET created_by = NULL WHERE created_by IN (SELECT id FROM auth.users WHERE email NOT LIKE '%@primecapitaldubai.com' AND email NOT LIKE '%@launchpathventures.com');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hub_surveys' AND table_schema = 'public') THEN
    UPDATE hub_surveys SET respondent_id = NULL WHERE respondent_id IN (SELECT id FROM auth.users WHERE email NOT LIKE '%@primecapitaldubai.com' AND email NOT LIKE '%@launchpathventures.com');
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hub_activity' AND table_schema = 'public') THEN
    UPDATE hub_activity SET user_id = NULL WHERE user_id IN (SELECT id FROM auth.users WHERE email NOT LIKE '%@primecapitaldubai.com' AND email NOT LIKE '%@launchpathventures.com');
  END IF;
END $$;

-- User profiles
DELETE FROM user_profiles
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email NOT LIKE '%@primecapitaldubai.com'
    AND email NOT LIKE '%@launchpathventures.com'
);

-- -----------------------------------------------------------------------------
-- 3. Clean up: delete non-company auth users
-- -----------------------------------------------------------------------------

DELETE FROM auth.users
WHERE email NOT LIKE '%@primecapitaldubai.com'
  AND email NOT LIKE '%@launchpathventures.com';
