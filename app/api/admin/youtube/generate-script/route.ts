/**
 * CATALYST - YouTube Full Script Generation API
 *
 * POST /api/admin/youtube/generate-script
 *
 * Takes a script idea and generates a full teleprompter-ready script
 * following the Prime Capital Script Generator v2.0 architecture.
 * Streams the response for real-time display.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { SCRIPT_GENERATOR_PROMPT } from "@/lib/youtube/script-generator-prompt"
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
  target_length?: string
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

    const { data: isAdmin } = await supabase.rpc("is_admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body: GenerateScriptRequest = await request.json()
    const { title, topic, target_length = "standard", previousScript, validationFeedback } = body

    if (!title?.trim() || !topic?.trim()) {
      return NextResponse.json(
        { error: "Title and topic are required" },
        { status: 400 }
      )
    }

    // Cap regeneration inputs to prevent runaway prompts
    const cappedPreviousScript = previousScript?.slice(0, 6000)
    const cappedValidationFeedback = validationFeedback?.slice(0, 4000)

    const lengthMap: Record<string, string> = {
      quick_take: "800-1,200 words (5-7 minutes)",
      standard: "1,500-2,000 words (8-12 minutes)",
      deep_dive: "2,000-2,500 words (12-15 minutes)",
    }

    const systemPrompt = `You are the lead scriptwriter for Prime Capital Dubai's YouTube channel. Follow the Script Generator v2.0 exactly.

${SCRIPT_GENERATOR_PROMPT}

CRITICAL RULES:
- Output the script in **Markdown format** for readability and PDF export
- Follow the exact script architecture: Packaging → Hook V1 → Hook V2 → Context Loop → Section 1 → Mid-Roll CTA → Section 2 → Section 3 → End-Roll CTA → Outro
- Use markdown headings (## and ###) to separate sections, and horizontal rules (---) between major sections
- The script body text under each section must be teleprompter-ready prose (no bullet points in spoken sections, natural spoken sentences)
- Two distinct hook versions required
- Include a "Packaging" section at the top with title options, thumbnail concept, CTA focus, and target length formatted as a markdown table or key-value list
- Voice: Tahir speaking — measured, evidence-based, conversational but authoritative
- Never use banned words: luxury, amazing, incredible, don't miss out, act now, trust me, passive income, no-brainer, exclusive, etc.
- Minimum 3 specific data points, at least one anonymized client scenario
- Include 2-3 open loops, pattern interrupts every 90-120 seconds
- Mid-roll CTA references Strategy Kit, end-roll CTA references Strategy Call
- Target length: ${lengthMap[target_length] || lengthMap.standard}

MARKDOWN FORMAT EXAMPLE:
\`\`\`
# [Script Title]

## Packaging

| Field | Detail |
|-------|--------|
| **Title Option 1** | ... |
| **Title Option 2** | ... |
| **Thumbnail Concept** | ... |
| **CTA Focus** | ... |
| **Target Length** | ... |

---

## Hook V1 — The Hypothetical

[Spoken text here...]

---

## Hook V2 — The Contrarian

[Spoken text here...]

---

## The Context Loop

[Authority → Trap → Consequence spoken text...]

---

## Section 1: [Title]

[Misconception → Evidence → Explanation → Actionable Takeaway]

---

## Mid-Roll CTA

[Strategy Kit pitch...]

---

## Section 2: [Title]

[Misconception → Evidence → Explanation → Actionable Takeaway]

---

## Section 3: [Title]

[Misconception → Evidence → Explanation → Actionable Takeaway]

---

## End-Roll CTA

[Strategy Call pitch...]

---

## Outro

[Bridge → Tease]
\`\`\``

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
          content: cappedPreviousScript && cappedValidationFeedback
            ? `REGENERATE this YouTube script for Prime Capital Dubai. The previous version failed validation. Fix ALL issues listed below while keeping the same topic and angle.

Title/Working Title: ${title}
Concept: ${topic}
Target Length: ${lengthMap[target_length] || lengthMap.standard}

VALIDATION FEEDBACK TO ADDRESS:
${cappedValidationFeedback}

PREVIOUS SCRIPT (rewrite and improve — do not copy verbatim):
${cappedPreviousScript}

Generate the improved script now, addressing every piece of feedback above.`
            : `Write a complete YouTube script for Prime Capital Dubai.

Title/Working Title: ${title}
Concept: ${topic}
Target Length: ${lengthMap[target_length] || lengthMap.standard}

Generate the full script now, following the exact architecture specified.`,
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
