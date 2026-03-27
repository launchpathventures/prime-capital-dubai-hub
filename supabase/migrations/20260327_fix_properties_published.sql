-- Fix: Add missing 'published' column to properties table
-- The RLS policy references published = true but the column was never added,
-- causing all anon reads to silently fail (empty properties page on the website).

ALTER TABLE properties ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- Set all existing properties to published
UPDATE properties SET published = true WHERE published IS NULL;
