-- =============================================================================
-- AI Coach: Usage tracking and rate limiting
-- =============================================================================
-- For v1, we're NOT persisting conversations between sessions.
-- This table is for analytics and rate limiting only.

create table if not exists coach_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  
  -- Context
  context_level text not null check (context_level in ('course', 'competency', 'module')),
  competency_slug text,
  module_slug text,
  
  -- Usage tracking
  message_count integer not null default 1,
  
  -- Timestamps
  created_at timestamptz default now()
);

-- Index for rate limiting queries
create index idx_coach_usage_user_time 
  on coach_usage(user_id, created_at desc);

-- RLS
alter table coach_usage enable row level security;

create policy "Users can insert own usage"
  on coach_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can view own usage"
  on coach_usage for select
  using (auth.uid() = user_id);

-- Rate limiting function
create or replace function check_coach_rate_limit(p_user_id uuid)
returns boolean as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from coach_usage
  where user_id = p_user_id
    and created_at > now() - interval '1 hour';
  
  -- 50 messages per hour limit
  return recent_count < 50;
end;
$$ language plpgsql security definer;
