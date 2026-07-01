/**
 * CATALYST - Backfill completion certificates
 *
 * One-off catch-up for learners who finished all modules BEFORE auto-issue
 * (#222) shipped and never re-triggered a completion event. Finds everyone who
 * currently meets the eligibility criteria, has no active certificate, and
 * issues one — mirroring lib/actions/certificate.ts exactly (idempotent,
 * one active cert per user, same certificate_id RPC and columns).
 *
 * Usage: npx tsx scripts/backfill-certificates.ts [flags]
 *
 * Flags:
 *   --dry-run        Report who WOULD be issued, write nothing (default: off)
 *   --send-emails    Also fire the Zapier "certificate_issued" webhook per new
 *                    cert (sends the learner their certificate email).
 *                    Off by default so the DB backfill and the email blast are
 *                    separate, deliberate steps.
 *
 * Recommended run order:
 *   1. npx tsx scripts/backfill-certificates.ts --dry-run   # review the list
 *   2. npx tsx scripts/backfill-certificates.ts             # issue, no emails
 *   3. npx tsx scripts/backfill-certificates.ts --send-emails  # (optional) notify
 *      — step 3 is idempotent: it skips users who already have a cert, so it
 *        will NOT re-issue. To email people issued in step 2 you must send in
 *        the same run. See note printed at the end.
 */

import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const DRY_RUN = process.argv.includes("--dry-run")
const SEND_EMAILS = process.argv.includes("--send-emails")

const COURSE_NAME = "Prime Capital Consultant Training Programme"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const APP_NAME = "Prime Capital Dubai"
const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables:")
  console.error("- NEXT_PUBLIC_SUPABASE_URL")
  console.error("- SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// Service-role client — bypasses RLS. This is a trusted maintenance script.
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

async function fireCertificateWebhook(payload: {
  learnerName: string
  learnerEmail: string | null
  certificateId: string
  modulesCompleted: number
  quizzesPassed: number
}) {
  if (!ZAPIER_WEBHOOK_URL) {
    console.warn("  ! ZAPIER_WEBHOOK_URL not set — skipping email webhook")
    return
  }
  const body = {
    event: "certificate_issued",
    timestamp: new Date().toISOString(),
    learnerName: payload.learnerName,
    learnerEmail: payload.learnerEmail,
    recipientEmail: payload.learnerEmail,
    certificateId: payload.certificateId,
    certificateUrl: `${APP_URL}/certificate/${payload.certificateId}`,
    certificatePdfUrl: `${APP_URL}/api/certificate/${payload.certificateId}/pdf`,
    modulesCompleted: payload.modulesCompleted,
    quizzesPassed: payload.quizzesPassed,
    courseName: COURSE_NAME,
    emailSubject: `Your ${APP_NAME} completion certificate is ready`,
  }
  try {
    await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error(`  ! Webhook failed for ${payload.certificateId}:`, error)
  }
}

async function main() {
  console.log(
    `Backfill certificates — ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE"}${
      SEND_EMAILS ? ", emails ON" : ", emails OFF"
    }\n`
  )

  // --- Total modules (the bar every learner must clear) ---
  const { count: totalModules, error: modErr } = await supabase
    .from("learning_modules")
    .select("*", { count: "exact", head: true })
  if (modErr) throw modErr
  if (!totalModules || totalModules === 0) {
    console.error("No learning_modules found — aborting (would issue to nobody).")
    process.exit(1)
  }
  console.log(`Total modules to complete: ${totalModules}\n`)

  // --- Every user with at least one completed module ---
  const { data: progressRows, error: progErr } = await supabase
    .from("learning_progress")
    .select("user_id")
    .eq("status", "completed")
  if (progErr) throw progErr

  const completedByUser = new Map<string, number>()
  for (const row of progressRows || []) {
    completedByUser.set(row.user_id, (completedByUser.get(row.user_id) || 0) + 1)
  }

  const eligibleUserIds = Array.from(completedByUser.entries())
    .filter(([, n]) => n >= totalModules)
    .map(([id]) => id)

  console.log(
    `${completedByUser.size} users have progress; ${eligibleUserIds.length} meet the completion bar.\n`
  )

  // --- Users who already hold an active certificate (skip them) ---
  const { data: activeCerts, error: certErr } = await supabase
    .from("completion_certificates")
    .select("user_id")
    .is("revoked_at", null)
  if (certErr) throw certErr
  const alreadyIssued = new Set((activeCerts || []).map((c) => c.user_id))

  const toIssue = eligibleUserIds.filter((id) => !alreadyIssued.has(id))
  console.log(
    `${alreadyIssued.size} already have an active certificate. ${toIssue.length} to issue.\n`
  )

  if (toIssue.length === 0) {
    console.log("Nothing to do.")
    return
  }

  let issued = 0
  let failed = 0

  for (const userId of toIssue) {
    // Profile (name) + email from auth, matching the server action's payload.
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("full_name")
      .eq("id", userId)
      .single()
    const fullName = profile?.full_name || "Unknown"

    const { data: authUser } = await supabase.auth.admin.getUserById(userId)
    const email = authUser?.user?.email ?? null

    // Quizzes passed — deduped by quiz_slug or module_id (mirrors eligibility check).
    const { data: passedAttempts } = await supabase
      .from("quiz_attempts")
      .select("quiz_slug, module_id")
      .eq("user_id", userId)
      .eq("passed", true)
    const passedSet = new Set<string>()
    for (const a of passedAttempts || []) {
      const key = a.quiz_slug || a.module_id
      if (key) passedSet.add(key)
    }
    const quizzesPassed = passedSet.size
    const modulesCompleted = completedByUser.get(userId) || 0

    if (DRY_RUN) {
      console.log(
        `  [dry] ${fullName} <${email ?? "no-email"}> — ${modulesCompleted}/${totalModules} modules, ${quizzesPassed} quizzes`
      )
      issued++
      continue
    }

    // Generate the human-readable ID via the same RPC the app uses.
    const { data: certificateId, error: seqError } = await supabase.rpc(
      "generate_certificate_id"
    )
    if (seqError || !certificateId) {
      console.error(`  x ${fullName}: failed to generate certificate ID`, seqError)
      failed++
      continue
    }

    const { error: insertError } = await supabase
      .from("completion_certificates")
      .insert({
        certificate_id: certificateId,
        user_id: userId,
        modules_completed: modulesCompleted,
        quizzes_passed: quizzesPassed,
        course_name: COURSE_NAME,
      })

    if (insertError) {
      // 23505 = raced against another issue path; treat as already-done.
      if (insertError.code === "23505") {
        console.log(`  = ${fullName}: already issued (race) — skipped`)
      } else {
        console.error(`  x ${fullName}: insert failed`, insertError)
        failed++
      }
      continue
    }

    console.log(`  + ${fullName} <${email ?? "no-email"}> — ${certificateId}`)
    issued++

    if (SEND_EMAILS) {
      await fireCertificateWebhook({
        learnerName: fullName,
        learnerEmail: email,
        certificateId,
        modulesCompleted,
        quizzesPassed,
      })
    }
  }

  console.log(
    `\nDone. ${DRY_RUN ? "Would issue" : "Issued"}: ${issued}${
      failed ? `, failed: ${failed}` : ""
    }`
  )
  if (!DRY_RUN && !SEND_EMAILS && issued > 0) {
    console.log(
      "\nNote: certificates were created but NO emails were sent (--send-emails off).\n" +
        "This run already marked these users as issued, so re-running with --send-emails\n" +
        "will skip them. To notify learners, send from the admin certificate dashboard,\n" +
        "or re-run the whole backfill with --send-emails on a fresh set."
    )
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
