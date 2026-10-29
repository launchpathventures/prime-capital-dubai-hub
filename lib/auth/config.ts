/**
 * CATALYST - Auth Configuration
 *
 * Determines which authentication mode to use.
 * 
 * MODES:
 * - demo:     Accept any credentials (for demos/development)
 * - password: Validate against AUTH_PASSWORD env var
 * - supabase: Full auth via Supabase (sign in, register, reset, etc.)
 * - custom:   POST to AUTH_CUSTOM_ENDPOINT for validation
 *
 * MODE SELECTION:
 * 1. If AUTH_MODE is set, use that mode explicitly
 * 2. Otherwise, auto-detect based on which env vars are configured
 */

import { isSupabaseConfigured } from "@/lib/supabase/config"

// -----------------------------------------------------------------------------
// Domain Restriction
// -----------------------------------------------------------------------------

/**
 * Domains allowed to create a NEW account. Mirrors public.allowed_signup_domains()
 * (supabase/migrations/20261029140000_enforce_signup_domain.sql), which enforces
 * it in the database; tests/security/signup-domain.test.ts checks they match.
 * launchpathventures.com added by 20261029160000_allow_launchpathventures_signup.sql;
 * both get a learner profile, nobody is auto-admin.
 */
export const SIGNUP_EMAIL_DOMAINS = ["primecapitaldubai.com", "launchpathventures.com"]

/**
 * Same rule as public.is_allowed_signup_email(): printable ASCII only, case
 * insensitive, non-empty local part with no further "@", domain after the last "@"
 * on the signup list. Used for early, friendly errors; the DB is the enforcer.
 */
export function isAllowedSignupEmail(email: string | null | undefined): boolean {
  if (!email || /[^ -~]/.test(email)) return false
  const at = email.lastIndexOf("@")
  if (at < 1) return false
  const local = email.slice(0, at)
  const domain = email.slice(at + 1).toLowerCase()
  return !local.includes("@") && SIGNUP_EMAIL_DOMAINS.includes(domain)
}

/** Start of the DB/hook refusal text (public.signup_domain_error_message()). */
export const SIGNUP_DOMAIN_ERROR_PREFIX = "Sign-up is limited to"

/**
 * Domains allowed to sign in. Currently the same as SIGNUP_EMAIL_DOMAINS; kept
 * separate so sign-in can stay wider than sign-up (e.g. for legacy accounts).
 */
export const ALLOWED_EMAIL_DOMAINS = [
  "primecapitaldubai.com",
  "launchpathventures.com",
]

/** Check if an email belongs to an allowed domain */
export function isAllowedEmail(email: string): boolean {
  const lower = email.toLowerCase()
  return ALLOWED_EMAIL_DOMAINS.some((domain) => lower.endsWith(`@${domain}`))
}

// -----------------------------------------------------------------------------
// Auth Mode Types
// -----------------------------------------------------------------------------

export type AuthMode = "demo" | "password" | "supabase" | "custom"

export type AuthConfig = {
  mode: AuthMode
  /** Password for password mode */
  password?: string
  /** Custom API endpoint for custom mode */
  customEndpoint?: string
  /** Redirect after successful sign in */
  redirectTo: string
}

// -----------------------------------------------------------------------------
// Environment Variables
// -----------------------------------------------------------------------------

/**
 * AUTH_MODE - Explicitly set the auth mode (optional)
 * 
 * Values: "demo" | "password" | "supabase" | "custom"
 * 
 * When set, this overrides auto-detection. Useful when:
 * - You use Supabase for data but want simple password auth
 * - Testing different auth modes without changing other env vars
 * - Forcing demo mode in development
 */
const AUTH_MODE = process.env.AUTH_MODE as AuthMode | undefined

/** Password for "password" mode (server-only, no public fallback) */
const AUTH_PASSWORD = process.env.AUTH_PASSWORD

/** API endpoint for "custom" mode (server-only, no public fallback) */
const AUTH_CUSTOM_ENDPOINT = process.env.AUTH_CUSTOM_ENDPOINT

/** Where to redirect after successful sign in */
const AUTH_REDIRECT_TO = process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO || "/auth/redirect"

// -----------------------------------------------------------------------------
// Auth Mode Detection
// -----------------------------------------------------------------------------

/**
 * Get the current auth mode.
 * 
 * If AUTH_MODE is explicitly set, use that.
 * Otherwise, auto-detect based on configured env vars.
 */
export function getAuthMode(): AuthMode {
  // Explicit mode override
  if (AUTH_MODE && isValidAuthMode(AUTH_MODE)) {
    return AUTH_MODE
  }

  // Auto-detect based on env vars (priority order)
  return detectAuthMode()
}

/**
 * Auto-detect auth mode based on which env vars are configured.
 * 
 * Priority: custom > supabase > password > demo
 * 
 * Edit this function to change auto-detection logic.
 */
function detectAuthMode(): AuthMode {
  // Custom endpoint configured
  if (AUTH_CUSTOM_ENDPOINT) {
    return "custom"
  }
  
  // Supabase URL + key configured
  if (isSupabaseConfigured()) {
    return "supabase"
  }
  
  // Simple password configured
  if (AUTH_PASSWORD) {
    return "password"
  }
  
  // Default: demo mode (accept anything)
  return "demo"
}

/** Validate that a string is a valid auth mode */
function isValidAuthMode(mode: string): mode is AuthMode {
  return ["demo", "password", "supabase", "custom"].includes(mode)
}

// -----------------------------------------------------------------------------
// Auth Config Helpers
// -----------------------------------------------------------------------------

/**
 * Get full auth configuration.
 */
export function getAuthConfig(): AuthConfig {
  const mode = getAuthMode()
  
  return {
    mode,
    password: AUTH_PASSWORD,
    customEndpoint: AUTH_CUSTOM_ENDPOINT,
    redirectTo: AUTH_REDIRECT_TO,
  }
}

/**
 * Check if registration is available.
 * Registration is disabled — all users are provisioned via Google Workspace SSO.
 */
export function isRegistrationEnabled(): boolean {
  return false
}

/**
 * Check if password recovery is available.
 * - demo: Yes (UI preview)
 * - password: No (only sign in available)
 * - supabase: Yes (functional)
 * - custom: Yes (POST to custom endpoint)
 */
export function isPasswordRecoveryEnabled(): boolean {
  const mode = getAuthMode()
  return mode === "supabase" || mode === "demo" || mode === "custom"
}
