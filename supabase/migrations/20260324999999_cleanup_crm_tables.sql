/**
 * CATALYST - Clean up CRM tables accidentally pushed to this database
 *
 * The AgentCRM codebase was misconfigured and pushed all its migrations
 * to the Prime Capital website/LMS database (vhgtbeimnkitqgekvtrz).
 * This migration removes all CRM-specific objects.
 *
 * SKIPPED (used by this app):
 *   - properties (CMS listings)
 *   - team_members (CMS team profiles)
 *   - user_profiles (LMS user profiles)
 *
 * The CRM also created an on_auth_user_created trigger that conflicts
 * with our own (from 20260325100000_google_sso_auto_provision.sql).
 * We drop the CRM triggers and re-create ours to be safe.
 */

-- ============================================================
-- 1. Drop CRM-only tables (CASCADE drops dependent views/policies/indexes)
-- ============================================================
DROP TABLE IF EXISTS public.contacts CASCADE;
DROP TABLE IF EXISTS public.requirements CASCADE;
DROP TABLE IF EXISTS public.deals CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.notes CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.campaign_recipients CASCADE;
DROP TABLE IF EXISTS public.nurture_sequences CASCADE;
DROP TABLE IF EXISTS public.nurture_enrollments CASCADE;
DROP TABLE IF EXISTS public.nurture_steps CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.contact_share_tokens CASCADE;
DROP TABLE IF EXISTS public.agencies CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;
DROP TABLE IF EXISTS public.agent_profiles CASCADE;
DROP TABLE IF EXISTS public.whatsapp_numbers CASCADE;
DROP TABLE IF EXISTS public.portal_leads CASCADE;
DROP TABLE IF EXISTS public.newsletter_schedules CASCADE;
DROP TABLE IF EXISTS public.allowed_signup_domains CASCADE;
DROP TABLE IF EXISTS public.feedback CASCADE;

-- ============================================================
-- 2. Drop CRM auth triggers (but NOT our own on_auth_user_created)
-- ============================================================
-- These CRM-specific triggers may have replaced or conflicted with ours
DROP TRIGGER IF EXISTS on_auth_user_created_user_profiles ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_agent_profiles ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_link_team_member ON auth.users;
DROP TRIGGER IF EXISTS check_signup_email_domain ON auth.users;

-- Drop CRM-specific trigger functions
DROP FUNCTION IF EXISTS public.handle_auth_user_created_user_profiles();
DROP FUNCTION IF EXISTS public.handle_auth_user_created_agent_profiles();
DROP FUNCTION IF EXISTS public.handle_auth_user_link_team_member();
DROP FUNCTION IF EXISTS public.check_signup_email_domain();

-- ============================================================
-- 3. Drop CRM utility functions
-- ============================================================
DROP FUNCTION IF EXISTS public.log_activity_on_status_change();
DROP FUNCTION IF EXISTS public.claim_campaign_recipients(uuid, integer);
-- NOTE: update_updated_at_column() is a common pattern — only drop if
-- our app doesn't use it. Check before uncommenting:
-- DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- ============================================================
-- 4. Restore our own auth trigger (in case CRM overwrote it)
-- ============================================================
-- Drop and re-create to ensure our version is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 5. Clean up CRM migration records
-- ============================================================
-- Delete CRM migration records so they don't block our own migrations.
-- Versions 20260325000000 and 20260407000000 collide with our app migrations
-- (completion_certificates.sql and team_members_schema_reconcile.sql), but the
-- CRM pushed its versions first, so these records are CRM's — not ours.
-- Our migrations have been made idempotent so they safely re-run after deletion.
-- This cleanup migration (20260324999999) is not in the list — it's ours.
DELETE FROM supabase_migrations.schema_migrations
WHERE version IN (
  '00000000000000', '00000000000001', '00000000000002', '00000000000003',
  '00000000000004', '00000000000005', '00000000000006', '00000000000007',
  '00000000000008', '00000000000009', '00000000000010', '00000000000011',
  '00000000000012',
  '20260216130000', '20260316100000', '20260321000000', '20260325000000',
  '20260327000000', '20260330000000', '20260330000001', '20260330100000',
  '20260330200000', '20260330200001', '20260331000000', '20260331100000',
  '20260331200000', '20260331200001', '20260331300000',
  '20260401000000', '20260401100000', '20260401200000', '20260401300000', '20260401400000',
  '20260402000000', '20260402100000', '20260402200000', '20260402300000',
  '20260402400000', '20260402500000', '20260402600000', '20260402700000',
  '20260403000000', '20260403100000', '20260403200000',
  '20260404000000', '20260405000000', '20260405100000', '20260405200000', '20260405300000',
  '20260406000000', '20260406100000', '20260406200000', '20260406300000',
  '20260406400000', '20260406500000',
  '20260407000000'
);
