-- CATALYST - Enforce the company email domain for NEW accounts (serviceos#2011, F3)
--
-- Before: the domain was only checked in the app callback (api/auth/callback),
-- AFTER the Supabase session already existed, and handle_new_user() let other
-- domains through (it only skipped the profile). Anyone could create an account.
-- After: account creation itself is refused unless the email is on an allowed
-- signup domain. Layers:
--   1. public.hook_before_user_created  - Auth "Before user created" hook. MUST BE
--      ATTACHED MANUALLY: Dashboard -> Authentication -> Hooks (not a migration).
--   2. enforce_signup_email_domain      - BEFORE INSERT trigger on auth.users,
--      active as soon as this migration is applied, hook attached or not.
--   3. enforce_email_change_domain      - BEFORE UPDATE OF email trigger, so an
--      existing account cannot be moved to an other-domain address. It only fires
--      when the email actually changes; existing rows are never rewritten.
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
STABLE
SET search_path = ''
AS $$
  SELECT ARRAY['primecapitaldubai.com']
$$;

-- ASCII only, case-insensitive. lower(... COLLATE "C") only folds A-Z, so
-- locale-dependent folds (e.g. U+0130 "İ" -> "i") can never turn a lookalike
-- into an allowed address; the ASCII check also rejects them outright.
-- The domain must follow the LAST '@' and the local part must be non-empty with
-- no further '@', so 'a@primecapitaldubai.com.evil.example' and
-- 'a@evil.example@primecapitaldubai.com' are refused. NULL is refused.
CREATE OR REPLACE FUNCTION public.is_allowed_signup_email(email text)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT coalesce(
    email !~ '[^ -~]'
    AND EXISTS (
      SELECT 1
      FROM unnest(public.allowed_signup_domains()) AS d
      WHERE lower(email COLLATE "C") LIKE '%@' || d
        AND length(email) > length(d) + 1
        AND strpos(left(email, length(email) - length(d) - 1), '@') = 0
    ),
    false
  )
$$;

-- Error text built from the domain list, so it can't drift from the rule.
CREATE OR REPLACE FUNCTION public.signup_domain_error_message()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT 'Sign-up is limited to '
    || array_to_string(ARRAY(SELECT '@' || d FROM unnest(public.allowed_signup_domains()) AS d), ' or ')
    || ' email addresses.'
$$;

-- The auth service runs these as supabase_auth_admin. Grant explicitly so they
-- keep working if PUBLIC execute / schema usage is ever revoked (e.g. hardening).
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION
  public.is_allowed_signup_email(text),
  public.allowed_signup_domains(),
  public.signup_domain_error_message()
  TO supabase_auth_admin;

-- Auth hook: returns {} to allow, or an error object to reject the sign-up.
CREATE OR REPLACE FUNCTION public.hook_before_user_created(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
BEGIN
  IF public.is_allowed_signup_email(event -> 'user' ->> 'email') THEN
    RETURN '{}'::jsonb;
  END IF;

  RETURN jsonb_build_object(
    'error', jsonb_build_object(
      'http_code', 403,
      'message', public.signup_domain_error_message()
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
    RAISE EXCEPTION '%', public.signup_domain_error_message()
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS enforce_signup_email_domain ON auth.users;
CREATE TRIGGER enforce_signup_email_domain
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_signup_email_domain();

-- Email changes: refuse only a CHANGE to a non-allowed address. Rows whose email
-- is not changing (including the existing launchpathventures.com admin) pass.
CREATE OR REPLACE FUNCTION public.enforce_email_change_domain()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email
     AND NOT public.is_allowed_signup_email(NEW.email) THEN
    RAISE EXCEPTION '%', public.signup_domain_error_message()
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS enforce_email_change_domain ON auth.users;
CREATE TRIGGER enforce_email_change_domain
  BEFORE UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.enforce_email_change_domain();

-- handle_new_user(): same profile creation as 20260410000000, but the domain test
-- is is_allowed_signup_email() (no hard-coded LIKEs, ASCII/case-safe) and
-- search_path is pinned. Profiles are always created as 'learner': the old
-- "launchpathventures.com => admin" branch is gone (that domain can't sign up
-- any more); admins are promoted explicitly via lib/actions/users.ts.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Only create profiles for allowed domains
  IF NOT public.is_allowed_signup_email(NEW.email) THEN
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
    -- Log but don't block user creation — callback handles profile fallback
    RAISE WARNING 'handle_new_user trigger failed for %: %', NEW.email, SQLERRM;
  END;

  RETURN NEW;
END;
$$;
