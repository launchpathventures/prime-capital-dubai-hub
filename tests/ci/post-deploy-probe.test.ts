/**
 * CATALYST - Post-deploy HTTP helper tests
 *
 * probeOnce, isChallenge and targetSmokeStatus talk to the network, so fetch is
 * stubbed. The point is what each does when the answer is odd: a bot challenge
 * must be inconclusive, and any GitHub problem must read as "unknown", never "passed".
 */

import { afterEach, describe, expect, it, vi } from "vitest"
import { isChallenge, probeOnce, targetSmokeStatus } from "../../scripts/post-deploy-smoke.mjs"

afterEach(() => {
  vi.unstubAllGlobals()
})

const html = (body: string, init: ResponseInit = {}) =>
  new Response(body, { status: 200, headers: { "content-type": "text/html; charset=utf-8" }, ...init })
const bigPage = `<html><head><title>Home</title></head><body>${"x".repeat(300)}</body></html>`

describe("isChallenge", () => {
  const challenge = (body: string, headers: Record<string, string> = {}) =>
    isChallenge(new Response(body, { headers }), body)

  it("recognises mitigation headers and challenge page titles", () => {
    expect(challenge("", { "x-vercel-mitigated": "challenge" })).toBe(true)
    expect(challenge("", { "cf-mitigated": "challenge" })).toBe(true)
    expect(challenge("<html><head><title>Just a moment...</title></head>")).toBe(true)
    expect(challenge("<title>Vercel Security Checkpoint</title>")).toBe(true)
    expect(challenge('<script src="/cdn-cgi/challenge-platform/cf-browser-verification.js">')).toBe(true)
  })

  it("does not treat ordinary page copy as a challenge", () => {
    expect(challenge("<html><title>Home</title><p>Just a moment of your time, please.</p></html>")).toBe(false)
    expect(challenge("<p>Our Vercel security checkpoint policy explained</p>")).toBe(false)
    expect(challenge("")).toBe(false)
  })
})

describe("probeOnce", () => {
  const stubFetch = (response: Response | Error) =>
    vi.stubGlobal("fetch", vi.fn(async () => {
      if (response instanceof Error) throw response
      return response
    }))

  it("passes a healthy /api/health only for HTTP 200 and status healthy", async () => {
    stubFetch(new Response('{"status":"healthy"}', { status: 200 }))
    expect(await probeOnce("https://x.test/api/health", "health")).toMatchObject({ ok: true, inconclusive: false })
    stubFetch(new Response('{"status":"unhealthy"}', { status: 503 }))
    expect(await probeOnce("https://x.test/api/health", "health")).toMatchObject({ ok: false, status: 503 })
    stubFetch(new Response('{"status":"healthy"}', { status: 500 }))
    expect(await probeOnce("https://x.test/api/health", "health")).toMatchObject({ ok: false })
    stubFetch(new Response("<html>oops</html>", { status: 200 }))
    expect(await probeOnce("https://x.test/api/health", "health")).toMatchObject({ ok: false })
  })

  it("passes a page only for 2xx HTML of reasonable size", async () => {
    stubFetch(html(bigPage))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({ ok: true })
    stubFetch(html("<html>tiny</html>"))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({ ok: false })
    stubFetch(html(bigPage, { status: 500 }))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({ ok: false, status: 500 })
    stubFetch(new Response(JSON.stringify({ a: "x".repeat(300) }), { headers: { "content-type": "application/json" } }))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({ ok: false })
  })

  it("marks a bot challenge inconclusive instead of failed-for-real", async () => {
    stubFetch(html("<title>Just a moment...</title>", { status: 403 }))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({
      ok: false,
      inconclusive: true,
      detail: "bot challenge",
    })
  })

  it("does not call a real 500 page inconclusive just because its copy says 'just a moment'", async () => {
    stubFetch(html(`<title>Error</title><p>Just a moment, something broke</p>${"x".repeat(300)}`, { status: 500 }))
    expect(await probeOnce("https://x.test/", "page")).toMatchObject({ ok: false, inconclusive: false })
  })

  it("lets a network error reject so the caller records it as a failed probe", async () => {
    stubFetch(new Error("fetch failed"))
    await expect(probeOnce("https://x.test/", "page")).rejects.toThrow("fetch failed")
  })
})

describe("targetSmokeStatus", () => {
  const env = { GITHUB_REPOSITORY: "owner/repo", GITHUB_TOKEN: "ghs_test" }
  const sha = "bbb2222222222222222222222222222222222222"
  const runs = (...conclusions: string[]) => ({
    workflow_runs: conclusions.map((conclusion, index) => ({
      conclusion,
      created_at: `2026-01-0${index + 1}T00:00:00Z`,
    })),
  })

  it("queries the smoke workflow's runs for the target SHA with the job token", async () => {
    const fetchMock = vi.fn(async () => Response.json(runs("success")))
    vi.stubGlobal("fetch", fetchMock)
    expect(await targetSmokeStatus({ sha, env })).toBe("passed")
    const [url, init] = fetchMock.mock.calls[0] as unknown as [URL, RequestInit]
    expect(url.origin + url.pathname).toBe(
      "https://api.github.com/repos/owner/repo/actions/workflows/post-deploy-smoke.yml/runs",
    )
    expect(url.searchParams.get("head_sha")).toBe(sha)
    expect(url.searchParams.get("per_page")).toBe("50")
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer ghs_test")
  })

  it("reports failed for the latest failing run", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json(runs("success", "failure"))))
    expect(await targetSmokeStatus({ sha, env })).toBe("failed")
  })

  it("is unknown on a non-OK response", async () => {
    for (const status of [401, 403, 404, 500]) {
      vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status })))
      expect(await targetSmokeStatus({ sha, env })).toBe("unknown")
    }
  })

  it("is unknown when fetch throws or the body is not JSON", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("network down") }))
    expect(await targetSmokeStatus({ sha, env })).toBe("unknown")
    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html>", { status: 200 })))
    expect(await targetSmokeStatus({ sha, env })).toBe("unknown")
  })

  it("is unknown with no runs, and never calls GitHub without a repository, token or SHA", async () => {
    const fetchMock = vi.fn(async () => Response.json({ workflow_runs: [] }))
    vi.stubGlobal("fetch", fetchMock)
    expect(await targetSmokeStatus({ sha, env })).toBe("unknown")
    fetchMock.mockClear()
    expect(await targetSmokeStatus({ sha, env: { GITHUB_TOKEN: "t" } })).toBe("unknown")
    expect(await targetSmokeStatus({ sha, env: { GITHUB_REPOSITORY: "o/r" } })).toBe("unknown")
    expect(await targetSmokeStatus({ sha: null, env })).toBe("unknown")
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
