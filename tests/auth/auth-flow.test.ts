/**
 * CATALYST - Auth Flow Tests
 *
 * Tests for authentication configuration, mode detection, and helper functions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

describe("Auth Configuration", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  // =============================================================================
  // AUTH MODE DETECTION
  // =============================================================================

  describe("Auth Mode Detection", () => {
    it("should return 'demo' mode when no auth configured", async () => {
      // Clear all auth-related env vars
      delete process.env.AUTH_MODE
      delete process.env.AUTH_PASSWORD
      delete process.env.AUTH_CUSTOM_ENDPOINT
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      const { getAuthMode } = await import("@/lib/auth/config")
      expect(getAuthMode()).toBe("demo")
    })

    it("should respect explicit AUTH_MODE override", async () => {
      process.env.AUTH_MODE = "password"
      process.env.AUTH_PASSWORD = "test-password"

      const { getAuthMode } = await import("@/lib/auth/config")
      expect(getAuthMode()).toBe("password")
    })

    it("should detect password mode when AUTH_PASSWORD is set", async () => {
      delete process.env.AUTH_MODE
      process.env.AUTH_PASSWORD = "my-secret-password"
      delete process.env.AUTH_CUSTOM_ENDPOINT
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      const { getAuthMode } = await import("@/lib/auth/config")
      expect(getAuthMode()).toBe("password")
    })

    it("should detect custom mode when AUTH_CUSTOM_ENDPOINT is set", async () => {
      delete process.env.AUTH_MODE
      process.env.AUTH_CUSTOM_ENDPOINT = "https://api.example.com/auth"
      delete process.env.AUTH_PASSWORD

      const { getAuthMode } = await import("@/lib/auth/config")
      expect(getAuthMode()).toBe("custom")
    })

    it("should detect supabase mode when Supabase is configured", async () => {
      delete process.env.AUTH_MODE
      delete process.env.AUTH_CUSTOM_ENDPOINT
      delete process.env.AUTH_PASSWORD
      process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"

      const { getAuthMode } = await import("@/lib/auth/config")
      expect(getAuthMode()).toBe("supabase")
    })
  })

  // =============================================================================
  // AUTH CONFIG HELPER
  // =============================================================================

  describe("getAuthConfig", () => {
    it("should return full auth config object", async () => {
      process.env.AUTH_MODE = "supabase"
      process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO = "/dashboard"

      const { getAuthConfig } = await import("@/lib/auth/config")
      const config = getAuthConfig()

      expect(config).toHaveProperty("mode")
      expect(config).toHaveProperty("redirectTo")
      expect(config.redirectTo).toBe("/dashboard")
    })

    it("should use default redirect when not specified", async () => {
      delete process.env.NEXT_PUBLIC_AUTH_REDIRECT_TO

      const { getAuthConfig } = await import("@/lib/auth/config")
      const config = getAuthConfig()

      expect(config.redirectTo).toBe("/learn")
    })
  })

  // =============================================================================
  // REGISTRATION ENABLED
  // =============================================================================

  describe("isRegistrationEnabled", () => {
    it("should return true for supabase mode", async () => {
      process.env.AUTH_MODE = "supabase"

      const { isRegistrationEnabled } = await import("@/lib/auth/config")
      expect(isRegistrationEnabled()).toBe(true)
    })

    it("should return true for demo mode", async () => {
      process.env.AUTH_MODE = "demo"

      const { isRegistrationEnabled } = await import("@/lib/auth/config")
      expect(isRegistrationEnabled()).toBe(true)
    })

    it("should return true for custom mode", async () => {
      process.env.AUTH_MODE = "custom"
      process.env.AUTH_CUSTOM_ENDPOINT = "https://api.example.com"

      const { isRegistrationEnabled } = await import("@/lib/auth/config")
      expect(isRegistrationEnabled()).toBe(true)
    })

    it("should return false for password mode", async () => {
      process.env.AUTH_MODE = "password"
      process.env.AUTH_PASSWORD = "test"

      const { isRegistrationEnabled } = await import("@/lib/auth/config")
      expect(isRegistrationEnabled()).toBe(false)
    })
  })

  // =============================================================================
  // PASSWORD RECOVERY ENABLED
  // =============================================================================

  describe("isPasswordRecoveryEnabled", () => {
    it("should return true for supabase mode", async () => {
      process.env.AUTH_MODE = "supabase"

      const { isPasswordRecoveryEnabled } = await import("@/lib/auth/config")
      expect(isPasswordRecoveryEnabled()).toBe(true)
    })

    it("should return false for password mode", async () => {
      process.env.AUTH_MODE = "password"
      process.env.AUTH_PASSWORD = "test"

      const { isPasswordRecoveryEnabled } = await import("@/lib/auth/config")
      expect(isPasswordRecoveryEnabled()).toBe(false)
    })
  })
})

// =============================================================================
// AUTH MODE TYPE VALIDATION
// =============================================================================

describe("Auth Mode Types", () => {
  it("should only accept valid auth modes", async () => {
    const validModes = ["demo", "password", "supabase", "custom"]

    for (const mode of validModes) {
      process.env.AUTH_MODE = mode
      if (mode === "password") process.env.AUTH_PASSWORD = "test"
      if (mode === "custom") process.env.AUTH_CUSTOM_ENDPOINT = "https://test.com"
      if (mode === "supabase") {
        process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test"
      }

      vi.resetModules()
      const { getAuthMode } = await import("@/lib/auth/config")
      expect(validModes).toContain(getAuthMode())
    }
  })

  it("should fallback to auto-detect for invalid AUTH_MODE values", async () => {
    process.env.AUTH_MODE = "invalid-mode"
    delete process.env.AUTH_PASSWORD
    delete process.env.AUTH_CUSTOM_ENDPOINT
    delete process.env.NEXT_PUBLIC_SUPABASE_URL

    vi.resetModules()
    const { getAuthMode } = await import("@/lib/auth/config")

    // Should fall back to demo mode (no valid auth configured)
    expect(getAuthMode()).toBe("demo")
  })
})
