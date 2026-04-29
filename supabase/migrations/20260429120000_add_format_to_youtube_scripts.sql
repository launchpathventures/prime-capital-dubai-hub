-- Add format column to youtube_scripts for the format-portfolio prompt system
-- Replaces the previous video_type field (which was never persisted to DB —
-- it only lived in the generate-ideas API response).
--
-- The six format slugs come from lib/youtube/prompts/index.ts:
--   authority_analysis, myth_buster, reaction, case_study, listicle, qa_mailbag
--
-- Backfill existing rows to authority_analysis (the anchor format) — they
-- were generated under the v2.0 single-format prompt, which is essentially
-- an Authority Analysis script.

alter table public.youtube_scripts
  add column if not exists format text;

-- Backfill existing rows to authority_analysis before adding the constraint
update public.youtube_scripts
  set format = 'authority_analysis'
  where format is null;

-- Add CHECK constraint allowing only the six portfolio format slugs
alter table public.youtube_scripts
  add constraint youtube_scripts_format_check
  check (format in (
    'authority_analysis',
    'myth_buster',
    'reaction',
    'case_study',
    'listicle',
    'qa_mailbag'
  ));

-- Default for new rows
alter table public.youtube_scripts
  alter column format set default 'authority_analysis';

-- Make NOT NULL now that all rows have a value and a default exists
alter table public.youtube_scripts
  alter column format set not null;

-- Index for kanban / format-faceted queries
create index if not exists idx_youtube_scripts_format
  on public.youtube_scripts(format);
