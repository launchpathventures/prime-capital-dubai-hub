-- Adds chat refinement + version snapshot support to youtube_scripts, plus
-- the panel-review columns Phase 4 will populate.
--
-- youtube_script_messages: free-form chat thread between the user and the
--   refinement agent. Persisted so the conversation survives reload. When a
--   regen is committed, the thread is "rolled off" by setting cleared_at on
--   every active message — the rows stay for audit but the active UI starts
--   fresh on the new draft.
--
-- youtube_script_versions: snapshot of the script taken at the moment the
--   user authorises a regen. Captures every field that could change in a
--   regen, plus the chat summary that motivated it, so the user can always
--   look back at "what the script was before this rewrite, and why we changed
--   it." Phase 4 will add panel_review + panel_review_score to this row.

-- =============================================================================
-- youtube_script_messages
-- =============================================================================

create table if not exists public.youtube_script_messages (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.youtube_scripts(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  -- Captures any tool call the assistant made on this turn. Null for pure-text
  -- replies and for all user messages. tool_name examples:
  --   'replace_section', 'replace_entire_script', 'request_regen'
  tool_name text,
  tool_input jsonb,
  -- Set when the chat thread rolls off after an accepted regen. Active messages
  -- are those where cleared_at is null.
  cleared_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.youtube_script_messages enable row level security;

create policy "Admins can manage youtube script messages"
  on public.youtube_script_messages for all
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

create index idx_youtube_script_messages_script
  on public.youtube_script_messages(script_id, created_at);

create index idx_youtube_script_messages_active
  on public.youtube_script_messages(script_id, created_at)
  where cleared_at is null;

-- =============================================================================
-- youtube_script_versions
-- =============================================================================

create table if not exists public.youtube_script_versions (
  id uuid primary key default gen_random_uuid(),
  script_id uuid not null references public.youtube_scripts(id) on delete cascade,
  -- Monotonic per-script version index. v1 = first regen snapshot, v2 = second, etc.
  version_number integer not null,

  -- Snapshot of the script as it stood BEFORE the regen that triggered this row
  script_body text,
  packaging text,
  hook_v1 text,
  hook_v2 text,
  word_count integer,

  -- Validator state at snapshot time
  validation_score integer,
  validation_notes jsonb,

  -- Phase 4: multi-agent panel review captured against this snapshot
  panel_review jsonb,
  panel_review_score integer,

  -- The chat-derived summary explaining why this regen was requested.
  -- Surfaced in the version history so reviewers can see the rationale.
  chat_summary text,

  created_at timestamptz not null default now(),

  unique (script_id, version_number)
);

alter table public.youtube_script_versions enable row level security;

create policy "Admins can manage youtube script versions"
  on public.youtube_script_versions for all
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

create index idx_youtube_script_versions_script
  on public.youtube_script_versions(script_id, version_number desc);

-- =============================================================================
-- Panel review on the live youtube_scripts row
-- =============================================================================
--
-- Phase 4 runs a four-agent panel against the current draft and stores the
-- result here. Snapshots will copy these values into youtube_script_versions
-- at regen time.

alter table public.youtube_scripts
  add column if not exists panel_review jsonb,
  add column if not exists panel_review_score integer,
  add column if not exists panel_reviewed_at timestamptz;
