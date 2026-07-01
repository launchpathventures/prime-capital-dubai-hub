/**
 * CATALYST - YouTube Script Idea Generation API
 *
 * POST /api/admin/youtube/generate-ideas
 *
 * Takes user input (topic text or voice transcription) and generates
 * multiple format-tagged script ideas. Each idea is mapped to one of the
 * six portfolio formats from lib/youtube/prompts.
 *
 * Optional: caller can pass `formats` to constrain which formats the AI
 * generates ideas in. If omitted, the AI picks the best mix for the topic.
 *
 * Reaction ideas without a concrete news peg are flagged with
 * `needs_news_peg: true` so the UI can grey them out (they can't be saved
 * without a peg).
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  FORMAT_META,
  FORMATS_IN_DISPLAY_ORDER,
  isFormat,
  type Format,
} from "@/lib/youtube/prompts"
import { getProfile, type ScriptProfile } from "@/lib/youtube/profiles"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"
import { cachedSystemPrompt } from "@/lib/ai/anthropic-cache"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerateIdeasRequest {
  input: string
  count?: number
  /** Optional pre-selected formats. Empty / undefined = AI picks the best mix. */
  formats?: string[]
  /** Existing idea titles to avoid duplicating when "generate more variations" is clicked. */
  existingTitles?: string[]
  /** Script Profile the ideas are being generated for. Defaults to Tahir. */
  profileSlug?: string
}

interface GeneratedIdea {
  title: string
  topic: string
  fear_addressed: string
  format: Format
  news_peg: string | null
  needs_news_peg: boolean
  target_length: "quick_take" | "standard" | "deep_dive"
}

const FORMAT_CATALOGUE = FORMATS_IN_DISPLAY_ORDER.map((slug) => {
  const meta = FORMAT_META[slug]
  const flags = [
    meta.newsPegRequired ? "REQUIRES a fresh news peg (DLD / RERA / Central Bank UAE / Fitch / Moody's / S&P)" : null,
    meta.clientSituationRequired ? "REQUIRES a real anonymisable client situation" : null,
    meta.questionsRequired ? "REQUIRES 4–7 viewer questions (real or composite — composite must be flagged)" : null,
  ].filter(Boolean)
  const flagText = flags.length > 0 ? ` — ${flags.join("; ")}` : ""
  return `- **${meta.label}** (\`${meta.slug}\`): ${meta.hint} (${meta.minutesLabel}, ${meta.wordsLabel}, ${meta.ctaCount} CTA${meta.ctaCount === 1 ? "" : "s"})${flagText}`
}).join("\n")

function getSystemPrompt(profile: ScriptProfile): string {
  return `You are the creative director for ${profile.brandFullName}'s YouTube channel. Your job is to generate distinct, format-tagged script ideas based on user input.

## Who you're writing for
${profile.speakerLine} — a strategic investment advisor (not a real estate agent) who has deployed ${profile.capitalLabelInline} for clients across ${profile.cyclesPhrase}. The audience: international HNW investors ($2M+ net worth), business owners, C-suite, senior professionals from UK, Europe, North America, and GCC.

## The six portfolio formats
Every idea must be tagged with one of these formats. Use the slug (the value in backticks) as the \`format\` field.

${FORMAT_CATALOGUE}

## Format-selection rules

### When the caller pre-selects formats
The user may pass a \`formats\` filter. If they do, **only generate ideas in those formats**. Distribute ideas across the selected formats — don't pile every idea onto one format.

### When no formats are pre-selected
Pick the best mix for the topic. Default mix for 5 ideas: 2 × Authority Analysis (the anchor), 1 × Myth-Buster, 1 × Listicle, 1 × Case Study or Q&A. Skew toward Authority Analysis for macro / cycle topics; skew toward Myth-Buster or Listicle for top-funnel topics; reserve Reaction for genuine news pegs only.

### Special handling per format

**Reaction:** Only generate a Reaction idea if the input genuinely contains or implies a fresh news peg from an allowed source (DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P). When you do, populate \`news_peg\` with a one-sentence description of the peg. If the user pre-selected Reaction but the input has no news peg, generate the idea anyway with \`needs_news_peg: true\` and a placeholder \`title\` and \`topic\` indicating the peg gap — the UI will grey it out and prompt the user to provide a peg.

**Case Study:** Only generate a Case Study idea if the input describes (or strongly implies) a real anonymisable client situation. If the input is purely topical and the user pre-selected Case Study, lean toward a different format unless you can frame the topic as a *prospective* case study (and flag that in the \`topic\` field).

**Q&A:** Only generate a Q&A idea if the input contains or implies multiple viewer questions. If the user pre-selected Q&A and the input is single-topic, frame the idea as "Q&A composite — five frequently-asked questions on [topic]" and note the composite framing in the \`topic\` field.

## Per-idea fields

Return a JSON array. Each idea has these fields:

\`\`\`json
{
  "title": "Working title — speak to investors, include tension or a question, no exclamation marks, no banned vocab (luxury, amazing, don't miss out, passive income, no-brainer, etc.)",
  "topic": "2–3 sentence concept summary explaining the angle, the format choice, and what the script would cover",
  "fear_addressed": "The primary investor concern this engages — one of the eight: bubble / developer delay / hidden fees / liquidity / tenants / region stability / contracts / managing from abroad",
  "format": "authority_analysis | myth_buster | reaction | case_study | listicle | qa_mailbag",
  "news_peg": "Only populated for reaction format — one-sentence description of the news event with named source. null for all other formats.",
  "needs_news_peg": "Only true for reaction ideas where no concrete news peg is available in the input. false for all other ideas.",
  "target_length": "quick_take | standard | deep_dive — match the format default unless the topic strongly justifies a different length"
}
\`\`\`

## Voice guidelines for titles and topics
- Position ${profile.firstName} as the "private banker" of Dubai real estate — the antidote to the Dubai hustle
- Contrarian, data-driven angles that challenge common assumptions
- UK English (colour, analyse, centre)
- Never use: luxury, amazing, incredible, don't miss out, act now, passive income, no-brainer, trust me, guaranteed, hottest, booming
- No exclamation marks anywhere
- Think: what would make a skeptical CEO lean in?

## Distinctness
Every idea in a batch must be **meaningfully distinct** from the others — different angle, different format, or different sub-topic. Avoid producing five ideas that are minor variations of the same thesis.

If the caller passes \`existingTitles\`, do not duplicate or near-duplicate any of those — generate genuinely new ideas.

## Output format
Return ONLY a JSON array. No prose, no markdown, no commentary. Just the array.`
}

export async function POST(request: NextRequest) {
  try {
    // IP-based rate limiting
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-ideas", RATE_LIMITS.AI)
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

    const body: GenerateIdeasRequest = await request.json()
    const { input, formats: rawFormats, existingTitles, profileSlug } = body

    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 })
    }

    const profile = getProfile(profileSlug)
    const systemPrompt = getSystemPrompt(profile)

    // Cap count to a reasonable range — guards against accidental large
    // generations and runaway AI cost.
    const count = Math.min(Math.max(body.count ?? 5, 1), 10)

    // Validate any pre-selected formats; drop unknown values rather than failing
    const requestedFormats = (rawFormats ?? []).filter(isFormat) as Format[]
    const formatsClause = requestedFormats.length > 0
      ? `Pre-selected formats — generate ideas ONLY in these: ${requestedFormats.map((f) => `\`${f}\` (${FORMAT_META[f].label})`).join(", ")}. Distribute the ${count} ideas across these formats.`
      : `No format filter — pick the best mix for the topic per the rules above.`

    const existingTitlesClause = existingTitles && existingTitles.length > 0
      ? `\n\nExisting idea titles to avoid duplicating:\n${existingTitles.map((t) => `- ${t}`).join("\n")}`
      : ""

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        temperature: 0.9,
        system: cachedSystemPrompt(systemPrompt),
        messages: [
          {
            role: "user",
            content: `Generate ${count} distinct format-tagged YouTube script ideas based on the user input below.

<user_input>
${input}
</user_input>

${formatsClause}${existingTitlesClause}

Return ONLY a JSON array. Each idea must include: title, topic, fear_addressed, format (one of the six slugs), news_peg (string or null), needs_news_peg (boolean), target_length.`,
          },
        ],
      },
      { signal: request.signal }
    )

    const text = response.content[0].type === "text" ? response.content[0].text : ""

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse ideas" }, { status: 500 })
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonMatch[0])
    } catch (err) {
      console.error("Idea JSON parse error:", err)
      return NextResponse.json({ error: "Failed to parse ideas" }, { status: 500 })
    }

    if (!Array.isArray(parsed)) {
      return NextResponse.json({ error: "Failed to parse ideas" }, { status: 500 })
    }

    // Normalise — drop malformed entries (null, primitives, arrays) and
    // ensure each surviving idea has a valid format slug. Fall back to
    // authority_analysis for anything the model returned wrong; preserve
    // the news-peg flag for the UI to grey out unsavable Reaction cards.
    const ideas: GeneratedIdea[] = parsed
      .map((raw): GeneratedIdea | null => {
        if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null
        const r = raw as Record<string, unknown>
        const format: Format = isFormat(r.format) ? r.format : "authority_analysis"
        const targetLength = (r.target_length === "quick_take" || r.target_length === "deep_dive")
          ? r.target_length
          : "standard"
        return {
          title: String(r.title ?? ""),
          topic: String(r.topic ?? ""),
          fear_addressed: String(r.fear_addressed ?? ""),
          format,
          news_peg: typeof r.news_peg === "string" && r.news_peg.length > 0 ? r.news_peg : null,
          needs_news_peg: format === "reaction" && (r.needs_news_peg === true || !r.news_peg),
          target_length: targetLength,
        }
      })
      .filter((idea): idea is GeneratedIdea => idea !== null)

    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("Generate ideas error:", error)
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 })
  }
}
