/**
 * CATALYST - Rate Limiting Tests
 *
 * Tests for the rate limiting utility functions.
 */

import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

describe("Rate Limiting", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =============================================================================
  // CHECK RATE LIMIT TESTS
  // =============================================================================

  describe("checkRateLimit", () => {
    it("should allow first request from new IP", () => {
      const result = checkRateLimit(
        "192.168.1.100",
        "test-context-1",
        { windowMs: 60000, maxRequests: 5 }
      )

      expect(result.limited).toBe(false)
      expect(result.remaining).toBe(4)
    })

    it("should decrement remaining count on subsequent requests", () => {
      const ip = "192.168.1.101"
      const context = "test-context-2"
      const options = { windowMs: 60000, maxRequests: 5 }

      // First request
      let result = checkRateLimit(ip, context, options)
      expect(result.remaining).toBe(4)

      // Second request
      result = checkRateLimit(ip, context, options)
      expect(result.remaining).toBe(3)

      // Third request
      result = checkRateLimit(ip, context, options)
      expect(result.remaining).toBe(2)
    })

    it("should rate limit after max requests exceeded", () => {
      const ip = "192.168.1.102"
      const context = "test-context-3"
      const options = { windowMs: 60000, maxRequests: 3 }

      // Make 3 requests (the limit)
      for (let i = 0; i < 3; i++) {
        const result = checkRateLimit(ip, context, options)
        expect(result.limited).toBe(false)
      }

      // 4th request should be limited
      const result = checkRateLimit(ip, context, options)
      expect(result.limited).toBe(true)
      expect(result.remaining).toBe(0)
      expect(result.retryAfter).toBeGreaterThan(0)
    })

    it("should track different IPs separately", () => {
      const context = "test-context-4"
      const options = { windowMs: 60000, maxRequests: 2 }

      // First IP uses all requests
      checkRateLimit("192.168.1.200", context, options)
      checkRateLimit("192.168.1.200", context, options)
      const ip1Result = checkRateLimit("192.168.1.200", context, options)
      expect(ip1Result.limited).toBe(true)

      // Second IP should still have full quota
      const ip2Result = checkRateLimit("192.168.1.201", context, options)
      expect(ip2Result.limited).toBe(false)
      expect(ip2Result.remaining).toBe(1)
    })

    it("should track different contexts separately", () => {
      const ip = "192.168.1.203"
      const options = { windowMs: 60000, maxRequests: 2 }

      // Use all requests in context A
      checkRateLimit(ip, "context-a", options)
      checkRateLimit(ip, "context-a", options)
      const contextAResult = checkRateLimit(ip, "context-a", options)
      expect(contextAResult.limited).toBe(true)

      // Context B should still have full quota
      const contextBResult = checkRateLimit(ip, "context-b", options)
      expect(contextBResult.limited).toBe(false)
      expect(contextBResult.remaining).toBe(1)
    })
  })

  // =============================================================================
  // GET CLIENT IP TESTS
  // =============================================================================

  describe("getClientIP", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "203.0.113.50, 70.41.3.18, 150.172.238.178",
        },
      })

      const ip = getClientIP(request)
      expect(ip).toBe("203.0.113.50")
    })

    it("should extract IP from x-real-ip header when x-forwarded-for is missing", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-real-ip": "198.51.100.23",
        },
      })

      const ip = getClientIP(request)
      expect(ip).toBe("198.51.100.23")
    })

    it("should return 'unknown' when no IP headers present", () => {
      const request = new Request("http://localhost")

      const ip = getClientIP(request)
      expect(ip).toBe("unknown")
    })

    it("should trim whitespace from IP", () => {
      const request = new Request("http://localhost", {
        headers: {
          "x-forwarded-for": "  203.0.113.50  ",
        },
      })

      const ip = getClientIP(request)
      expect(ip).toBe("203.0.113.50")
    })
  })

  // =============================================================================
  // RATE LIMIT RESPONSE TESTS
  // =============================================================================

  describe("createRateLimitResponse", () => {
    it("should return 429 status", () => {
      const response = createRateLimitResponse(60)
      expect(response.status).toBe(429)
    })

    it("should include Retry-After header", () => {
      const response = createRateLimitResponse(120)
      expect(response.headers.get("Retry-After")).toBe("120")
    })

    it("should include proper error message in body", async () => {
      const response = createRateLimitResponse(60)
      const body = await response.json()

      expect(body.error).toBe("Too many requests. Please try again later.")
      expect(body.retryAfter).toBe(60)
    })
  })

  // =============================================================================
  // PREDEFINED RATE LIMITS TESTS
  // =============================================================================

  describe("RATE_LIMITS configurations", () => {
    it("should have AUTH limits defined", () => {
      expect(RATE_LIMITS.AUTH).toEqual({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
      })
    })

    it("should have AI limits defined", () => {
      expect(RATE_LIMITS.AI).toEqual({
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 20,
      })
    })

    it("should have FORMS limits defined", () => {
      expect(RATE_LIMITS.FORMS).toEqual({
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5,
      })
    })

    it("should have GENERAL limits defined", () => {
      expect(RATE_LIMITS.GENERAL).toEqual({
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100,
      })
    })
  })
})
