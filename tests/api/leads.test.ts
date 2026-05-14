/**
 * CATALYST - Lead Form API Tests
 *
 * Tests for lead capture API validation, rate limiting, and honeypot protection.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { NextRequest } from "next/server"

vi.mock("@/lib/content", () => ({
  getWebPropertyBySlug: vi.fn(async () => null),
}))

// Mock the fetch function for Zapier webhook calls
const mockFetch = vi.fn()
global.fetch = mockFetch

const ORIGINAL_ENV = { ...process.env }

describe("Lead Form API", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    process.env = {
      ...ORIGINAL_ENV,
      AGENTCRM_API_KEY: "test-agentcrm-key",
      AGENTCRM_API_URL: "https://crm.example.test/api/public/enquiry",
      ZAPIER_LEAD_WEBHOOK_URL: "",
      ZAPIER_BID_WEBHOOK_URL: "",
    }
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: () => Promise.resolve("OK"),
    })
  })

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe("Validation", () => {
    it("should reject requests with missing required fields", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.1",
        },
        body: JSON.stringify({
          firstName: "John",
          // Missing lastName, email, whatsapp, formMode, etc.
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe("Please check your form and try again.")
    })

    it("should reject invalid email format", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.2",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "invalid-email",
          whatsapp: "+971501234567",
          formMode: "contact",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/contact",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)
    })

    it("should accept valid form data", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.3",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          whatsapp: "+971501234567",
          formMode: "landing",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("should validate formMode is one of allowed values", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.4",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          whatsapp: "+971501234567",
          formMode: "invalid-mode",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)
    })

    it("should enforce field length limits", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.5",
        },
        body: JSON.stringify({
          firstName: "A".repeat(101), // Exceeds 100 char limit
          lastName: "Doe",
          email: "john@example.com",
          whatsapp: "+971501234567",
          formMode: "contact",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)
    })
  })

  // =============================================================================
  // HONEYPOT TESTS
  // =============================================================================

  describe("Honeypot Protection", () => {
    it("should forward honeypot submissions so the CRM can silently drop spam", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.6",
        },
        body: JSON.stringify({
          firstName: "Bot",
          lastName: "User",
          email: "bot@spam.com",
          whatsapp: "+971501234567",
          formMode: "contact",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
          website: "http://spam-link.com", // Honeypot field filled = bot
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)

      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [, requestInit] = mockFetch.mock.calls[0]
      const payload = JSON.parse(String(requestInit.body))
      expect(payload.website).toBe("http://spam-link.com")
    })
  })

  // =============================================================================
  // CRM CONTRACT TESTS
  // =============================================================================

  describe("CRM Contract", () => {
    it("forwards a stable site source and explicit UTM fields", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.7",
        },
        body: JSON.stringify({
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@example.com",
          whatsapp: "+971501234567",
          formMode: "landing",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://tahirmajithia.com/contact?utm_source=youtube&utm_campaign=test123",
          source: "legacy-source-param",
          utmSource: "youtube",
          utmCampaign: "test123",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      const [url, requestInit] = mockFetch.mock.calls[0]
      const payload = JSON.parse(String(requestInit.body))

      expect(url).toBe("https://crm.example.test/api/public/enquiry")
      expect(requestInit.headers.Authorization).toBe("Bearer test-agentcrm-key")
      expect(payload._source).toBe("prime-capital-website")
      expect(payload.formName).toBe("quick-enquiry-contact-page")
      expect(payload.pageUrl).toBe(
        "https://tahirmajithia.com/contact?utm_source=youtube&utm_campaign=test123",
      )
      expect(payload.utmSource).toBe("youtube")
      expect(payload.utmCampaign).toBe("test123")
      expect(payload.source).toBeUndefined()
    })
  })

  // =============================================================================
  // HTTP METHOD TESTS
  // =============================================================================

  describe("HTTP Methods", () => {
    it("should reject GET requests", async () => {
      const { GET } = await import("@/app/api/leads/route")

      const response = await GET()
      expect(response.status).toBe(405)

      const data = await response.json()
      expect(data.error).toBe("Method not allowed")
    })
  })
})
