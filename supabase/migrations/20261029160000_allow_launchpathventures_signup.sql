-- CATALYST - Allow launchpathventures.com sign-ups (follow-up to serviceos#2011 / #250)
--
-- Tim's decision: new accounts are allowed from primecapitaldubai.com AND
-- launchpathventures.com. Nothing else changes: is_allowed_signup_email(), the
-- hook, both triggers and the refusal message are all built from this list.
-- handle_new_user() always creates a 'learner' profile, so nobody is auto-admin;
-- admins are still promoted explicitly (and role changes stay guarded by
-- 20261029150000_block_role_self_promotion.sql). Existing rows are not touched.
--
-- Mirror any change here in SIGNUP_EMAIL_DOMAINS in lib/auth/config.ts (a parity
-- test checks both).
--
-- Rollback: supabase/rollback/20261029160000_allow_launchpathventures_signup.down.sql

CREATE OR REPLACE FUNCTION public.allowed_signup_domains()
RETURNS text[]
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT ARRAY['primecapitaldubai.com', 'launchpathventures.com']
$$;

-- Same grants as 20261029140000 (CREATE OR REPLACE keeps them; restated so this
-- file is self-contained).
GRANT EXECUTE ON FUNCTION public.allowed_signup_domains() TO supabase_auth_admin;
