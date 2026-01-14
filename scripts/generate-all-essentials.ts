#!/usr/bin/env npx tsx
/**
 * CATALYST - Generate All Essentials CLI
 *
 * Generates AI-extracted essentials for all learning modules.
 * Uses Claude to create pedagogically-structured summaries.
 *
 * Usage:
 *   npx tsx scripts/generate-all-essentials.ts           # Generate all missing
 *   npx tsx scripts/generate-all-essentials.ts --force   # Regenerate all
 *   npx tsx scripts/generate-all-essentials.ts --module dubai-overview  # Single module
 *   npx tsx scripts/generate-all-essentials.ts --competency market-intelligence  # All in competency
 *   npx tsx scripts/generate-all-essentials.ts --dry-run # Preview without saving
 *   pnpm generate:essentials
 *
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ANTHROPIC_API_KEY
 */

import { createClient } from "@supabase/supabase-js"
import Anthropic from "@anthropic-ai/sdk"
import { config } from "dotenv"
import {
  ESSENTIALS_PROMPT_VERSION,
  hashContent,
  buildEssentialsPrompt,
  parseEssentialsResponse,
} from "../lib/lms/essentials"

// Load environment variables
config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const anthropicKey = process.env.ANTHROPIC_API_KEY!

// =============================================================================
// CONFIGURATION
// =============================================================================

/** Delay between API calls to avoid rate limits (ms) */
const API_DELAY_MS = 2000

/** Maximum retries per module */
const MAX_RETRIES = 3

// =============================================================================
// TYPES
// =============================================================================

interface ModuleWithCompetency {
  id: string
  slug: string
  title: string
  type: string
  content: string | null
  module_number: string | null
  estimated_duration: string | null
  frontmatter: Record<string, unknown> | null
  essentials: unknown | null
  essentials_source_hash: string | null
  competency_id: string
  competencies: {
    id: string
    slug: string
    name: string
    description: string | null
  } | null
}

interface AudioTranscript {
  slug: string
  title: string
  duration: string | null
  type: string
}

interface GenerationResult {
  success: boolean
  moduleSlug: string
  moduleTitle: string
  error?: string
  tokensUsed?: { input: number; output: number }
  timeMs?: number
}

// =============================================================================
// CLI ARGUMENT PARSING
// =============================================================================

function parseArgs(): {
  force: boolean
  dryRun: boolean
  moduleSlug?: string
  competencySlug?: string
} {
  const args = process.argv.slice(2)
  const result = {
    force: false,
    dryRun: false,
    moduleSlug: undefined as string | undefined,
    competencySlug: undefined as string | undefined,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--force":
      case "-f":
        result.force = true
        break
      case "--dry-run":
      case "-d":
        result.dryRun = true
        break
      case "--module":
      case "-m":
        result.moduleSlug = args[++i]
        break
      case "--competency":
      case "-c":
        result.competencySlug = args[++i]
        break
      case "--help":
      case "-h":
        console.log(`
Generate AI Essentials for Learning Modules

Usage:
  npx tsx scripts/generate-all-essentials.ts [options]

Options:
  --force, -f              Regenerate all, even if essentials exist
  --dry-run, -d            Preview what would be generated (no API calls)
  --module, -m <slug>      Generate for a specific module only
  --competency, -c <slug>  Generate for all modules in a competency
  --help, -h               Show this help message

Examples:
  npx tsx scripts/generate-all-essentials.ts                    # Generate all missing
  npx tsx scripts/generate-all-essentials.ts --force            # Regenerate everything
  npx tsx scripts/generate-all-essentials.ts -m dubai-overview  # Single module
  npx tsx scripts/generate-all-essentials.ts -c foundations     # All foundations modules
  npx tsx scripts/generate-all-essentials.ts --dry-run          # Preview only
`)
        process.exit(0)
    }
  }

  return result
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

// =============================================================================
// MAIN GENERATION LOGIC
// =============================================================================

async function generateEssentialsForModule(
  supabase: ReturnType<typeof createClient>,
  anthropic: Anthropic,
  module: ModuleWithCompetency,
  audioTranscripts: AudioTranscript[],
  dryRun: boolean
): Promise<GenerationResult> {
  const startTime = Date.now()

  try {
    // Skip if no content
    if (!module.content) {
      return {
        success: false,
        moduleSlug: module.slug,
        moduleTitle: module.title,
        error: "No content available",
      }
    }

    const competency = module.competencies

    // Build the prompt
    const { systemPrompt, userPrompt } = buildEssentialsPrompt({
      module: {
        title: module.title,
        type: module.type,
        content: module.content,
        estimated_duration: module.estimated_duration,
        frontmatter: module.frontmatter,
      },
      competency: {
        name: competency?.name || "Unknown",
        description: competency?.description || null,
      },
      audioTranscripts: audioTranscripts.map((a) => ({
        slug: a.slug,
        title: a.title,
        duration: a.duration || "unknown",
        type: a.type,
      })),
      requiredFacts: [], // Could be enhanced to extract from content
    })

    if (dryRun) {
      return {
        success: true,
        moduleSlug: module.slug,
        moduleTitle: module.title,
        timeMs: Date.now() - startTime,
      }
    }

    // Call Claude API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    // Parse response
    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from AI")
    }

    const essentials = parseEssentialsResponse(content.text)
    const sourceHash = hashContent(module.content)

    // Add metadata
    essentials.generatedAt = new Date().toISOString()
    essentials.sourceHash = sourceHash
    essentials.promptVersion = ESSENTIALS_PROMPT_VERSION

    // Save to database
    const { error: updateError } = await supabase
      .from("learning_modules")
      .update({
        essentials,
        essentials_generated_at: new Date().toISOString(),
        essentials_source_hash: sourceHash,
        essentials_prompt_version: ESSENTIALS_PROMPT_VERSION,
      })
      .eq("id", module.id)

    if (updateError) {
      throw new Error(`Database update failed: ${updateError.message}`)
    }

    return {
      success: true,
      moduleSlug: module.slug,
      moduleTitle: module.title,
      tokensUsed: {
        input: response.usage.input_tokens,
        output: response.usage.output_tokens,
      },
      timeMs: Date.now() - startTime,
    }
  } catch (error) {
    return {
      success: false,
      moduleSlug: module.slug,
      moduleTitle: module.title,
      error: error instanceof Error ? error.message : String(error),
      timeMs: Date.now() - startTime,
    }
  }
}

async function main() {
  const args = parseArgs()
  const startTime = Date.now()

  console.log("\n╔══════════════════════════════════════════════════════════════╗")
  console.log("║           GENERATE ESSENTIALS FOR LEARNING MODULES           ║")
  console.log("╚══════════════════════════════════════════════════════════════╝\n")

  // Validate environment
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials. Check .env.local")
    process.exit(1)
  }

  if (!args.dryRun && !anthropicKey) {
    console.error("❌ Missing ANTHROPIC_API_KEY. Check .env.local")
    process.exit(1)
  }

  // Display config
  console.log("📋 Configuration:")
  console.log(`   Force regenerate: ${args.force ? "Yes" : "No"}`)
  console.log(`   Dry run: ${args.dryRun ? "Yes" : "No"}`)
  if (args.moduleSlug) console.log(`   Target module: ${args.moduleSlug}`)
  if (args.competencySlug) console.log(`   Target competency: ${args.competencySlug}`)
  console.log("")

  // Initialize clients
  const supabase = createClient(supabaseUrl, supabaseKey)
  const anthropic = args.dryRun ? (null as unknown as Anthropic) : new Anthropic({ apiKey: anthropicKey })

  // Build query for modules
  let query = supabase
    .from("learning_modules")
    .select(
      `
      id,
      slug,
      title,
      type,
      content,
      module_number,
      estimated_duration,
      frontmatter,
      essentials,
      essentials_source_hash,
      competency_id,
      competencies (
        id,
        slug,
        name,
        description
      )
    `
    )
    .order("module_number", { ascending: true })

  // Apply filters
  if (args.moduleSlug) {
    query = query.eq("slug", args.moduleSlug)
  }

  if (args.competencySlug) {
    // First get the competency ID
    const { data: comp } = await supabase
      .from("competencies")
      .select("id")
      .eq("slug", args.competencySlug)
      .single()

    if (!comp) {
      console.error(`❌ Competency not found: ${args.competencySlug}`)
      process.exit(1)
    }
    query = query.eq("competency_id", comp.id)
  }

  // Fetch modules
  const { data: modules, error: fetchError } = await query

  if (fetchError) {
    console.error("❌ Failed to fetch modules:", fetchError)
    process.exit(1)
  }

  if (!modules || modules.length === 0) {
    console.log("⚠️ No modules found matching criteria")
    process.exit(0)
  }

  // Filter to only modules needing generation
  const modulesToProcess = (modules as ModuleWithCompetency[]).filter((m) => {
    if (args.force) return true
    return m.essentials === null
  })

  console.log(`📚 Found ${modules.length} modules total`)
  console.log(`🎯 Modules to process: ${modulesToProcess.length}`)
  if (!args.force && modules.length !== modulesToProcess.length) {
    console.log(`   (Skipping ${modules.length - modulesToProcess.length} with existing essentials)`)
  }
  console.log("")

  if (modulesToProcess.length === 0) {
    console.log("✅ All modules already have essentials!")
    console.log("   Use --force to regenerate")
    process.exit(0)
  }

  // Pre-fetch all audio transcripts
  console.log("🎧 Fetching audio transcripts...")
  const { data: allAudio } = await supabase.from("audio_transcripts").select("module_id, slug, title, duration, type")

  const audioByModule = new Map<string, AudioTranscript[]>()
  for (const audio of allAudio || []) {
    if (audio.module_id) {
      const existing = audioByModule.get(audio.module_id) || []
      existing.push(audio)
      audioByModule.set(audio.module_id, existing)
    }
  }
  console.log(`   Found ${allAudio?.length || 0} audio transcripts\n`)

  // Process modules
  console.log("═══════════════════════════════════════════════════════════════")
  console.log("                    GENERATING ESSENTIALS")
  console.log("═══════════════════════════════════════════════════════════════\n")

  const results: GenerationResult[] = []
  let totalTokensIn = 0
  let totalTokensOut = 0

  for (let i = 0; i < modulesToProcess.length; i++) {
    const module = modulesToProcess[i]
    const progress = `[${i + 1}/${modulesToProcess.length}]`
    const moduleNum = module.module_number || "?"

    process.stdout.write(`${progress} ${moduleNum} ${module.title}... `)

    const audio = audioByModule.get(module.id) || []

    // Retry logic
    let result: GenerationResult | null = null
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      result = await generateEssentialsForModule(supabase, anthropic, module, audio, args.dryRun)

      if (result.success) break

      if (attempt < MAX_RETRIES) {
        process.stdout.write(`retry ${attempt + 1}... `)
        await sleep(API_DELAY_MS * 2)
      }
    }

    if (!result) {
      result = {
        success: false,
        moduleSlug: module.slug,
        moduleTitle: module.title,
        error: "Max retries exceeded",
      }
    }

    results.push(result)

    if (result.success) {
      if (result.tokensUsed) {
        totalTokensIn += result.tokensUsed.input
        totalTokensOut += result.tokensUsed.output
        console.log(`✅ (${formatDuration(result.timeMs || 0)}, ${result.tokensUsed.input + result.tokensUsed.output} tokens)`)
      } else {
        console.log(`✅ (dry run)`)
      }
    } else {
      console.log(`❌ ${result.error}`)
    }

    // Rate limiting delay
    if (i < modulesToProcess.length - 1 && !args.dryRun) {
      await sleep(API_DELAY_MS)
    }
  }

  // Summary
  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length
  const totalTime = Date.now() - startTime

  console.log("\n═══════════════════════════════════════════════════════════════")
  console.log("                         SUMMARY")
  console.log("═══════════════════════════════════════════════════════════════\n")

  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏱️ Total time: ${formatDuration(totalTime)}`)

  if (!args.dryRun && totalTokensIn > 0) {
    console.log(`\n📊 Token Usage:`)
    console.log(`   Input tokens: ${totalTokensIn.toLocaleString()}`)
    console.log(`   Output tokens: ${totalTokensOut.toLocaleString()}`)
    console.log(`   Total tokens: ${(totalTokensIn + totalTokensOut).toLocaleString()}`)

    // Rough cost estimate (Claude Sonnet pricing as of 2024)
    const inputCost = (totalTokensIn / 1_000_000) * 3
    const outputCost = (totalTokensOut / 1_000_000) * 15
    console.log(`   Estimated cost: ~$${(inputCost + outputCost).toFixed(2)}`)
  }

  if (failed > 0) {
    console.log("\n⚠️ Failed modules:")
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`   - ${r.moduleSlug}: ${r.error}`)
      })
  }

  console.log("\n═══════════════════════════════════════════════════════════════\n")

  process.exit(failed > 0 ? 1 : 0)
}

main().catch((error) => {
  console.error("\n❌ Fatal error:", error)
  process.exit(1)
})
