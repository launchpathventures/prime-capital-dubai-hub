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
} = {}) {
  const liveShas = overrides.liveShas ?? [NEW_SHA]
  let versionCall = 0
  let probeCall = 0
  const rollbackTo = vi.fn(async () => {})
  const deps = {
    waitForSha: vi.fn(async ({ expectedSha }: { expectedSha: string }) => {
      const sha = liveShas[Math.min(versionCall++, liveShas.length - 1)]
      return { live: sha === expectedSha, attempts: 1, status: 200, sha, detail: "" }
    }),
    probeJobs: vi.fn(async (jobs: Job[]) => {
      probeCall++
      return jobs.map((job) => (overrides.failing?.(job, probeCall) ? fail(job.url, job.kind) : pass(job.url, job.kind)))
    }),
    listProductionDeployments: vi.fn(async () => overrides.deployments ?? deployments),
    rollbackTo,
    sleep: vi.fn(async () => {}),
  }
  return { deps, rollbackTo }
}

const env = {
  EXPECTED_SHA: NEW_SHA,
  VERCEL_TOKEN: "test-token",
  AUTO_ROLLBACK: "true",
  SMOKE_ORIGINS: "https://example.test",
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

  it("passes cleanly without touching Vercel when every probe passes", async () => {
    const { deps, rollbackTo } = makeDeps()
    const result = await runSmoke(env, deps)
    expect(result.fail).toBe(false)
    expect(rollbackTo).not.toHaveBeenCalled()
    expect(deps.listProductionDeployments).not.toHaveBeenCalled()
  })
})
