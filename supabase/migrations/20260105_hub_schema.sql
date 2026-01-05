-- CATALYST - Hub Schema Migration
-- 
-- Creates tables for the client engagement hub:
-- - hub_projects: Client engagement projects
-- - hub_tasks: Project tasks with assignees
-- - hub_questions: Questions/feedback items
-- - hub_question_responses: Text and voice responses
-- - hub_activity: Activity feed entries
--
-- Run this migration in your Supabase SQL editor

-- =============================================================================
-- Projects
-- =============================================================================

CREATE TABLE IF NOT EXISTS hub_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold', 'archived')),
  client_name TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hub_projects_status ON hub_projects(status);
CREATE INDEX IF NOT EXISTS idx_hub_projects_slug ON hub_projects(slug);

-- =============================================================================
-- Tasks
-- =============================================================================

CREATE TABLE IF NOT EXISTS hub_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hub_tasks_project ON hub_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_hub_tasks_assignee ON hub_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_hub_tasks_status ON hub_tasks(status);
CREATE INDEX IF NOT EXISTS idx_hub_tasks_due_date ON hub_tasks(due_date);

-- =============================================================================
-- Questions
-- =============================================================================

CREATE TABLE IF NOT EXISTS hub_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  context TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'resolved')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hub_questions_project ON hub_questions(project_id);
CREATE INDEX IF NOT EXISTS idx_hub_questions_status ON hub_questions(status);
CREATE INDEX IF NOT EXISTS idx_hub_questions_created_by ON hub_questions(created_by);

-- =============================================================================
-- Question Responses
-- =============================================================================

CREATE TABLE IF NOT EXISTS hub_question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES hub_questions(id) ON DELETE CASCADE,
  respondent_id UUID REFERENCES auth.users(id),
  respondent_name TEXT,
  text_response TEXT,
  audio_url TEXT,
  audio_duration INTEGER,
  transcription TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hub_responses_question ON hub_question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_hub_responses_respondent ON hub_question_responses(respondent_id);

-- =============================================================================
-- Activity Feed
-- =============================================================================

CREATE TABLE IF NOT EXISTS hub_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES hub_projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN (
    'project_created', 'project_updated',
    'task_created', 'task_completed', 'task_updated',
    'question_created', 'question_answered', 'question_resolved'
  )),
  target_type TEXT CHECK (target_type IN ('project', 'task', 'question')),
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hub_activity_project ON hub_activity(project_id);
CREATE INDEX IF NOT EXISTS idx_hub_activity_user ON hub_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_hub_activity_created ON hub_activity(created_at DESC);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE hub_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE hub_activity ENABLE ROW LEVEL SECURITY;

-- For now, allow all authenticated users to read hub content
-- In production, you may want to restrict this based on user role

CREATE POLICY "Authenticated users can read projects"
  ON hub_projects FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read tasks"
  ON hub_tasks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read questions"
  ON hub_questions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read responses"
  ON hub_question_responses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create responses"
  ON hub_question_responses FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read activity"
  ON hub_activity FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admin-only write policies (adjust based on your user_profiles table)
-- These assume you have a way to check admin role

-- CREATE POLICY "Admins can manage projects"
--   ON hub_projects FOR ALL
--   USING (
--     EXISTS (
--       SELECT 1 FROM user_profiles
--       WHERE user_profiles.id = auth.uid()
--       AND user_profiles.role = 'admin'
--     )
--   );

-- =============================================================================
-- Updated At Trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hub_projects_updated_at
  BEFORE UPDATE ON hub_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hub_tasks_updated_at
  BEFORE UPDATE ON hub_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hub_questions_updated_at
  BEFORE UPDATE ON hub_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Storage Bucket for Voice Recordings
-- =============================================================================
-- 
-- IMPORTANT: Storage buckets cannot be created via SQL migrations.
-- You MUST manually create the voice-recordings bucket in Supabase:
--
-- Option 1: Supabase Dashboard
--   1. Go to Storage in your Supabase dashboard
--   2. Click "New bucket"
--   3. Name: "voice-recordings"
--   4. Enable "Public bucket" for public access to recordings
--
-- Option 2: Supabase CLI
--   supabase storage create voice-recordings --public
--
-- Option 3: JavaScript API (run once in your app initialization)
--   const { data, error } = await supabase.storage.createBucket('voice-recordings', {
--     public: true,
--     allowedMimeTypes: ['audio/webm', 'audio/mp4', 'audio/mpeg'],
--     fileSizeLimit: 52428800, // 50MB
--   })
--
-- After creating the bucket, apply these policies via SQL:
-- =============================================================================

-- Policy: Authenticated users can upload voice recordings
CREATE POLICY "Authenticated users can upload voice recordings"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'voice-recordings' AND
    auth.role() = 'authenticated'
  );

-- Policy: Anyone can read voice recordings (public bucket)
CREATE POLICY "Anyone can read voice recordings"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'voice-recordings');

-- Policy: Users can delete their own recordings
CREATE POLICY "Users can delete their own voice recordings"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'voice-recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
