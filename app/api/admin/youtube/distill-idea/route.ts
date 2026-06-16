/**
 * CATALYST - YouTube Idea Distillation API
 *
 * POST /api/admin/youtube/distill-idea
 *
 * Mode B (Write One Script) entry point: takes a chunk of user-provided
 * context (notes, brief, competitor video transcript, half-formed thought)
 * + an explicitly chosen format, and condenses it into 3 distinct angles
 * the user picks from. The selected angle then feeds straight into
 * /generate-script.
 *
 * Distillation is different from idea brainstorming — it's not exploring
 * the topic space, it's compressing existing context into the most
 * defensible angles within a single format.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  FORMAT_META,
  isFormat,
  toFormat,
  type Format,
} from "@/lib/youtube/prompts"
import { getProfile, type ScriptProfile } from "@/lib/youtube/profiles"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface DistillRequest {
  context: string
  format: string
  profileSlug?: string
}

interface DistilledAngle {
  title: string
  topic: string
  why_this_angle: string
  news_peg: string | null
  needs_news_peg: boolean
  target_length: "quick_take" | "standard" | "deep_dive"
}

function systemPromptFor(format: Format, profile: ScriptProfile): string {
  const meta = FORMAT_META[format]

  const formatGuardrails: Record<Format, string> = {
    authority_analysis:
      "Each angle must lead with a non-obvious thesis the audience hasn't heard a hundred times. Macro / cycle / supply-side reasoning preferred over deal-level commentary.",
    myth_buster:
      "Each angle must name the specific myth being steelmanned and the evidence that dismantles it. The myth must be one investors actually hold — not a strawman.",
    reaction:
      "Each angle MUST be pegged to a concrete news event from an allowed source (DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P). If the context doesn't supply one, populate news_peg with null and set needs_news_peg true — the UI will block submission until a peg is added.",
    case_study:
      "Each angle must imply a real anonymisable client situation. If the context is purely topical, frame the angle as a prospective case study and say so in the why_this_angle field.",
    listicle:
      "Each angle's title must lead with a number. The criteria for inclusion in the list must be defensible — no arbitrary rankings.",
    qa_mailbag:
      "Each angle frames a tight cluster of 4–7 viewer questions on one theme. If the context implies real viewer questions, use them; otherwise flag a composite framing in why_this_angle.",
  }

  return `You are the creative director for ${profile.brandFullName}'s YouTube channel. Your job is to take user-provided context and distil it into THREE distinct, defensible angles within the ${meta.label} format.

## Format being targeted
${meta.label} — ${meta.hint}
Length: ${meta.minutesLabel} (${meta.wordsLabel})
Hook formula: ${meta.hookFormula} (${meta.hookName})
CTAs: ${meta.ctaCount}

## Format-specific guardrails
${formatGuardrails[format]}

## Who you're writing for
${profile.speakerLine} — a strategic investment advisor (not a real estate agent) who has deployed ${profile.capitalLabelInline} for clients across ${profile.cyclesPhrase}. Audience: international HNW investors ($2M+ net worth), business owners, C-suite, senior professionals from UK, Europe, North America, and GCC.

## What "distillation" means here
The user has given you context — possibly messy, possibly verbose. Do NOT brainstorm tangential ideas. Your job is to find the THREE strongest angles that are *actually inside* this context, expressed as ${meta.label}-shaped scripts. Each angle should be a different cut of the same material — not three minor variations of the same thesis.

## Voice guidelines for titles and topics
- Position ${profile.firstName} as the "private banker" of Dubai real estate — the antidote to the Dubai hustle
- Contrarian, data-driven angles that challenge common assumptions
- UK English (colour, analyse, centre)
- Never use: luxury, amazing, incredible, don't miss out, act now, passive income, no-brainer, trust me, guaranteed, hottest, booming
- No exclamation marks anywhere
- Think: what would make a skeptical CEO lean in?

## Output format
Return ONLY a JSON array of exactly 3 angle objects. No prose, no markdown.

\`\`\`json
[
  {
    "title": "Working title for the video (no exclamation marks, no banned vocab)",
    "topic": "2–3 sentence concept summary — the angle, the thesis, what the script would cover",
    "why_this_angle": "One sentence: why this is the strongest cut of the user's context",
    "news_peg": "Reaction only — one-sentence description of the news event with named source. null otherwise.",
    "needs_news_peg": "Reaction only — true if no peg available. false otherwise.",
    "target_length": "quick_take | standard | deep_dive — match the format default unless a strong reason to differ"
  }
]
\`\`\`

Each angle must be MEANINGFULLY DISTINCT — different lens, different data, different stake.`
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-distill", RATE_LIMITS.AI)
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

    const body: DistillRequest = await request.json()
    const { context, format: rawFormat, profileSlug } = body

    if (!context?.trim()) {
      return NextResponse.json({ error: "Context is required" }, { status: 400 })
    }
    if (!isFormat(rawFormat)) {
      return NextResponse.json({ error: "Format is required" }, { status: 400 })
    }

    const format: Format = toFormat(rawFormat)
    const meta = FORMAT_META[format]
    const profile = getProfile(profileSlug)

    const cappedContext = context.slice(0, 12_000)

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929",
        max_tokens: 2048,
        temperature: 0.7,
        system: systemPromptFor(format, profile),
        messages: [
          {
            role: "user",
            content: `Distil this context into 3 distinct ${meta.label} angles.

<user_context>
${cappedContext}
</user_context>

Return ONLY a JSON array of 3 angles.`,
          },
        ],
      },
      { signal: request.signal }
    )

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse angles" }, { status: 500 })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (err) {
      console.error("Distill JSON parse error:", err)
      return NextResponse.json({ error: "Failed to parse angles" }, { status: 500 })
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: "Failed to parse angles" }, { status: 500 })
    }

    const angles: DistilledAngle[] = parsed
      .map((raw): DistilledAngle | null => {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
        const r = raw as Record<string, unknown>
        const targetLength = r.target_length === "quick_take" || r.target_length === "deep_dive"
          ? r.target_length
          : "standard"
        const newsPeg = typeof r.news_peg === "string" && r.news_peg.length > 0 ? r.news_peg : null
        return {
          title: String(r.title ?? "").trim(),
          topic: String(r.topic ?? "").trim(),
          why_this_angle: String(r.why_this_angle ?? "").trim(),
          news_peg: newsPeg,
          needs_news_peg: format === "reaction" && (r.needs_news_peg === true || !newsPeg),
          target_length: targetLength,
        }
      })
      .filter((a): a is DistilledAngle => a !== null && a.title.length > 0)

    if (angles.length === 0) {
      return NextResponse.json({ error: "No usable angles returned" }, { status: 500 })
    }

    return NextResponse.json({ angles, format })
  } catch (error) {
    console.error("Distill idea error:", error)
    return NextResponse.json({ error: "Failed to distil context" }, { status: 500 })
  }
}
