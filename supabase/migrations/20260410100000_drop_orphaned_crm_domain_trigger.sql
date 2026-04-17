-- =============================================================================
-- Drop orphaned CRM domain validation trigger
-- =============================================================================
-- The AgentCRM cleanup migration (20260324999999) dropped `check_signup_email_domain`
-- but missed `validate_signup_email_domain` (different name, same purpose).
-- This orphaned BEFORE INSERT trigger on auth.users was querying
-- `allowed_signup_domains` (which was already dropped), causing every new
-- user signup to fail with "Database error saving new user".
-- =============================================================================

DROP TRIGGER IF EXISTS validate_signup_email_domain ON auth.users;
DROP FUNCTION IF EXISTS public.validate_signup_email_domain();
