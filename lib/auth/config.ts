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

/** Password for "password" mode */
const AUTH_PASSWORD = process.env.AUTH_PASSWORD || process.env.NEXT_PUBLIC_AUTH_PASSWORD

/** API endpoint for "custom" mode */
const AUTH_CUSTOM_ENDPOINT = process.env.AUTH_CUSTOM_ENDPOINT || process.env.NEXT_PUBLIC_AUTH_CUSTOM_ENDPOINT

/** Where to redirect after successful sign in */
const AUTH_REDIRECT_TO = process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO || "/app/dashboard"

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
 * - demo: Yes (UI preview)
 * - password: No (only sign in available)
 * - supabase: Yes (functional)
 * - custom: Yes (POST to custom endpoint)
 */
export function isRegistrationEnabled(): boolean {
  const mode = getAuthMode()
  return mode === "supabase" || mode === "demo" || mode === "custom"
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
