-- CATALYST - Rollback for 20261029150000_block_role_self_promotion.sql (serviceos#2011)
--
-- WARNING: this re-opens self-promotion to admin (and therefore cms writes).
-- Only run it if the guard breaks a legitimate flow, and re-apply a fix promptly.
-- Safe to run more than once.

BEGIN;

DROP TRIGGER IF EXISTS guard_user_profile_role ON public.user_profiles;
DROP FUNCTION IF EXISTS public.guard_user_profile_role();

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can create own profile" ON public.user_profiles;
CREATE POLICY "Users can create own profile"
  ON public.user_profiles FOR INSERT TO public
  WITH CHECK (auth.uid() = id);

COMMIT;
