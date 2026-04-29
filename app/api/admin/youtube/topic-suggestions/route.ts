/**
 * CATALYST - YouTube Topic Suggestions API
 *
 * POST /api/admin/youtube/topic-suggestions
 *
 * Uses Perplexity's web-search-enabled LLM to scan current Dubai real estate
 * market developments and return 5 topic prompts tuned for Prime Capital's
 * investor-focused YouTube channel.
 *
 * Output mix: ~60% contrarian/analytical, ~40% broader (hot takes, process explainers).
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  FORMAT_META,
  isFormat,
  type Format,
} from "@/lib/youtube/prompts"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
} from "@/lib/rate-limit"

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY

const SYSTEM_PROMPT = `You are the creative director for Prime Capital Dubai's YouTube channel. Your role is to scan what's happening in the Dubai real estate market RIGHT NOW and propose topic prompts that will make for high-engagement investor-focused videos.

## Who the Channel Is For
Tahir Majithia, founder of Prime Capital Dubai — strategic investment advisor (not agent). The audience is international HNW investors ($2M+ net worth), business owners, C-suite, senior professionals from UK, Europe, North America, GCC. They are analytical, skeptical of hype, research-driven.

## The Brand Voice
- Contrarian, data-driven, measured
- Position as the "private banker" of Dubai real estate
- 20+ years experience, AED 3B+ deployed across cycles
- Never salesy. Substance over shine.

## Your Task
Scan the current Dubai real estate market for developments happening in the last 30-60 days that would make for a compelling YouTube video. Look for:
- Regulatory changes (DLD, RERA, Golden Visa rules, mortgage caps)
- Market data shifts (yields, prices, transaction volumes by area)
- Developer news (launches, delays, completion patterns)
- Macro shifts affecting international investors (tax changes, currency, geopolitics)
- Supply/demand inflection points (oversupply warnings, undersupplied corridors)
- News events that sophisticated investors would want perspective on

Return 5 distinct topic prompts. Mix the styles:
- 3 should be CONTRARIAN/ANALYTICAL — challenge a consensus view with data
- 2 should be BROADER — hot take, process explainer, or macro/strategic frame

## Output Format
Return a JSON array of 5 topic prompts. Each:
{
  "title": "Short working video title (specific, tension/question)",
  "prompt": "A 2-4 sentence prompt describing what the video should cover — specific enough that it could be pasted into an AI tool to generate full script ideas from. Include key data points, angles, or questions to address.",
  "timeliness": "1 sentence on WHY this is timely right now (what just happened in the market)",
  "style": "contrarian | analytical | hot_take | process | macro"
}

Return ONLY the JSON array. No prose before or after.`

interface PerplexityMessage {
  role: string
  content: string
}

interface PerplexityResponse {
  choices?: { message?: PerplexityMessage }[]
}

/**
 * Per-format guidance for the market-scan prompt. Tells Perplexity what kind
 * of topics work well for each format so the suggestions land on briefs that
 * the idea generator and script generator can both run on cleanly.
 */
function formatTopicGuidance(format: Format): string {
  switch (format) {
    case "authority_analysis":
      return "macro theses, supply analysis, cycle commentary, market structure pieces. Topics rich in DLD / RERA / Central Bank UAE data."
    case "myth_buster":
      return "widely circulated property-bro narratives ripe for dismantling — common buyer mistakes, 'everyone says X but…' patterns, contested orthodoxies in Dubai property. The narrative must be currently circulating, not historic."
    case "reaction":
      return "concrete news events from the last 14 days with named sources from the allowed list: DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P. Each suggestion MUST cite the specific news item, the date, and the source. Without a fresh peg, do not propose a Reaction topic."
    case "case_study":
      return "anonymisable client situations or recent transaction patterns that illustrate a teachable principle. Note: these will need real-deal grounding from the operator — propose topics where a client situation could plausibly anchor the analysis."
    case "listicle":
      return "rankable / countable patterns — corridors to avoid, mistakes investors make, criteria to filter launches, questions to evaluate developers. Topics that naturally produce 3, 5, or 7 items each with a specific data point."
    case "qa_mailbag":
      return "clusters of related questions investors are asking right now — across timing, financing, exit liquidity, regional stability. Suggest themes that could anchor 4–7 viewer questions, real or composite."
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!PERPLEXITY_API_KEY) {
      return NextResponse.json(
        { error: "Perplexity API key not configured" },
        { status: 503 }
      )
    }

    // IP-based rate limit — Perplexity calls are expensive
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-topic-suggestions", {
      windowMs: 60 * 60 * 1000,
      maxRequests: 10,
    })
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

    // Optional: user can provide a focus area (capped to prevent token waste / prompt abuse)
    const body = await request.json().catch(() => ({}))
    const focus = typeof body?.focus === "string"
      ? body.focus.trim().slice(0, 500)
      : ""

    // Optional: user can pre-select formats. When set, steer suggestions
    // toward topics that work well for those formats (reactions need news
    // pegs; listicles need rankable patterns; myth-busters need circulating
    // narratives; etc).
    const rawFormats = Array.isArray(body?.formats) ? body.formats : []
    const formats: Format[] = rawFormats.filter(isFormat) as Format[]

    const formatGuidance = formats.length > 0
      ? `\n\n## Format constraint\nThe operator has pre-selected the following script format(s) for any video generated from these topics: ${formats.map((f) => FORMAT_META[f].label).join(", ")}. Bias the topic suggestions toward developments that work well for these formats:\n${formats.map((f) => `- **${FORMAT_META[f].label}**: ${formatTopicGuidance(f)}`).join("\n")}\n\nDistribute the 5 suggestions across the selected formats. If a selected format is **Live Reaction**, every suggestion under that format MUST cite a specific news event from the last 14 days with a named source from this allowed list: DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P. Do not propose Live Reaction topics without a concrete news peg.`
      : ""

    const userPrompt = (focus
      ? `Scan the Dubai real estate market for the latest developments, with a focus on the area provided by the operator below.\n\n<operator_focus>\n${focus}\n</operator_focus>\n\nToday's date context matters — prioritise news and data from the last 30-60 days. Return 5 topic prompts as the JSON array specified.`
      : `Scan the Dubai real estate market for the most significant developments in the last 30-60 days. Return 5 topic prompts as the JSON array specified.`
    ) + formatGuidance

    const res = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: request.signal,
      body: JSON.stringify({
        model: "sonar-pro",
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      console.error("Perplexity API error:", res.status, errText)
      return NextResponse.json(
        { error: "Market scan failed — Perplexity returned an error" },
        { status: 502 }
      )
    }

    const data: PerplexityResponse = await res.json()
    const text = data.choices?.[0]?.message?.content || ""

    // Extract JSON array — may be wrapped in ```json fences or prose
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error("Perplexity response had no JSON:", text.slice(0, 500))
      return NextResponse.json(
        { error: "Could not parse topic suggestions" },
        { status: 500 }
      )
    }

    let suggestions: unknown
    try {
      suggestions = JSON.parse(jsonMatch[0])
    } catch (err) {
      console.error("JSON parse error:", err, jsonMatch[0].slice(0, 500))
      return NextResponse.json(
        { error: "Invalid topic suggestions format" },
        { status: 500 }
      )
    }

    if (!Array.isArray(suggestions)) {
      return NextResponse.json(
        { error: "Invalid topic suggestions format" },
        { status: 500 }
      )
    }

    return NextResponse.json({ suggestions })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return NextResponse.json({ error: "Aborted" }, { status: 499 })
    }
    console.error("Topic suggestions error:", err)
    return NextResponse.json(
      { error: "Failed to fetch topic suggestions" },
      { status: 500 }
    )
  }
}
