/**
 * CATALYST - Auth callback ?next= tests (serviceos#2347)
 *
 * After a successful sign-in the callback must only ever redirect to this site.
 */
import { describe, it, expect, vi } from "vitest"
import { NextRequest } from "next/server"

import { UNSAFE_NEXTS } from "./unsafe-nexts.fixture"

const LANDING = "/auth/redirect"
const ORIGIN = "https://hub.test"

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      exchangeCodeForSession: async () => ({ error: null }),
      getUser: async () => ({ data: { user: { id: "u1", email: "a@primecapitaldubai.com" } } }),
      signOut: async () => ({}),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: async () => ({ data: { id: "u1" } }) }) }),
    }),
  }),
}))

vi.mock("@/lib/auth", () => ({
  getAuthConfig: () => ({ redirectTo: LANDING }),
  isAllowedEmail: () => true,
}))

async function callbackLocation(next: string): Promise<URL> {
  const { GET } = await import("@/app/api/auth/callback/route")
  const url = `${ORIGIN}/api/auth/callback?code=abc&next=${encodeURIComponent(next)}`
  const res = await GET(new NextRequest(url))
  return new URL(res.headers.get("location") as string, ORIGIN)
}

describe("auth callback ?next=", () => {
  it.each(UNSAFE_NEXTS)("stays on this site for %j", async (next) => {
    const location = await callbackLocation(next)
    expect(location.origin).toBe(ORIGIN)
    expect(location.pathname).toBe(LANDING)
  })

  it("follows a safe path and keeps its query", async () => {
    const location = await callbackLocation("/admin/team?x=1")
    expect(location.origin).toBe(ORIGIN)
    expect(location.pathname).toBe("/admin/team")
    expect(location.searchParams.get("x")).toBe("1")
  })
})
