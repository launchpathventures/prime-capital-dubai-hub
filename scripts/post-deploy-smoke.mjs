/**
 * CATALYST - Post-deploy production smoke and instant rollback.
 *
 * Plain Node so the production job does not install dependencies.
 * Decision helpers are exported for unit tests. The CLI runs only when this
 * file is the process entrypoint.
 *
 * Approach follows launchpathventures/agentcrm scripts/shared-post-deploy-smoke.mjs:
 * confirm the SHA is on the production alias, probe public routes, and on
 * failure call Vercel's instant rollback to the deployment that was serving production before.
 */

import { appendFileSync, realpathSync } from "node:fs"
import { pathToFileURL } from "node:url"

export const PRODUCTION_ORIGIN = "https://primecapitaldubai.com"
export const WWW_ORIGIN = "https://www.primecapitaldubai.com"
/** Partner brand served by the same Vercel project (proxy.ts maps the host to the /tahir surface). The apex redirects to www. */
export const TAHIR_ORIGIN = "https://tahirmajithia.com"
export const TAHIR_WWW_ORIGIN = "https://www.tahirmajithia.com"

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

/**
 * Tahir routes are rewritten to /tahir/*, so /properties and /team do not exist
 * on that host. /api/health is shared and answers on every host.
 */
export const TAHIR_SMOKE_PATHS = [
  { path: "/api/health", kind: "health" },
  { path: "/", kind: "page" },
  { path: "/about", kind: "page" },
  { path: "/contact", kind: "page" },
  { path: "/services", kind: "page" },
]

const ON_VALUES = new Set(["1", "true", "on", "yes", "enabled"])
const USER_AGENT = "PrimeCapitalSmoke/1.0 (+https://www.primecapitaldubai.com)"

/** One quiet period so a brief Supabase 503 does not move production. */
export const PROBE_RETRY_WAIT_MS = 45_000

/** Opt-in: rollback runs only when AUTO_ROLLBACK is explicitly turned on. */
export function rollbackEnabled(value) {
  if (value == null) return false
  return ON_VALUES.has(String(value).trim().toLowerCase())
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
    commitMessage: meta.githubCommitMessage || "",
    // Vercel reports false/absent when a deployment cannot be rolled back to.
    rollbackCandidate: raw?.isRollbackCandidate,
    // Time the production domains were last pointed at this deployment.
    servedAt: typeof raw?.aliasAssigned === "number" ? raw.aliasAssigned : null,
    neverServed: raw?.aliasAssigned === false || raw?.aliasAssigned === null,
  }
}

/** When the deployment started serving production, falling back to creation time. */
function servingSince(deployment) {
  return deployment.servedAt ?? deployment.created
}

function isProductionReady(deployment) {
  if (!deployment.ready || !deployment.id) return false
  return deployment.target == null || deployment.target === "production"
}

/**
 * The rollback target is the deployment that was serving production before the
 * current one: READY production, served the domains, not itself a rollback, and
 * serving before the current deployment did. Returns { target, reason }.
 *
 * Fails closed (target null) when the choice cannot be verified:
 * - Vercel does not document whether a rollback refreshes `aliasAssigned`, so if
 *   ordering by serving time disagrees with ordering by creation time, a
 *   deployment in the window may have been rolled away from and the "previous"
 *   one is ambiguous.
 * - the best candidate is not a rollback candidate per Vercel, or has no git SHA
 *   to confirm the restore with. Older deployments are never skipped to.
 */
export function selectRollbackTarget(deployments, currentId) {
  const all = deployments.map(normalizeDeployment)
  const current = all.find((deployment) => deployment.id === currentId)
  if (!current) return { target: null, reason: "current deployment not found in the latest production deployments" }
  const currentSince = servingSince(current)
  const served = all
    .filter(isProductionReady)
    .filter((deployment) => deployment.id !== currentId)
    .filter((deployment) => !deployment.neverServed)
    .filter((deployment) => !deploymentIsRollback(deployment))
    .filter((deployment) => servingSince(deployment) < currentSince)
  if (served.length === 0) return { target: null, reason: "no previous READY production deployment" }
  const byServed = [...served].sort(
    (left, right) => servingSince(right) - servingSince(left) || right.created - left.created,
  )
  const byCreated = [...served].sort((left, right) => right.created - left.created)
  const target = byServed[0]
  if (target.id !== byCreated[0].id) {
    return {
      target: null,
      reason: "previous deployment is ambiguous (a deployment in the window may have been rolled away from)",
    }
  }
  if (shaMatches(target.sha, current.sha)) {
    return { target: null, reason: `previous deployment ${target.id} is the same commit as the failing one` }
  }
  if (target.rollbackCandidate !== true) {
    return { target: null, reason: `previous deployment ${target.id} is not reported as a rollback candidate` }
  }
  if (!target.sha) {
    return { target: null, reason: `previous deployment ${target.id} has no git SHA to verify the restore` }
  }
  return { target, reason: "" }
}

/**
 * Did the target's own post-deploy smoke run pass? Judged from the workflow runs
 * GitHub recorded for the target's SHA, so it does not depend on how Vercel
 * orders deployments after a rollback: a deploy that failed smoke and was
 * rolled away from stays "failed" however Vercel timestamps it.
 * Only the latest completed pass/fail run counts (skipped preview runs and
 * cancelled runs are ignored). No such run means "unknown", which also refuses.
 *
 * @param {Array<{ conclusion?: string | null, created_at?: string, run_started_at?: string }> | undefined} runs
 * @returns {"passed" | "failed" | "unknown"}
 */
export function classifySmokeRuns(runs) {
  const decided = (runs || [])
    .filter((run) => ["success", "failure", "timed_out"].includes(String(run?.conclusion)))
    .sort(
      (left, right) =>
        Date.parse(right.created_at || right.run_started_at || 0) - Date.parse(left.created_at || left.run_started_at || 0),
    )
  if (decided.length === 0) return "unknown"
  return decided[0].conclusion === "success" ? "passed" : "failed"
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
  // Description only: a commit message is author text and must not switch rollback off.
  return /rolled back|instant rollback|auto rollback/i.test(deployment.description || "")
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
 * @param {boolean} [input.healthOnlyFailure] only /api/health failed; every page probe passed
 * @param {boolean} [input.superseded] the live SHA is no longer the one this job is judging
 * @param {boolean} [input.liveShaUnknown] the live SHA could not be re-read (network error, no SHA reported)
 * @param {string} [input.targetNote] why no target was chosen
 */
export function decideRollback({
  probesOk,
  versionLive,
  autoRollback,
  rollbackTargetId,
  currentIsRollback,
  tokenPresent,
  inconclusive = false,
  healthOnlyFailure = false,
  superseded = false,
  liveShaUnknown = false,
  targetNote = "",
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
  if (liveShaUnknown) {
    return {
      rollback: false,
      fail: true,
      reason: "could not re-check the live SHA (network error or no SHA reported); not rolling back",
    }
  }
  if (superseded) {
    return {
      rollback: false,
      fail: true,
      reason: "a different deployment is live now; not rolling back (it is not the one this job judged)",
    }
  }
  if (inconclusive) {
    return {
      rollback: false,
      fail: true,
      reason: "smoke was inconclusive (bot challenge or incomplete response); not rolling back",
    }
  }
  if (healthOnlyFailure) {
    return {
      rollback: false,
      fail: true,
      reason:
        "only /api/health failed and every page probe passed (likely a dependency outage); not rolling back",
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
    return { rollback: false, fail: true, reason: "AUTO_ROLLBACK is not enabled; rollback is opt-in" }
  }
  if (!tokenPresent) {
    return { rollback: false, fail: true, reason: "VERCEL_TOKEN is not set; cannot roll back" }
  }
  if (!rollbackTargetId) {
    return {
      rollback: false,
      fail: true,
      reason: targetNote
        ? `no verified rollback target: ${targetNote}`
        : "no previous READY production deployment to roll back to",
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

/**
 * Bot challenge pages, not the app. The body match is anchored to the <title>
 * (or Cloudflare's verification script) so ordinary page copy containing
 * "just a moment" cannot turn a real failure into an inconclusive result.
 */
export function isChallenge(response, body) {
  if (response.headers?.get?.("x-vercel-mitigated")) return true
  if (response.headers?.get?.("cf-mitigated")) return true
  return /<title>\s*(?:just a moment|vercel security checkpoint)|cf-browser-verification/i.test(body)
}

export async function probeOnce(url, kind) {
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
      detail: sanitizeForLog(parsed?.status || body, 160),
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

/** @param {Array<{ origins: string[], paths: Array<{ path: string, kind: string }> }>} surfaces */
export function smokeJobs(surfaces) {
  return surfaces.flatMap(({ origins, paths }) =>
    origins.flatMap((origin) => paths.map((spec) => ({ url: new URL(spec.path, origin).href, kind: spec.kind }))),
  )
}

function parseOrigins(value) {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
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
        detail: sanitizeForLog(error instanceof Error ? error.message : error, 180),
      })),
    ),
  )
}

async function waitForSha({ origin, expectedSha, attempts, intervalMs }) {
  /** @type {{ status: number, sha: string | null, detail: string }} */
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
      last = { status: response.status, sha: sha == null ? null : sanitizeForLog(sha, 64), detail: sanitizeForLog(body, 180) }
      if (shaMatches(sha, expectedSha)) return { live: true, attempts: attempt, ...last }
    } catch (error) {
      last = { status: 0, sha: null, detail: sanitizeForLog(error instanceof Error ? error.message : error, 180) }
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

/** Read-only GitHub call using the job's GITHUB_TOKEN. Any problem is "unknown", never "passed". */
export async function targetSmokeStatus({ sha, env }) {
  const repository = env.GITHUB_REPOSITORY
  const githubToken = env.GITHUB_TOKEN
  if (!repository || !githubToken || !sha) return "unknown"
  try {
    const url = new URL(`https://api.github.com/repos/${repository}/actions/workflows/post-deploy-smoke.yml/runs`)
    url.searchParams.set("head_sha", sha)
    url.searchParams.set("per_page", "50")
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20000),
      headers: {
        authorization: `Bearer ${githubToken}`,
        accept: "application/vnd.github+json",
        "user-agent": USER_AGENT,
      },
    })
    if (!response.ok) return "unknown"
    const json = await response.json()
    return classifySmokeRuns(json.workflow_runs)
  } catch {
    return "unknown"
  }
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

/** True when the only failures are /api/health and every page probe passed. */
export function isHealthOnlyFailure(probes) {
  const failed = probes.filter((probe) => !probe.ok)
  const pages = probes.filter((probe) => probe.kind !== "health")
  return failed.length > 0 && failed.every((probe) => probe.kind === "health") && pages.every((probe) => probe.ok)
}

/**
 * External text (commit messages, response bodies, API errors) goes into the job
 * log and summary. A lone CR could start a workflow command, and markdown or
 * HTML characters would format the summary, so keep one plain line.
 */
export function sanitizeForLog(value, max = 100) {
  return String(value ?? "")
    .split(/[\r\n\u2028\u2029]/)[0]
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[`<>|\[\]()*_#@&\\]/g, "'")
    .slice(0, max)
}

function describeTarget(target) {
  const message = sanitizeForLog(target.commitMessage)
  return `\`${target.id}\`, sha \`${target.sha}\`${message ? `, "${message}"` : ""}`
}

const defaultDeps = {
  waitForSha,
  probeJobs,
  listProductionDeployments,
  rollbackTo,
  targetSmokeStatus,
  sleep,
}

/**
 * Runs the whole check. Returns { fail, lines, rolledBack } so tests can drive it
 * with fake dependencies; the CLI writes the summary and sets the exit code.
 */
export async function runSmoke(env, deps = defaultDeps) {
  const expectedSha = env.EXPECTED_SHA || ""
  if (!expectedSha) throw new Error("EXPECTED_SHA is required")

  const origins = parseOrigins(env.SMOKE_ORIGINS || `${PRODUCTION_ORIGIN},${WWW_ORIGIN}`)
  // Same deployment serves both brands, so a rollback moves both; an explicit empty value turns Tahir probes off.
  const tahirOrigins = parseOrigins(env.SMOKE_TAHIR_ORIGINS ?? `${TAHIR_ORIGIN},${TAHIR_WWW_ORIGIN}`)
  const surfaces = [
    { origins, paths: SMOKE_PATHS },
    { origins: tahirOrigins, paths: TAHIR_SMOKE_PATHS },
  ]
  const versionOrigin = origins[0]
  const attempts = Number(env.VERSION_ATTEMPTS || 12)
  const intervalMs = Number(env.VERSION_INTERVAL_MS || 5000)
  const autoRollback = env.AUTO_ROLLBACK
  const token = env.VERCEL_TOKEN || ""
  const teamId = env.VERCEL_TEAM_ID || DEFAULT_TEAM_ID
  const projectId = env.VERCEL_PROJECT_ID || DEFAULT_PROJECT_ID

  const lines = [
    "## Post-deploy smoke",
    "",
    `- Expected SHA: \`${expectedSha}\``,
    `- Origins: ${[...origins, ...tahirOrigins].join(", ")}`,
    `- Rollback: ${rollbackEnabled(autoRollback) ? "on" : "off"} (\`AUTO_ROLLBACK\`, opt-in)`,
  ]

  const version = await deps.waitForSha({ origin: versionOrigin, expectedSha, attempts, intervalMs })
  lines.push(
    `- Version on ${versionOrigin}: ${version.live ? "live" : "not live"} (HTTP ${version.status}, sha ${version.sha || "none"}, ${version.attempts} attempt(s))`,
  )

  // A newer deploy may go live while this job waits; it must never be rolled back for this job's SHA.
  // Returns "same", "superseded" (another SHA answered) or "unknown" (no usable answer).
  const recheckLiveSha = async (when) => {
    const check = await deps.waitForSha({ origin: versionOrigin, expectedSha, attempts: 1, intervalMs })
    if (check.live) return "same"
    if (check.sha) {
      lines.push(`- Live SHA is no longer the expected one ${when} (now ${check.sha})`)
      return "superseded"
    }
    lines.push(
      `- Could not re-read the live SHA ${when} (HTTP ${check.status}, ${check.detail || "no detail"}); treating it as unknown, not as superseded`,
    )
    return "unknown"
  }

  let probeResults = []
  let superseded = false
  let liveShaUnknown = false
  if (version.live) {
    const jobs = smokeJobs(surfaces)
    const attempt1 = await deps.probeJobs(jobs)
    lines.push("", formatProbeAttempt(1, attempt1))
    const firstFailures = attempt1.filter((probe) => !probe.ok)
    const retry = retryBeforeRollback({ attempt: 1, failedCount: firstFailures.length })
    if (retry.retry) {
      lines.push(
        `- Waiting ${retry.waitMs / 1000}s, then re-probing ${firstFailures.length} failing check(s)`,
      )
      await deps.sleep(retry.waitMs)
      const live = await recheckLiveSha("before attempt 2")
      if (live === "same") {
        const attempt2 = await deps.probeJobs(firstFailures.map((probe) => ({ url: probe.url, kind: probe.kind })))
        lines.push("", formatProbeAttempt(2, attempt2))
        const byUrl = new Map(attempt1.map((probe) => [probe.url, probe]))
        for (const probe of attempt2) byUrl.set(probe.url, probe)
        probeResults = jobs.map((job) => byUrl.get(job.url))
      } else {
        superseded = live === "superseded"
        liveShaUnknown = live === "unknown"
        probeResults = attempt1
      }
    } else {
      probeResults = attempt1
      lines.push("", "### Attempt 2", "- not run; attempt 1 passed")
    }
  }

  const secondGate = retryBeforeRollback({
    attempt: probeResults.some((probe) => !probe.ok) ? 2 : 1,
    failedCount: probeResults.filter((probe) => !probe.ok).length,
  })
  // probeResults stays empty unless the new SHA went live, so this also covers versionLive.
  const probesOk = probeResults.length > 0 && probeResults.every((probe) => probe.ok)
  const inconclusive = probeResults.some((probe) => probe.inconclusive)
  const healthOnlyFailure = isHealthOnlyFailure(probeResults)
  let rollbackTargetId = null
  let targetSha = null
  let targetNote = ""
  let currentIsRollback = deploymentIsRollback({ description: env.DEPLOYMENT_DESCRIPTION || "" })
  let lookupNote = ""

  // The lookup is read-only, so it also runs while rollback is off to show what it would have done.
  const needsLookup =
    version.live &&
    !superseded &&
    !liveShaUnknown &&
    secondGate.rollbackAllowed &&
    !probesOk &&
    !inconclusive &&
    !healthOnlyFailure &&
    !currentIsRollback &&
    token
  if (needsLookup) {
    try {
      const deployments = await deps.listProductionDeployments({ token, teamId, projectId })
      const current = findDeploymentBySha(deployments, expectedSha)
      if (current) currentIsRollback = currentIsRollback || deploymentIsRollback(current)
      if (!current) {
        targetNote = "failed SHA was not in the latest production deployments"
        lookupNote = targetNote
      } else if (!currentIsRollback) {
        let { target, reason } = selectRollbackTarget(deployments, current.id)
        if (target) {
          // Second, independent check: the target's own smoke run must have passed.
          const smoke = await deps.targetSmokeStatus({ sha: target.sha, env })
          if (smoke !== "passed") {
            reason =
              smoke === "failed"
                ? `previous deployment ${target.id} failed its own post-deploy smoke run`
                : `previous deployment ${target.id} has no passing post-deploy smoke run on record (none found or GitHub unavailable)`
            target = null
          }
        }
        rollbackTargetId = target?.id ?? null
        targetSha = target?.sha ?? null
        targetNote = reason
        lookupNote = target
          ? `current \`${current.id}\`; rollback target ${describeTarget(target)}; its own smoke run passed`
          : `current \`${current.id}\`; no verified rollback target (${reason})`
      }
    } catch (error) {
      targetNote = "deployment lookup failed"
      lookupNote = `deployment lookup failed: ${sanitizeForLog(error instanceof Error ? error.message : error, 200)}`
    }
    // Last check before acting: only roll back while the SHA this job judged is still live.
    if (rollbackTargetId && rollbackEnabled(autoRollback)) {
      const live = await recheckLiveSha("before rollback")
      superseded = live === "superseded"
      liveShaUnknown = live === "unknown"
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
    healthOnlyFailure,
    superseded,
    liveShaUnknown,
    targetNote,
  })

  lines.push(`- Decision: ${decision.reason}`)
  if (lookupNote) lines.push(`- Vercel: ${lookupNote}`)

  let restoredOk = false
  let rolledBack = false
  if (decision.rollback && rollbackTargetId) {
    try {
      await deps.rollbackTo({ token, teamId, projectId, deploymentId: rollbackTargetId })
      rolledBack = true
      lines.push(`- Instant rollback requested for \`${rollbackTargetId}\` (sha \`${targetSha}\`)`)
      const restored = await deps.waitForSha({ origin: versionOrigin, expectedSha: targetSha, attempts, intervalMs })
      lines.push(
        `- Alias after rollback: ${restored.live ? "serving previous SHA" : "previous SHA not observed"} (${restored.sha || "none"})`,
      )
      if (restored.live) {
        const reprobes = await deps.probeJobs(smokeJobs(surfaces))
        restoredOk = reprobes.every((probe) => probe.ok)
        lines.push("", formatProbeAttempt(1, reprobes).replace("### Attempt 1", "### Recheck after rollback"))
      }
    } catch (error) {
      lines.push(`- Rollback API failed: ${sanitizeForLog(error instanceof Error ? error.message : error, 200)}`)
    }
    lines.push(
      restoredOk
        ? "- Production was restored to the previous deployment. This job still fails so the bad deploy stays visible."
        : "- Rollback did not leave a healthy production alias. Use docs/runbooks/deployment-rollback.md.",
    )
  }

  return { fail: decision.fail, reason: decision.reason, lines, rolledBack }
}

async function main() {
  const result = await runSmoke(process.env)
  writeSummary(result.lines.join("\n"))
  if (result.fail) {
    console.error(`::error::${result.reason}`)
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
