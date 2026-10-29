-- CATALYST - Rollback for 20261029160000_allow_launchpathventures_signup.sql (serviceos#2011 follow-up)
--
-- Back to primecapitaldubai.com only. Run manually. Safe to run more than once.
-- Existing launchpathventures.com accounts (and their profiles) are not touched;
-- only new sign-ups from that domain are refused again. Requires
-- 20261029140000_enforce_signup_domain.sql to be applied (it creates the function).

BEGIN;

CREATE OR REPLACE FUNCTION public.allowed_signup_domains()
RETURNS text[]
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT ARRAY['primecapitaldubai.com']
$$;

GRANT EXECUTE ON FUNCTION public.allowed_signup_domains() TO supabase_auth_admin;

COMMIT;
