-- CATALYST - LMS Schema Extended Migration
--
-- Extends learning_modules table with additional columns for structured content:
-- - type: Module type (knowledge, skills, skills-script)
-- - description: Module description
-- - module_number: Module number like "1.2", "0.1"
-- - estimated_duration: Duration string like "25 minutes"
-- - frontmatter: Flexible JSONB for all frontmatter fields
-- - the_risk: Risk callout text for module header
-- - the_reward: Reward callout text for module header
-- - process_model: JSON array of process steps
-- - practice_scenario: JSON object for skills practice
-- - resources: JSON array of resource links
-- - quiz_id: Reference to quiz for this module
--
-- Also creates audio_transcripts table for TTS content

-- =============================================================================
-- Learning Modules Extended Columns
-- =============================================================================

ALTER TABLE learning_modules 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'knowledge',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS module_number TEXT,
ADD COLUMN IF NOT EXISTS estimated_duration TEXT,
ADD COLUMN IF NOT EXISTS frontmatter JSONB,
ADD COLUMN IF NOT EXISTS the_risk TEXT,
ADD COLUMN IF NOT EXISTS the_reward TEXT,
ADD COLUMN IF NOT EXISTS process_model JSONB,
ADD COLUMN IF NOT EXISTS practice_scenario JSONB,
ADD COLUMN IF NOT EXISTS resources JSONB,
ADD COLUMN IF NOT EXISTS quiz_id TEXT;

-- Add check constraint for type (only if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'learning_modules_type_check'
  ) THEN
    ALTER TABLE learning_modules 
    ADD CONSTRAINT learning_modules_type_check 
    CHECK (type IN ('knowledge', 'skills', 'skills-script'));
  END IF;
END $$;

COMMENT ON COLUMN learning_modules.type IS 'Module type: knowledge, skills, or skills-script';
COMMENT ON COLUMN learning_modules.description IS 'Short description of module content';
COMMENT ON COLUMN learning_modules.module_number IS 'Module number like "1.2", "0.1" for ordering display';
COMMENT ON COLUMN learning_modules.estimated_duration IS 'Estimated completion time as text (e.g., "25 minutes")';
COMMENT ON COLUMN learning_modules.frontmatter IS 'Flexible JSONB storage for all frontmatter fields from markdown';
COMMENT ON COLUMN learning_modules.the_risk IS 'Risk callout text for module header';
COMMENT ON COLUMN learning_modules.the_reward IS 'Reward callout text for module header';
COMMENT ON COLUMN learning_modules.process_model IS 'JSON array of process steps with title, description, script';
COMMENT ON COLUMN learning_modules.practice_scenario IS 'JSON object defining practice scenario for skills modules';
COMMENT ON COLUMN learning_modules.resources IS 'JSON array of resource links';
COMMENT ON COLUMN learning_modules.quiz_id IS 'Reference to quiz identifier for this module';

-- =============================================================================
-- Audio Transcripts Table
-- =============================================================================

CREATE TABLE IF NOT EXISTS audio_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
  competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  duration TEXT, -- "8 minutes"
  voice TEXT DEFAULT 'coach', -- Voice actor/style
  type TEXT DEFAULT 'demonstration', -- demonstration, summary, walkthrough
  transcript TEXT NOT NULL, -- Full markdown transcript
  audio_url TEXT, -- URL after TTS generation
  frontmatter JSONB, -- Flexible metadata storage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE audio_transcripts IS 'Audio transcripts for TTS generation, linked to modules or competencies';
COMMENT ON COLUMN audio_transcripts.slug IS 'Unique identifier like "module-slug-audio" or "competency-intro-audio"';
COMMENT ON COLUMN audio_transcripts.voice IS 'Voice style/actor for TTS generation';
COMMENT ON COLUMN audio_transcripts.type IS 'Type of audio: demonstration, summary, walkthrough';
COMMENT ON COLUMN audio_transcripts.transcript IS 'Full transcript text in markdown format';
COMMENT ON COLUMN audio_transcripts.audio_url IS 'URL to generated audio file (null until TTS is run)';
COMMENT ON COLUMN audio_transcripts.frontmatter IS 'Flexible JSONB for additional metadata';

CREATE INDEX IF NOT EXISTS idx_audio_transcripts_module ON audio_transcripts(module_id);
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_competency ON audio_transcripts(competency_id);
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_slug ON audio_transcripts(slug);

-- =============================================================================
-- Row Level Security for Audio Transcripts
-- =============================================================================

ALTER TABLE audio_transcripts ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read audio transcripts
CREATE POLICY "Authenticated users can view audio transcripts"
  ON audio_transcripts FOR SELECT
  USING (auth.role() = 'authenticated');

-- Admins can manage audio transcripts
CREATE POLICY "Admins can manage audio transcripts"
  ON audio_transcripts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- =============================================================================
-- Quiz Questions Extended Columns
-- =============================================================================

-- Add additional columns to quiz_questions for more flexible quiz structure
ALTER TABLE quiz_questions
ADD COLUMN IF NOT EXISTS quiz_id TEXT,
ADD COLUMN IF NOT EXISTS competency_slug TEXT,
ADD COLUMN IF NOT EXISTS related_module TEXT,
ADD COLUMN IF NOT EXISTS question_number INTEGER,
ADD COLUMN IF NOT EXISTS question_text TEXT;

-- Update question_text from existing question column where applicable
UPDATE quiz_questions SET question_text = question WHERE question_text IS NULL AND question IS NOT NULL;

COMMENT ON COLUMN quiz_questions.quiz_id IS 'Quiz identifier like "market-intelligence-1"';
COMMENT ON COLUMN quiz_questions.competency_slug IS 'Slug of related competency for cross-reference';
COMMENT ON COLUMN quiz_questions.related_module IS 'Slug of related module for context';
COMMENT ON COLUMN quiz_questions.question_number IS 'Question number within the quiz';
COMMENT ON COLUMN quiz_questions.question_text IS 'Full question text (alias for question column)';
