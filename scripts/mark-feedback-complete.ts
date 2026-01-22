/**
 * CATALYST - Mark Feedback Complete
 *
 * Script to mark feedback items as complete for specific modules.
 * Used after implementing brief-related content fixes.
 *
 * Usage:
 *   npx tsx scripts/mark-feedback-complete.ts --modules golden-visa,area-knowledge,area-deep-dives,regulatory-framework,dubai-overview,competitive-landscape
 *   npx tsx scripts/mark-feedback-complete.ts --competency market-intelligence
 *   npx tsx scripts/mark-feedback-complete.ts --dry-run
 */

import { config } from "dotenv"

// Load environment variables from .env.local
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const modulesArg = args.find((a) => a.startsWith("--modules="))
const competencyArg = args.find((a) => a.startsWith("--competency="))

const modules = modulesArg?.replace("--modules=", "").split(",") || []
const competency = competencyArg?.replace("--competency=", "") || null

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log("\n╔══════════════════════════════════════════════════════════════╗")
  console.log("║              MARK FEEDBACK ITEMS COMPLETE                    ║")
  console.log("╚══════════════════════════════════════════════════════════════╝\n")

  console.log("📋 Configuration:")
  console.log(`   Dry run: ${dryRun ? "Yes" : "No"}`)
  if (modules.length > 0) {
    console.log(`   Target modules: ${modules.join(", ")}`)
  }
  if (competency) {
    console.log(`   Target competency: ${competency}`)
  }
  console.log()

  // Build query
  let query = supabase
    .from("lms_feedback")
    .select("*")
    .in("status", ["new", "in_progress"])
    .order("created_at", { ascending: false })

  if (competency) {
    query = query.eq("competency_slug", competency)
  }

  if (modules.length > 0) {
    query = query.in("module_slug", modules)
  }

  const { data: feedbackItems, error } = await query

  if (error) {
    console.error("❌ Error fetching feedback:", error.message)
    process.exit(1)
  }

  if (!feedbackItems || feedbackItems.length === 0) {
    console.log("✅ No pending feedback items found matching criteria")
    return
  }

  console.log(`📝 Found ${feedbackItems.length} feedback items to update:\n`)

  for (const item of feedbackItems) {
    const preview = item.text_content?.substring(0, 80) || item.quoted_text?.substring(0, 80) || "(no text)"
    console.log(`   [${item.status}] ${item.module_slug || item.competency_slug || "general"}`)
    console.log(`      "${preview}${preview.length >= 80 ? "..." : ""}"`)
    console.log()
  }

  if (dryRun) {
    console.log("🔍 Dry run - no changes made")
    return
  }

  // Update all items to complete
  const ids = feedbackItems.map((f) => f.id)

  const { error: updateError, count } = await supabase
    .from("lms_feedback")
    .update({ status: "complete", updated_at: new Date().toISOString() })
    .in("id", ids)

  if (updateError) {
    console.error("❌ Error updating feedback:", updateError.message)
    process.exit(1)
  }

  console.log(`✅ Successfully marked ${count || feedbackItems.length} feedback items as complete`)
}

main().catch(console.error)
