-- =============================================================================
-- Fix CMS RLS policies: remove old is_admin() policies, add proper role checks
-- =============================================================================
-- The production database had manually-created per-operation policies using
-- is_admin() which only checked for role='admin'. These blocked marketing users
-- and (due to naming mismatch) couldn't be dropped by the original CMS migration.
--
-- This migration:
-- 1. Drops ALL old per-operation policies (insert/update/delete + public read)
-- 2. Creates clean FOR ALL policies for admin+marketing on CMS tables
-- 3. Creates proper public SELECT policies (published-only where applicable)
-- 4. Team members remain admin-only (marketing blocked by proxy.ts middleware)
--
-- Applied manually via Supabase Management API on 2026-04-01.
-- =============================================================================

-- Properties
DROP POLICY IF EXISTS "Admins can manage properties" ON properties;
DROP POLICY IF EXISTS "Admins can delete properties" ON properties;
DROP POLICY IF EXISTS "Admins can insert properties" ON properties;
DROP POLICY IF EXISTS "Admins can update properties" ON properties;
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Admins and marketing can manage properties"
  ON properties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'marketing')
    )
  );
CREATE POLICY "Anyone can view published properties"
  ON properties FOR SELECT USING (published = true);

-- Services
DROP POLICY IF EXISTS "Admins can manage services" ON services;
DROP POLICY IF EXISTS "Admins can delete services" ON services;
DROP POLICY IF EXISTS "Admins can insert services" ON services;
DROP POLICY IF EXISTS "Admins can update services" ON services;
DROP POLICY IF EXISTS "Public read access" ON services;
CREATE POLICY "Admins and marketing can manage services"
  ON services FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'marketing')
    )
  );
CREATE POLICY "Anyone can view services"
  ON services FOR SELECT USING (true);

-- Site Settings
DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can delete site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site_settings" ON site_settings;
DROP POLICY IF EXISTS "Public read access" ON site_settings;
CREATE POLICY "Admins and marketing can manage site settings"
  ON site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'marketing')
    )
  );
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT USING (true);

-- Stats
DROP POLICY IF EXISTS "Admins can manage stats" ON stats;
DROP POLICY IF EXISTS "Admins can delete stats" ON stats;
DROP POLICY IF EXISTS "Admins can insert stats" ON stats;
DROP POLICY IF EXISTS "Admins can update stats" ON stats;
DROP POLICY IF EXISTS "Public read access" ON stats;
CREATE POLICY "Admins and marketing can manage stats"
  ON stats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'marketing')
    )
  );
CREATE POLICY "Anyone can view stats"
  ON stats FOR SELECT USING (true);

-- Testimonials
DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
CREATE POLICY "Admins and marketing can manage testimonials"
  ON testimonials FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('admin', 'marketing')
    )
  );
CREATE POLICY "Anyone can view testimonials"
  ON testimonials FOR SELECT USING (true);

-- Team Members (admin only — marketing blocked by proxy.ts middleware)
DROP POLICY IF EXISTS "Admins can manage team members" ON team_members;
DROP POLICY IF EXISTS "Admins can delete team_members" ON team_members;
DROP POLICY IF EXISTS "Admins can insert team_members" ON team_members;
DROP POLICY IF EXISTS "Admins can update team_members" ON team_members;
DROP POLICY IF EXISTS "Public read access" ON team_members;
CREATE POLICY "Admins can manage team members"
  ON team_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
CREATE POLICY "Anyone can view published team members"
  ON team_members FOR SELECT USING (published = true);
