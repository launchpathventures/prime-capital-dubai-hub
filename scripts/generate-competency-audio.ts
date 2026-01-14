/**
 * CATALYST - Generate Competency Intro Audio
 *
 * Generates audio for competency intro transcripts that don't have audio_url.
 * Reads transcripts from database, generates MP3 via ElevenLabs, uploads to storage.
 *
 * Usage:
 *   npx tsx scripts/generate-competency-audio.ts
 *   npx tsx scripts/generate-competency-audio.ts --dry-run
 */

import { config } from "dotenv"
config({ path: ".env.local" })

import { createClient } from "@supabase/supabase-js"
import {
  generateSpeech,
  prepareTranscriptForTTS,
  estimateAudioDuration,
  getSubscriptionInfo,
} from "../lib/elevenlabs"

// Parse command line args
const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")

interface AudioRecord {
  id: string
  slug: string
  title: string
  type: string
  transcript: string
  audio_url: string | null
}

interface GenerationResult {
  slug: string
  success: boolean
  audioUrl?: string
  error?: string
  characterCount?: number
  audioDuration?: number
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error("Supabase credentials not configured")
  }

  return createClient(url, key)
}

async function getCompetencyAudioRecords(supabase: ReturnType<typeof getSupabaseClient>): Promise<AudioRecord[]> {
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("id, slug, title, type, transcript, audio_url")
    .not("competency_id", "is", null)
    .is("audio_url", null)
    .order("slug")
  
  if (error) {
    throw new Error(`Failed to fetch records: ${error.message}`)
  }
  
  return data || []
}

async function processRecord(
  record: AudioRecord,
  supabase: ReturnType<typeof getSupabaseClient>
): Promise<GenerationResult> {
  try {
    // Prepare text for TTS
    const cleanText = prepareTranscriptForTTS(record.transcript)
    const characterCount = cleanText.length
    const estimatedDuration = estimateAudioDuration(cleanText)

    if (DRY_RUN) {
      return {
        slug: record.slug,
        success: true,
        characterCount,
        audioDuration: estimatedDuration,
      }
    }

    // Generate audio
    const { audio, requestId } = await generateSpeech(cleanText, {})

    // Upload to Supabase Storage
    const fileName = `${record.slug}.mp3`
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

    // Update database record
    const { error: dbError } = await supabase
      .from("audio_transcripts")
      .update({
        audio_url: publicUrl,
        audio_duration_seconds: estimatedDuration,
        generated_at: new Date().toISOString(),
        eleven_labs_request_id: requestId,
      })
      .eq("id", record.id)

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    return {
      slug: record.slug,
      success: true,
      audioUrl: publicUrl,
      characterCount,
      audioDuration: estimatedDuration,
    }
  } catch (error) {
    return {
      slug: record.slug,
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

async function main() {
  console.log("\n🎙️  Competency Audio Generation Script")
  console.log("=======================================\n")

  if (DRY_RUN) {
    console.log("📋 DRY RUN MODE - No files will be generated\n")
  }

  const supabase = getSupabaseClient()

  // Get records needing generation
  const records = await getCompetencyAudioRecords(supabase)
  console.log(`📁 Found ${records.length} competency audio records needing generation`)

  if (records.length === 0) {
    console.log("✅ All competency audio files already generated!")
    return
  }

  // Estimate total characters
  const totalChars = records.reduce((sum, r) => {
    const clean = prepareTranscriptForTTS(r.transcript)
    return sum + clean.length
  }, 0)
  console.log(`📝 Total characters: ${totalChars.toLocaleString()}`)
  console.log(`⏱️  Estimated audio: ~${Math.round(totalChars / 150 / 60)} minutes\n`)

  // For dry run, just show records and exit
  if (DRY_RUN) {
    console.log("Records to generate:")
    for (const record of records) {
      const chars = prepareTranscriptForTTS(record.transcript).length
      console.log(`  - ${record.slug} (${chars} chars)`)
    }
    console.log(`\n📋 Dry run complete. Use without --dry-run to generate.`)
    return
  }

  // Check ElevenLabs API key
  if (!process.env.ELEVENLABS_API_KEY) {
    console.error("❌ ELEVENLABS_API_KEY not set")
    process.exit(1)
  }

  // Check subscription
  try {
    const subscription = await getSubscriptionInfo()
    const remaining = subscription.character_limit - subscription.character_count
    console.log(`📊 ElevenLabs quota: ${remaining.toLocaleString()} characters remaining`)
    console.log(`   (${subscription.character_count.toLocaleString()} / ${subscription.character_limit.toLocaleString()} used)\n`)
    
    if (remaining < totalChars) {
      console.error(`❌ Not enough quota! Need ${totalChars.toLocaleString()} characters but only ${remaining.toLocaleString()} remaining.`)
      process.exit(1)
    }
  } catch (error) {
    console.warn("⚠️  Could not check ElevenLabs subscription\n")
  }

  // Process records
  const results: GenerationResult[] = []
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    process.stdout.write(`\r[${i + 1}/${records.length}] Processing ${record.slug}...`)

    const result = await processRecord(record, supabase)
    results.push(result)

    if (result.success) {
      successCount++
      console.log(` ✅`)
    } else {
      errorCount++
      console.log(`\n  ❌ Error: ${result.error}`)
    }

    // Rate limiting - ElevenLabs has limits
    if (i < records.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }

  // Summary
  console.log("\n=======================================")
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
