/**
 * CATALYST - Legacy CRM Property Description Tests
 */

import { describe, expect, it } from "vitest"

import { formatLegacyPropertyDescription } from "@/lib/crm/property-description"

describe("formatLegacyPropertyDescription", () => {
  it("turns inline section labels and portal bullets into markdown", () => {
    const input =
      "A bright family home. Key Features: • 4 bedrooms • Smart lighting Community Location Highlights • Near Downtown • Gated community"

    expect(formatLegacyPropertyDescription(input)).toBe(
      [
        "A bright family home.",
        "",
        "### Key Features",
        "",
        "- 4 bedrooms",
        "- Smart lighting",
        "",
        "### Community Location Highlights",
        "",
        "- Near Downtown",
        "- Gated community",
      ].join("\n"),
    )
  })

  it("splits asterisks embedded between imported list items", () => {
    const input =
      "Intro copy. Property Details * One bedroom\n* One bathroom\n* Balcony * Modern kitchen Amenities * Pool\n* Gym"

    expect(formatLegacyPropertyDescription(input)).toContain(
      "### Property Details\n\n- One bedroom\n- One bathroom\n- Balcony\n- Modern kitchen",
    )
    expect(formatLegacyPropertyDescription(input)).toContain("### Amenities\n\n- Pool\n- Gym")
  })

  it("leaves normal prose and markdown emphasis intact", () => {
    const input = "A carefully written **premium home** with generous natural light."

    expect(formatLegacyPropertyDescription(input)).toBe(input)
  })
})
