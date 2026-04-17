/**
 * CATALYST - YouTube Script Idea Generation API
 *
 * POST /api/admin/youtube/generate-ideas
 *
 * Takes user input (topic text or voice transcription) and generates
 * multiple script ideas using the Prime Capital script generator prompt.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface GenerateIdeasRequest {
  input: string
  count?: number
}

const SYSTEM_PROMPT = `You are the creative director for Prime Capital Dubai's YouTube channel. Your job is to generate compelling video script ideas based on user input.

## Who You're Writing For
Tahir Majithia, founder of Prime Capital Dubai — a strategic investment advisor (not a real estate agent) who has deployed over AED 3 billion for clients across multiple market cycles. His audience: international HNW investors ($2M+ net worth), business owners, C-suite executives from UK, Europe, North America, and GCC.

## Your Task
Generate distinct YouTube video script ideas. Each idea should:
1. Have a compelling working title (speak to investors, not tourists — include tension or a question)
2. A 2-3 sentence concept summary explaining the angle and why it matters
3. The primary audience fear or motivation it addresses
4. Suggested video type: market_analysis, area_guide, developer_analysis, regulatory_process
5. Suggested length: quick_take (5-7 min), standard (8-12 min), or deep_dive (12-15 min)

## Voice Guidelines
- Position Tahir as the "private banker" of Dubai real estate
- Contrarian, data-driven angles that challenge common assumptions
- Never use: luxury, amazing, incredible, don't miss out, act now, passive income, no-brainer, trust me
- Think: What would make a skeptical CEO lean in?

## Output Format
Return a JSON array of ideas. Each idea:
{
  "title": "The working title",
  "topic": "2-3 sentence concept",
  "fear_addressed": "The primary investor concern this tackles",
  "video_type": "market_analysis | area_guide | developer_analysis | regulatory_process",
  "target_length": "quick_take | standard | deep_dive"
}

Return ONLY the JSON array, no other text.`

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

    const { data: isAdmin } = await supabase.rpc("is_admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body: GenerateIdeasRequest = await request.json()
    const { input, count = 5 } = body

    if (!input?.trim()) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 })
    }

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 2048,
        temperature: 0.9,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: `Generate ${count} distinct YouTube script ideas based on this input:\n\n${input}\n\nRemember: return ONLY a JSON array.`,
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

    const ideas = JSON.parse(jsonMatch[0])
    return NextResponse.json({ ideas })
  } catch (error) {
    console.error("Generate ideas error:", error)
    return NextResponse.json({ error: "Failed to generate ideas" }, { status: 500 })
  }
}
