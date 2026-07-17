/**
 * CATALYST - Access-tier helper tests
 */
import { describe, it, expect } from "vitest"

import { isBasicTier, lockedSectionLabel, type CrmProperty } from "@/lib/crm"

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
