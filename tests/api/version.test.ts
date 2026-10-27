/**
 * CATALYST - Deploy version endpoint
 *
 * Smoke checks read this before judging production. It must answer from
 * Vercel env only, including when Supabase (and therefore /api/health) is down.
 */

import { afterEach, describe, expect, it } from "vitest"

const ORIGINAL_ENV = { ...process.env }

describe("GET /api/version", () => {
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV }
  })

  it("returns the deployment SHA and forbids caching", async () => {
    process.env.VERCEL_GIT_COMMIT_SHA = "abc123def4567890"
    process.env.VERCEL_DEPLOYMENT_ID = "dpl_test"
    process.env.VERCEL_ENV = "production"

    const { GET } = await import("@/app/api/version/route")
    const response = await GET()

    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toMatch(/no-store/)
    await expect(response.json()).resolves.toEqual({
      sha: "abc123def4567890",
      deploymentId: "dpl_test",
      env: "production",
    })
  })

  it("still returns 200 when the SHA is not injected", async () => {
    delete process.env.VERCEL_GIT_COMMIT_SHA
    delete process.env.VERCEL_DEPLOYMENT_ID
    delete process.env.VERCEL_ENV

    const { GET } = await import("@/app/api/version/route")
    const response = await GET()
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.sha).toBeNull()
    expect(body.env).toBe("development")
  })
})
