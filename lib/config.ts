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

    /**
     * Website section toggles (can be overridden by JSON config)
     */
    properties: process.env.NEXT_PUBLIC_PROPERTIES_ENABLED !== "false",
    team: process.env.NEXT_PUBLIC_TEAM_ENABLED !== "false",
    testimonials: process.env.NEXT_PUBLIC_TESTIMONIALS_ENABLED !== "false",
    blog: process.env.NEXT_PUBLIC_BLOG_ENABLED === "true",
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
    name: "Prime Capital Dubai",
    tagline: "We move complexity out of sight",
    description:
      "Boutique real estate advisory for discerning international investors seeking quality exposure to Dubai's premium property market.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },

  /**
   * Vendor / Creator
   * The organization that created and maintains this kit.
   */
  vendor: {
    name: "Launch Path Ventures",
    url: "https://www.launchpath.ventures",
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
   * Contact Information
   */
  contact: {
    email: "hello@primecapitaldubai.com",
    phone: "+971 4 XXX XXXX",
    address: "Office XXX, DIFC, Dubai, UAE",
  },

  /**
   * Social Links
   */
  social: {
    linkedin: "https://linkedin.com/company/prime-capital-dubai",
    instagram: "https://instagram.com/primecapitaldubai",
  },

  /**
   * External Links
   * URLs for external resources, repositories, and services.
   */
  links: {
    /** GitHub repository for the starter kit */
    github: "https://github.com/launchpathventures/prime-capital-dubai-hub",
    /** Documentation site (if separate from app) */
    docs: null as string | null,
    /** Support or contact link */
    support: null as string | null,
    /** Strategy Kit PDF download */
    strategyKit: "/downloads/strategy-kit.pdf",
  },

  /**
   * Form IDs (Fillout.com)
   */
  forms: {
    contact: process.env.NEXT_PUBLIC_CONTACT_FORM_ID || "",
    strategyKit: process.env.NEXT_PUBLIC_STRATEGY_KIT_FORM_ID || "",
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

  /**
   * Learning Management System Configuration
   * Settings for the LMS/learning portal.
   */
  learning: {
    /** Quiz pass threshold (percentage as decimal, e.g., 0.8 = 80%) */
    quizPassThreshold: 0.8,
    /** Core competency slugs in display order */
    competencies: [
      "market-intelligence",
      "client-discovery",
      "property-matching",
      "transaction-management",
      "objection-navigation",
      "relationship-stewardship",
    ],
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
