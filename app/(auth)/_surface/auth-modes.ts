/**
 * CATALYST - Auth Mode Configuration
 *
 * Centralized mode labels and descriptions for UI display.
 * Used by DevCard and potentially docs.
 */

import { type AuthMode } from "@/lib/auth/config"

// -----------------------------------------------------------------------------
// Mode Display Configuration
// -----------------------------------------------------------------------------

export type AuthModeConfig = {
  /** Internal mode key */
  key: AuthMode
  /** User-friendly label */
  label: string
  /** Short description */
  description: string
  /** Hint for how to enable this mode */
  hint: string
}

export const authModeConfigs: Record<AuthMode, AuthModeConfig> = {
  demo: {
    key: "demo",
    label: "Demo",
    description: "Any credentials work",
    hint: "Set AUTH_MODE in .env.local to change",
  },
  password: {
    key: "password",
    label: "Password",
    description: "Validates against a single password",
    hint: "Set AUTH_PASSWORD in .env.local",
  },
  supabase: {
    key: "supabase",
    label: "Supabase",
    description: "Full authentication via Supabase",
    hint: "Configure Supabase URL and key",
  },
  custom: {
    key: "custom",
    label: "Custom",
    description: "Authenticates via your API endpoint",
    hint: "Set AUTH_CUSTOM_ENDPOINT in .env.local",
  },
}

/**
 * Get the display config for an auth mode.
 */
export function getAuthModeConfig(mode: AuthMode): AuthModeConfig {
  return authModeConfigs[mode]
}
