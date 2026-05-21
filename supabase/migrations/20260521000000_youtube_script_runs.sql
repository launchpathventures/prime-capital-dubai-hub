-- =============================================================================
-- youtube_script_runs — bundle a single-script "Write One Script" run
-- =============================================================================
-- A "run" is the context the user fed into distil-idea + the 3 angles that
-- came back. Before this table the angles were ephemeral: pick one, generate
-- it, lose the other two. With a run row the user can come back and try a
-- different angle without re-pasting context or re-recording their voice note.
--
-- One run produces 0..3 youtube_scripts rows (one per generated angle), linked
-- via youtube_scripts.run_id + angle_index.

create table if not exists public.youtube_script_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,

  -- Editable context the user pasted/dictated. Voice-note transcripts are
  -- appended here exactly as they would be in any other YouTube input field.
  context_text text not null,

  -- The format + presenter the run was distilled for. CHECK lists mirror
  -- youtube_scripts so the two tables stay in lock-step.
  format text not null
    check (format in (
      'authority_analysis',
      'myth_buster',
      'reaction',
      'case_study',
      'listicle',
      'qa_mailbag'
    )),
  profile_slug text not null default 'tahir'
    check (profile_slug in ('tahir', 'ahmed')),

  -- The 3 distilled angles. Shape per entry:
  --   { title, topic, why_this_angle, news_peg, needs_news_peg, target_length }
  angles jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.youtube_script_runs enable row level security;

-- Single source of truth: can_access_youtube() also gates the API routes
-- (see 20260516120000_add_youtube_editor_role.sql). If the role list ever
-- changes, both layers move together.
create policy "Admins can manage youtube script runs"
  on public.youtube_script_runs for all
  using (public.can_access_youtube())
  with check (public.can_access_youtube());

create trigger update_youtube_script_runs_updated_at
  before update on public.youtube_script_runs
  for each row
  execute function update_updated_at_column();

create index idx_youtube_script_runs_user
  on public.youtube_script_runs(user_id, created_at desc);

-- =============================================================================
-- youtube_scripts: link back to the run + angle index
-- =============================================================================
-- run_id is on delete set null so deleting a run never destroys a generated
-- script — the script is real work and survives independently.

alter table public.youtube_scripts
  add column if not exists run_id uuid references public.youtube_script_runs(id) on delete set null,
  add column if not exists angle_index integer
    check (angle_index is null or (angle_index >= 0 and angle_index <= 2));

create index if not exists idx_youtube_scripts_run
  on public.youtube_scripts(run_id);
