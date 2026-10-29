-- CATALYST - Block self-promotion to admin via user_profiles (serviceos#2011)
--
-- Found while reviewing the cms lock (confirmed in prod with a read-only catalog
-- query): any signed-in user could set their own user_profiles.role = 'admin',
--   * "Users can update own profile"  (UPDATE, authenticated, id = uid, no column limit)
--   * "Users can create own profile"  (INSERT, TO public, CHECK uid = id, no role limit)
-- and then pass every "role = 'admin'" check, including the admin-only cms
-- storage policies. The cms lock is meaningless without this fix.
--
-- Fix, two layers:
--   1. RLS: drop the duplicate TO public insert policy; the remaining insert policy
--      only accepts role = 'learner'.
--   2. Trigger: an anon/authenticated caller who is not already an admin cannot
--      INSERT a non-learner row or change role on UPDATE, whatever policies exist.
--      service_role, postgres, supabase_auth_admin and other non-API roles are not
--      restricted, so lib/actions/users.ts (service-role client) keeps working.
--
-- Rollback: supabase/rollback/20261029150000_block_role_self_promotion.down.sql

DROP POLICY IF EXISTS "Users can create own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()) AND role = 'learner');

-- SECURITY DEFINER so the admin lookup is not itself subject to RLS.
-- current_setting('role') is the role set by SET ROLE (what PostgREST does per
-- request); unlike a JWT claim it is not request-controlled data.
CREATE OR REPLACE FUNCTION public.guard_user_profile_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF current_setting('role', true) IN ('anon', 'authenticated')
     AND NOT EXISTS (
       SELECT 1 FROM public.user_profiles p
       WHERE p.id = (SELECT auth.uid()) AND p.role = 'admin'
     )
  THEN
    IF TG_OP = 'INSERT' AND NEW.role IS DISTINCT FROM 'learner' THEN
      RAISE EXCEPTION 'Only an admin can create a profile with role %', coalesce(NEW.role, 'NULL')
        USING ERRCODE = 'insufficient_privilege';
    ELSIF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Only an admin can change a profile role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END
$$;

REVOKE EXECUTE ON FUNCTION public.guard_user_profile_role() FROM public, anon, authenticated;

DROP TRIGGER IF EXISTS guard_user_profile_role ON public.user_profiles;
CREATE TRIGGER guard_user_profile_role
  BEFORE INSERT OR UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_user_profile_role();
