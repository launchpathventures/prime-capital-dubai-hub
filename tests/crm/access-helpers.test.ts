/**
 * CATALYST - Access-tier helper tests
 */
import { describe, it, expect } from "vitest"

import {
  isBasicTier,
  isDevelopmentListing,
  lockedSectionLabel,
  type CrmProperty,
  type CrmPropertyFull,
} from "@/lib/crm"

function withAccess(access: CrmProperty["access"]): Pick<CrmProperty, "access"> {
  return { access }
}

describe("isBasicTier", () => {
  it("is true for a basic-tier response", () => {
    expect(isBasicTier(withAccess({ tier: "basic", gated: true, lockedSections: [], reason: null }))).toBe(true)
  })

  it("is false for a full-tier response", () => {
    expect(isBasicTier(withAccess({ tier: "full", gated: false, lockedSections: [], reason: null }))).toBe(false)
  })

  it("treats absent access as full (legacy responses are never gated)", () => {
    expect(isBasicTier(withAccess(null))).toBe(false)
  })
})

describe("lockedSectionLabel", () => {
  it("maps known keys to friendly labels", () => {
    expect(lockedSectionLabel("payment_plan")).toBe("Payment plan")
    expect(lockedSectionLabel("unit_types")).toBe("Unit types & pricing")
  })

  it("title-cases unknown keys", () => {
    expect(lockedSectionLabel("some_new_section")).toBe("Some New Section")
  })
})

type DevelopmentSignals = Pick<
  CrmPropertyFull,
  | "access"
  | "unitGroups"
  | "constructionProgress"
  | "completionDate"
  | "bedroomsMin"
  | "bedroomsMax"
>

function developmentSignals(overrides: Partial<DevelopmentSignals> = {}): DevelopmentSignals {
  return {
    access: null,
    unitGroups: null,
    constructionProgress: null,
    completionDate: null,
    bedroomsMin: null,
    bedroomsMax: null,
    ...overrides,
  }
}

describe("isDevelopmentListing", () => {
  it("keeps a gated basic listing off-plan when unit groups are withheld", () => {
    expect(
      isDevelopmentListing(
        developmentSignals({
          access: { tier: "basic", gated: true, lockedSections: ["unit_types"], reason: null },
        }),
      ),
    ).toBe(true)
  })

  it("classifies a full legacy response from grouped units", () => {
    expect(
      isDevelopmentListing(
        developmentSignals({
          unitGroups: [
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
          ],
        }),
      ),
    ).toBe(true)
  })

  it("keeps a completed listing without off-plan signals ready", () => {
    expect(
      isDevelopmentListing(
        developmentSignals({ constructionProgress: 100, completionDate: "2020-01-01" }),
      ),
    ).toBe(false)
  })
})
