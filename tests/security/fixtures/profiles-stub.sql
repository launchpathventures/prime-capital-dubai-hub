-- CATALYST - public.user_profiles as it is in prod, for the security tests (serviceos#2011)
--
-- RLS is ON with the four policies read from prod (read-only catalog query,
-- 29 Oct 2026). Note prod has NO admin-manage policy on this table; role changes
-- by admins go through the service-role client (lib/actions/users.ts).
-- Requires auth-stub.sql.

CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY,
  full_name text,
  role text DEFAULT 'learner',
  certification_status text DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- Supabase grants full privileges to the API roles and relies on RLS alone.
GRANT ALL ON public.user_profiles TO anon, authenticated, service_role;

CREATE FUNCTION public.is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE POLICY "Users can create own profile" ON public.user_profiles
  FOR INSERT TO public WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT TO authenticated WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid())) WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING ((id = (SELECT auth.uid())) OR public.is_admin());
