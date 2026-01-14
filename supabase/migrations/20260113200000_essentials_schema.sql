-- CATALYST - LMS Essentials Schema Migration
--
-- Adds AI-generated "Essentials" layer to learning modules.
-- Essentials are pedagogically-structured extractions that provide
-- the 20% of content needed for 80% of client conversations.
--
-- Single source of truth: markdown content stays authoritative,
-- essentials are derived via AI and stored for fast access.

-- =============================================================================
-- Add Essentials Columns to Learning Modules
-- =============================================================================

ALTER TABLE learning_modules 
ADD COLUMN IF NOT EXISTS essentials JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_generated_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_source_hash TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_prompt_version TEXT DEFAULT NULL;

-- Comments for documentation
COMMENT ON COLUMN learning_modules.essentials IS 'AI-generated essential content in structured JSON format (tldr, keyFacts, scripts, images, audio, practice, reflection)';
COMMENT ON COLUMN learning_modules.essentials_generated_at IS 'Timestamp when essentials were last generated';
COMMENT ON COLUMN learning_modules.essentials_source_hash IS 'MD5 hash of source content used for generation (detect staleness)';
COMMENT ON COLUMN learning_modules.essentials_prompt_version IS 'Version of AI prompt used for generation (track quality improvements)';

-- Index for querying modules with/without essentials
CREATE INDEX IF NOT EXISTS idx_learning_modules_essentials_status 
  ON learning_modules ((essentials IS NOT NULL));

-- Index for finding stale essentials (useful for admin dashboard)
CREATE INDEX IF NOT EXISTS idx_learning_modules_essentials_generated 
  ON learning_modules (essentials_generated_at)
  WHERE essentials IS NOT NULL;

-- =============================================================================
-- Essentials JSON Schema Documentation
-- =============================================================================
-- The essentials JSONB column stores structured content:
-- {
--   "tldr": "200-word summary...",
--   "keyFacts": [{ "fact": "...", "context": "...", "source": "..." }],
--   "scripts": [{ "scenario": "...", "script": "...", "source": "..." }],
--   "images": [{ "src": "...", "alt": "...", "caption": "...", "essential": true, "context": "..." }],
--   "audio": [{ "slug": "...", "title": "...", "duration": "...", "context": "..." }],
--   "practice": { "situation": "...", "task": "...", "success": "..." },
--   "reflection": "...",
--   "generatedAt": "ISO timestamp",
--   "sourceHash": "md5 hash",
--   "promptVersion": "1.0"
-- }
