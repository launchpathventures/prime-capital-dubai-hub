/**
 * CATALYST - YouTube Script Validation API
 *
 * POST /api/admin/youtube/validate-script
 *
 * Runs a comprehensive validation on a generated script, checking:
 * - Adherence to Script Generator v2.0 structure
 * - Prime Capital brand compliance
 * - Language quality and banned word detection
 * - YouTube best practices for retention
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { BRAND_GUIDE } from "@/lib/youtube/brand-guide"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

interface ValidateRequest {
  scriptId: string
  scriptBody: string
  packaging?: string
  hookV1?: string
  hookV2?: string
}

const VALIDATION_PROMPT = `You are a senior content quality analyst for Prime Capital Dubai. Your job is to validate YouTube scripts against the brand's strict quality standards.

You must evaluate the script across these categories and provide a structured assessment:

## Validation Categories

### 1. STRUCTURE COMPLIANCE
Check the script follows the required architecture:
- Packaging section (title options, thumbnail concept, CTA focus, target length)
- Two distinct hook versions (Hypothetical/Question + Warning/Contrarian)
- Context Loop (Authority → Trap → Consequence)
- Three body sections, each with (Misconception → Evidence → Explanation → Actionable Takeaway)
- Mid-roll CTA after Section 1
- End-roll CTA after final section
- Outro with Bridge + Tease

### 2. LANGUAGE COMPLIANCE
Check for banned words and phrases:
BANNED: luxury, amazing, incredible, breathtaking, stunning, don't miss out, act now, hurry, limited time, best deal, steal, bargain, trust us, trust me, exclusive, once in a lifetime, passive income, no-brainer, game-changer, unlock, dream home, hottest market, booming, skyrocketing, cash cow, guaranteed returns, risk-free
Also check: no ALL CAPS, no excessive exclamation marks, no emoji, no ellipsis for suspense

### 3. VOICE & BRAND
- Does it sound like Tahir — measured, evidence-based, conversational but authoritative?
- Is it the "private banker" voice, not a salesperson?
- Does it demonstrate authority through specificity, not claims?
- Would a CEO find the tone respectful of their intelligence?
- Is it distinctly Prime Capital — not interchangeable with another agency?

### 4. DATA & EVIDENCE
- Are there at least 3 specific data points?
- At least one anonymized client scenario?
- Are claims supported, not vague?
- Are area names, percentages, and timeframes cited?

### 5. RETENTION MECHANICS
- Does the hook create an open loop in the first 2 sentences?
- Are there 2-3 open loops planted and resolved?
- Pattern interrupts every 90-120 seconds?
- Mid-roll CTA feels natural, not interruptive?
- End-roll CTA feels earned?
- Outro points to specific next video?

### 6. YOUTUBE BEST PRACTICES
- Would the title attract clicks from informed investors (not clickbait)?
- Is the pacing appropriate for the target length?
- Are transitions natural for spoken delivery?
- Would this work on a teleprompter (plain text, short paragraphs)?

## Output Format
Return a JSON object:
{
  "overall": "A 2-3 sentence summary of the script's quality",
  "score": 0-100,
  "checks": [
    {
      "category": "Structure Compliance",
      "passed": true/false,
      "notes": "Specific feedback"
    },
    {
      "category": "Language Compliance",
      "passed": true/false,
      "notes": "List any violations found"
    },
    {
      "category": "Voice & Brand",
      "passed": true/false,
      "notes": "Specific feedback"
    },
    {
      "category": "Data & Evidence",
      "passed": true/false,
      "notes": "Specific feedback"
    },
    {
      "category": "Retention Mechanics",
      "passed": true/false,
      "notes": "Specific feedback"
    },
    {
      "category": "YouTube Best Practices",
      "passed": true/false,
      "notes": "Specific feedback"
    }
  ],
  "suggestions": ["Specific improvement suggestions"],
  "banned_words_found": ["any banned words or phrases detected"]
}

Return ONLY the JSON object, no other text.`

export async function POST(request: NextRequest) {
  try {
    // IP-based rate limiting
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-validate", RATE_LIMITS.AI)
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

    const body: ValidateRequest = await request.json()
    const { scriptId, scriptBody, packaging, hookV1, hookV2 } = body

    if (!scriptBody?.trim()) {
      return NextResponse.json(
        { error: "Script body is required" },
        { status: 400 }
      )
    }

    // Cap sizes to prevent runaway requests
    const MAX_SCRIPT_BODY = 50_000
    const MAX_SECTION = 10_000
    if (scriptBody.length > MAX_SCRIPT_BODY) {
      return NextResponse.json(
        { error: "Script body exceeds maximum length" },
        { status: 413 }
      )
    }
    const cappedPackaging = packaging?.slice(0, MAX_SECTION)
    const cappedHookV1 = hookV1?.slice(0, MAX_SECTION)
    const cappedHookV2 = hookV2?.slice(0, MAX_SECTION)

    const fullScript = [
      cappedPackaging && `PACKAGING:\n${cappedPackaging}`,
      cappedHookV1 && `HOOK V1:\n${cappedHookV1}`,
      cappedHookV2 && `HOOK V2:\n${cappedHookV2}`,
      `SCRIPT BODY:\n${scriptBody}`,
    ]
      .filter(Boolean)
      .join("\n\n---\n\n")

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 4096,
        temperature: 0.3,
        system: `${VALIDATION_PROMPT}\n\n## Brand Guide Reference\n${BRAND_GUIDE}`,
        messages: [
          {
            role: "user",
            content: `Validate this YouTube script for Prime Capital Dubai:\n\n${fullScript}`,
          },
        ],
      },
      { signal: request.signal }
    )

    const text =
      response.content[0].type === "text" ? response.content[0].text : ""

    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse validation" },
        { status: 500 }
      )
    }

    const validation = JSON.parse(jsonMatch[0])

    // Save validation results to the script record if scriptId provided
    if (scriptId) {
      await supabase
        .from("youtube_scripts")
        .update({
          validation_score: validation.score,
          validation_notes: validation,
          validated_at: new Date().toISOString(),
        })
        .eq("id", scriptId)
    }

    return NextResponse.json({ validation })
  } catch (error) {
    console.error("Validate script error:", error)
    return NextResponse.json(
      { error: "Failed to validate script" },
      { status: 500 }
    )
  }
}
