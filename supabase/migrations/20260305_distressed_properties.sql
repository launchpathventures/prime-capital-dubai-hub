-- CATALYST - Add tags column and distressed properties
--
-- Adds a JSONB tags column to properties for categorization (e.g., "distressed").
-- Inserts 5 distressed deal properties.
--
-- NOTE: This was applied manually via SQL Editor due to migration history drift.
-- The column types below match the actual remote schema (text[] for features/images).

-- =============================================================================
-- Schema Change: Add tags column
-- =============================================================================

ALTER TABLE properties ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]';

COMMENT ON COLUMN properties.tags IS 'JSON array of string tags for categorization (e.g., ["distressed"])';

CREATE INDEX IF NOT EXISTS idx_properties_tags ON properties USING GIN (tags);

-- =============================================================================
-- Distressed Deal Properties
-- =============================================================================

INSERT INTO properties (
  slug, title, type, location, developer,
  price_from, price_to, bedrooms, status,
  size_from, size_to, completion_date,
  description, features, cover_image, images, tags,
  display_order
) VALUES
(
  'sobha-one-tower-d-1bed-study',
  'Sobha One Tower D — 1 Bed + Study',
  'apartment',
  'Sobha Hartland, MBR City',
  'Sobha Realty',
  1750000, 1870000, '1', 'off-plan',
  740, 740,
  '2026-12-31',
  'High floor 1-bedroom + study apartment in Sobha One Tower D with full golf course views. 60% already paid by the seller — buyer assumes only the remaining 40% balance on handover (Q4 2026). Original price AED 1.87M, now offered at AED 1.75M.',
  ARRAY['Full Golf Course View', 'High Floor', '1 Bed + Study', '60% Paid by Seller', '40% Balance on Handover Q4 2026'],
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop',
  ARRAY[]::text[],
  '["distressed"]'::jsonb,
  1
),
(
  'the-valley-nima-3bed',
  'The Valley | Nima — 3 Bed Townhouse',
  'townhouse',
  'The Valley, Dubai',
  'Emaar Properties',
  2650000, 2750000, '3', 'off-plan',
  1873, 2233,
  NULL,
  'Single-row 3-bedroom townhouse in Nima at The Valley by Emaar. BUA 2,233 sq ft with 80% already paid. Corner kitchen layout — currently the lowest priced unit in the market. Asking price AED 2.65M (original AED 2.75M).',
  ARRAY['Single Row', 'Corner Kitchen Layout', '80% Paid', 'BUA 2,233 sq ft', 'Lowest in Market'],
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  ARRAY[]::text[],
  '["distressed"]'::jsonb,
  2
),
(
  'vida-residences-club-point-1bed',
  'Vida Residences Club Point — 1 Bed',
  'apartment',
  'Dubai Hills Estate',
  'Emaar Properties',
  1640000, 1640000, '1', 'off-plan',
  NULL, NULL,
  NULL,
  'Middle-floor 1-bedroom apartment in Vida Residences Club Point, Dubai Hills Estate. Selling below original price at AED 1.64M. Unfurnished with modern, elegant finishes, functional layout with open kitchen concept, and a balcony offering views over green landscape.',
  ARRAY['Unfurnished', 'Modern & Elegant Finishes', 'Open Kitchen Concept', 'Balcony with Green Views', 'Below Original Price'],
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop',
  ARRAY[]::text[],
  '["distressed"]'::jsonb,
  3
),
(
  'downtown-views-2-2bed',
  'Downtown Views 2 — 2 Bed with Burj Khalifa Views',
  'apartment',
  'Downtown Dubai',
  'Emaar Properties',
  3600000, 3750000, '2', 'ready',
  1801, 1801,
  NULL,
  'Stunning 2-bedroom apartment in Downtown Views 2 with full Burj Khalifa views and a big terrace. 1,801 sq ft of living space. Original price AED 3.75M, now asking AED 3.6M.',
  ARRAY['Full Burj Khalifa Views', 'Large Terrace', '1,801 sq ft', 'Downtown Location', 'Below Original Price'],
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop',
  ARRAY[]::text[],
  '["distressed"]'::jsonb,
  4
),
(
  'koro-one-1bed',
  'Koro One — 1 Bed at Jumeirah Garden City',
  'apartment',
  'Jumeirah Garden City',
  'Alta Development',
  1975000, 2100000, '1', 'off-plan',
  864, 864,
  '2026-03-31',
  'Brand new 1-bedroom apartment in Koro One at Jumeirah Garden City. Handover in March 2026. Original price AED 1.86M with original asking of AED 2.1M — now reduced to AED 1.975M.',
  ARRAY['Brand New', 'March 2026 Handover', '864 sq ft', 'Jumeirah Garden City', 'Reduced Price'],
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop',
  ARRAY[]::text[],
  '["distressed"]'::jsonb,
  5
);
