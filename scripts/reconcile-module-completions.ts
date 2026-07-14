/**
 * CATALYST - Reconcile module completions from passed quiz attempts
 *
 * Repairs the historical damage from the brittle quiz->module link: cases where
 * a learner PASSED a module's quiz but the module was never marked "completed"
 * (the quiz->module lookup silently returned null at submit time, so
 * markModuleComplete never fired). For every passed quiz attempt we resolve the
 * module (attempt.module_id, else quizzes.related_module -> learning_modules.slug)
 * and ensure a learning_progress row exists with status='completed'.
 *
 * Idempotent: rows already 'completed' are left untouched; completed_at is set to
 * the earliest passing attempt so history stays truthful.
 *
 * Usage:
 *   npx tsx scripts/reconcile-module-completions.ts --dry-run   # report only
 *   npx tsx scripts/reconcile-module-completions.ts             # apply
 *
 * After applying, run scripts/backfill-certificates.ts to issue certificates to
 * anyone the reconciliation pushes to 100%.
 */

import { config as loadEnv } from "dotenv"
loadEnv({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

const DRY_RUN = process.argv.includes("--dry-run")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

// Service-role client — bypasses RLS. Trusted maintenance script.
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

async function main() {
  console.log(`Reconcile module completions — ${DRY_RUN ? "DRY RUN (no writes)" : "LIVE"}\n`)

  // quiz_slug -> module_id, via quizzes.related_module = learning_modules.slug
  const { data: modules, error: modErr } = await supabase
    .from("learning_modules")
    .select("id, slug")
  if (modErr) throw modErr
  const slugToModuleId = new Map((modules || []).map((m) => [m.slug, m.id]))

  const { data: quizzes, error: qErr } = await supabase
    .from("quizzes")
    .select("slug, related_module")
  if (qErr) throw qErr
  const quizSlugToModuleId = new Map<string, string>()
  for (const q of quizzes || []) {
    const mid = q.related_module ? slugToModuleId.get(q.related_module) : undefined
    if (mid) quizSlugToModuleId.set(q.slug, mid)
  }

  // Existing progress: which (user, module) are already completed / present
  const { data: progress, error: pErr } = await supabase
    .from("learning_progress")
    .select("user_id, module_id, status")
  if (pErr) throw pErr
  const completed = new Set((progress || []).filter((p) => p.status === "completed").map((p) => `${p.user_id}:${p.module_id}`))
  const existing = new Set((progress || []).map((p) => `${p.user_id}:${p.module_id}`))

  // All passing attempts -> earliest attempted_at per (user, module)
  const { data: attempts, error: aErr } = await supabase
    .from("quiz_attempts")
    .select("user_id, quiz_slug, module_id, passed, attempted_at")
    .eq("passed", true)
  if (aErr) throw aErr

  let unresolved = 0
  const earliestPass = new Map<string, { userId: string; moduleId: string; at: string }>()
  for (const a of attempts || []) {
    const moduleId = a.module_id || (a.quiz_slug ? quizSlugToModuleId.get(a.quiz_slug) : undefined)
    if (!moduleId) {
      unresolved++
      continue
    }
    const key = `${a.user_id}:${moduleId}`
    const at = a.attempted_at || new Date().toISOString()
    const prev = earliestPass.get(key)
    if (!prev || at < prev.at) earliestPass.set(key, { userId: a.user_id, moduleId, at })
  }

  // Rows to repair: passed but not completed
  const toRepair = [...earliestPass.entries()]
    .filter(([key]) => !completed.has(key))
    .map(([key, v]) => ({ ...v, isInsert: !existing.has(key) }))

  console.log(`Passing attempts resolved to modules: ${earliestPass.size}`)
  console.log(`Unresolvable passing attempts (no module link): ${unresolved}`)
  console.log(`Module completions to repair: ${toRepair.length}\n`)

  if (toRepair.length === 0) {
    console.log("Nothing to reconcile.")
    return
  }

  // Names for a readable report
  const affectedUsers = [...new Set(toRepair.map((r) => r.userId))]
  const { data: profs } = await supabase
    .from("user_profiles")
    .select("id, full_name")
    .in("id", affectedUsers)
  const nameById = new Map((profs || []).map((p) => [p.id, p.full_name || "(no name)"]))
  const slugById = new Map((modules || []).map((m) => [m.id, m.slug]))

  const byUser = new Map<string, string[]>()
  for (const r of toRepair) {
    if (!byUser.has(r.userId)) byUser.set(r.userId, [])
    byUser.get(r.userId)!.push(slugById.get(r.moduleId) || r.moduleId)
  }
  for (const [uid, slugs] of byUser) {
    console.log(`  ${nameById.get(uid) || uid}: +${slugs.length} [${slugs.join(", ")}]`)
  }

  if (DRY_RUN) {
    console.log(`\n[dry run] Would mark ${toRepair.length} module(s) complete across ${byUser.size} user(s).`)
    return
  }

  let ok = 0
  let failed = 0
  for (const r of toRepair) {
    const { error } = await supabase.from("learning_progress").upsert(
      {
        user_id: r.userId,
        module_id: r.moduleId,
        status: "completed",
        started_at: r.at,
        completed_at: r.at,
      },
      { onConflict: "user_id,module_id", ignoreDuplicates: false }
    )
    if (error) {
      console.error(`  x ${nameById.get(r.userId)} / ${slugById.get(r.moduleId)}:`, error.message)
      failed++
    } else {
      ok++
    }
  }

  console.log(`\nDone. Reconciled: ${ok}${failed ? `, failed: ${failed}` : ""}`)
  console.log("Next: npx tsx scripts/backfill-certificates.ts --dry-run")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
