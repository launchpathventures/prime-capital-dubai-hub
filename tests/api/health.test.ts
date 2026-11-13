/**
 * CATALYST - Health endpoint tests
 *
 * /api/health is public, so a failing Supabase check must report status only.
 * The error text goes to server-side tracking and never into the response.
 */

import { beforeEach, describe, expect, it, vi } from "vitest"

const state = vi.hoisted(() => ({
  result: { error: null } as { error: unknown },
  throws: null as Error | null,
  track: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createStaticClient: () => {
    if (state.throws) throw state.throws
    return { from: () => ({ select: () => ({ limit: async () => state.result }) }) }
  },
}))
vi.mock("@/lib/error-tracking", () => ({ trackApiError: state.track }))

import { GET } from "@/app/api/health/route"

describe("GET /api/health", () => {
  beforeEach(() => {
    state.result = { error: null }
    state.throws = null
    state.track.mockClear()
  })

  it("reports healthy with 200", async () => {
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.status).toBe("healthy")
    expect(body.checks.supabase.status).toBe("ok")
  })

  it("does not return a Supabase error message, and tracks it server-side", async () => {
    state.result = { error: { message: 'relation "internal_table" does not exist' } }
    const response = await GET()
    const text = JSON.stringify(await response.json())
    expect(response.status).toBe(503)
    expect(text).toContain("unhealthy")
    expect(text).not.toContain("internal_table")
    expect(text).not.toContain('"error":')
    expect(state.track).toHaveBeenCalledTimes(1)
  })

  it("does not return a thrown error message either", async () => {
    state.throws = new Error("connect ECONNREFUSED 10.0.0.5:5432")
    const response = await GET()
    const text = JSON.stringify(await response.json())
    expect(response.status).toBe(503)
    expect(text).not.toContain("ECONNREFUSED")
    expect(state.track).toHaveBeenCalledTimes(1)
  })
})
