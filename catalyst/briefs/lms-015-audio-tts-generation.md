# LMS-015: Audio TTS Generation with Eleven Labs

**Status:** � IN PROGRESS  
**Priority:** High (enables multimodal learning experience)  
**Estimated Time:** 4-6 days  
**Dependencies:** LMS-011 (audio transcript content) ✅, LMS-006 (module experience)  

---

## Objective

Implement end-to-end audio generation using Eleven Labs TTS API — from markdown transcripts to playable audio files stored in Supabase, rendered in competency and module pages.

---

## Audio Scripts Status (LMS-011)

✅ **Complete** — 112 audio script files in canonical format:

| Competency | Intros | Demos | Walkthroughs | Total |
|------------|--------|-------|--------------|-------|
| 0 Foundations | 5 | 0 | 1 | 6 |
| 1 Market Intelligence | 10 | 4 | 0 | 14 |
| 2 Client Discovery | 7 | 5 | 1 | 13 |
| 3 Sales Mastery | 8 | 5 | 2 | 15 |
| 4 Property Matching | 7 | 2 | 5 | 14 |
| 5 Transaction Management | 12 | 2 | 4 | 18 |
| 6 Objection Navigation | 7 | 4 | 3 | 14 |
| 7 Relationship Stewardship | 4 | 1 | 3 | 8 |
| 8 RERA Exam Prep | 8 | 0 | 2 | 10 |
| **Total** | **68** | **23** | **21** | **112** |

**File format:**
```
content/lms/{competency}/audio/
├── {moduleNumber}-{slug}.intro.md
├── {moduleNumber}-{slug}.demo.md        # skills-script only
└── {moduleNumber}-{slug}.walkthrough.md  # skills only
```

**Frontmatter:**
```yaml
---
title: "Module Title"
moduleNumber: "3.2"
type: "intro"           # intro | demo | walkthrough
moduleType: "skills"    # knowledge | skills | skills-script
duration: "60-90 seconds"
---
```

---

## Overview

This brief covers three main areas:

1. **Database & Storage** — `audio_transcripts` table, Supabase Storage bucket for audio files
2. **Generation Workflow** — API route and script to convert transcripts to speech via Eleven Labs
3. **Rendering** — Display audio players in competency/module pages with transcript sync

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Markdown       │     │  Eleven Labs     │     │  Supabase       │
│  Transcripts    │────▶│  TTS API         │────▶│  Storage        │
│  (.intro.md)    │     │                  │     │  (audio bucket) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                                                │
        ▼                                                ▼
┌─────────────────┐                              ┌─────────────────┐
│ audio_transcripts│◀─────────────────────────────│  Public URL     │
│ table (Supabase)│                              │  (audio_url)    │
└─────────────────┘                              └─────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  AudioCoachPlayer Component                                      │
│  - Plays audio from URL                                          │
│  - Shows transcript with section highlighting                    │
│  - Displays demo sections ([DEMO: Strong], [DEMO: Weak])        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Database Schema (Day 1)

### Create `audio_transcripts` Table

```sql
-- Migration: create_audio_transcripts_table
CREATE TABLE IF NOT EXISTS audio_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  
  -- Linking
  module_id UUID REFERENCES learning_modules(id) ON DELETE SET NULL,
  competency_id UUID REFERENCES competencies(id) ON DELETE SET NULL,
  
  -- Metadata
  title TEXT NOT NULL,
  duration TEXT,                         -- e.g., "8 minutes"
  voice TEXT DEFAULT 'coach',            -- voice persona
  type TEXT DEFAULT 'demonstration',     -- demonstration, summary, walkthrough
  
  -- Content
  transcript TEXT NOT NULL,              -- Full markdown transcript
  frontmatter JSONB,                     -- Additional metadata
  
  -- Audio generation
  audio_url TEXT,                        -- URL to generated audio file (null until generated)
  audio_duration_seconds INTEGER,        -- Actual audio duration in seconds
  generated_at TIMESTAMPTZ,              -- When audio was generated
  eleven_labs_request_id TEXT,           -- For tracking/debugging
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_module ON audio_transcripts(module_id);
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_competency ON audio_transcripts(competency_id);
CREATE INDEX IF NOT EXISTS idx_audio_transcripts_generated ON audio_transcripts(audio_url) WHERE audio_url IS NOT NULL;

-- RLS
ALTER TABLE audio_transcripts ENABLE ROW LEVEL SECURITY;

-- Public read access (audio is learning content)
CREATE POLICY "Audio transcripts are viewable by everyone"
  ON audio_transcripts FOR SELECT
  USING (true);

-- Admin-only write access
CREATE POLICY "Only admins can modify audio transcripts"
  ON audio_transcripts FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Comments
COMMENT ON TABLE audio_transcripts IS 'Audio transcripts for TTS generation, linked to modules or competencies';
COMMENT ON COLUMN audio_transcripts.audio_url IS 'Public URL to generated MP3 file in Supabase Storage';
COMMENT ON COLUMN audio_transcripts.eleven_labs_request_id IS 'Request ID from Eleven Labs for debugging';
```

### Create Storage Bucket

```sql
-- Create public bucket for audio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lms-audio',
  'lms-audio', 
  true,
  52428800,  -- 50MB max (generous for long audio)
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav']
);

-- Public read access
CREATE POLICY "LMS audio is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'lms-audio');

-- Admin upload access
CREATE POLICY "Only admins can upload audio"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'lms-audio' AND auth.jwt() ->> 'role' = 'admin');
```

---

## Phase 2: Eleven Labs Integration (Days 2-3)

### Environment Configuration

```bash
# .env.local
ELEVENLABS_API_KEY=sk_ceffa6b144c38fd7fc3eba1126c9c73d8136d127bf8ec77f
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb  # Default voice (or customize)
ELEVENLABS_MODEL_ID=eleven_multilingual_v2  # High-quality multilingual model
```

### Eleven Labs Service

Create `lib/elevenlabs.ts`:

```typescript
/**
 * CATALYST - Eleven Labs TTS Service
 * 
 * Generates speech audio from text using Eleven Labs API.
 */

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1"

export interface TTSOptions {
  voiceId?: string
  modelId?: string
  outputFormat?: string
  stability?: number
  similarityBoost?: number
}

export interface TTSResult {
  audio: Buffer
  contentType: string
  requestId: string
}

/**
 * Convert text to speech using Eleven Labs API
 */
export async function generateSpeech(
  text: string,
  options: TTSOptions = {}
): Promise<TTSResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY not configured")
  }

  const voiceId = options.voiceId || process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb"
  const modelId = options.modelId || process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2"
  const outputFormat = options.outputFormat || "mp3_44100_128"

  const response = await fetch(
    `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=${outputFormat}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Eleven Labs API error: ${response.status} - ${error}`)
  }

  const requestId = response.headers.get("request-id") || ""
  const arrayBuffer = await response.arrayBuffer()
  
  return {
    audio: Buffer.from(arrayBuffer),
    contentType: "audio/mpeg",
    requestId,
  }
}

/**
 * Clean transcript text for TTS
 * - Remove markdown formatting
 * - Convert tags to speech-friendly markers
 * - Handle section breaks
 */
export function prepareTranscriptForTTS(transcript: string): string {
  return transcript
    // Remove markdown headers (keep text)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove markdown links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Convert demo markers to spoken cues
    .replace(/\[DEMO:\s*Weak\]/gi, "... Here's the weak approach: ...")
    .replace(/\[DEMO:\s*Strong\]/gi, "... Now, the strong approach: ...")
    .replace(/\[DEMO:\s*Comparison\]/gi, "... Let's compare: ...")
    .replace(/\[COACH EXPLAINS\]/gi, "... Here's why this matters: ...")
    .replace(/\[PRACTICE TIP\]/gi, "... Practice tip: ...")
    .replace(/\[KEY INSIGHT\]/gi, "... Key insight: ...")
    // Remove horizontal rules
    .replace(/^---+$/gm, "...")
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "")
    // Clean up excessive whitespace
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/**
 * Estimate audio duration from text (rough: ~150 words/minute)
 */
export function estimateAudioDuration(text: string): number {
  const wordCount = text.split(/\s+/).length
  return Math.ceil((wordCount / 150) * 60) // seconds
}
```

### Generation API Route

Create `app/api/admin/generate-audio/route.ts`:

```typescript
/**
 * CATALYST - Audio Generation API
 * 
 * POST /api/admin/generate-audio
 * Generates audio for a specific transcript or all pending transcripts.
 * 
 * Body: { slug?: string, all?: boolean }
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { 
  generateSpeech, 
  prepareTranscriptForTTS, 
  estimateAudioDuration 
} from "@/lib/elevenlabs"

export async function POST(request: NextRequest) {
  // Verify admin access
  const authHeader = request.headers.get("authorization")
  // TODO: Proper admin verification
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.json()
  const { slug, all = false } = body

  // Get transcripts to process
  let query = supabase
    .from("audio_transcripts")
    .select("id, slug, transcript, voice, title")
  
  if (slug) {
    query = query.eq("slug", slug)
  } else if (!all) {
    // Only process those without audio
    query = query.is("audio_url", null)
  }

  const { data: transcripts, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!transcripts?.length) {
    return NextResponse.json({ message: "No transcripts to process" })
  }

  const results = []

  for (const transcript of transcripts) {
    try {
      // Prepare text for TTS
      const cleanText = prepareTranscriptForTTS(transcript.transcript)
      
      // Generate audio
      const { audio, requestId } = await generateSpeech(cleanText)
      
      // Upload to Supabase Storage
      const fileName = `${transcript.slug}.mp3`
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
      const { data: urlData } = supabase.storage
        .from("lms-audio")
        .getPublicUrl(fileName)

      const publicUrl = urlData.publicUrl

      // Update database record
      const { error: updateError } = await supabase
        .from("audio_transcripts")
        .update({
          audio_url: publicUrl,
          audio_duration_seconds: estimateAudioDuration(cleanText),
          generated_at: new Date().toISOString(),
          eleven_labs_request_id: requestId,
        })
        .eq("id", transcript.id)

      if (updateError) {
        throw new Error(`Database update failed: ${updateError.message}`)
      }

      results.push({
        slug: transcript.slug,
        status: "success",
        audioUrl: publicUrl,
      })
    } catch (err) {
      results.push({
        slug: transcript.slug,
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  }

  return NextResponse.json({
    processed: results.length,
    results,
  })
}
```

### CLI Script for Batch Generation

Create `scripts/generate-audio.ts`:

```typescript
/**
 * CATALYST - Generate Audio Script
 * 
 * Usage: pnpm generate:audio [--slug <slug>] [--all] [--dry-run]
 */

import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"
import { 
  generateSpeech, 
  prepareTranscriptForTTS,
  estimateAudioDuration 
} from "@/lib/elevenlabs"

config({ path: ".env.local" })

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes("--dry-run")
  const all = args.includes("--all")
  const slugIndex = args.indexOf("--slug")
  const slug = slugIndex > -1 ? args[slugIndex + 1] : null

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  console.log("🎙️  Audio Generation Script")
  console.log("===========================")

  // Get transcripts
  let query = supabase
    .from("audio_transcripts")
    .select("id, slug, transcript, title, audio_url")

  if (slug) {
    query = query.eq("slug", slug)
  } else if (!all) {
    query = query.is("audio_url", null)
  }

  const { data: transcripts, error } = await query

  if (error) {
    console.error("❌ Failed to fetch transcripts:", error.message)
    process.exit(1)
  }

  console.log(`📝 Found ${transcripts?.length || 0} transcripts to process`)

  if (dryRun) {
    console.log("\n🔍 DRY RUN - No audio will be generated")
    for (const t of transcripts || []) {
      const cleanText = prepareTranscriptForTTS(t.transcript)
      const duration = estimateAudioDuration(cleanText)
      console.log(`  - ${t.slug}: ~${Math.ceil(duration / 60)} min (${cleanText.split(/\s+/).length} words)`)
    }
    return
  }

  let success = 0
  let failed = 0

  for (const transcript of transcripts || []) {
    console.log(`\n🔊 Processing: ${transcript.slug}`)
    
    try {
      const cleanText = prepareTranscriptForTTS(transcript.transcript)
      console.log(`   Words: ${cleanText.split(/\s+/).length}`)
      
      const { audio, requestId } = await generateSpeech(cleanText)
      console.log(`   Generated: ${(audio.length / 1024 / 1024).toFixed(2)} MB`)
      
      // Upload
      const fileName = `${transcript.slug}.mp3`
      await supabase.storage
        .from("lms-audio")
        .upload(fileName, audio, { contentType: "audio/mpeg", upsert: true })
      
      const { data: urlData } = supabase.storage
        .from("lms-audio")
        .getPublicUrl(fileName)

      // Update DB
      await supabase
        .from("audio_transcripts")
        .update({
          audio_url: urlData.publicUrl,
          audio_duration_seconds: estimateAudioDuration(cleanText),
          generated_at: new Date().toISOString(),
          eleven_labs_request_id: requestId,
        })
        .eq("id", transcript.id)

      console.log(`   ✅ Success: ${urlData.publicUrl}`)
      success++
    } catch (err) {
      console.log(`   ❌ Failed: ${err instanceof Error ? err.message : "Unknown"}`)
      failed++
    }

    // Rate limiting: wait between requests
    await new Promise((r) => setTimeout(r, 1000))
  }

  console.log("\n===========================")
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
}

main()
```

Add to `package.json`:

```json
{
  "scripts": {
    "generate:audio": "npx tsx scripts/generate-audio.ts"
  }
}
```

---

## Phase 3: Content & Rendering (Days 4-5)

### Update Content Sync

The existing `syncAudioTranscripts` function in `lib/lms/sync.ts` already handles syncing `.audio.md` files. Ensure it runs as part of `pnpm sync:lms`.

### Update AudioCoachPlayer Component

The existing component at `components/lms/audio-coach-player.tsx` already supports `audioUrl` prop. Ensure it:

1. Shows loading state while audio loads
2. Falls back to transcript-only view when `audioUrl` is null
3. Highlights current section during playback (future enhancement)

### Fetch Audio in Module/Competency Pages

Update data fetching to include audio transcripts:

```typescript
// In learning.ts or relevant data fetching

export async function getModuleWithAudio(slug: string) {
  const supabase = createClient()
  
  // Get module
  const { data: module } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("slug", slug)
    .single()
  
  // Get audio transcript
  const { data: audio } = await supabase
    .from("audio_transcripts")
    .select("*")
    .eq("module_id", module.id)
    .single()
  
  return { module, audio }
}
```

---

## Phase 4: Admin UI (Day 6)

### Audio Generation Dashboard

Create admin page to manage audio generation:

- List all transcripts with generation status
- Generate individual or batch audio
- Preview audio files
- Re-generate with different settings

Location: `app/app/admin/audio/page.tsx`

---

## Deliverables

### Files to Create

| File | Purpose |
|------|---------|
| `supabase/migrations/xxx_audio_transcripts.sql` | Database schema |
| `lib/elevenlabs.ts` | Eleven Labs API client |
| `app/api/admin/generate-audio/route.ts` | Audio generation API |
| `scripts/generate-audio.ts` | CLI batch generation |
| `app/app/admin/audio/page.tsx` | Admin dashboard (optional) |

### Files to Update

| File | Change |
|------|--------|
| `package.json` | Add `generate:audio` script |
| `.env.example` | Add Eleven Labs env vars |
| `lib/learning.ts` | Include audio in data fetching |
| `components/lms/audio-coach-player.tsx` | Enhance with actual playback |

---

## Acceptance Criteria

- [ ] `audio_transcripts` table created with RLS policies
- [ ] `lms-audio` storage bucket created and public
- [ ] Eleven Labs integration working (test with single transcript)
- [ ] Audio files uploaded to Supabase Storage
- [ ] `audio_url` populated in database after generation
- [ ] AudioCoachPlayer plays generated audio
- [ ] CLI script can batch-generate all pending audio
- [ ] Content sync populates transcripts from `.audio.md` files
- [ ] Admin can trigger audio generation via API

---

## Voice Configuration

### Recommended Eleven Labs Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Model | `eleven_multilingual_v2` | Best quality for coaching content |
| Voice | TBD - recommend selecting | Should sound professional, warm, authoritative |
| Stability | 0.5 | Balance between consistency and expression |
| Similarity Boost | 0.75 | Closer to original voice |
| Output Format | `mp3_44100_128` | Good quality, reasonable file size |

### Voice Selection

Browse available voices at [Eleven Labs Voice Library](https://elevenlabs.io/voice-library) or use the API:

```bash
curl -X GET "https://api.elevenlabs.io/v1/voices" \
  -H "xi-api-key: YOUR_API_KEY"
```

Recommended voice characteristics for coach persona:
- Male or female (consistent throughout)
- Professional, authoritative
- Warm and encouraging
- Clear diction
- Moderate pace

---

## Cost Estimation

Eleven Labs pricing (as of 2024):
- ~$0.30 per 1,000 characters (Starter plan)
- ~$0.18 per 1,000 characters (Creator plan)

Estimated transcript sizes:
- Module demo: ~2,000-4,000 characters → $0.60-$1.20 each
- Competency intro: ~1,000-2,000 characters → $0.30-$0.60 each

With ~70 modules + 9 competencies:
- Estimated total: ~250,000 characters → ~$45-$75 total

---

## Security Notes

1. **API Key Protection** — Never expose `ELEVENLABS_API_KEY` client-side
2. **Admin-Only Generation** — Audio generation requires admin role
3. **Rate Limiting** — Add delays between API calls to avoid rate limits
4. **File Validation** — Verify audio files before upload

---

## Future Enhancements

- [ ] Real-time transcript highlighting during playback
- [ ] Multiple voice personas (coach, client demo voices)
- [ ] Audio quality selection (high/standard)
- [ ] Regeneration with different settings
- [ ] Audio analytics (listen completion, skip points)
- [ ] Voice cloning for brand-specific voice

---

## Notes

- Create `.audio.md` transcript files first (see LMS-011)
- Test with a single short transcript before batch generation
- Monitor Eleven Labs usage/credits
- Audio files are cached by Supabase CDN for fast delivery
