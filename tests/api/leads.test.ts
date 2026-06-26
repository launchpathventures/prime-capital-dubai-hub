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

    it("should reject unbounded multi-select payloads before forwarding", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.51",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          whatsapp: "+971501234567",
          formMode: "contact",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
          goals: Array.from({ length: 11 }, (_, i) => `goal-${i}`),
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it("should reject non-UUIDv4 session IDs before forwarding", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.52",
        },
        body: JSON.stringify({
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          whatsapp: "+971501234567",
          formMode: "landing",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://example.com/",
          sessionId: "website-session",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(400)
      expect(mockFetch).not.toHaveBeenCalled()
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
          sessionId: "6f3fdfb4-8697-4c0a-9f68-3b2c83f8f5c5",
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
      expect(payload.sessionId).toBe("6f3fdfb4-8697-4c0a-9f68-3b2c83f8f5c5")
      expect(payload.source).toBeUndefined()
    })

    it("keeps accepted AgentCRM enquiry payloads below the 64KB body cap", async () => {
      const { POST } = await import("@/app/api/leads/route")

      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "192.168.1.71",
        },
        body: JSON.stringify({
          firstName: "A".repeat(100),
          lastName: "B".repeat(100),
          email: "max@example.com",
          whatsapp: "+971501234567",
          formMode: "contact",
          submittedAt: new Date().toISOString(),
          pageUrl: `https://example.com/${"p".repeat(480)}`,
          goals: Array.from({ length: 10 }, (_, i) => `goal-${i}`),
          investTimeline: "12_24_months",
          budget: "10m-20m",
          propertyTypes: Array.from({ length: 9 }, (_, i) => `type-${i}`),
          locations: Array.from({ length: 5 }, (_, i) => `Location ${i} ${"x".repeat(85)}`),
          bedrooms: 20,
          propertyLocation: "L".repeat(500),
          concerns: "C".repeat(2000),
          propertyType: "apartment",
          saleTimeline: "flexible",
          targetPrice: "50m-plus",
          hasQuestions: true,
          questionsText: "Q".repeat(500),
          privateRole: "investor",
          deploymentRange: "50m-plus",
          preferredContact: "whatsapp",
          privateContext: "P".repeat(500),
          enquiryIntent: Array.from({ length: 10 }, (_, i) => `intent-${i}`),
          propertyAppeals: Array.from({ length: 10 }, (_, i) => `appeal-${i}`),
          enquiryNotes: "N".repeat(1000),
          leadMagnet: "M".repeat(200),
          leadTag: "T".repeat(100),
          visitorType: "investor",
          referringProperty: "R".repeat(500),
          referringTeamMember: "agent-slug",
          referringTeamMemberEmail: "agent@primecapitaldubai.com",
          utmSource: "S".repeat(100),
          utmMedium: "M".repeat(100),
          utmCampaign: "C".repeat(100),
          utmContent: "O".repeat(100),
          utmTerm: "T".repeat(100),
          manychat: "Y".repeat(100),
          referrer: `https://referrer.example/${"r".repeat(475)}`,
          firstTouchUtmSource: "F".repeat(100),
          firstTouchUtmMedium: "F".repeat(100),
          firstTouchUtmCampaign: "F".repeat(100),
          firstTouchUtmContent: "F".repeat(100),
          firstTouchUtmTerm: "F".repeat(100),
          firstTouchReferrer: `https://first.example/${"f".repeat(478)}`,
          firstTouchLandingPage: `https://landing.example/${"l".repeat(476)}`,
          firstTouchAt: new Date().toISOString(),
          submissionId: "29c7c5ac-308d-4d81-95d6-00f5e8316b36",
          sessionId: "6f3fdfb4-8697-4c0a-9f68-3b2c83f8f5c5",
          meetingStartTime: new Date().toISOString(),
          meetingEndTime: new Date().toISOString(),
          meetingInviteeName: "I".repeat(200),
          meetingInviteeEmail: "invitee@example.com",
          meetingEventType: "E".repeat(200),
          meetingEventUri: `https://calendly.example/${"e".repeat(475)}`,
          meetingInviteeUri: `https://calendly.example/${"i".repeat(475)}`,
          meetingRescheduleUrl: `https://calendly.example/${"s".repeat(475)}`,
          meetingCancelUrl: `https://calendly.example/${"c".repeat(475)}`,
          website: "",
        }),
      })

      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(1)

      const [, requestInit] = mockFetch.mock.calls[0]
      const body = String(requestInit.body)
      expect(Buffer.byteLength(body, "utf8")).toBeLessThanOrEqual(64 * 1024)
    })
  })

  // =============================================================================
  // VISITOR TYPE ROUTING (Leads vs Partners)
  // =============================================================================
  //
  // AgentCRM reserves "vendor" for partners / service-providers. A consumer
  // selling their own property must route to "seller" (Leads), never "vendor".

  describe("visitorType routing", () => {
    async function postAndReadPayload(
      body: Record<string, unknown>,
      ip: string,
    ): Promise<Record<string, unknown>> {
      const { POST } = await import("@/app/api/leads/route")
      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": ip,
        },
        body: JSON.stringify({
          submittedAt: new Date().toISOString(),
          ...body,
        }),
      })
      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)
      expect(mockFetch).toHaveBeenCalledTimes(1)
      const [, requestInit] = mockFetch.mock.calls[0]
      return JSON.parse(String(requestInit.body))
    }

    it("routes a sell-only form to 'seller' and keeps 'sell' in goals", async () => {
      const payload = await postAndReadPayload(
        {
          firstName: "Sam",
          lastName: "Seller",
          email: "sam@example.com",
          whatsapp: "+971501112222",
          formMode: "contact",
          pageUrl: "https://primecapitaldubai.com/contact",
          goals: ["sell"],
        },
        "192.168.2.1",
      )

      expect(payload.visitorType).toBe("seller")
      expect(payload.goals).toContain("sell")
    })

    it("routes the /sell landing flow (goals: ['sell']) to 'seller'", async () => {
      const payload = await postAndReadPayload(
        {
          firstName: "Tara",
          email: "tara@example.com",
          whatsapp: "+971502223333",
          formMode: "landing",
          pageUrl: "https://primecapitaldubai.com/sell",
          leadTag: "seller",
          // What the /sell page now seeds via initialData
          goals: ["sell"],
        },
        "192.168.2.2",
      )

      expect(payload.visitorType).toBe("seller")
      expect(payload.goals).toContain("sell")
    })

    it("routes a mixed buy + sell form to 'investor' and keeps 'sell' in goals", async () => {
      const payload = await postAndReadPayload(
        {
          firstName: "Max",
          lastName: "Mixed",
          email: "max@example.com",
          whatsapp: "+971503334444",
          formMode: "contact",
          pageUrl: "https://primecapitaldubai.com/contact",
          goals: ["buy-ready", "sell"],
        },
        "192.168.2.3",
      )

      expect(payload.visitorType).toBe("investor")
      expect(payload.visitorType).not.toBe("vendor")
      expect(payload.goals).toContain("sell")
    })

    it("keeps an explicit partner/service-provider application as 'vendor'", async () => {
      const payload = await postAndReadPayload(
        {
          firstName: "Pat",
          lastName: "Partner",
          email: "pat@partner.example",
          whatsapp: "+971504445555",
          formMode: "contact",
          pageUrl: "https://primecapitaldubai.com/partners",
          // A real partner/service-provider application sets this explicitly
          visitorType: "vendor",
        },
        "192.168.2.4",
      )

      expect(payload.visitorType).toBe("vendor")
    })
  })

  // =============================================================================
  // EVENT KIOSK METADATA
  // =============================================================================

  describe("event kiosk metadata", () => {
    async function postEvent(
      distribution: "team" | "managers",
      ip: string,
    ): Promise<Record<string, unknown>> {
      const { POST } = await import("@/app/api/leads/route")
      const request = new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
        body: JSON.stringify({
          firstName: "Guest",
          whatsapp: "+971501112222",
          formMode: "event",
          leadMagnet: "Cityscape Global 2026",
          leadTag: "event-cityscape-global-2026",
          leadDistribution: distribution,
          utmSource: "event",
          utmMedium: "kiosk",
          utmCampaign: "event-cityscape-global-2026",
          submittedAt: new Date().toISOString(),
          pageUrl: "https://www.primecapitaldubai.com/register",
        }),
      })
      const response = await POST(request as unknown as NextRequest)
      expect(response.status).toBe(200)
      const [, requestInit] = mockFetch.mock.calls[0]
      return JSON.parse(String(requestInit.body))
    }

    it("forwards leadDistribution 'managers' with prospect markers", async () => {
      const payload = await postEvent("managers", "192.168.3.1")
      expect(payload.leadDistribution).toBe("managers")
      expect(payload.leadLifecycle).toBe("prospect")
      expect(payload.leadStage).toBe("prospect")
      expect(payload.formMode).toBe("event")
      expect(payload.utmMedium).toBe("kiosk")
    })

    it("forwards leadDistribution 'team'", async () => {
      const payload = await postEvent("team", "192.168.3.2")
      expect(payload.leadDistribution).toBe("team")
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
