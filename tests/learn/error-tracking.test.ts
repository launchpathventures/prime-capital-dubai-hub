/**
 * CATALYST - Error Tracking Tests
 *
 * Tests for the centralized error tracking utility.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import {
  trackError,
  trackApiError,
  trackComponentError,
  trackActionError,
  trackWarning,
} from "@/lib/error-tracking"

describe("Error Tracking", () => {
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubEnv("NODE_ENV", "development")
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe("trackError", () => {
    it("should log error with context in development", () => {
      vi.stubEnv("NODE_ENV", "development")
      const error = new Error("Test error")

      trackError(error, { context: "test" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          message: "Test error",
          context: { context: "test" },
          severity: "error",
        })
      )
    })

    it("should log JSON in production", () => {
      vi.stubEnv("NODE_ENV", "production")
      const error = new Error("Production error")

      trackError(error, { context: "prod" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('"message":"Production error"')
      )
    })

    it("should handle non-Error objects", () => {
      vi.stubEnv("NODE_ENV", "development")

      trackError("String error", { context: "test" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          message: "String error",
        })
      )
    })

    it("should include timestamp", () => {
      vi.stubEnv("NODE_ENV", "development")
      const error = new Error("Test")

      trackError(error, { context: "test" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          timestamp: expect.any(String),
        })
      )
    })
  })

  describe("trackApiError", () => {
    it("should include route in context", () => {
      vi.stubEnv("NODE_ENV", "development")
      const error = new Error("API Error")

      trackApiError(error, "/api/coach/chat", { userId: "123" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          context: expect.objectContaining({
            context: "api",
            route: "/api/coach/chat",
            userId: "123",
          }),
        })
      )
    })
  })

  describe("trackComponentError", () => {
    it("should include component name and digest", () => {
      vi.stubEnv("NODE_ENV", "development")
      const error = new Error("Component Error")

      trackComponentError(error, "LearnDashboard", "abc123")

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          context: expect.objectContaining({
            context: "component",
            component: "LearnDashboard",
            digest: "abc123",
          }),
        })
      )
    })
  })

  describe("trackActionError", () => {
    it("should include action name", () => {
      vi.stubEnv("NODE_ENV", "development")
      const error = new Error("Action Error")

      trackActionError(error, "updateUser", { userId: "456" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          context: expect.objectContaining({
            context: "action",
            action: "updateUser",
            userId: "456",
          }),
        })
      )
    })
  })

  describe("trackWarning", () => {
    it("should log with warning severity", () => {
      vi.stubEnv("NODE_ENV", "development")

      trackWarning("Something suspicious", { context: "validation" })

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[Error Tracking]",
        expect.objectContaining({
          message: "Something suspicious",
          severity: "warning",
        })
      )
    })
  })
})
