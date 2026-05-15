/**
 * CATALYST - YouTube Full Script Generation API
 *
 * POST /api/admin/youtube/generate-script
 *
 * Takes a script idea + format and generates a full teleprompter-ready
 * script using the format-portfolio prompt system. Streams the response
 * for real-time display.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  getSystemPrompt,
  toFormat,
  FORMAT_META,
  type Format,
} from "@/lib/youtube/prompts"
import { getProfile } from "@/lib/youtube/profiles"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerateScriptRequest {
  title: string
  topic: string
  format?: string
  profileSlug?: string
  scriptId?: string
  previousScript?: string
  validationFeedback?: string
}

export async function POST(request: NextRequest) {
  try {
    // IP-based rate limiting — script generation is the heaviest endpoint
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-script", RATE_LIMITS.AI)
    if (rl.limited) return createRateLimitResponse(rl.retryAfter!)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: canAccess } = await supabase.rpc("can_access_youtube")
    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body: GenerateScriptRequest = await request.json()
    const { title, topic, format: rawFormat, profileSlug, previousScript, validationFeedback } = body

    if (!title?.trim() || !topic?.trim()) {
      return NextResponse.json(
        { error: "Title and topic are required" },
        { status: 400 }
      )
    }

    const format: Format = toFormat(rawFormat)
    const meta = FORMAT_META[format]
    const profile = getProfile(profileSlug)

    // Cap regeneration inputs to prevent runaway prompts
    const cappedPreviousScript = previousScript?.slice(0, 6000)
    const cappedValidationFeedback = validationFeedback?.slice(0, 4000)

    // System prompt = SHARED_IMMUTABLES + format-specific prompt.
    // Each format prompt enforces its own length, structure, hook formula,
    // CTA placement, and signature patterns.
    const systemPrompt = getSystemPrompt(format, profile)

    const userMessage = cappedPreviousScript && cappedValidationFeedback
      ? `REGENERATE this YouTube script for ${profile.brandFullName}. The previous version failed validation. Fix ALL issues listed below while keeping the same topic, angle, and **format** (${meta.label}).

Title / Working Title: ${title}
Concept: ${topic}
Format: ${meta.label} (${meta.minutesLabel}, ${meta.wordsLabel})

VALIDATION FEEDBACK TO ADDRESS:
${cappedValidationFeedback}

PREVIOUS SCRIPT (rewrite and improve — do not copy verbatim):
${cappedPreviousScript}

Generate the improved script now, addressing every piece of feedback above. Follow the format spec exactly.`
      : `Write a complete YouTube script for ${profile.brandFullName}.

Title / Working Title: ${title}
Concept: ${topic}
Format: ${meta.label} (${meta.minutesLabel}, ${meta.wordsLabel})
Hook formula: ${meta.hookFormula} — ${meta.hookName}
CTA count: ${meta.ctaCount}

Generate the full script now, following the format spec exactly. Output Markdown — use the structure laid out in the format prompt's "Output structure (Markdown)" section.`

    // Stream the response — pass request.signal so disconnect cancels upstream call
    const stream = await anthropic.messages.stream(
      {
        model: process.env.YOUTUBE_SCRIPT_MODEL || "claude-opus-4-20250514",
        max_tokens: 16384,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      { signal: request.signal }
    )

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          console.error("Script generation stream error:", err)
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Generate script error:", error)
    return NextResponse.json(
      { error: "Failed to generate script" },
      { status: 500 }
    )
  }
}
