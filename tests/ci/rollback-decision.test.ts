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
  it("stays on when the repository variable is unset", () => {
    expect(rollbackEnabled(undefined)).toBe(true)
    expect(rollbackEnabled("")).toBe(true)
    expect(rollbackEnabled("   ")).toBe(true)
  })

  it("accepts the common on values", () => {
    for (const value of ["true", "TRUE", "1", "yes", "on"]) {
      expect(rollbackEnabled(value)).toBe(true)
    }
  })

  it("treats the kill switch as off", () => {
    for (const value of ["false", "0", "off", "no", "disabled", " FALSE "]) {
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
  it("chooses the previous READY production deployment, skipping newer failures", () => {
    const target = selectRollbackTarget(
      [
        current,
        { ...previous, readyState: "ERROR", created: 250, uid: "dpl_error" },
        previous,
        older,
        { uid: "dpl_preview", created: 290, readyState: "READY", target: "preview", meta: {} },
      ],
      "dpl_new",
    )
    expect(target?.id).toBe("dpl_prev")
  })

  it("returns null when the failed deployment is missing or is the oldest READY deploy", () => {
    expect(selectRollbackTarget([current, previous], "dpl_missing")).toBeNull()
    expect(selectRollbackTarget([previous], "dpl_prev")).toBeNull()
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
})

describe("decideRollback", () => {
  const ready = {
    probesOk: false,
    versionLive: true,
    autoRollback: undefined,
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

  it("rolls back by default when the new deploy is live and smoke fails", () => {
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

  it("honours the kill switch", () => {
    const decision = decideRollback({ ...ready, autoRollback: "false" })
    expect(decision.rollback).toBe(false)
    expect(decision.fail).toBe(true)
    expect(decision.reason).toMatch(/AUTO_ROLLBACK/)
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
