/**
 * CATALYST - Application Configuration
 *
 * Central configuration for feature flags, app settings, and external links.
 * This is the SINGLE SOURCE OF TRUTH for configurable values.
 *
 * Environment variables are read here and exposed via typed config object.
 * See .env.example for available environment variables.
 *
 * Location: lib/config.ts
 * See AGENTS.md for documentation on repo conventions.
 */

export const config = {
  /**
   * Feature Flags
   * Toggle visibility of sections/features across the app.
   */
  features: {
    /**
     * Show documentation pages in production.
     * Controlled by NEXT_PUBLIC_DOCS_ENABLED env var.
     */
    showDocsInProduction: process.env.NEXT_PUBLIC_DOCS_ENABLED !== "false",
  },

  /**
   * Developer Tools
   * Controls visibility of dev tools cards throughout the app.
   * Set NEXT_PUBLIC_DEV_TOOLS=false to hide all dev tools.
   */
  devTools: {
    /** Master switch - controls all dev tools visibility */
    enabled: process.env.NEXT_PUBLIC_DEV_TOOLS !== "false",
    /** Show dev tools only in development mode (ignores enabled flag in production) */
    devOnly: process.env.NEXT_PUBLIC_DEV_TOOLS_DEV_ONLY === "true",
  },

  /**
   * App Metadata
   * Used in layouts, SEO, and branding.
   */
  app: {
    name: "Catalyst",
    description:
      "AI-first delivery system that turns messy discovery into confident delivery with proof-led alignment and a managed path to production.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  /**
   * Vendor / Creator
   * The organization that created and maintains this kit.
   */
  vendor: {
    name: "RIVER Group",
    url: "https://www.weareriver.nz",
  },

  /**
   * Catalyst Repository
   * The source repository for the Catalyst dev kit.
   */
  catalyst: {
    repo: "https://github.com/WEARERIVER/catalyst-ai-dev-kit.git",
    repoShort: "WEARERIVER/catalyst-ai-dev-kit",
  },

  /**
   * External Links
   * URLs for external resources, repositories, and services.
   */
  links: {
    /** GitHub repository for the starter kit */
    github: "https://github.com/WEARERIVER/catalyst-ai-dev-kit",
    /** Documentation site (if separate from app) */
    docs: null as string | null,
    /** Support or contact link */
    support: null as string | null,
  },

  /**
   * Supabase Configuration
   * Public values are safe for client use.
   */
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  },
} as const

/**
 * Check if docs should be accessible.
 * Returns true in development, or in production if enabled.
 */
export function isDocsEnabled(): boolean {
  if (process.env.NODE_ENV === "development") {
    return true
  }
  return config.features.showDocsInProduction
}

/**
 * Check if dev tools should be visible.
 * Respects both master switch and devOnly setting.
 */
export function isDevToolsEnabled(): boolean {
  // If devOnly is set, only show in development
  if (config.devTools.devOnly) {
    return process.env.NODE_ENV === "development"
  }
  // Otherwise respect the enabled flag
  return config.devTools.enabled
}
