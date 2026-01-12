-- Fix missing columns and constraints for LMS sync

-- Add description column to learning_modules if missing
ALTER TABLE learning_modules 
  ADD COLUMN IF NOT EXISTS description TEXT;

-- Make module_id nullable in quiz_questions (questions link to quiz_slug now)
ALTER TABLE quiz_questions 
  ALTER COLUMN module_id DROP NOT NULL;
