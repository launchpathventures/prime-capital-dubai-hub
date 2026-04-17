-- YouTube Scripts table for script generation pipeline
-- Kanban stages: idea → script_ready → script_recorded → script_live

create table if not exists public.youtube_scripts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  topic text,
  input_text text,                         -- original user input (text or transcription)
  status text not null default 'idea'
    check (status in ('idea', 'script_drafted', 'script_ready', 'script_recorded', 'script_live')),

  -- Script content (populated when generating full script)
  hook_v1 text,
  hook_v2 text,
  packaging text,                          -- title options, thumbnail, CTA focus, target length
  script_body text,                        -- full teleprompter-ready script

  -- AI validation results
  validation_score integer,                -- 0-100 overall score
  validation_notes jsonb,                  -- structured validation feedback
  validated_at timestamptz,

  -- Metadata
  word_count integer,
  target_length text,                      -- quick_take, standard, deep_dive
  user_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.youtube_scripts enable row level security;

-- Admin and marketing roles can manage scripts
create policy "Admins can manage youtube scripts"
  on public.youtube_scripts for all
  using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing')
    )
  )
  with check (
    exists (
      select 1 from public.user_profiles
      where user_profiles.id = auth.uid()
      and user_profiles.role in ('admin', 'marketing')
    )
  );

-- Updated at trigger
create trigger update_youtube_scripts_updated_at
  before update on public.youtube_scripts
  for each row
  execute function update_updated_at_column();

-- Index for status-based queries (kanban columns)
create index idx_youtube_scripts_status on public.youtube_scripts(status);
create index idx_youtube_scripts_created on public.youtube_scripts(created_at desc);
