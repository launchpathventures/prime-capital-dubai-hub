/**
 * CATALYST - The daily delivery check's marked test lead reaches the CRM with its marker intact
 *
 * TopStreet AI's website enquiry delivery check (agentcrm scripts/enquiry-canary.mjs; Tim, 6-7 Nov 2026) sends one
 * marked test lead through this form after every launch and once a day. The CRM drops a trusted post whose answers
 * carry "test lead: dummy data" before anything is created. If this route ever stopped passing the marker (or the
 * submission id) through, the daily test lead would become a real lead: created, assigned and notified. This pins
 * that it does not.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"
import type { NextRequest } from "next/server"

vi.mock("@/lib/crm/client", () => ({ getCrmPropertyBySlug: vi.fn().mockResolvedValue(null) }))

const mockFetch = vi.fn()
global.fetch = mockFetch

const CRM_URL = "https://crm.example.test/api/public/enquiry"
const SUBMISSION_ID = "6f1c2b9a-3d4e-4f5a-8b6c-7d8e9f0a1b2c"
const MARKER = "test lead: dummy data for full_name"

describe("the delivery check's marked test lead", () => {
  beforeEach(() => {
    vi.resetModules()
    mockFetch.mockReset()
    mockFetch.mockResolvedValue({ ok: true, status: 200, text: () => Promise.resolve("{}") })
    process.env.AGENTCRM_API_KEY = "test-agentcrm-key"
    process.env.AGENTCRM_API_URL = CRM_URL
    process.env.ZAPIER_LEAD_WEBHOOK_URL = ""
    process.env.ZAPIER_BID_WEBHOOK_URL = ""
  })

  it("is sent to the CRM with the marker in firstName and its own submission id, unchanged", async () => {
    const { POST } = await import("@/app/api/leads/route")
    const response = await POST(
      new Request("http://localhost/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "10.9.9.9" },
        // The exact body scripts/enquiry-canary.mjs sends for prime-capital-dubai-hub.
        body: JSON.stringify({
          firstName: MARKER,
          lastName: "Delivery check",
          email: "delivery-check@example.com",
          whatsapp: "+971501234567",
          pageUrl: "https://www.primecapitaldubai.com/contact",
          submittedAt: new Date().toISOString(),
          formMode: "contact",
          submissionId: SUBMISSION_ID,
        }),
      }) as unknown as NextRequest
    )

    expect(response.status).toBe(200)
    const crmCall = mockFetch.mock.calls.find(([url]) => url === CRM_URL)
    expect(crmCall).toBeDefined()
    expect(crmCall?.[1]?.headers).toMatchObject({ Authorization: "Bearer test-agentcrm-key" })
    const body = JSON.parse(String(crmCall?.[1]?.body))
    expect(body.firstName).toBe(MARKER)
    expect(body.submissionId).toBe(SUBMISSION_ID)
  })
})
