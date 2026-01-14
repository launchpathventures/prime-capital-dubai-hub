/**
 * CATALYST - Generate Audio from Transcripts
 *
 * Processes markdown audio scripts and generates MP3 files using Eleven Labs.
 * Uploads to Supabase Storage and updates database records.
 *
 * Usage:
 *   pnpm generate:audio              # Generate all pending
 *   pnpm generate:audio --dry-run    # Preview without generating
 *   pnpm generate:audio --module 3.2 # Generate specific module
 *   pnpm generate:audio --competency 3 # Generate entire competency
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import * as fs from "fs"
import * as path from "path"
import { createClient } from "@supabase/supabase-js"
import {
  generateSpeech,
  prepareTranscriptForTTS,
  estimateAudioDuration,
  getSubscriptionInfo,
} from "../lib/elevenlabs"

// Types
interface AudioFile {
  filePath: string
  moduleNumber: string
  slug: string
  type: "intro" | "demo" | "walkthrough"
  title: string
  moduleType: string
  duration: string
  content: string
  competency: string
}

interface GenerationResult {
  slug: string
  success: boolean
  audioUrl?: string
  error?: string
  characterCount?: number
  audioDuration?: number
}

// Parse command line args
const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")
const MODULE_FILTER = args.find((a) => a.startsWith("--module="))?.split("=")[1]
const COMPETENCY_FILTER = args
  .find((a) => a.startsWith("--competency="))
  ?.split("=")[1]
const VOICE_OVERRIDE = args.find((a) => a.startsWith("--voice="))?.split("=")[1]

const LMS_DIR = path.join(process.cwd(), "content", "lms")

// Supabase client
function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase credentials not configured")
  }

  return createClient(url, key)
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatter: Record<string, string> = {}
  const lines = match[1].split("\n")

  for (const line of lines) {
    const colonIndex = line.indexOf(":")
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, "")
      frontmatter[key] = value
    }
  }

  return frontmatter
}

/**
 * Discover all audio script files
 */
function discoverAudioFiles(): AudioFile[] {
  const files: AudioFile[] = []
  const competencies = fs.readdirSync(LMS_DIR).filter((d) => {
    const stat = fs.statSync(path.join(LMS_DIR, d))
    return stat.isDirectory() && /^\d+-/.test(d)
  })

  for (const competency of competencies) {
    const audioDir = path.join(LMS_DIR, competency, "audio")
    if (!fs.existsSync(audioDir)) continue

    // Filter by competency if specified
    if (COMPETENCY_FILTER) {
      const compNum = competency.split("-")[0]
      if (compNum !== COMPETENCY_FILTER) continue
    }

    const audioFiles = fs.readdirSync(audioDir).filter((f) => f.endsWith(".md"))

    for (const file of audioFiles) {
      // Parse filename: {moduleNumber}-{slug}.{type}.md
      const match = file.match(/^(\d+\.\d+)-([^.]+)\.(intro|demo|walkthrough)\.md$/)
      if (!match) continue

      const [, moduleNumber, slug, type] = match

      // Filter by module if specified
      if (MODULE_FILTER && moduleNumber !== MODULE_FILTER) continue

      const filePath = path.join(audioDir, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const frontmatter = parseFrontmatter(content)

      files.push({
        filePath,
        moduleNumber,
        slug,
        type: type as AudioFile["type"],
        title: frontmatter.title || slug,
        moduleType: frontmatter.moduleType || "knowledge",
        duration: frontmatter.duration || "60-90 seconds",
        content,
        competency,
      })
    }
  }

  return files.sort((a, b) => {
    // Sort by module number
    const [aMajor, aMinor] = a.moduleNumber.split(".").map(Number)
    const [bMajor, bMinor] = b.moduleNumber.split(".").map(Number)
    if (aMajor !== bMajor) return aMajor - bMajor
    if (aMinor !== bMinor) return aMinor - bMinor
    // Then by type: intro, demo, walkthrough
    const typeOrder = { intro: 0, demo: 1, walkthrough: 2 }
    return typeOrder[a.type] - typeOrder[b.type]
  })
}

/**
 * Generate slug for database
 */
function generateDbSlug(file: AudioFile): string {
  return `${file.moduleNumber}-${file.slug}-${file.type}`
}

/**
 * Check which files need generation
 */
async function getFilesToGenerate(
  files: AudioFile[],
  supabase: ReturnType<typeof getSupabaseClient>
): Promise<AudioFile[]> {
  // Get existing records
  const { data: existing } = await supabase
    .from("audio_transcripts")
    .select("slug, audio_url")

  const existingSlugs = new Set(
    existing?.filter((r) => r.audio_url).map((r) => r.slug) || []
  )

  return files.filter((f) => !existingSlugs.has(generateDbSlug(f)))
}

/**
 * Process a single audio file
 */
async function processFile(
  file: AudioFile,
  supabase: ReturnType<typeof getSupabaseClient>
): Promise<GenerationResult> {
  const slug = generateDbSlug(file)

  try {
    // Prepare text for TTS
    const cleanText = prepareTranscriptForTTS(file.content)
    const characterCount = cleanText.length
    const estimatedDuration = estimateAudioDuration(cleanText)

    if (DRY_RUN) {
      return {
        slug,
        success: true,
        characterCount,
        audioDuration: estimatedDuration,
      }
    }

    // Generate audio
    const { audio, requestId } = await generateSpeech(cleanText, {
      voiceId: VOICE_OVERRIDE,
    })

    // Upload to Supabase Storage
    const fileName = `${slug}.mp3`
    const { error: uploadError } = await supabase.storage
      .from("lms-audio")
      .upload(fileName, audio, {
        contentType: "audio/mpeg",
        upsert: true,
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("lms-audio").getPublicUrl(fileName)

    // Upsert database record
    const { error: dbError } = await supabase.from("audio_transcripts").upsert(
      {
        slug,
        title: file.title,
        type: file.type,
        transcript: file.content,
        audio_url: publicUrl,
        audio_duration_seconds: estimatedDuration,
        generated_at: new Date().toISOString(),
        eleven_labs_request_id: requestId,
        frontmatter: {
          moduleNumber: file.moduleNumber,
          moduleType: file.moduleType,
          competency: file.competency,
        },
      },
      { onConflict: "slug" }
    )

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    return {
      slug,
      success: true,
      audioUrl: publicUrl,
      characterCount,
      audioDuration: estimatedDuration,
    }
  } catch (error) {
    return {
      slug,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log("\n🎙️  Audio Generation Script")
  console.log("============================\n")

  if (DRY_RUN) {
    console.log("📋 DRY RUN MODE - No files will be generated\n")
  }

  // Discover files first (doesn't need API key)
  const allFiles = discoverAudioFiles()
  console.log(`📁 Found ${allFiles.length} audio script files`)

  if (MODULE_FILTER) {
    console.log(`   Filtered to module: ${MODULE_FILTER}`)
  }
  if (COMPETENCY_FILTER) {
    console.log(`   Filtered to competency: ${COMPETENCY_FILTER}`)
  }

  // Estimate total characters
  const totalChars = allFiles.reduce((sum, f) => {
    const clean = prepareTranscriptForTTS(f.content)
    return sum + clean.length
  }, 0)
  console.log(`📝 Total characters: ${totalChars.toLocaleString()}`)
  console.log(
    `⏱️  Estimated audio: ~${Math.round(totalChars / 150 / 60)} minutes\n`
  )

  // For dry run, just show files and exit
  if (DRY_RUN) {
    console.log("Files to generate:")
    for (const file of allFiles) {
      const chars = prepareTranscriptForTTS(file.content).length
      console.log(`  - ${generateDbSlug(file)} (${chars} chars)`)
    }
    console.log(`\n📋 Dry run complete. Use without --dry-run to generate.`)
    return
  }

  // Check ElevenLabs API key (only needed for actual generation)
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("❌ ELEVENLABS_API_KEY not set")
    process.exit(1)
  }

  // Check subscription
  try {
    const subscription = await getSubscriptionInfo()
    const remaining = subscription.character_limit - subscription.character_count
    console.log(`📊 ElevenLabs quota: ${remaining.toLocaleString()} characters remaining`)
    console.log(
      `   (${subscription.character_count.toLocaleString()} / ${subscription.character_limit.toLocaleString()} used)\n`
    )
  } catch (error) {
    console.warn("⚠️  Could not check ElevenLabs subscription\n")
  }

  // Get Supabase client
  const supabase = getSupabaseClient()

  // Filter to files needing generation
  const filesToGenerate = await getFilesToGenerate(allFiles, supabase)
  console.log(`🎯 ${filesToGenerate.length} files need generation\n`)

  if (filesToGenerate.length === 0) {
    console.log("✅ All audio files already generated!")
    return
  }

  // Process files
  const results: GenerationResult[] = []
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < filesToGenerate.length; i++) {
    const file = filesToGenerate[i]
    const slug = generateDbSlug(file)

    process.stdout.write(
      `\r[${i + 1}/${filesToGenerate.length}] Processing ${slug}...`
    )

    const result = await processFile(file, supabase)
    results.push(result)

    if (result.success) {
      successCount++
    } else {
      errorCount++
      console.log(`\n  ❌ Error: ${result.error}`)
    }

    // Rate limiting - ElevenLabs has limits
    if (i < filesToGenerate.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Summary
  console.log("\n\n============================")
  console.log("📊 Generation Complete\n")
  console.log(`  ✅ Success: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)

  if (errorCount > 0) {
    console.log("\nFailed files:")
    for (const r of results.filter((r) => !r.success)) {
      console.log(`  - ${r.slug}: ${r.error}`)
    }
  }

  console.log()
}

main().catch(console.error)
