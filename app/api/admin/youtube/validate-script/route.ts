/**
 * CATALYST - YouTube Script Validation API
 *
 * POST /api/admin/youtube/validate-script
 *
 * Runs a comprehensive validation on a generated script, checking:
 * - Adherence to the format-specific structure (Authority Analysis, Myth-Buster,
 *   Reaction, Case Study, Listicle, or Q&A) loaded at runtime
 * - Prime Capital brand compliance
 * - Language quality and banned word detection
 * - YouTube best practices for retention
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { getBrandGuide } from "@/lib/youtube/brand-guide"
import {
  getSystemPrompt,
  toFormat,
  FORMAT_META,
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

interface ValidateRequest {
  scriptId: string
  scriptBody: string
  format?: string
  profileSlug?: string
  packaging?: string
  hookV1?: string
  hookV2?: string
}

function getValidationPrompt(profile: ScriptProfile): string {
  return `You are a senior content quality analyst for ${profile.brandFullName}. Your job is to validate YouTube scripts against the brand's strict quality standards AND the script's specific format spec.

You will be given:
1. The script to validate (in <script_to_validate> tags)
2. The format the script was generated in (e.g., Authority Analysis, Myth-Buster)
3. The full format prompt (the same prompt the generator used) appended below — use this as the source of truth for structural validation
4. The brand guide for voice / vocabulary checks

You must evaluate the script across these categories and provide a structured assessment:

## Validation Categories

### 1. STRUCTURE COMPLIANCE
Validate against the **format-specific structure** described in the format prompt below. Each format has a different structure — use the format's "Output structure (Markdown)" and "Format-specific QC checklist" sections as the authoritative reference. Do NOT apply Authority Analysis structure rules to a Myth-Buster, Reaction, Listicle, Case Study, or Q&A. Specifically:
- Authority Analysis: 2 hook versions, Context Loop, 3 body sections, mid-roll + end-roll + outro CTA
- Myth-Buster: 1 hook (Direct Contradiction), 3 sections (Myth steelman → What's Actually True → What This Means For You), CTAs #1, #2, #3
- Reaction: 1 hook, 3 sections (What Happened → What It Means → What I'm Telling Clients), **single CTA only** (CTA #2), no watch-next tease
- Case Study: 1 hook, 4 sections (Brief → What I Looked At → What I Recommended → What Actually Happened), CTAs #1, #2, #3, anonymisation declared
- Listicle: 1 hook (number-led), criteria framing, the list (with mid-list CTA #1), how to use, CTA #2, CTA #3
- Q&A: 1 hook (Direct Address), 4–7 questions each with one-sentence-answer + reasoning + risk caveat, CTA #1 mid, CTA #2 end, CTA #3 outro

Refer to the format prompt below for the complete signature patterns required for the specific format.

### 2. LANGUAGE COMPLIANCE
Check for banned words and phrases:
BANNED: luxury, amazing, incredible, breathtaking, stunning, don't miss out, act now, hurry, limited time, best deal, steal, bargain, trust us, trust me, exclusive, once in a lifetime, passive income, no-brainer, game-changer, unlock, dream home, hottest market, booming, skyrocketing, cash cow, guaranteed returns, risk-free
Also check: no ALL CAPS, no excessive exclamation marks, no emoji, no ellipsis for suspense, **UK English** (colour, analyse, centre — not American spellings)

### 3. VOICE & BRAND
- Does it sound like ${profile.firstName} — measured, evidence-based, confident, restrained, grounded, direct, warm, assured?
- Is it the "private banker" voice, not a salesperson?
- Does it demonstrate authority through specificity, not claims?
- Is the credibility anchor (${profile.capitalLabel}, ${profile.yearsLabel}, ${profile.cyclesPhrase}) referenced in the opening minute?
- Is the sign-off line exact: "${profile.signOff}"?

### 4. DATA & EVIDENCE
- Are there at least 3 specific data points (DLD AED figures, % YoY, occupancy, named regulatory dates, RERA stats)?
- At least one anonymised client scenario (where the format calls for one)?
- Are claims supported, not vague?
- Are sources named only from the allowed list (DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P)? Other sources must use generic attribution (e.g., "industry research").
- No US-imported metrics ("housing market," "months of inventory")?

### 5. RETENTION MECHANICS
- Does the hook create an open loop in the first 2 sentences?
- Does the format-specific signature pattern hold (e.g., "Most investors think…" openers in Authority Analysis sections; steelman before dismantle in Myth-Buster; date-stamp + named source in Reaction; anonymisation declaration in Case Study; number-led title in Listicle; direct one-sentence answer in Q&A)?
- Is the "what are the risks of being wrong?" beat present where the format requires it?
- CTAs feel earned, not interruptive?

### 6. CTA INVENTORY COMPLIANCE
- Only the three locked CTAs from the format prompt's CTA inventory used?
- CTA count matches the format (Reaction = 1; all others = 3)?
- The non-negotiable trust line "and if it doesn't make sense, we'll tell you that too" present in CTA #2?
- No invented CTAs, no webinar/newsletter/Telegram/etc.?

## Output Format
Return a JSON object:
{
  "overall": "A 2-3 sentence summary of the script's quality, mentioning the format checked",
  "score": 0-100,
  "checks": [
    {
      "category": "Structure Compliance",
      "passed": true/false,
      "notes": "Specific feedback referencing the format's structure requirements"
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
      "category": "CTA Inventory Compliance",
      "passed": true/false,
      "notes": "Specific feedback"
    }
  ],
  "suggestions": ["Specific improvement suggestions"],
  "banned_words_found": ["any banned words or phrases detected"]
}

Return ONLY the JSON object, no other text.`
}

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

    const { data: canAccess } = await supabase.rpc("can_access_youtube")
    if (!canAccess) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body: ValidateRequest = await request.json()
    const { scriptId, scriptBody, format: rawFormat, profileSlug: rawProfileSlug, packaging, hookV1, hookV2 } = body

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

    // Resolve the profile from the request body, falling back to the script's
    // stored profile_slug when the caller didn't pass one. getProfile() coerces
    // unknown values to the default profile, so this is always safe.
    let profileSlug = rawProfileSlug
    if (!profileSlug && scriptId) {
      const { data: scriptRow } = await supabase
        .from("youtube_scripts")
        .select("profile_slug")
        .eq("id", scriptId)
        .maybeSingle()
      profileSlug = scriptRow?.profile_slug
    }
    const profile = getProfile(profileSlug)

    // Resolve format and load the matching format spec for the validator's
    // structural reference. Falls back to authority_analysis for legacy
    // scripts that pre-date format-tagging.
    const format: Format = toFormat(rawFormat)
    const meta = FORMAT_META[format]
    const formatSpec = getSystemPrompt(format, profile)

    const fullScript = [
      cappedPackaging && `PACKAGING:\n${cappedPackaging}`,
      cappedHookV1 && `HOOK V1:\n${cappedHookV1}`,
      cappedHookV2 && `HOOK V2:\n${cappedHookV2}`,
      `SCRIPT BODY:\n${scriptBody}`,
    ]
      .filter(Boolean)
      .join("\n\n---\n\n")

    const systemPrompt = `${getValidationPrompt(profile)}

---

## Format being validated: ${meta.label}

Hook formula: ${meta.hookFormula} — ${meta.hookName}
Target length: ${meta.minutesLabel} (${meta.wordsLabel})
CTA count: ${meta.ctaCount}
Funnel position: ${meta.funnel}-funnel

The full format prompt (the same prompt the generator was instructed with) is below. Use its "Output structure (Markdown)" and "Format-specific QC checklist" sections as the structural source of truth.

<format_prompt>
${formatSpec}
</format_prompt>

---

## Brand Guide Reference

<brand_guide>
${getBrandGuide(profile)}
</brand_guide>`

    const response = await anthropic.messages.create(
      {
        model: process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929",
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Validate this YouTube script for ${profile.brandFullName}. The script was generated in the **${meta.label}** format — apply that format's structural rules.

<script_to_validate>
${fullScript}
</script_to_validate>`,
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
