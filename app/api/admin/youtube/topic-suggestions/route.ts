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
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
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

    const userPrompt = focus
      ? `Scan the Dubai real estate market for the latest developments, with a focus on: ${focus}.\n\nToday's date context matters — prioritise news and data from the last 30-60 days. Return 5 topic prompts as the JSON array specified.`
      : `Scan the Dubai real estate market for the most significant developments in the last 30-60 days. Return 5 topic prompts as the JSON array specified.`

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
