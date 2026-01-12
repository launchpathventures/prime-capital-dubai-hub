-- LMS Schema Update: Full content sync support
-- Truncates existing data and updates schema for complete content sync

-- =============================================================================
-- TRUNCATE EXISTING DATA (order matters for foreign keys)
-- =============================================================================

TRUNCATE TABLE quiz_attempts CASCADE;
TRUNCATE TABLE quiz_questions CASCADE;
TRUNCATE TABLE learning_progress CASCADE;
TRUNCATE TABLE learning_modules CASCADE;
TRUNCATE TABLE competencies CASCADE;

-- =============================================================================
-- UPDATE COMPETENCIES TABLE
-- =============================================================================

ALTER TABLE competencies 
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB;

-- =============================================================================
-- UPDATE LEARNING_MODULES TABLE
-- =============================================================================

ALTER TABLE learning_modules 
  ADD COLUMN IF NOT EXISTS module_number TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'knowledge',
  ADD COLUMN IF NOT EXISTS estimated_duration TEXT,
  ADD COLUMN IF NOT EXISTS frontmatter JSONB;

-- =============================================================================
-- CREATE QUIZZES TABLE (metadata about quizzes)
-- =============================================================================

CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  competency_slug TEXT NOT NULL,
  related_module TEXT,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 80,
  question_count INT,
  estimated_duration TEXT,
  frontmatter JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "quizzes_public_read" ON quizzes
  FOR SELECT USING (true);

-- =============================================================================
-- UPDATE QUIZ_QUESTIONS TABLE
-- =============================================================================

-- Add new columns
ALTER TABLE quiz_questions 
  ADD COLUMN IF NOT EXISTS quiz_slug TEXT,
  ADD COLUMN IF NOT EXISTS competency_slug TEXT,
  ADD COLUMN IF NOT EXISTS related_module TEXT,
  ADD COLUMN IF NOT EXISTS question_number INT,
  ADD COLUMN IF NOT EXISTS question_text TEXT;

-- =============================================================================
-- CREATE SCENARIOS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  competencies TEXT[],
  difficulty TEXT,
  estimated_duration TEXT,
  scenario_count INT,
  frontmatter JSONB,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "scenarios_public_read" ON scenarios
  FOR SELECT USING (true);

-- =============================================================================
-- ADD UPDATED_AT TRIGGERS
-- =============================================================================

-- Trigger for quizzes
DROP TRIGGER IF EXISTS update_quizzes_updated_at ON quizzes;

-- Trigger for scenarios  
CREATE TRIGGER update_scenarios_updated_at
  BEFORE UPDATE ON scenarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
