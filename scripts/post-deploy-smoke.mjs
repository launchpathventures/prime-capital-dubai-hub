/**
 * CATALYST - Post-deploy production smoke and instant rollback.
 *
 * Plain Node so the production job does not install dependencies.
 * Decision helpers are exported for unit tests. The CLI runs only when this
 * file is the process entrypoint.
 *
 * Approach follows launchpathventures/agentcrm scripts/shared-post-deploy-smoke.mjs:
 * confirm the SHA is on the production alias, probe public routes, and on
 * failure call Vercel's instant rollback to the previous READY deployment.
 */

import { appendFileSync, realpathSync } from "node:fs"
import { pathToFileURL } from "node:url"

export const PRODUCTION_ORIGIN = "https://primecapitaldubai.com"
export const WWW_ORIGIN = "https://www.primecapitaldubai.com"

/** Live project. Repository variables VERCEL_TEAM_ID and VERCEL_PROJECT_ID override these. */
export const DEFAULT_TEAM_ID = "team_HshsUsC6U4lidrM07nzJLx1n"
export const DEFAULT_PROJECT_ID = "prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x"

/**
 * Public routes from docs/runbooks/smoke-test-checklist.md.
 * Form submission, login, and admin stay manual — those mutate or need credentials.
 */
export const SMOKE_PATHS = [
  { path: "/api/health", kind: "health" },
  { path: "/", kind: "page" },
  { path: "/contact", kind: "page" },
  { path: "/properties", kind: "page" },
  { path: "/team", kind: "page" },
  { path: "/auth/login", kind: "page" },
]

const OFF_VALUES = new Set(["0", "false", "off", "no", "disabled"])
const USER_AGENT = "PrimeCapitalSmoke/1.0 (+https://www.primecapitaldubai.com)"

/** One quiet period so a brief Supabase 503 does not move production. */
export const PROBE_RETRY_WAIT_MS = 45_000

export function rollbackEnabled(value) {
  if (value == null) return true
  const normalized = String(value).trim().toLowerCase()
  if (!normalized) return true
  return !OFF_VALUES.has(normalized)
}

export function shaMatches(live, expected) {
  if (!live || !expected) return false
  const left = String(live).trim().toLowerCase()
  const right = String(expected).trim().toLowerCase()
  if (!/^[0-9a-f]+$/.test(left) || !/^[0-9a-f]+$/.test(right)) return false
  if (left === right) return true
  const [shorter, longer] = left.length <= right.length ? [left, right] : [right, left]
  return shorter.length >= 7 && longer.startsWith(shorter)
}

export function normalizeDeployment(raw) {
  const meta = raw?.meta || {}
  return {
    id: raw?.uid || raw?.id || null,
    created: Number(raw?.created || raw?.createdAt || 0),
    ready: (raw?.readyState || raw?.state) === "READY",
    target: raw?.target ?? null,
    sha: meta.githubCommitSha || meta.gitCommitSha || null,
    meta,
    description: raw?.description || "",
  }
}

function isProductionReady(deployment) {
  if (!deployment.ready || !deployment.id) return false
  return deployment.target == null || deployment.target === "production"
}

export function selectRollbackTarget(deployments, currentId) {
  const ready = deployments
    .map(normalizeDeployment)
    .filter(isProductionReady)
    .sort((left, right) => right.created - left.created)
  const index = ready.findIndex((deployment) => deployment.id === currentId)
  if (index < 0) return null
  return ready[index + 1] || null
}

export function findDeploymentBySha(deployments, sha) {
  const matches = deployments
    .map(normalizeDeployment)
    .filter((deployment) => shaMatches(deployment.sha, sha))
    .sort((left, right) => right.created - left.created)
  return matches[0] || null
}

export function deploymentIsRollback(deployment) {
  if (!deployment) return false
  const meta = deployment.meta || {}
  if (meta.action === "rollback") return true
  if (meta.rollback === true || meta.rollback === "1" || meta.rollback === "true") return true
  const description = `${deployment.description || ""} ${meta.githubCommitMessage || ""}`
  return /rolled back|instant rollback/i.test(description)
}

/**
 * @param {object} input
 * @param {boolean} input.probesOk
 * @param {boolean} input.versionLive
 * @param {string | undefined | null} input.autoRollback
 * @param {string | null} input.rollbackTargetId
 * @param {boolean} input.currentIsRollback
 * @param {boolean} input.tokenPresent
 * @param {boolean} [input.inconclusive]
 */
export function decideRollback({
  probesOk,
  versionLive,
  autoRollback,
  rollbackTargetId,
  currentIsRollback,
  tokenPresent,
  inconclusive = false,
}) {
  if (!versionLive) {
    return {
      rollback: false,
      fail: true,
      reason: "new deploy is not live on the production alias; left the previous deployment in place",
    }
  }
  if (probesOk) {
    return { rollback: false, fail: false, reason: "production smoke passed" }
  }
  if (inconclusive) {
    return {
      rollback: false,
      fail: true,
      reason: "smoke was inconclusive (bot challenge or incomplete response); not rolling back",
    }
  }
  if (currentIsRollback) {
    return {
      rollback: false,
      fail: true,
      reason: "deployment is already a rollback; not rolling back again",
    }
  }
  if (!rollbackEnabled(autoRollback)) {
    return { rollback: false, fail: true, reason: "AUTO_ROLLBACK kill switch is off" }
  }
  if (!tokenPresent) {
    return { rollback: false, fail: true, reason: "VERCEL_TOKEN is not set; cannot roll back" }
  }
  if (!rollbackTargetId) {
    return {
      rollback: false,
      fail: true,
      reason: "no previous READY production deployment to roll back to",
    }
  }
  return {
    rollback: true,
    fail: true,
    reason: "smoke failed on the live production deploy",
  }
}

/**
 * The first failed probe of the new SHA is not a rollback. Wait and run the
 * failing checks once more. Rollback is allowed only when that second attempt
 * still has failures.
 *
 * @param {{ attempt: number, failedCount: number }} input
 */
export function retryBeforeRollback({ attempt, failedCount }) {
  if (failedCount === 0) {
    return { retry: false, waitMs: 0, rollbackAllowed: false }
  }
  if (attempt < 2) {
    return { retry: true, waitMs: PROBE_RETRY_WAIT_MS, rollbackAllowed: false }
  }
  return { retry: false, waitMs: 0, rollbackAllowed: true }
}

/**
 * @param {number} attempt
 * @param {Array<{ ok: boolean, inconclusive?: boolean, url: string, status: number, detail: string }>} probes
 */
export function formatProbeAttempt(attempt, probes) {
  const lines = [`### Attempt ${attempt}`]
  for (const probe of probes) {
    const label = probe.inconclusive ? "INCONCLUSIVE" : probe.ok ? "PASS" : "FAIL"
    lines.push(`- ${label} ${probe.url} → HTTP ${probe.status} ${probe.detail}`)
  }
  return lines.join("\n")
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function writeSummary(markdown) {
  console.log(markdown)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`)
  }
}

function isChallenge(response, body) {
  if (response.headers?.get?.("x-vercel-mitigated")) return true
  return /vercel security checkpoint|cf-browser-verification|just a moment/i.test(body)
}

async function probeOnce(url, kind) {
  const response = await fetch(url, {
    redirect: "follow",
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
    headers: {
      "user-agent": USER_AGENT,
      accept: kind === "health" ? "application/json" : "text/html,application/xhtml+xml",
    },
  })
  const body = await response.text()
  if (isChallenge(response, body)) {
    return { ok: false, inconclusive: true, url, kind, status: response.status, detail: "bot challenge" }
  }
  if (kind === "health") {
    let parsed = null
    try {
      parsed = JSON.parse(body)
    } catch {
      parsed = null
    }
    const ok = response.status === 200 && parsed?.status === "healthy"
    return {
      ok,
      inconclusive: false,
      url,
      kind,
      status: response.status,
      detail: parsed?.status || body.slice(0, 160),
    }
  }
  const contentType = response.headers.get("content-type") || ""
  const html = contentType.includes("text/html")
  const ok = response.status >= 200 && response.status < 300 && html && body.length >= 200
  return {
    ok,
    inconclusive: false,
    url,
    kind,
    status: response.status,
    detail: html ? `${body.length} bytes` : contentType || "no content-type",
  }
}

function smokeJobs(origins) {
  return origins.flatMap((origin) =>
    SMOKE_PATHS.map((spec) => ({ url: new URL(spec.path, origin).href, kind: spec.kind })),
  )
}

async function probeJobs(jobs) {
  return Promise.all(
    jobs.map((job) =>
      probeOnce(job.url, job.kind).catch((error) => ({
        ok: false,
        inconclusive: false,
        url: job.url,
        kind: job.kind,
        status: 0,
        detail: error instanceof Error ? error.message : String(error),
      })),
    ),
  )
}

async function waitForSha({ origin, expectedSha, attempts, intervalMs }) {
  let last = { status: 0, sha: null, detail: "no response" }
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(new URL("/api/version", origin), {
        redirect: "follow",
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: { accept: "application/json", "user-agent": USER_AGENT },
      })
      const body = await response.text()
      let sha = null
      try {
        sha = JSON.parse(body).sha ?? null
      } catch {
        sha = null
      }
      last = { status: response.status, sha, detail: body.slice(0, 180) }
      if (shaMatches(sha, expectedSha)) return { live: true, attempts: attempt, ...last }
    } catch (error) {
      last = { status: 0, sha: null, detail: error instanceof Error ? error.message : String(error) }
    }
    if (attempt < attempts) await sleep(intervalMs)
  }
  return { live: false, attempts, ...last }
}

async function vercelFetch(url, token, init = {}) {
  const response = await fetch(url, {
    ...init,
    signal: AbortSignal.timeout(30000),
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/json",
      ...(init.headers || {}),
    },
  })
  const text = await response.text()
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 400)}`)
  }
  return text
}

async function listProductionDeployments({ token, teamId, projectId }) {
  const url = new URL("https://api.vercel.com/v6/deployments")
  url.searchParams.set("projectId", projectId)
  url.searchParams.set("teamId", teamId)
  url.searchParams.set("target", "production")
  url.searchParams.set("limit", "20")
  const text = await vercelFetch(url, token)
  const json = JSON.parse(text)
  return json.deployments || []
}

async function rollbackTo({ token, teamId, projectId, deploymentId }) {
  const url = new URL(`https://api.vercel.com/v1/projects/${projectId}/rollback/${deploymentId}`)
  url.searchParams.set("teamId", teamId)
  url.searchParams.set("description", "auto rollback: production smoke failed")
  await vercelFetch(url, token, { method: "POST" })
}

function isDirectRun() {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href
  } catch {
    return false
  }
}

async function main() {
  const expectedSha = process.env.EXPECTED_SHA || ""
  if (!expectedSha) throw new Error("EXPECTED_SHA is required")

  const origins = (process.env.SMOKE_ORIGINS || `${PRODUCTION_ORIGIN},${WWW_ORIGIN}`)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
  const versionOrigin = origins[0]
  const attempts = Number(process.env.VERSION_ATTEMPTS || 12)
  const intervalMs = Number(process.env.VERSION_INTERVAL_MS || 5000)
  const autoRollback = process.env.AUTO_ROLLBACK
  const token = process.env.VERCEL_TOKEN || ""
  const teamId = process.env.VERCEL_TEAM_ID || DEFAULT_TEAM_ID
  const projectId = process.env.VERCEL_PROJECT_ID || DEFAULT_PROJECT_ID

  const lines = [
    "## Post-deploy smoke",
    "",
    `- Expected SHA: \`${expectedSha}\``,
    `- Origins: ${origins.join(", ")}`,
    `- Rollback: ${rollbackEnabled(autoRollback) ? "on" : "off"} (\`AUTO_ROLLBACK\`)`,
  ]

  const version = await waitForSha({ origin: versionOrigin, expectedSha, attempts, intervalMs })
  lines.push(
    `- Version on ${versionOrigin}: ${version.live ? "live" : "not live"} (HTTP ${version.status}, sha ${version.sha || "none"}, ${version.attempts} attempt(s))`,
  )

  let probeResults = []
  if (version.live) {
    const jobs = smokeJobs(origins)
    const attempt1 = await probeJobs(jobs)
    lines.push("", formatProbeAttempt(1, attempt1))
    const firstFailures = attempt1.filter((probe) => !probe.ok)
    const retry = retryBeforeRollback({ attempt: 1, failedCount: firstFailures.length })
    if (retry.retry) {
      lines.push(
        `- Waiting ${retry.waitMs / 1000}s, then re-probing ${firstFailures.length} failing check(s)`,
      )
      await sleep(retry.waitMs)
      const attempt2 = await probeJobs(firstFailures.map((probe) => ({ url: probe.url, kind: probe.kind })))
      lines.push("", formatProbeAttempt(2, attempt2))
      const byUrl = new Map(attempt1.map((probe) => [probe.url, probe]))
      for (const probe of attempt2) byUrl.set(probe.url, probe)
      probeResults = jobs.map((job) => byUrl.get(job.url))
    } else {
      probeResults = attempt1
      lines.push("", "### Attempt 2", "- not run; attempt 1 passed")
    }
  }

  const secondGate = retryBeforeRollback({
    attempt: probeResults.some((probe) => !probe.ok) ? 2 : 1,
    failedCount: probeResults.filter((probe) => !probe.ok).length,
  })
  const probesOk =
    version.live && probeResults.length > 0 && probeResults.every((probe) => probe.ok) && !secondGate.rollbackAllowed
  const inconclusive = probeResults.some((probe) => probe.inconclusive)
  let rollbackTargetId = null
  let targetSha = null
  let currentIsRollback = deploymentIsRollback({ description: process.env.DEPLOYMENT_DESCRIPTION || "" })
  let lookupNote = ""

  const needsLookup =
    version.live &&
    secondGate.rollbackAllowed &&
    !probesOk &&
    !inconclusive &&
    rollbackEnabled(autoRollback) &&
    !currentIsRollback &&
    token
  if (needsLookup) {
    try {
      const deployments = await listProductionDeployments({ token, teamId, projectId })
      const current = findDeploymentBySha(deployments, expectedSha)
      if (current) currentIsRollback = currentIsRollback || deploymentIsRollback(current)
      const target = current && !currentIsRollback ? selectRollbackTarget(deployments, current.id) : null
      rollbackTargetId = target?.id ?? null
      targetSha = target?.sha ?? null
      lookupNote = current
        ? `current ${current.id}; previous READY ${rollbackTargetId || "none"}`
        : "failed SHA was not in the latest production deployments"
    } catch (error) {
      lookupNote = `deployment lookup failed: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  const decision = decideRollback({
    probesOk,
    versionLive: version.live,
    autoRollback,
    rollbackTargetId,
    currentIsRollback,
    tokenPresent: Boolean(token),
    inconclusive,
  })

  lines.push(`- Decision: ${decision.reason}`)
  if (lookupNote) lines.push(`- Vercel: ${lookupNote}`)

  let restoredOk = false
  if (decision.rollback && rollbackTargetId) {
    try {
      await rollbackTo({ token, teamId, projectId, deploymentId: rollbackTargetId })
      lines.push(`- Instant rollback requested for \`${rollbackTargetId}\``)
      if (!targetSha) {
        lines.push("- Previous deployment has no git SHA; re-probe skipped")
      } else {
        const restored = await waitForSha({ origin: versionOrigin, expectedSha: targetSha, attempts, intervalMs })
        lines.push(
          `- Alias after rollback: ${restored.live ? "serving previous SHA" : "previous SHA not observed"} (${restored.sha || "none"})`,
        )
        if (restored.live) {
          const reprobes = await probeJobs(smokeJobs(origins))
          restoredOk = reprobes.every((probe) => probe.ok)
          lines.push("", formatProbeAttempt(1, reprobes).replace("### Attempt 1", "### Recheck after rollback"))
        }
      }
    } catch (error) {
      lines.push(`- Rollback API failed: ${error instanceof Error ? error.message : String(error)}`)
    }
    lines.push(
      restoredOk
        ? "- Production was restored to the previous deployment. This job still fails so the bad deploy stays visible."
        : "- Rollback did not leave a healthy production alias. Use docs/runbooks/deployment-rollback.md.",
    )
  }

  writeSummary(lines.join("\n"))
  if (decision.fail) {
    console.error(`::error::${decision.reason}`)
    process.exit(1)
  }
}

if (isDirectRun()) {
  main().catch((error) => {
    const message = error instanceof Error ? error.message : String(error)
    console.error(message)
    console.error(`::error::${message}`)
    process.exit(1)
  })
}
