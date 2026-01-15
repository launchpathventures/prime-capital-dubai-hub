# LMS-029a: Feedback Data Layer

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 hour  
**Dependencies:** None  

---

## Objective

Create the database schema, RLS policies, and storage bucket for the feedback system.

---

## Tasks

### 1. Create Migration

**File:** `supabase/migrations/20260115000000_lms_feedback.sql`

```sql
-- LMS Feedback System
-- Stores user feedback on content with context, status tracking

create table if not exists lms_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  
  -- Context
  feedback_type text not null default 'general' 
    check (feedback_type in ('general', 'module')),
  competency_slug text,
  module_slug text,
  page_url text,
  
  -- Content
  text_content text,
  voice_transcription text,
  quoted_text text,
  
  -- Files (storage paths)
  audio_path text,
  attachments text[],
  
  -- Status workflow
  status text not null default 'new' 
    check (status in ('new', 'in_progress', 'complete')),
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_lms_feedback_user on lms_feedback(user_id);
create index idx_lms_feedback_status on lms_feedback(status);
create index idx_lms_feedback_context on lms_feedback(competency_slug, module_slug);
create index idx_lms_feedback_created on lms_feedback(created_at desc);

-- RLS
alter table lms_feedback enable row level security;

-- All authenticated users can insert their own feedback
create policy "Users can insert own feedback"
  on lms_feedback for insert
  with check (auth.uid() = user_id);

-- All authenticated users can view all feedback (to avoid duplicates)
create policy "Users can view all feedback"
  on lms_feedback for select
  using (auth.uid() is not null);

-- Only admins can update feedback (status changes)
create policy "Admins can update feedback"
  on lms_feedback for update
  using (
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Updated_at trigger
create or replace function update_lms_feedback_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger lms_feedback_updated_at
  before update on lms_feedback
  for each row
  execute function update_lms_feedback_updated_at();
```

### 2. Apply Migration

Run via Supabase MCP or dashboard.

### 3. Create Storage Bucket

Create bucket `feedback` in Supabase Storage with:
- Public: No
- File size limit: 10MB
- Allowed MIME types: audio/*, image/*, application/pdf

### 4. Storage RLS Policies

```sql
-- Storage policies for feedback bucket
-- Users can upload to their own folder
create policy "Users can upload feedback files"
  on storage.objects for insert
  with check (
    bucket_id = 'feedback' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can read their own files
create policy "Users can read own feedback files"
  on storage.objects for select
  using (
    bucket_id = 'feedback' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can read all feedback files
create policy "Admins can read all feedback files"
  on storage.objects for select
  using (
    bucket_id = 'feedback' and
    exists (
      select 1 from user_profiles 
      where id = auth.uid() and role = 'admin'
    )
  );
```

---

## Verification

- [ ] Table `lms_feedback` exists
- [ ] RLS policies active
- [ ] Storage bucket `feedback` created
- [ ] Can insert test row as authenticated user
- [ ] Can read feedback as any authenticated user
