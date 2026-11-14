/**
 * CATALYST - safeNextPath tests (serviceos#2347)
 */
import { describe, it, expect } from "vitest"

import { safeNextPath, safeNextOutsideAuth } from "@/lib/auth/safe-next"
import { UNSAFE_NEXTS } from "./unsafe-nexts.fixture"

const FALLBACK = "/auth/redirect"

describe("safeNextPath", () => {
  it.each(UNSAFE_NEXTS)("refuses %j", (raw) => {
    expect(safeNextPath(raw, FALLBACK)).toBe(FALLBACK)
  })

  it.each([null, undefined, ""])("falls back for %j", (raw) => {
    expect(safeNextPath(raw, FALLBACK)).toBe(FALLBACK)
  })

  it("keeps a plain path", () => {
    expect(safeNextPath("/admin/dashboard", FALLBACK)).toBe("/admin/dashboard")
  })

  it("keeps the query and hash", () => {
    expect(safeNextPath("/path?x=1", FALLBACK)).toBe("/path?x=1")
    expect(safeNextPath("/learn/quiz/a?returnTo=%2Flearn%2Fb#top", FALLBACK)).toBe(
      "/learn/quiz/a?returnTo=%2Flearn%2Fb#top",
    )
  })
})

describe("safeNextOutsideAuth", () => {
  it("never sends a signed-in person back to a sign-in page", () => {
    expect(safeNextOutsideAuth("/auth/login", FALLBACK)).toBe(FALLBACK)
    expect(safeNextOutsideAuth("/%61uth/login", FALLBACK)).toBe(FALLBACK)
  })

  it("keeps other paths and refuses the unsafe list", () => {
    expect(safeNextOutsideAuth("/admin/team", FALLBACK)).toBe("/admin/team")
    for (const raw of UNSAFE_NEXTS) expect(safeNextOutsideAuth(raw, FALLBACK)).toBe(FALLBACK)
  })
})
