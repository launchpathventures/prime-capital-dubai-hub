/**
 * CATALYST - Lead Source Attribution Tests
 */

import { describe, expect, it } from "vitest"
import { deriveSiteSource } from "@/lib/leads/source"

describe("deriveSiteSource", () => {
  it("keeps the Prime Capital site source even when utm_source is present", () => {
    expect(
      deriveSiteSource({
        pageUrl: "https://tahirmajithia.com/contact?utm_source=instagram",
        leadTag: "website-tahir",
      }),
    ).toBe("prime-capital-website")
  })

  it("uses the Prime Capital source for direct Tahir submissions", () => {
    expect(
      deriveSiteSource({
        pageUrl: "https://tahirmajithia.com/contact",
        leadTag: "website-tahir",
      }),
    ).toBe("prime-capital-website")
  })

  it("uses the Prime Capital source for local /tahir routes", () => {
    expect(
      deriveSiteSource({
        pageUrl: "http://localhost:3010/tahir/strategy-kit",
      }),
    ).toBe("prime-capital-website")
  })

  it("uses the Prime Capital source for Ahmed routes", () => {
    expect(
      deriveSiteSource({
        pageUrl: "https://primecapitaldubai.com/ahmed-ashfaq",
        leadTag: "website-ahmed-strategy-kit",
      }),
    ).toBe("prime-capital-website")
  })

  it("keeps the Prime Capital website fallback for non-Tahir submissions", () => {
    expect(
      deriveSiteSource({
        pageUrl: "https://primecapitaldubai.com/contact",
      }),
    ).toBe("prime-capital-website")
  })
})
