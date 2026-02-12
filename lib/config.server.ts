/**
 * CATALYST - Server-Only Configuration
 *
 * Configuration values that must NEVER be exposed to the client.
 * This file imports "server-only" to ensure Next.js throws a build error
 * if any client component tries to import it.
 *
 * Location: lib/config.server.ts
 * See AGENTS.md for documentation on repo conventions.
 */

import "server-only"

/**
 * Server-only configuration values.
 * These are secrets that must never be bundled into client JavaScript.
 */
export const serverConfig = {
  /**
   * Supabase Service Role Key
   * Used for admin operations that bypass Row Level Security.
   * NEVER expose this to the client.
   */
  supabase: {
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },

  /**
   * Default password for new users created via admin panel.
   */
  auth: {
    defaultPassword: process.env.AUTH_DEFAULT_PASSWORD || "",
  },
} as const
