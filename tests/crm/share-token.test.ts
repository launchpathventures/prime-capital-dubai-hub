/**
 * CATALYST - Share-token resolution tests
 */
import { describe, it, expect } from "vitest"

import {
  selectShareToken,
  paramReaderFromRecord,
} from "@/lib/crm/share-token"

function sp(query: string) {
  return new URLSearchParams(query)
}

describe("selectShareToken", () => {
  it("selects ref when only ref is present", () => {
    expect(selectShareToken(sp("ref=abc"))).toEqual({
      present: true,
      key: "ref",
      value: "abc",
    })
  })

  it("canonicalises a share-only landing (share wins when ref absent)", () => {
    expect(selectShareToken(sp("share=xyz"))).toEqual({
      present: true,
      key: "share",
      value: "xyz",
    })
  })

  it("prefers ref over share when both are present", () => {
    expect(selectShareToken(sp("ref=abc&share=xyz"))).toEqual({
      present: true,
      key: "ref",
      value: "abc",
    })
  })

  it("lets a present-but-blank ref win and does NOT fall back to share", () => {
    expect(selectShareToken(sp("ref=&share=xyz"))).toEqual({
      present: true,
      key: "ref",
      value: "",
    })
  })

  it("reports absence when neither key is present", () => {
    expect(selectShareToken(sp("utm_source=email"))).toEqual({ present: false })
  })
})

describe("paramReaderFromRecord", () => {
  it("reads string values and preserves present-but-blank", () => {
    const reader = paramReaderFromRecord({ ref: "", utm_source: "email" })
    expect(reader.has("ref")).toBe(true)
    expect(reader.get("ref")).toBe("")
    expect(reader.has("share")).toBe(false)
  })

  it("takes the first value of a repeated key", () => {
    const reader = paramReaderFromRecord({ ref: ["a", "b"] })
    expect(reader.get("ref")).toBe("a")
  })

  it("resolves ref-wins precedence end to end from a Next record", () => {
    const token = selectShareToken(
      paramReaderFromRecord({ ref: "", share: "xyz" }),
    )
    expect(token).toEqual({ present: true, key: "ref", value: "" })
  })
})
