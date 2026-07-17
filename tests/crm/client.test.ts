/**
 * CATALYST - AgentCRM client tests
 *
 * Covers the sharing/gating contract: agency UUID requests, token forwarding
 * with no-store, token scrubbing in error logs, null-slug UUID fallback,
 * access mapping, and that internal fields never survive mapping.
 */
import { describe, it, expect, beforeEach, vi } from "vitest"

const AGENCY_UUID = "f78d13a4-c23e-47ce-81f6-b36284891eca"

vi.mock("server-only", () => ({}))
// NB: factory is hoisted above imports — inline the literal, no outer refs.
vi.mock("@/lib/config", () => ({
  config: {
    crm: {
      baseUrl: "https://crm.example.com",
      agencyUuid: "f78d13a4-c23e-47ce-81f6-b36284891eca",
      agencySlug: "prime-capital",
    },
  },
}))
vi.mock("@/lib/error-tracking", () => ({ trackError: vi.fn() }))

import { getCrmProperties, getCrmPropertyBySlug } from "@/lib/crm/client"
import { trackError } from "@/lib/error-tracking"

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    headers: { get: () => null },
    json: async () => data,
  } as unknown as Response
}

function listRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "uuid-1",
    title: "Marina Tower",
    slug: "marina-tower",
    area: "Dubai Marina",
    price: 1_000_000,
    price_from: 1_000_000,
    images: [],
    ...overrides,
  }
}

const mockFetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal("fetch", mockFetch)
})

describe("agency requests", () => {
  it("queries the property list with the agency UUID", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ data: [listRow()], pagination: { next_cursor: null, has_more: false, total: 1 } }),
    )
    await getCrmProperties()
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain(`agency=${AGENCY_UUID}`)
  })

  it("queries the detail endpoint with the agency UUID and never caches (no-store)", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: listRow() }))
    await getCrmPropertyBySlug("marina-tower")
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain(`agency=${AGENCY_UUID}`)
    // Anonymous property fetches must be no-store too — no website ISR/TTL.
    expect(init.cache).toBe("no-store")
    expect(init.next).toBeUndefined()
  })

  it("uses no-store for the anonymous list fetch (no ISR revalidate)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ data: [listRow()], pagination: { next_cursor: null, has_more: false, total: 1 } }),
    )
    await getCrmProperties()
    const init = mockFetch.mock.calls[0][1]
    expect(init.cache).toBe("no-store")
    expect(init.next).toBeUndefined()
  })
})

describe("share token forwarding", () => {
  it("forwards the token under the landing key and disables caching", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: listRow() }))
    await getCrmPropertyBySlug("marina-tower", {
      shareToken: { present: true, key: "ref", value: "tok-123" },
    })
    const [url, init] = mockFetch.mock.calls[0]
    expect(url).toContain("ref=tok-123")
    expect(init.cache).toBe("no-store")
    expect(init.next).toBeUndefined()
  })

  it("preserves a share-key landing token", async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse({ data: listRow() }))
    await getCrmPropertyBySlug("marina-tower", {
      shareToken: { present: true, key: "share", value: "tok-9" },
    })
    const url = mockFetch.mock.calls[0][0] as string
    expect(url).toContain("share=tok-9")
    expect(url).not.toContain("ref=")
  })

  it("scrubs the token from error-tracking on fetch failure", async () => {
    mockFetch.mockRejectedValueOnce(new Error("network down"))
    await getCrmPropertyBySlug("marina-tower", {
      shareToken: { present: true, key: "ref", value: "super-secret-token" },
    })
    expect(trackError).toHaveBeenCalledTimes(1)
    const meta = (trackError as unknown as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(meta.url).not.toContain("super-secret-token")
    expect(meta.url).toContain("ref=REDACTED")
  })
})

describe("mapping", () => {
  it("falls back to the UUID when the slug is null (secondary privacy)", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: [listRow({ id: "uuid-secondary", slug: null })],
        pagination: { next_cursor: null, has_more: false, total: 1 },
      }),
    )
    const { properties } = await getCrmProperties()
    expect(properties[0].slug).toBe("uuid-secondary")
  })

  it("never exposes commission_rate or raw unit_number", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: listRow({ commission_rate: 2.5, unit_number: "APT-1203" }),
      }),
    )
    const property = await getCrmPropertyBySlug("marina-tower")
    expect(property).not.toBeNull()
    expect("commission_rate" in (property as object)).toBe(false)
    // unit_number (snake) is never mapped; only the camel unitNumber exists and
    // is null unless the API supplies it under the mapped field.
    expect("unit_number" in (property as object)).toBe(false)
  })

  it("maps the access block to camelCase, null when absent", async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: listRow({
          access: {
            tier: "basic",
            gated: true,
            locked_sections: ["payment_plan", "unit_types"],
            reason: null,
          },
        }),
      }),
    )
    const withAccess = await getCrmPropertyBySlug("marina-tower")
    expect(withAccess?.access).toEqual({
      tier: "basic",
      gated: true,
      lockedSections: ["payment_plan", "unit_types"],
      reason: null,
    })

    mockFetch.mockResolvedValueOnce(jsonResponse({ data: listRow() }))
    const noAccess = await getCrmPropertyBySlug("marina-tower")
    expect(noAccess?.access).toBeNull()
  })

  it("maps the additive unit_groups contract independently of raw unit_types", async () => {
    const unitGroups = [
      {
        bedrooms: 0,
        label: "Studio",
        layouts: 30,
        size_min_sqft: 393,
        size_max_sqft: 450,
        price_from: 748_000,
        total_units: 0,
        available_units: 0,
      },
      {
        bedrooms: 1,
        label: "1 Bedroom",
        layouts: 45,
        size_min_sqft: 650,
        size_max_sqft: 820,
        price_from: 1_100_000,
        total_units: 12,
        available_units: 3,
      },
    ]
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        data: listRow({
          unit_types: [
            {
              name: "Studio Type A",
              bedrooms: 0,
              bathrooms: 1,
              size_sqft: 393,
              price_from: 748_000,
              price_to: 765_000,
              total_units: 0,
              available_units: 0,
            },
          ],
          unit_groups: unitGroups,
        }),
      }),
    )

    const property = await getCrmPropertyBySlug("marina-tower")

    expect(property?.unitGroups).toEqual(unitGroups)
  })
})
