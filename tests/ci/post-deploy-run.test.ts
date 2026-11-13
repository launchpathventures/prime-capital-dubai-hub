/**
 * CATALYST - Post-deploy orchestration tests
 *
 * Drives runSmoke with fake Vercel and HTTP dependencies to prove when a
 * rollback is requested and, more importantly, when it is refused.
 */

import { describe, expect, it, vi } from "vitest"
import { runSmoke } from "../../scripts/post-deploy-smoke.mjs"

const NEW_SHA = "aaa1111111111111111111111111111111111111"
const PREV_SHA = "bbb2222222222222222222222222222222222222"
const OTHER_SHA = "ccc3333333333333333333333333333333333333"

const deployments = [
  { uid: "dpl_new", created: 300, readyState: "READY", target: "production", meta: { githubCommitSha: NEW_SHA } },
  {
    uid: "dpl_prev",
    created: 200,
    isRollbackCandidate: true,
    readyState: "READY",
    target: "production",
    meta: { githubCommitSha: PREV_SHA, githubCommitMessage: "feat: previous `change`\r::stop-commands::x\nbody" },
  },
]

const pass = (url: string, kind: string) => ({ ok: true, inconclusive: false, url, kind, status: 200, detail: "ok" })
const fail = (url: string, kind: string) => ({ ok: false, inconclusive: false, url, kind, status: 503, detail: "bad" })

type Job = { url: string; kind: string }

function makeDeps(overrides: {
  /** live SHA per waitForSha call, in order; last value repeats */
  liveShas?: string[]
  failing?: (job: Job, call: number) => boolean
  deployments?: object[]
  /** smoke-run status by SHA; unlisted SHAs are "passed" */
  smokeBySha?: Record<string, "passed" | "failed" | "unknown">
  /** replace the answer of specific waitForSha calls (0-based), e.g. a network error */
  versionOverrides?: Record<number, { live: boolean; status: number; sha: string | null; detail: string }>
} = {}) {
  const liveShas = overrides.liveShas ?? [NEW_SHA]
  let versionCall = 0
  let probeCall = 0
  const rollbackTo = vi.fn(async () => {})
  const deps = {
    waitForSha: vi.fn(async ({ expectedSha }: { expectedSha: string }) => {
      const index = versionCall++
      const override = overrides.versionOverrides?.[index]
      if (override) return { attempts: 1, ...override }
      const sha = liveShas[Math.min(index, liveShas.length - 1)]
      return { live: sha === expectedSha, attempts: 1, status: 200, sha, detail: "" }
    }),
    probeJobs: vi.fn(async (jobs: Job[]) => {
      probeCall++
      return jobs.map((job) => (overrides.failing?.(job, probeCall) ? fail(job.url, job.kind) : pass(job.url, job.kind)))
    }),
    listProductionDeployments: vi.fn(async () => overrides.deployments ?? deployments),
    rollbackTo,
    targetSmokeStatus: vi.fn(async ({ sha }: { sha: string }) => overrides.smokeBySha?.[sha] ?? "passed"),
    sleep: vi.fn(async () => {}),
  }
  return { deps, rollbackTo }
}

const env = {
  EXPECTED_SHA: NEW_SHA,
  VERCEL_TOKEN: "test-token",
  AUTO_ROLLBACK: "true",
  SMOKE_ORIGINS: "https://example.test",
  SMOKE_TAHIR_ORIGINS: "https://tahir.example.test",
}

const pageFails = (job: Job) => job.kind === "page" && job.url.endsWith("/contact")
const healthFails = (job: Job) => job.kind === "health"

describe("runSmoke", () => {
  it("rolls back to the verified previous deployment and logs its SHA and commit message", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      // new SHA live for: initial wait, recheck before attempt 2, recheck before rollback; then the restored SHA
      liveShas: [NEW_SHA, NEW_SHA, NEW_SHA, PREV_SHA],
    })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).toHaveBeenCalledTimes(1)
    expect(rollbackTo).toHaveBeenCalledWith(expect.objectContaining({ deploymentId: "dpl_prev" }))
    const summary = result.lines.join("\n")
    expect(summary).toContain(PREV_SHA)
    expect(summary).toContain("feat: previous 'change'")
    expect(summary).not.toContain("body")
    expect(summary).not.toMatch(/\r|::stop-commands::/)
    expect(result.fail).toBe(true)
  })

  it("does not call the rollback API when AUTO_ROLLBACK is unset, but logs the target it would use", async () => {
    const { deps, rollbackTo } = makeDeps({ failing: pageFails })
    const result = await runSmoke({ ...env, AUTO_ROLLBACK: undefined }, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/AUTO_ROLLBACK/)
    expect(result.lines.join("\n")).toContain(PREV_SHA)
  })

  it("does not roll back when a newer deploy went live during the 45s wait", async () => {
    const { deps, rollbackTo } = makeDeps({ failing: pageFails, liveShas: [NEW_SHA, OTHER_SHA] })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(deps.listProductionDeployments).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/different deployment is live/)
  })

  it("does not roll back when a newer deploy goes live after the retry, just before rollback", async () => {
    const { deps, rollbackTo } = makeDeps({ failing: pageFails, liveShas: [NEW_SHA, NEW_SHA, OTHER_SHA] })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/different deployment is live/)
  })

  it("fails without rolling back when only /api/health fails and every page passes", async () => {
    const { deps, rollbackTo } = makeDeps({ failing: healthFails })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(deps.listProductionDeployments).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/only \/api\/health failed/)
  })

  it("still rolls back when health and a page both fail", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: (job) => healthFails(job) || pageFails(job),
      liveShas: [NEW_SHA, NEW_SHA, NEW_SHA, PREV_SHA],
    })
    await runSmoke(env, deps)
    expect(rollbackTo).toHaveBeenCalledTimes(1)
  })

  it("refuses to roll back when the previous deployment cannot be verified", async () => {
    // dpl_bad was rolled away from and dpl_prev restored afterwards: order is ambiguous.
    const ambiguous = [
      { ...deployments[0], aliasAssigned: 310 },
      { uid: "dpl_bad", created: 250, readyState: "READY", target: "production", aliasAssigned: 260, meta: { githubCommitSha: OTHER_SHA } },
      { ...deployments[1], aliasAssigned: 280 },
    ]
    const { deps, rollbackTo } = makeDeps({ failing: pageFails, deployments: ambiguous })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/no verified rollback target/)
  })

  it("refuses the known-bad deploy B in the A -> B (rolled back to A) -> D scenario when Vercel did not refresh A's alias time", async () => {
    // A (sha PREV) went live at 100; B (sha OTHER) was served at 150 and failed smoke, then
    // production was rolled back to A. A's aliasAssigned was NOT updated, so serving order and
    // creation order both say B, and the ordering check alone would pick B.
    const noUpdate = [
      { ...deployments[0], aliasAssigned: 400 },
      { uid: "dpl_b", created: 250, readyState: "READY", target: "production", isRollbackCandidate: true, aliasAssigned: 260, meta: { githubCommitSha: OTHER_SHA } },
      { ...deployments[1], aliasAssigned: 100 },
    ]
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      deployments: noUpdate,
      smokeBySha: { [OTHER_SHA]: "failed", [PREV_SHA]: "passed" },
      liveShas: [NEW_SHA],
    })
    const result = await runSmoke(env, deps)
    expect(deps.targetSmokeStatus).toHaveBeenCalledWith(expect.objectContaining({ sha: OTHER_SHA }))
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.fail).toBe(true)
    expect(result.reason).toMatch(/no verified rollback target/)
    expect(result.lines.join("\n")).toMatch(/failed its own post-deploy smoke run/)
  })

  it("fails closed when the target's smoke history cannot be determined", async () => {
    const { deps, rollbackTo } = makeDeps({ failing: pageFails, smokeBySha: { [PREV_SHA]: "unknown" } })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.lines.join("\n")).toMatch(/no passing post-deploy smoke run on record/)
  })

  it("logs a failed live-SHA re-check as unknown, not superseded, and does not roll back", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      versionOverrides: { 1: { live: false, status: 0, sha: null, detail: "fetch failed" } },
    })
    const result = await runSmoke(env, deps)
    const summary = result.lines.join("\n")
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.reason).toMatch(/could not re-check the live SHA/)
    expect(summary).toMatch(/Could not re-read the live SHA before attempt 2/)
    expect(summary).not.toMatch(/no longer the expected one/)
  })

  it("treats a network error on the final re-check before rollback as unknown too", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      versionOverrides: { 2: { live: false, status: 0, sha: null, detail: "fetch failed" } },
    })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.reason).toMatch(/could not re-check the live SHA/)
    expect(result.lines.join("\n")).toMatch(/Could not re-read the live SHA before rollback/)
  })

  it("probes the Tahir domain too, with its own page set, and lists it in the summary", async () => {
    const { deps } = makeDeps()
    const result = await runSmoke({ ...env, SMOKE_TAHIR_ORIGINS: "https://tahirmajithia.com,https://www.tahirmajithia.com" }, deps)
    const urls = (deps.probeJobs.mock.calls[0][0] as Job[]).map((job) => job.url)
    for (const host of ["https://tahirmajithia.com", "https://www.tahirmajithia.com"]) {
      expect(urls).toEqual(
        expect.arrayContaining([`${host}/api/health`, `${host}/`, `${host}/about`, `${host}/contact`, `${host}/services`]),
      )
      // Tahir rewrites to /tahir/*, so primary-brand-only routes are not probed there.
      expect(urls).not.toContain(`${host}/properties`)
      expect(urls).not.toContain(`${host}/team`)
    }
    expect(urls).toContain("https://example.test/properties")
    expect(result.lines.join("\n")).toContain("https://www.tahirmajithia.com")
  })

  it("probes the real production hosts of both brands by default", async () => {
    const { deps } = makeDeps()
    await runSmoke({ ...env, SMOKE_ORIGINS: undefined, SMOKE_TAHIR_ORIGINS: undefined }, deps)
    const hosts = new Set((deps.probeJobs.mock.calls[0][0] as Job[]).map((job) => new URL(job.url).host))
    expect(hosts).toEqual(
      new Set(["primecapitaldubai.com", "www.primecapitaldubai.com", "tahirmajithia.com", "www.tahirmajithia.com"]),
    )
  })

  it("turns Tahir probes off only when SMOKE_TAHIR_ORIGINS is explicitly empty", async () => {
    const { deps } = makeDeps()
    await runSmoke({ ...env, SMOKE_TAHIR_ORIGINS: "" }, deps)
    const urls = (deps.probeJobs.mock.calls[0][0] as Job[]).map((job) => job.url)
    expect(urls.every((url) => url.startsWith("https://example.test"))).toBe(true)
  })

  it("rolls back when only the Tahir domain fails a page, because one deployment serves both brands", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: (job) => job.url.startsWith("https://tahir.example.test") && job.url.endsWith("/services"),
      liveShas: [NEW_SHA, NEW_SHA, NEW_SHA, PREV_SHA],
    })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).toHaveBeenCalledTimes(1)
    expect(result.lines.join("\n")).toMatch(/FAIL https:\/\/tahir\.example\.test\/services/)
    // the recheck after rollback covers both brands as well
    const recheck = deps.probeJobs.mock.calls.at(-1)![0] as Job[]
    expect(recheck.some((job) => job.url.startsWith("https://tahir.example.test"))).toBe(true)
  })

  it("does not roll back when only the Tahir /api/health fails and every page passes", async () => {
    const { deps, rollbackTo } = makeDeps({
      failing: (job) => job.kind === "health" && job.url.startsWith("https://tahir.example.test"),
    })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.reason).toMatch(/only \/api\/health failed/)
  })

  it("uses creation time when Vercel omits aliasAssigned on the previous deployment", async () => {
    const mixed = [
      { ...deployments[0], aliasAssigned: 400 },
      { ...deployments[1] }, // no aliasAssigned at all
    ]
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      deployments: mixed,
      liveShas: [NEW_SHA, NEW_SHA, NEW_SHA, PREV_SHA],
    })
    await runSmoke(env, deps)
    expect(rollbackTo).toHaveBeenCalledWith(expect.objectContaining({ deploymentId: "dpl_prev" }))
  })

  it("uses creation time for both when aliasAssigned is missing everywhere", async () => {
    const bare = deployments.map(({ ...deployment }) => deployment)
    const { deps, rollbackTo } = makeDeps({
      failing: pageFails,
      deployments: bare,
      liveShas: [NEW_SHA, NEW_SHA, NEW_SHA, PREV_SHA],
    })
    await runSmoke(env, deps)
    expect(rollbackTo).toHaveBeenCalledTimes(1)
  })

  it("refuses a previous deployment whose aliasAssigned is false (never served)", async () => {
    const neverServed = [{ ...deployments[0] }, { ...deployments[1], aliasAssigned: false }]
    const { deps, rollbackTo } = makeDeps({ failing: pageFails, deployments: neverServed })
    const result = await runSmoke(env, deps)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(result.reason).toMatch(/no verified rollback target/)
  })

  it("passes cleanly without touching Vercel when every probe passes", async () => {
    const { deps, rollbackTo } = makeDeps()
    const result = await runSmoke(env, deps)
    expect(result.fail).toBe(false)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(deps.listProductionDeployments).not.toHaveBeenCalled()
  })
})
