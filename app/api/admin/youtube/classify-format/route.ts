/**
 * CATALYST - YouTube Format Classifier API
 *
 * POST /api/admin/youtube/classify-format
 *
 * Review & Rewrite (Mode A) entry point. The user pastes an existing
 * script; rather than forcing a manual format pick, this route reads the
 * script and maps it to the best-fit format in the portfolio so the
 * validator can immediately score it against the right spec.
 *
 * Classification is structural, not creative: it judges hook shape,
 * section scaffolding, CTA inventory, and content stance — never voice.
 * That makes it profile-independent (Tahir vs Ahmed is irrelevant here).
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  FORMAT_META,
  FORMATS_IN_DISPLAY_ORDER,
  isFormat,
  toFormat,
  type Format,
} from "@/lib/youtube/prompts"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface ClassifyRequest {
  scriptBody: string
}

const SYSTEM_PROMPT = `You are a format classifier for a Dubai property YouTube channel. You are given an existing video script. Your only job is to map it to the single best-fit format from a fixed portfolio of six.

This is a STRUCTURAL judgement, not a creative one. Decide on:
- Hook shape (rhetorical question, direct contradiction, news headline, deal walk-through, numbered curiosity, direct address)
- Section scaffolding (thesis + analysis, steelman + dismantle, news + read, brief + analysis + outcome, ranked list, question clusters)
- CTA inventory and content stance

## The six formats

${FORMATS_IN_DISPLAY_ORDER.map((f) => {
  const m = FORMAT_META[f]
  return `- "${m.slug}" — ${m.label}: ${m.hint} (${m.minutesLabel})`
}).join("\n")}

## Rules
- Pick exactly ONE format — the closest fit, even if the script is imperfect.
- A title or thumbnail leading with a number is a strong Listicle signal.
- A specific, recent news event with a named source points to Live Reaction.
- A single anonymised client deal (brief → analysis → outcome) points to Case Study.
- A clustered set of viewer questions with short answers points to Q&A / Mailbag.
- Steelmanning then dismantling a popular belief points to Myth-Buster.
- A macro/supply/cycle thesis with no news peg and no client is Authority Analysis (the anchor format and the safe default when ambiguous).

## Output
Return ONLY a JSON object. No prose, no markdown.

{
  "format": "one of the six slugs above, exactly",
  "rationale": "one sentence — the structural evidence that decided it"
}`

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-classify-format", RATE_LIMITS.AI)
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

    const body: ClassifyRequest = await request.json()
    const { scriptBody } = body

    if (!scriptBody?.trim()) {
      return NextResponse.json({ error: "Script body is required" }, { status: 400 })
    }

    const cappedScript = scriptBody.slice(0, 12_000)

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 512,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Classify this script into the single best-fit format.

<script>
${cappedScript}
</script>

Return ONLY the JSON object.`,
          },
        ],
      },
      { signal: request.signal }
    )

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to classify format" }, { status: 500 })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (err) {
      console.error("Classify-format JSON parse error:", err)
      return NextResponse.json({ error: "Failed to classify format" }, { status: 500 })
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Failed to classify format" }, { status: 500 })
    }

    const r = parsed as Record<string, unknown>
    // toFormat() never throws — an unrecognised slug falls back to the
    // anchor format, which is also the documented "ambiguous" default.
    const format: Format = isFormat(r.format) ? r.format : toFormat(r.format)
    const rationale =
      typeof r.rationale === "string" && r.rationale.trim().length > 0
        ? r.rationale.trim()
        : `Closest structural match: ${FORMAT_META[format].label}.`

    return NextResponse.json({ format, rationale })
  } catch (error) {
    console.error("Classify format error:", error)
    return NextResponse.json({ error: "Failed to classify format" }, { status: 500 })
  }
}
