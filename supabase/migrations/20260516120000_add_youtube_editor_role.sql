-- =============================================================================
-- Add youtube_editor role + can_access_youtube() gate
-- =============================================================================
-- Introduces a narrowly-scoped 'youtube_editor' role. These users can ONLY
-- reach the YouTube script generator in admin — nothing else. Access for the
-- generator is governed by can_access_youtube(), a single source of truth
-- shared by the API routes (rpc) and RLS policies.
--
-- Why a new function instead of reusing is_admin():
--   is_admin() lives only in the live DB and means "is an admin". The YouTube
--   RLS policies already allow 'marketing', so the API gate (is_admin) and RLS
--   were inconsistent. can_access_youtube() makes both layers agree and adds
--   the new role in one place.
-- =============================================================================

-- Expand the role CHECK constraint to allow 'youtube_editor'.
ALTER TABLE user_profiles
  DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles
  ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('admin', 'marketing', 'youtube_editor', 'learner'));

-- -----------------------------------------------------------------------------
-- can_access_youtube(): true for any role permitted to use the generator.
-- SECURITY DEFINER so it can read user_profiles regardless of the caller's RLS.
-- -----------------------------------------------------------------------------
create or replace function public.can_access_youtube()
returns boolean
language sql
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.user_profiles
    where user_profiles.id = auth.uid()
    and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
  );
$$;

grant execute on function public.can_access_youtube() to authenticated;

-- -----------------------------------------------------------------------------
-- Recreate the three YouTube RLS policies so youtube_editor is included.
-- Definitions mirror the originals (create_youtube_scripts /
-- youtube_chat_and_versions) with the role list extended.
-- -----------------------------------------------------------------------------

drop policy if exists "Admins can manage youtube scripts" on public.youtube_scripts;
create policy "Admins can manage youtube scripts"
  on public.youtube_scripts for all
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  );

drop policy if exists "Admins can manage youtube script messages" on public.youtube_script_messages;
create policy "Admins can manage youtube script messages"
  on public.youtube_script_messages for all
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  );

drop policy if exists "Admins can manage youtube script versions" on public.youtube_script_versions;
create policy "Admins can manage youtube script versions"
  on public.youtube_script_versions for all
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing', 'youtube_editor')
    )
  );
