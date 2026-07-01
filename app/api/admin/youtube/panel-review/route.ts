/**
 * CATALYST - YouTube Panel Review API
 *
 * POST /api/admin/youtube/panel-review
 *
 * Runs a multi-agent panel against the current draft of a script:
 *
 *   - Structure Auditor   (Sonnet) — format-spec compliance
 *   - Brand Voice Critic  (Sonnet) — Tahir voice, banned words, UK English
 *   - Evidence Officer    (Sonnet) — data points, named-source whitelist
 *   - Retention Analyst   (Sonnet) — hook, signature patterns, CTAs
 *   - Synthesiser         (Haiku)  — combines the four reviewer outputs
 *
 * The four reviewers run in parallel. Each returns a strict JSON ReviewerOutput.
 * The synthesiser then takes the four JSON blobs (NOT the script again) and
 * produces a single PanelReview, which is persisted on youtube_scripts.
 *
 * Token strategy:
 *   - Each reviewer gets a focused system prompt + just the reference material
 *     it needs (format spec for Structure/Retention, brand guide for Voice/
 *     Evidence). No reviewer carries the omnibus validator prompt.
 *   - The synthesiser only sees the four small JSON outputs — it does not
 *     re-read the script, which keeps it cheap on Haiku.
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
import { getProfile, type ProfileSlug, type ScriptProfile } from "@/lib/youtube/profiles"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"
import { cachedSystemPrompt } from "@/lib/ai/anthropic-cache"
import type {
  PanelReview,
  ReviewerOutput,
} from "@/lib/actions/youtube"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const REVIEWER_MODEL =
  process.env.YOUTUBE_PANEL_REVIEWER_MODEL || "claude-sonnet-4-5-20250929"
const SYNTHESISER_MODEL =
  process.env.YOUTUBE_PANEL_SYNTHESISER_MODEL || "claude-haiku-4-5-20251001"

const MAX_SCRIPT_BODY = 50_000

interface PanelReviewRequest {
  scriptId: string
}

interface ScriptRow {
  id: string
  title: string
  topic: string | null
  format: Format | null
  profile_slug: ProfileSlug | null
  script_body: string | null
  packaging: string | null
  hook_v1: string | null
  hook_v2: string | null
  word_count: number | null
}

// =============================================================================
// REVIEWER PROMPTS
// =============================================================================
//
// Each reviewer is a specialist with a narrow lens. They MUST return strict
// JSON matching the ReviewerOutput shape. They do NOT synthesise — they just
// surface what they see through their lens.

const REVIEWER_JSON_SHAPE = `Return ONLY a single JSON object, no prose, no markdown fence:
{
  "score": <integer 0-100>,
  "verdict": "<one to two short sentences>",
  "top_issues": ["<specific, actionable issue>", "..."],
  "ok_signals": ["<concrete thing the script does well from this lens>", "..."]
}`

function structureAuditorPrompt(format: Format, profile: ScriptProfile): string {
  const meta = FORMAT_META[format]
  const formatSpec = getSystemPrompt(format, profile)
  return `You are the Structure Auditor on a multi-agent review panel for ${profile.brandFullName}'s YouTube scripts. Your single lens is FORMAT-SPEC COMPLIANCE.

Format being audited: ${meta.label}
Hook formula: ${meta.hookFormula} — ${meta.hookName}
Target length: ${meta.minutesLabel} (${meta.wordsLabel})
CTA count required: ${meta.ctaCount}

You check ONLY:
- Are the required sections present in the correct order? (Use the format's "Output structure (Markdown)" as the source of truth.)
- Does the hook follow formula ${meta.hookFormula} (${meta.hookName})?
- Is the CTA count exactly ${meta.ctaCount}? Are they the locked CTAs from the format's CTA inventory (no inventions)?
- Is the non-negotiable trust line "and if it doesn't make sense, we'll tell you that too" present where CTA #2 calls for it?
- Is the sign-off line exact: "${profile.signOff}"?
- For formats that require it: news peg date-stamped (Reaction), anonymisation declared (Case Study), question count 4-7 (Q&A), number-led title (Listicle).

You do NOT comment on voice, banned words, evidence, hook strength, or retention pacing — other reviewers handle those.

Score rubric:
  90-100 = every required structural element present and in order
  70-89  = minor structural drift (mislabeled heading, CTA in wrong place)
  50-69  = a required section missing or a CTA omitted
  0-49   = wrong format scaffold, multiple sections missing

${REVIEWER_JSON_SHAPE}

---

FORMAT SPEC (source of truth for structure):

${formatSpec}`
}

function brandVoiceCriticPrompt(profile: ScriptProfile): string {
  return `You are the Brand Voice Critic on a multi-agent review panel for ${profile.brandFullName}'s YouTube scripts. Your single lens is VOICE and LANGUAGE.

You check ONLY:
- Does the script sound like ${profile.fullName}: measured, evidence-based, restrained, warm, direct, "private banker" voice?
- Is the credibility anchor referenced in the opening minute (${profile.capitalLabel}, ${profile.yearsLabel}, ${profile.cyclesPhrase})?
- Banned words/phrases — list every occurrence: luxury, amazing, incredible, breathtaking, stunning, don't miss out, act now, hurry, limited time, best deal, steal, bargain, trust us, trust me, exclusive, once in a lifetime, passive income, no-brainer, game-changer, unlock, dream home, hottest market, booming, skyrocketing, cash cow, guaranteed returns, risk-free.
- UK English spelling throughout (colour, analyse, centre, behaviour, organisation — flag American spellings).
- No ALL-CAPS shouting, no exclamation-mark stacks, no emoji, no ellipsis for suspense.

You do NOT comment on structure, CTA count, evidence sourcing, or retention — other reviewers handle those.

Score rubric:
  90-100 = voice locked, zero banned words, UK English clean
  70-89  = minor voice slips or one banned phrase
  50-69  = multiple banned phrases or sustained voice drift (salesy/hyped passages)
  0-49   = wrong voice entirely (sales-pitch tone, US English, repeated banned words)

${REVIEWER_JSON_SHAPE}

---

BRAND GUIDE (voice reference):

${getBrandGuide(profile)}`
}

function evidenceOfficerPrompt(profile: ScriptProfile): string {
  return `You are the Evidence Officer on a multi-agent review panel for ${profile.brandFullName}'s YouTube scripts. Your single lens is EVIDENCE QUALITY and SOURCING.

You check ONLY:
- Does the script carry at least three specific, verifiable data points? Acceptable forms: AED figures from DLD, % YoY changes with a year-stamp, occupancy percentages, named regulatory dates, RERA-issued statistics.
- Is at least one anonymised client scenario present where the format calls for one (Authority Analysis, Case Study, Q&A)? Is the anonymisation declared, not implied?
- Are named sources drawn ONLY from the allowed list: DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P? Any other named institution is a violation — they should use generic attribution ("industry research", "market data").
- Are there any US-imported metrics that don't belong in a Dubai context? Flag every instance: "housing market" (use "property market"), "months of inventory", US-style mortgage rate framings, references to American regulatory bodies.
- Are vague claims ("studies show", "experts say") flagged as needing specificity?

You do NOT comment on structure, voice, hook strength, or CTAs — other reviewers handle those.

Score rubric:
  90-100 = 3+ verifiable data points, clean sourcing, anonymisation declared where required
  70-89  = enough evidence but one weak/vague claim
  50-69  = under-evidenced (1-2 data points) or one US-imported metric
  0-49   = no data points, or multiple sourcing violations

${REVIEWER_JSON_SHAPE}

---

EVIDENCE RULES REFERENCE (extract from brand guide):

- AED-denominated figures only. Never USD as primary.
- Named-source whitelist: DLD, RERA, Central Bank UAE, Fitch, Moody's, S&P.
- Generic attribution allowed for anything else: "industry research", "market data".
- Anonymisation declaration required for any client scenario: "Names and details changed. The numbers and timing are real."
- Dubai-native metrics only: AED figures, occupancy %, completion dates, payment-plan structures. No US imports.`
}

function retentionAnalystPrompt(format: Format, profile: ScriptProfile): string {
  const meta = FORMAT_META[format]
  const formatSpec = getSystemPrompt(format, profile)
  return `You are the Retention Analyst on a multi-agent review panel for ${profile.brandFullName}'s YouTube scripts. Your single lens is HOOK STRENGTH, SIGNATURE PATTERNS, and CTA PSYCHOLOGY.

You check ONLY:
- Does the hook create an open loop in the first two sentences — a tension the viewer needs the rest of the video to resolve? Or does it sag into context-setting?
- Does the format-specific signature pattern hold? Examples by format:
  - Authority Analysis: "Most investors think… The reality is…" openers in each body section.
  - Myth-Buster: steelman of the myth BEFORE the dismantle — does the viewer feel the writer takes the myth seriously?
  - Reaction: date-stamp + named source in the first 30 seconds.
  - Case Study: anonymisation declaration up front, then number-rich brief.
  - Listicle: number in the hook AND in the packaging title — both, or neither?
  - Q&A: each answer leads with a direct one-sentence answer BEFORE the reasoning.
- "What are the risks of being wrong?" beat present where the format calls for it (Authority Analysis, Case Study, Q&A).
- CTAs feel earned — they follow value delivered, not interrupt it. Mid-roll CTA placed at the natural pause? End-roll CTA feels like a logical next step?
- Pacing — are there places where a viewer would drop off? Long un-broken paragraphs, no specifics for 200+ words, repeated framing without new evidence?

You do NOT comment on banned words, sourcing rules, or section count — other reviewers handle those.

Score rubric:
  90-100 = hook lands hard, signature patterns hold throughout, CTAs feel earned
  70-89  = hook works but one signature pattern misses, or one CTA feels interruptive
  50-69  = hook is informational rather than tension-creating, or multiple pattern misses
  0-49   = hook is generic, signature patterns absent, CTAs feel bolted on

${REVIEWER_JSON_SHAPE}

---

FORMAT SPEC (for signature patterns and CTA placement — ${meta.label}):

${formatSpec}`
}

// =============================================================================
// SYNTHESISER PROMPT
// =============================================================================

const SYNTHESISER_PROMPT = `You are the synthesiser for a four-agent YouTube script review panel. Your inputs are the four reviewers' JSON outputs (Structure Auditor, Brand Voice Critic, Evidence Officer, Retention Analyst). You do not see the script — you only see what the reviewers reported.

Your job:
- Produce one overall score (0-100). Use a weighted average: Structure 25%, Voice 25%, Evidence 25%, Retention 25%. Round to the nearest integer.
- Write a one-to-two-sentence verdict that captures the dominant theme across reviewers (e.g., "Structurally sound and well-evidenced, but voice drifts into sales territory in the mid-roll").
- Separate the reviewers' issues into:
  - **blocking_issues**: must-fix before recording. Pull from top_issues where the underlying rule is non-negotiable (banned words, missing sign-off, no anonymisation declared, wrong CTA count, sourcing violations).
  - **polish_recommendations**: nice-to-have. Pacing tweaks, sharper hook variants, tightening prose.
- Set ready_to_record: true ONLY if there are zero blocking_issues. Otherwise false.

Deduplicate when reviewers raise the same issue. Use UK English. Keep entries short — one phrase per item.

Return ONLY a single JSON object, no prose, no markdown fence:
{
  "overall_score": <integer 0-100>,
  "verdict": "<one to two short sentences>",
  "blocking_issues": ["<must-fix item>", "..."],
  "polish_recommendations": ["<nice-to-have item>", "..."],
  "ready_to_record": <true | false>
}`

// =============================================================================
// HELPERS
// =============================================================================

/** Extract the first JSON object from a model response and parse it. */
function parseJsonObject(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error("No JSON object found in response")
  return JSON.parse(match[0])
}

function coerceReviewerOutput(raw: unknown, fallbackVerdict: string): ReviewerOutput {
  const obj = (raw ?? {}) as Record<string, unknown>
  const score = Number(obj.score)
  const verdict = typeof obj.verdict === "string" ? obj.verdict : fallbackVerdict
  const top_issues = Array.isArray(obj.top_issues)
    ? obj.top_issues.filter((s): s is string => typeof s === "string")
    : []
  const ok_signals = Array.isArray(obj.ok_signals)
    ? obj.ok_signals.filter((s): s is string => typeof s === "string")
    : []
  return {
    score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : 0,
    verdict,
    top_issues,
    ok_signals,
  }
}

/** Build the script payload sent to each reviewer. Includes packaging + hooks. */
function buildScriptPayload(script: ScriptRow): string {
  const parts: string[] = []
  if (script.packaging) parts.push(`PACKAGING:\n${script.packaging}`)
  if (script.hook_v1) parts.push(`HOOK V1:\n${script.hook_v1}`)
  if (script.hook_v2) parts.push(`HOOK V2:\n${script.hook_v2}`)
  parts.push(`SCRIPT BODY:\n${script.script_body}`)
  return parts.join("\n\n---\n\n")
}

/** Run one Sonnet reviewer call and parse its JSON output. */
async function runReviewer(
  systemPrompt: string,
  scriptPayload: string,
  reviewerLabel: string,
  signal: AbortSignal
): Promise<ReviewerOutput> {
  const response = await anthropic.messages.create(
    {
      model: REVIEWER_MODEL,
      max_tokens: 2048,
      temperature: 0.3,
      system: cachedSystemPrompt(systemPrompt),
      messages: [
        {
          role: "user",
          content: `Review this YouTube script through your lens only. Return strict JSON per the schema.

<script_to_review>
${scriptPayload}
</script_to_review>`,
        },
      ],
    },
    { signal }
  )

  const text =
    response.content[0]?.type === "text" ? response.content[0].text : ""

  try {
    const parsed = parseJsonObject(text)
    return coerceReviewerOutput(parsed, `${reviewerLabel} returned no verdict.`)
  } catch (err) {
    console.error(`${reviewerLabel} JSON parse failed:`, err, text)
    return {
      score: 0,
      verdict: `${reviewerLabel} failed to return parseable JSON.`,
      top_issues: ["Reviewer output unparseable — re-run the panel."],
      ok_signals: [],
    }
  }
}

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-panel", RATE_LIMITS.AI)
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

    const body: PanelReviewRequest = await request.json()
    const { scriptId } = body
    if (!scriptId) {
      return NextResponse.json(
        { error: "scriptId is required" },
        { status: 400 }
      )
    }

    // -------------------------------------------------------------------------
    // Load script
    // -------------------------------------------------------------------------

    const { data: script, error: scriptErr } = await supabase
      .from("youtube_scripts")
      .select(
        "id, title, topic, format, profile_slug, script_body, packaging, hook_v1, hook_v2, word_count"
      )
      .eq("id", scriptId)
      .maybeSingle<ScriptRow>()

    if (scriptErr || !script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }
    if (!script.script_body?.trim()) {
      return NextResponse.json(
        { error: "Cannot review a script with no body yet" },
        { status: 400 }
      )
    }
    if (script.script_body.length > MAX_SCRIPT_BODY) {
      return NextResponse.json(
        { error: "Script body exceeds maximum length" },
        { status: 413 }
      )
    }

    const format: Format = toFormat(script.format)
    const profile = getProfile(script.profile_slug)
    const scriptPayload = buildScriptPayload(script)

    // -------------------------------------------------------------------------
    // Run the four reviewers in parallel
    // -------------------------------------------------------------------------

    const [structure, voice, evidence, retention] = await Promise.all([
      runReviewer(
        structureAuditorPrompt(format, profile),
        scriptPayload,
        "Structure Auditor",
        request.signal
      ),
      runReviewer(
        brandVoiceCriticPrompt(profile),
        scriptPayload,
        "Brand Voice Critic",
        request.signal
      ),
      runReviewer(
        evidenceOfficerPrompt(profile),
        scriptPayload,
        "Evidence Officer",
        request.signal
      ),
      runReviewer(
        retentionAnalystPrompt(format, profile),
        scriptPayload,
        "Retention Analyst",
        request.signal
      ),
    ])

    // -------------------------------------------------------------------------
    // Synthesise — Haiku takes only the four JSON outputs
    // -------------------------------------------------------------------------

    const reviewerSummary = JSON.stringify(
      {
        structure,
        voice,
        evidence,
        retention,
      },
      null,
      2
    )

    const synthResponse = await anthropic.messages.create(
      {
        model: SYNTHESISER_MODEL,
        max_tokens: 1024,
        temperature: 0.2,
        system: SYNTHESISER_PROMPT,
        messages: [
          {
            role: "user",
            content: `Here are the four reviewer outputs to synthesise:

<reviewer_outputs>
${reviewerSummary}
</reviewer_outputs>`,
          },
        ],
      },
      { signal: request.signal }
    )

    const synthText =
      synthResponse.content[0]?.type === "text"
        ? synthResponse.content[0].text
        : ""

    let synth: {
      overall_score: number
      verdict: string
      blocking_issues: string[]
      polish_recommendations: string[]
      ready_to_record: boolean
    }
    try {
      const parsed = parseJsonObject(synthText) as Record<string, unknown>
      const overall = Number(parsed.overall_score)
      synth = {
        overall_score: Number.isFinite(overall)
          ? Math.max(0, Math.min(100, Math.round(overall)))
          : Math.round(
              (structure.score + voice.score + evidence.score + retention.score) /
                4
            ),
        verdict:
          typeof parsed.verdict === "string"
            ? parsed.verdict
            : "Panel reviewed — see reviewer cards for detail.",
        blocking_issues: Array.isArray(parsed.blocking_issues)
          ? parsed.blocking_issues.filter(
              (s): s is string => typeof s === "string"
            )
          : [],
        polish_recommendations: Array.isArray(parsed.polish_recommendations)
          ? parsed.polish_recommendations.filter(
              (s): s is string => typeof s === "string"
            )
          : [],
        ready_to_record: parsed.ready_to_record === true,
      }
    } catch (err) {
      console.error("Synthesiser JSON parse failed:", err, synthText)
      synth = {
        overall_score: Math.round(
          (structure.score + voice.score + evidence.score + retention.score) / 4
        ),
        verdict: "Synthesiser failed to parse — falling back to averaged score.",
        blocking_issues: [],
        polish_recommendations: [],
        ready_to_record: false,
      }
    }

    const reviewedAt = new Date().toISOString()
    const panelReview: PanelReview = {
      overall_score: synth.overall_score,
      verdict: synth.verdict,
      blocking_issues: synth.blocking_issues,
      polish_recommendations: synth.polish_recommendations,
      ready_to_record: synth.ready_to_record,
      reviewers: { structure, voice, evidence, retention },
      reviewed_at: reviewedAt,
    }

    // -------------------------------------------------------------------------
    // Persist on the live row
    // -------------------------------------------------------------------------

    const { error: updateErr } = await supabase
      .from("youtube_scripts")
      .update({
        panel_review: panelReview,
        panel_review_score: panelReview.overall_score,
        panel_reviewed_at: reviewedAt,
      })
      .eq("id", scriptId)
    if (updateErr) {
      console.error("Failed to persist panel review:", updateErr)
    }

    // We still return the computed review so the client can render it even if
    // the persist failed — but `persisted: false` lets the client warn the
    // user to re-run rather than silently lose the result on next reload.
    return NextResponse.json({ panelReview, persisted: !updateErr })
  } catch (error) {
    console.error("Panel review error:", error)
    return NextResponse.json(
      { error: "Failed to run panel review" },
      { status: 500 }
    )
  }
}
