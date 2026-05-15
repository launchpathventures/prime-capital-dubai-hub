-- Adds the Script Profile slug to youtube_scripts and its version snapshots.
--
-- A "Script Profile" is the presenter the script is written for (e.g. Tahir,
-- Ahmed). The slug is the only thing persisted; the runtime hydrates the full
-- profile from lib/youtube/profiles. We default to 'tahir' because that is the
-- only profile that produced output prior to this migration — every existing
-- row was generated for him, so 'tahir' is the correct backfill value.

alter table public.youtube_scripts
  add column if not exists profile_slug text not null default 'tahir'
    check (profile_slug in ('tahir', 'ahmed'));

alter table public.youtube_script_versions
  add column if not exists profile_slug text
    check (profile_slug is null or profile_slug in ('tahir', 'ahmed'));

create index if not exists idx_youtube_scripts_profile
  on public.youtube_scripts(profile_slug);
