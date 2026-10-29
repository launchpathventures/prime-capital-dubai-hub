-- CATALYST - Rollback for 20261029140000_enforce_signup_domain.sql (serviceos#2011, F3)
--
-- Removes the sign-up domain enforcement. Run manually. If the Auth hook was
-- attached in the dashboard, detach it FIRST (Authentication -> Hooks), otherwise
-- sign-ups fail while the function is missing. Safe to run more than once.
-- Never restores auto-admin: new profiles are always role 'learner'.
-- (The USAGE / EXECUTE grants to supabase_auth_admin are left in place; harmless.)

BEGIN;

DROP TRIGGER IF EXISTS enforce_signup_email_domain ON auth.users;
DROP TRIGGER IF EXISTS enforce_email_change_domain ON auth.users;
DROP FUNCTION IF EXISTS public.enforce_signup_email_domain();
DROP FUNCTION IF EXISTS public.enforce_email_change_domain();
DROP FUNCTION IF EXISTS public.hook_before_user_created(jsonb);
DROP FUNCTION IF EXISTS public.is_allowed_signup_email(text);
DROP FUNCTION IF EXISTS public.signup_domain_error_message();
DROP FUNCTION IF EXISTS public.allowed_signup_domains();

-- handle_new_user() back to the shape of 20260410000000 (case-sensitive match, no
-- pinned search_path) but WITHOUT its "launchpathventures.com => admin" branch:
-- this rollback must never restore automatic admin for any domain. Every new
-- profile is a 'learner'; admins are promoted explicitly (lib/actions/users.ts).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email IS NOT NULL
     AND NEW.email NOT LIKE '%@primecapitaldubai.com'
     AND NEW.email NOT LIKE '%@launchpathventures.com'
  THEN
    RETURN NEW;
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
      'learner',
      'in_progress'
    )
    ON CONFLICT (id) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user trigger failed for %: %', NEW.email, SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
