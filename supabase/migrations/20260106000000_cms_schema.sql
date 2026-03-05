-- CATALYST - CMS Schema Migration
-- 
-- Creates tables for the Prime Capital website content management:
-- - properties: Real estate listings and portfolios
-- - team_members: Team profiles and expertise
-- - testimonials: Client testimonials and reviews
-- - stats: Key statistics displayed on website
-- - services: Service offerings and features
-- - site_settings: Global site configuration and feature flags
--
-- All tables use UUID primary keys, TIMESTAMPTZ for dates,
-- and Row Level Security for access control

-- =============================================================================
-- Properties
-- =============================================================================

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT, -- 'apartment', 'villa', 'penthouse', 'townhouse', etc.
  location TEXT,
  developer TEXT,
  price_from NUMERIC,
  price_to NUMERIC,
  bedrooms_from INTEGER,
  bedrooms_to INTEGER,
  size_from NUMERIC, -- Square feet/meters
  size_to NUMERIC,
  completion_date DATE,
  description TEXT, -- Full property description (supports markdown)
  features JSONB DEFAULT '[]', -- Array of feature strings
  images JSONB DEFAULT '[]', -- Array of image URLs from Supabase Storage
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE properties IS 'Real estate property listings displayed on the public website';
COMMENT ON COLUMN properties.slug IS 'URL-friendly identifier for property detail pages';
COMMENT ON COLUMN properties.features IS 'JSON array of property features (e.g., ["Pool", "Gym", "Smart Home"])';
COMMENT ON COLUMN properties.images IS 'JSON array of image URLs stored in Supabase Storage';

CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(published);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_display_order ON properties(display_order);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- =============================================================================
-- Team Members
-- =============================================================================

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT, -- 'Founder', 'Senior Consultant', 'Consultant', etc.
  bio TEXT, -- Full biography (supports markdown)
  expertise JSONB DEFAULT '[]', -- Array of expertise areas
  image_url TEXT, -- Profile image from Supabase Storage
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE team_members IS 'Team member profiles and contact information';
COMMENT ON COLUMN team_members.slug IS 'URL-friendly identifier for team member detail pages';
COMMENT ON COLUMN team_members.expertise IS 'JSON array of expertise areas (e.g., ["Off-Plan", "Luxury Residential"])';

CREATE INDEX IF NOT EXISTS idx_team_members_published ON team_members(published);
CREATE INDEX IF NOT EXISTS idx_team_members_display_order ON team_members(display_order);
CREATE INDEX IF NOT EXISTS idx_team_members_slug ON team_members(slug);

-- =============================================================================
-- Testimonials
-- =============================================================================

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT, -- Can be anonymized like "Private Client, London"
  author_title TEXT, -- Role/position
  author_location TEXT, -- City/country
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE testimonials IS 'Client testimonials and reviews displayed on the website';
COMMENT ON COLUMN testimonials.author_name IS 'Client name or anonymized identifier (e.g., "Private Client, London")';

CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(published);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- =============================================================================
-- Stats
-- =============================================================================

CREATE TABLE IF NOT EXISTS stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL, -- What the stat represents (e.g., "Properties Delivered")
  value TEXT NOT NULL, -- The stat value (e.g., "250+", "$500M+")
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE stats IS 'Key statistics displayed in the website stats bar';
COMMENT ON COLUMN stats.value IS 'Stat value as formatted text (e.g., "250+", "$500M+")';

CREATE INDEX IF NOT EXISTS idx_stats_display_order ON stats(display_order);

-- =============================================================================
-- Services
-- =============================================================================

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT, -- Service description (supports markdown)
  features JSONB DEFAULT '[]', -- Array of service feature strings
  icon TEXT, -- Icon identifier (lucide-react icon name or custom)
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE services IS 'Service offerings displayed on the services page';
COMMENT ON COLUMN services.slug IS 'URL-friendly identifier for service deep-dive pages (future)';
COMMENT ON COLUMN services.features IS 'JSON array of service features/benefits';
COMMENT ON COLUMN services.icon IS 'Icon identifier for display (e.g., "building", "shield")';

CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- =============================================================================
-- Site Settings
-- =============================================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE site_settings IS 'Global site configuration and feature flags';
COMMENT ON COLUMN site_settings.key IS 'Setting identifier (e.g., "features", "metadata")';
COMMENT ON COLUMN site_settings.value IS 'Setting value as JSON (supports complex structures)';

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read published content
CREATE POLICY "Anyone can view published properties"
  ON properties FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can view published team members"
  ON team_members FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can view published testimonials"
  ON testimonials FOR SELECT
  USING (published = true);

CREATE POLICY "Anyone can view stats"
  ON stats FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Admins can manage all content
-- Note: Assumes user_profiles table with role field exists from LMS migration

CREATE POLICY "Admins can manage properties"
  ON properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage stats"
  ON stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
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

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stats_updated_at
  BEFORE UPDATE ON stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
