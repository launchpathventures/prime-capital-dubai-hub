-- CATALYST - Enforce the company email domain for NEW accounts (serviceos#2011, F3)
--
-- Before: the domain was only checked in the app callback (api/auth/callback),
-- AFTER the Supabase session already existed, and handle_new_user() let other
-- domains through (it only skipped the profile). Anyone could create an account.
-- After: account creation itself is refused unless the email is on an allowed
-- signup domain. Two independent layers:
--   1. public.hook_before_user_created  - Auth "Before user created" hook. MUST BE
--      ATTACHED MANUALLY: Dashboard -> Authentication -> Hooks (not a migration).
--   2. enforce_signup_email_domain      - BEFORE INSERT trigger on auth.users,
--      active as soon as this migration is applied, hook attached or not.
--
-- Existing users are NOT touched: no UPDATE/DELETE of auth.users, and the
-- triggers only fire on INSERT.
--
-- QUESTION for Tim: launchpathventures.com is deliberately NOT allowed for new
-- sign-ups. To allow it, add it to allowed_signup_domains() below (one line) and
-- to SIGNUP_EMAIL_DOMAINS in lib/auth/config.ts (a parity test checks both).
--
-- Rollback: supabase/rollback/20261029140000_enforce_signup_domain.down.sql

-- Single source of truth for the signup domain list.
CREATE OR REPLACE FUNCTION public.allowed_signup_domains()
RETURNS text[]
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT ARRAY['primecapitaldubai.com']
$$;

-- Case-insensitive; the domain must follow the LAST '@' and the local part must
-- be non-empty with no further '@', so lookalikes such as
-- 'a@primecapitaldubai.com.evil.example' or 'a@evil.example@primecapitaldubai.com'
-- are refused. NULL (phone-only / anonymous users) is refused.
CREATE OR REPLACE FUNCTION public.is_allowed_signup_email(email text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT coalesce(
    EXISTS (
      SELECT 1
      FROM unnest(public.allowed_signup_domains()) AS d
      WHERE lower(email) LIKE '%@' || d
        AND length(email) > length(d) + 1
        AND strpos(left(email, length(email) - length(d) - 1), '@') = 0
    ),
    false
  )
$$;

-- Auth hook: returns {} to allow, or an error object to reject the sign-up.
CREATE OR REPLACE FUNCTION public.hook_before_user_created(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF public.is_allowed_signup_email(event -> 'user' ->> 'email') THEN
    RETURN '{}'::jsonb;
  END IF;

  RETURN jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', 'Sign-up is limited to @primecapitaldubai.com email addresses.'
    )
  );
END
$$;

GRANT EXECUTE ON FUNCTION public.hook_before_user_created(jsonb) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.hook_before_user_created(jsonb) FROM authenticated, anon, public;

-- Belt and braces: same rule as a trigger, so it holds even if the hook is
-- unattached or removed. Unlike on_auth_user_created (AFTER INSERT, swallows
-- errors) this must abort the insert.
CREATE OR REPLACE FUNCTION public.enforce_signup_email_domain()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NOT public.is_allowed_signup_email(NEW.email) THEN
    RAISE EXCEPTION 'Sign-up is limited to @primecapitaldubai.com email addresses.'
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS enforce_signup_email_domain ON auth.users;
CREATE TRIGGER enforce_signup_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_signup_email_domain();

-- handle_new_user(): profile logic unchanged (20260410000000) apart from
-- lower-case matching, so 'Jane@PrimeCapitalDubai.com' gets a profile too.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Only create profiles for allowed domains
  IF NEW.email IS NOT NULL
     AND lower(NEW.email) NOT LIKE '%@primecapitaldubai.com'
     AND lower(NEW.email) NOT LIKE '%@launchpathventures.com'
  THEN
    RETURN NEW;
  END IF;

  -- Assign role based on domain
  IF lower(NEW.email) LIKE '%@launchpathventures.com' THEN
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
