-- CATALYST - LMS Schema Migration
-- 
-- Creates tables for the Prime Capital Learning Management System:
-- - competencies: The 6 core competency areas
-- - learning_modules: Training modules within each competency
-- - quiz_questions: Knowledge check questions per module
-- - learning_progress: Individual learner progress tracking
-- - quiz_attempts: Quiz attempt history and scores
-- - user_profiles: Extended user information and roles
--
-- All tables use UUID primary keys, TIMESTAMPTZ for dates,
-- and Row Level Security for access control

-- =============================================================================
-- User Profiles
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'learner' CHECK (role IN ('admin', 'learner')),
  certification_status TEXT DEFAULT 'in_progress' CHECK (
    certification_status IN ('in_progress', 'ready', 'certified')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Extended user profiles with role and certification status';
COMMENT ON COLUMN user_profiles.role IS 'User role: admin (full access) or learner (learning portal only)';
COMMENT ON COLUMN user_profiles.certification_status IS 'Learning certification progress: in_progress, ready, or certified';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_certification ON user_profiles(certification_status);

-- =============================================================================
-- Competencies
-- =============================================================================

CREATE TABLE IF NOT EXISTS competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT, -- Overview of the competency area (supports markdown)
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE competencies IS 'Core competency areas for agent training (e.g., Market Intelligence, Client Discovery)';
COMMENT ON COLUMN competencies.slug IS 'URL-friendly identifier for competency routes (/learn/[slug])';

CREATE INDEX IF NOT EXISTS idx_competencies_display_order ON competencies(display_order);
CREATE INDEX IF NOT EXISTS idx_competencies_slug ON competencies(slug);

-- =============================================================================
-- Learning Modules
-- =============================================================================

CREATE TABLE IF NOT EXISTS learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID NOT NULL REFERENCES competencies(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT, -- Module content in markdown format
  duration_minutes INTEGER, -- Estimated time to complete
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competency_id, slug)
);

COMMENT ON TABLE learning_modules IS 'Training modules containing learning content and knowledge checks';
COMMENT ON COLUMN learning_modules.slug IS 'URL-friendly identifier within competency (/learn/[competency]/[slug])';
COMMENT ON COLUMN learning_modules.content IS 'Module content in markdown format';
COMMENT ON COLUMN learning_modules.duration_minutes IS 'Estimated completion time in minutes';

CREATE INDEX IF NOT EXISTS idx_learning_modules_competency ON learning_modules(competency_id);
CREATE INDEX IF NOT EXISTS idx_learning_modules_display_order ON learning_modules(display_order);

-- =============================================================================
-- Quiz Questions
-- =============================================================================

CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of {text: string, correct: boolean}
  explanation TEXT, -- Explanation shown after answer
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quiz_questions IS 'Knowledge check questions for each learning module';
COMMENT ON COLUMN quiz_questions.options IS 'JSON array of answer options with correct flag: [{"text": "Answer", "correct": true}]';
COMMENT ON COLUMN quiz_questions.explanation IS 'Explanation shown after answering (why this answer is correct/incorrect)';

CREATE INDEX IF NOT EXISTS idx_quiz_questions_module ON quiz_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_display_order ON quiz_questions(display_order);

-- =============================================================================
-- Learning Progress
-- =============================================================================

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'completed')
  ),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

COMMENT ON TABLE learning_progress IS 'Tracks individual learner progress through modules';
COMMENT ON COLUMN learning_progress.status IS 'Module status: not_started, in_progress, or completed';

CREATE INDEX IF NOT EXISTS idx_learning_progress_user ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_module ON learning_progress(module_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_status ON learning_progress(status);

-- =============================================================================
-- Quiz Attempts
-- =============================================================================

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES learning_modules(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL, -- true if score >= 80% (configurable threshold)
  answers JSONB, -- Record of answers given: {question_id: selected_option_index}
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE quiz_attempts IS 'History of quiz attempts with scores and pass/fail status';
COMMENT ON COLUMN quiz_attempts.passed IS 'Whether the attempt passed the threshold (default 80%)';
COMMENT ON COLUMN quiz_attempts.answers IS 'JSON record of answers: {question_id: selected_option_index}';

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_module ON quiz_attempts(module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_attempted_at ON quiz_attempts(attempted_at DESC);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE competencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- User Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON user_profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Competencies: All authenticated users can read, admins can manage
CREATE POLICY "Authenticated users can view competencies"
  ON competencies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage competencies"
  ON competencies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Learning Modules: All authenticated users can read, admins can manage
CREATE POLICY "Authenticated users can view modules"
  ON learning_modules FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage modules"
  ON learning_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Quiz Questions: All authenticated users can read, admins can manage
CREATE POLICY "Authenticated users can view quiz questions"
  ON quiz_questions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage quiz questions"
  ON quiz_questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Learning Progress: Users see own progress, admins see all
CREATE POLICY "Users can view own progress"
  ON learning_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
  ON learning_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update own progress"
  ON learning_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own progress"
  ON learning_progress FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all progress"
  ON learning_progress FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Quiz Attempts: Users see own attempts, admins see all
CREATE POLICY "Users can view own quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quiz attempts"
  ON quiz_attempts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can create own quiz attempts"
  ON quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all quiz attempts"
  ON quiz_attempts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- =============================================================================
-- Update Triggers
-- =============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competencies_updated_at
  BEFORE UPDATE ON competencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON learning_modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- Helper Functions
-- =============================================================================

-- Function to calculate overall learner progress percentage
CREATE OR REPLACE FUNCTION get_learner_progress(learner_id UUID)
RETURNS TABLE(
  total_modules INTEGER,
  completed_modules INTEGER,
  progress_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER as total_modules,
    COUNT(*) FILTER (WHERE lp.status = 'completed')::INTEGER as completed_modules,
    ROUND(
      (COUNT(*) FILTER (WHERE lp.status = 'completed')::NUMERIC / 
       NULLIF(COUNT(*)::NUMERIC, 0)) * 100,
      2
    ) as progress_percentage
  FROM learning_modules lm
  LEFT JOIN learning_progress lp ON lm.id = lp.module_id AND lp.user_id = learner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_learner_progress IS 'Calculate overall progress percentage for a learner';
