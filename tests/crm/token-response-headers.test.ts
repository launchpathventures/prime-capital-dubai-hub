/**
 * CATALYST - Token response-header tests
 *
 * The pure header decision used by proxy.ts (edge middleware) to stamp
 * token-bearing property responses. Anonymous requests must be left untouched.
 */
import { describe, it, expect } from "vitest"

import { shareTokenResponseHeaders } from "@/lib/crm/token-response-headers"

function sp(query: string) {
  return new URLSearchParams(query)
}

describe("shareTokenResponseHeaders", () => {
  it("returns private/no-store + no-referrer for a ref token", () => {
    expect(shareTokenResponseHeaders(sp("ref=tok"))).toEqual({
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    })
  })

  it("returns the headers for a share token too", () => {
    expect(shareTokenResponseHeaders(sp("share=tok"))?.["Cache-Control"]).toBe(
      "private, no-store",
    )
  })

  it("stamps even a present-but-blank ref (still a token landing)", () => {
    expect(shareTokenResponseHeaders(sp("ref="))?.["Referrer-Policy"]).toBe("no-referrer")
  })

  it("returns null for anonymous requests (headers untouched)", () => {
    expect(shareTokenResponseHeaders(sp("utm_source=email"))).toBeNull()
  })
})
