-- Add 'script_drafted' status to youtube_scripts
-- Pipeline: idea → script_drafted → script_ready → script_recorded → script_live

alter table public.youtube_scripts
  drop constraint youtube_scripts_status_check;

alter table public.youtube_scripts
  add constraint youtube_scripts_status_check
  check (status in ('idea', 'script_drafted', 'script_ready', 'script_recorded', 'script_live'));
