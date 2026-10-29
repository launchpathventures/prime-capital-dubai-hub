/**
 * CATALYST - Rollback decision tests
 *
 * The post-deploy job must fail a bad production deploy without rolling
 * traffic back when the new SHA is not actually live, when the kill switch
 * is off, or when there is no previous READY deployment to restore.
 */

import { describe, expect, it } from "vitest"
import {
  decideRollback,
  deploymentIsRollback,
  findDeploymentBySha,
  formatProbeAttempt,
  isHealthOnlyFailure,
  retryBeforeRollback,
  rollbackEnabled,
  selectRollbackTarget,
  shaMatches,
} from "../../scripts/post-deploy-smoke.mjs"

const current = {
  uid: "dpl_new",
  created: 300,
  readyState: "READY",
  target: "production",
  meta: { githubCommitSha: "aaa1111111111111111111111111111111111111" },
}

const previous = {
  uid: "dpl_prev",
  created: 200,
  readyState: "READY",
  target: "production",
  meta: { githubCommitSha: "bbb2222222222222222222222222222222222222" },
}

const older = {
  uid: "dpl_older",
  created: 100,
  state: "READY",
  target: "production",
  meta: { githubCommitSha: "ccc3333333333333333333333333333333333333" },
}

describe("rollbackEnabled", () => {
  it("is off by default when the repository variable is unset or blank", () => {
    expect(rollbackEnabled(undefined)).toBe(false)
    expect(rollbackEnabled("")).toBe(false)
    expect(rollbackEnabled("   ")).toBe(false)
  })

  it("turns on only for explicit on values", () => {
    for (const value of ["true", "TRUE", "1", "yes", "on", " enabled "]) {
      expect(rollbackEnabled(value)).toBe(true)
    }
  })

  it("stays off for off values and anything unrecognised", () => {
    for (const value of ["false", "0", "off", "no", "disabled", " FALSE ", "maybe"]) {
      expect(rollbackEnabled(value)).toBe(false)
    }
  })
})

describe("shaMatches", () => {
  it("compares full SHAs case-insensitively and accepts a unique prefix", () => {
    expect(shaMatches("ABC", "abc")).toBe(true)
    expect(shaMatches("abc1234ffff", "ABC1234ffff")).toBe(true)
    expect(shaMatches("abc1234", "abc1234ffff")).toBe(true)
    expect(shaMatches("abc123", "abc1234ffff")).toBe(false)
    expect(shaMatches(null, "abc1234ffff")).toBe(false)
  })
})

describe("selectRollbackTarget", () => {
  const pick = (deployments: object[], id = "dpl_new") => selectRollbackTarget(deployments, id)

  it("chooses the previous READY production deployment, skipping newer failures", () => {
    const { target } = pick([
      current,
      { ...previous, readyState: "ERROR", created: 250, uid: "dpl_error" },
      previous,
      older,
      { uid: "dpl_preview", created: 290, readyState: "READY", target: "preview", meta: {} },
    ])
    expect(target?.id).toBe("dpl_prev")
  })

  it("refuses when the best candidate is not a rollback candidate, instead of skipping to an older one", () => {
    const { target, reason } = pick([current, { ...previous, isRollbackCandidate: false }, older])
    expect(target).toBeNull()
    expect(reason).toMatch(/not a rollback candidate/)
  })

  it("skips a production build that never served the domains", () => {
    const { target } = pick([current, { ...previous, aliasAssigned: null }, { ...older, aliasAssigned: 150 }])
    expect(target?.id).toBe("dpl_older")
  })

  it("skips deployments that are themselves rollbacks", () => {
    const { target } = pick([current, { ...previous, meta: { ...previous.meta, action: "rollback" } }, older])
    expect(target?.id).toBe("dpl_older")
  })

  it("refuses when serving order and creation order disagree (a deployment may have been rolled away from)", () => {
    // dpl_bad (created 250) was rolled away from; dpl_prev (created 200) was
    // restored afterwards. Whether Vercel refreshes aliasAssigned on rollback is
    // undocumented, so the script must not guess between them.
    const bad = { ...previous, uid: "dpl_bad", created: 250, aliasAssigned: 260 }
    const restored = { ...previous, created: 200, aliasAssigned: 280 }
    const newest = { ...current, aliasAssigned: 310 }
    const { target, reason } = pick([newest, bad, restored, older])
    expect(target).toBeNull()
    expect(reason).toMatch(/ambiguous/)
  })

  it("refuses when the previous deployment has no git SHA to verify the restore", () => {
    const { target, reason } = pick([current, { ...previous, meta: {} }, older])
    expect(target).toBeNull()
    expect(reason).toMatch(/no git SHA/)
  })

  it("ignores deployments that started serving after the current one", () => {
    const newest = { ...current, aliasAssigned: 310 }
    const later = { ...previous, uid: "dpl_later", created: 400, aliasAssigned: 400 }
    expect(pick([later, newest, older]).target?.id).toBe("dpl_older")
  })

  it("returns no target when the failed deployment is missing or is the oldest READY deploy", () => {
    expect(pick([current, previous], "dpl_missing").target).toBeNull()
    expect(pick([previous], "dpl_prev").target).toBeNull()
  })
})

describe("findDeploymentBySha", () => {
  it("returns the newest deployment for the SHA", () => {
    const found = findDeploymentBySha(
      [older, { ...current, created: 100 }, { ...current, created: 400, uid: "dpl_newer_same" }],
      "aaa1111111111111111111111111111111111111",
    )
    expect(found?.id).toBe("dpl_newer_same")
  })
})

describe("deploymentIsRollback", () => {
  it("recognises Vercel rollback metadata and dashboard descriptions", () => {
    expect(deploymentIsRollback({ meta: { action: "rollback" } })).toBe(true)
    expect(deploymentIsRollback({ description: "Rolled back to a previous deployment" })).toBe(true)
    expect(deploymentIsRollback({ meta: { githubCommitSha: "abc" }, description: "Deployment has completed" })).toBe(false)
    expect(deploymentIsRollback(null)).toBe(false)
  })

  it("ignores the commit message, so a message about rollbacks does not switch rollback off", () => {
    expect(
      deploymentIsRollback({
        meta: { githubCommitMessage: "fix: handle rolled back payments (instant rollback of fees)" },
        description: "Deployment has completed",
      }),
    ).toBe(false)
  })
})

describe("decideRollback", () => {
  const ready = {
    probesOk: false,
    versionLive: true,
    autoRollback: "true",
    rollbackTargetId: "dpl_prev",
    currentIsRollback: false,
    tokenPresent: true,
  }

  it("does nothing when the probes pass", () => {
    expect(decideRollback({ ...ready, probesOk: true })).toEqual({
      rollback: false,
      fail: false,
      reason: "production smoke passed",
    })
  })

  it("rolls back when enabled, the new deploy is live and smoke fails", () => {
    expect(decideRollback(ready)).toEqual({
      rollback: true,
      fail: true,
      reason: "smoke failed on the live production deploy",
    })
  })

  it("does not roll back when the new SHA never became live", () => {
    const decision = decideRollback({ ...ready, versionLive: false })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/not live/i)
  })

  it("does not roll back unless AUTO_ROLLBACK is enabled (default off)", () => {
    for (const autoRollback of [undefined, "", "false"]) {
      const decision = decideRollback({ ...ready, autoRollback })
      expect(decision.rollback).toBe(false)
      expect(decision.fail).toBe(true)
      expect(decision.reason).toMatch(/AUTO_ROLLBACK/)
    }
  })

  it("fails without rolling back when only /api/health failed", () => {
    const decision = decideRollback({ ...ready, healthOnlyFailure: true })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/only \/api\/health failed/)
  })

  it("fails without rolling back when a different deployment is live now", () => {
    const decision = decideRollback({ ...ready, superseded: true })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/different deployment is live/)
  })

  it("fails loudly when the token or a previous READY deployment is missing", () => {
    expect(decideRollback({ ...ready, tokenPresent: false }).reason).toMatch(/VERCEL_TOKEN/)
    expect(decideRollback({ ...ready, rollbackTargetId: null }).rollback).toBe(false)
    expect(decideRollback({ ...ready, rollbackTargetId: null }).reason).toMatch(/previous READY/)
  })

  it("does not roll a rollback back again", () => {
    const decision = decideRollback({ ...ready, currentIsRollback: true })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/already a rollback/i)
  })

  it("does not roll back when a probe was a bot challenge rather than the app", () => {
    const decision = decideRollback({ ...ready, inconclusive: true })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/inconclusive/i)
  })
})

describe("retryBeforeRollback", () => {
  it("waits 45s and re-probes failing checks once, rolling back only if they fail again", () => {
    const health = {
      url: "https://www.primecapitaldubai.com/api/health",
      status: 503,
      detail: "unhealthy",
      ok: false,
      inconclusive: false,
    }
    const home = {
      url: "https://www.primecapitaldubai.com/",
      status: 200,
      detail: "1200 bytes",
      ok: true,
      inconclusive: false,
    }

    expect(retryBeforeRollback({ attempt: 1, failedCount: 1 })).toEqual({
      retry: true,
      waitMs: 45_000,
      rollbackAllowed: false,
    })
    expect(retryBeforeRollback({ attempt: 1, failedCount: 0 })).toEqual({
      retry: false,
      waitMs: 0,
      rollbackAllowed: false,
    })
    expect(retryBeforeRollback({ attempt: 2, failedCount: 0 }).rollbackAllowed).toBe(false)
    expect(retryBeforeRollback({ attempt: 2, failedCount: 1 })).toEqual({
      retry: false,
      waitMs: 0,
      rollbackAllowed: true,
    })

    const summary = [
      formatProbeAttempt(1, [health, home]),
      formatProbeAttempt(2, [{ ...health, status: 200, detail: "healthy", ok: true }]),
    ].join("\n")
    expect(summary).toContain("### Attempt 1")
    expect(summary).toContain("FAIL https://www.primecapitaldubai.com/api/health → HTTP 503 unhealthy")
    expect(summary).toContain("PASS https://www.primecapitaldubai.com/ → HTTP 200 1200 bytes")
    expect(summary).toContain("### Attempt 2")
    expect(summary).toContain("PASS https://www.primecapitaldubai.com/api/health → HTTP 200 healthy")
  })
})

describe("isHealthOnlyFailure", () => {
  const probe = (kind: string, ok: boolean) => ({ kind, ok, url: `https://x/${kind}`, status: ok ? 200 : 503, detail: "" })

  it("is true only when health is the sole failure and every page passed", () => {
    expect(isHealthOnlyFailure([probe("health", false), probe("page", true)])).toBe(true)
    expect(isHealthOnlyFailure([probe("health", false), probe("page", false)])).toBe(false)
    expect(isHealthOnlyFailure([probe("health", true), probe("page", false)])).toBe(false)
    expect(isHealthOnlyFailure([probe("health", true), probe("page", true)])).toBe(false)
    expect(isHealthOnlyFailure([])).toBe(false)
  })
})
