-- =============================================================================
-- Fix handle_new_user() trigger to not block user creation
-- =============================================================================
-- The trigger was failing silently and returning "Database error saving new user"
-- from Supabase GoTrue. This wraps the profile INSERT in an exception handler
-- so user creation always succeeds — the auth callback has fallback code to
-- create the profile if the trigger fails.
-- =============================================================================

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

  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    -- Log but don't block user creation — callback handles profile fallback
    RAISE WARNING 'handle_new_user trigger failed for %: %', NEW.email, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
