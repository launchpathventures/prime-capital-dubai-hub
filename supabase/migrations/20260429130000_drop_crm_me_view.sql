/**
 * CATALYST - Drop leftover crm_me view
 *
 * The AgentCRM codebase pollution (cleaned up in 20260324999999_cleanup_crm_tables.sql)
 * left behind a SECURITY DEFINER view `public.crm_me` that exposes auth.users data
 * to the anon role via PostgREST. The earlier cleanup dropped tables with CASCADE
 * but did not drop standalone views.
 *
 * Supabase linter flags this as:
 *   - auth_users_exposed (ERROR): auth.users exposed to anon
 *   - security_definer_view (ERROR): view runs with creator's privileges
 *
 * This view is not used anywhere in the Geneva codebase.
 */

DROP VIEW IF EXISTS public.crm_me CASCADE;
