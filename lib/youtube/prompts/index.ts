/**
 * CATALYST - YouTube Format-Portfolio Prompt Dispatcher
 *
 * Single entry point for the six format-specific prompts. Composes the
 * shared brand-level immutables with the per-format prompt at generation
 * time:
 *
 *   const systemPrompt = getSystemPrompt('myth_buster')
 *
 * Used by:
 *   - app/api/admin/youtube/generate-script/route.ts
 *   - app/api/admin/youtube/generate-ideas/route.ts (FORMAT_META only)
 *   - UI: Step 1 format pills, Step 2 format badges, detail page
 */

import { SHARED_IMMUTABLES } from "./shared-immutables"
import { AUTHORITY_ANALYSIS_PROMPT } from "./authority-analysis"
import { MYTH_BUSTER_PROMPT } from "./myth-buster"
import { REACTION_PROMPT } from "./reaction"
import { CASE_STUDY_PROMPT } from "./case-study"
import { LISTICLE_PROMPT } from "./listicle"
import { QA_MAILBAG_PROMPT } from "./qa-mailbag"

// =============================================================================
// TYPES
// =============================================================================

export type Format =
  | "authority_analysis"
  | "myth_buster"
  | "reaction"
  | "case_study"
  | "listicle"
  | "qa_mailbag"

export type FundnelStage = "top" | "mid" | "bottom"

export interface FormatMeta {
  /** Canonical slug — also the DB value */
  slug: Format
  /** Human-friendly display name */
  label: string
  /** One-line use-case hint shown on hover/title under the pill */
  hint: string
  /** Funnel stage this format is built for */
  funnel: FundnelStage
  /** Default target length string (matches existing target_length convention) */
  defaultLength: "quick_take" | "standard" | "deep_dive"
  /** Spoken minutes range for display */
  minutesLabel: string
  /** Word count range for display */
  wordsLabel: string
  /** Hook formula letter (A–F) */
  hookFormula: "A" | "B" | "C" | "D" | "E" | "F"
  /** Hook formula name */
  hookName: string
  /** Number of CTAs — Reaction is 1, others are 3 */
  ctaCount: 1 | 3
  /** True if format requires a fresh news peg (Reaction) */
  newsPegRequired: boolean
  /** True if format requires a real anonymisable client situation (Case Study) */
  clientSituationRequired: boolean
  /** True if format requires viewer questions (Q&A) */
  questionsRequired: boolean
}

// =============================================================================
// FORMAT METADATA
// =============================================================================

export const FORMAT_META: Record<Format, FormatMeta> = {
  authority_analysis: {
    slug: "authority_analysis",
    label: "Authority Analysis",
    hint: "Anchor format. Macro thesis, supply analysis, cycle commentary. Two hook versions.",
    funnel: "mid",
    defaultLength: "standard",
    minutesLabel: "8–10 min",
    wordsLabel: "~1,500–1,700 words",
    hookFormula: "A",
    hookName: "Rhetorical Question + Empathy",
    ctaCount: 3,
    newsPegRequired: false,
    clientSituationRequired: false,
    questionsRequired: false,
  },
  myth_buster: {
    slug: "myth_buster",
    label: "Myth-Buster",
    hint: "Top-funnel. Steelman a popular narrative, then dismantle it with evidence.",
    funnel: "top",
    defaultLength: "standard",
    minutesLabel: "6–8 min",
    wordsLabel: "~1,100–1,400 words",
    hookFormula: "B",
    hookName: "Direct Contradiction",
    ctaCount: 3,
    newsPegRequired: false,
    clientSituationRequired: false,
    questionsRequired: false,
  },
  reaction: {
    slug: "reaction",
    label: "Live Reaction",
    hint: "Top-funnel. News-cycle hot-take. Single CTA. Requires a fresh news peg.",
    funnel: "top",
    defaultLength: "quick_take",
    minutesLabel: "4–6 min",
    wordsLabel: "~750–1,000 words",
    hookFormula: "C",
    hookName: "News Headline + Tahir's Read",
    ctaCount: 1,
    newsPegRequired: true,
    clientSituationRequired: false,
    questionsRequired: false,
  },
  case_study: {
    slug: "case_study",
    label: "Case Study",
    hint: "Mid/bottom-funnel. Real anonymised client deal — brief, analysis, recommendation, outcome.",
    funnel: "bottom",
    defaultLength: "deep_dive",
    minutesLabel: "9–12 min",
    wordsLabel: "~1,600–2,000 words",
    hookFormula: "D",
    hookName: "Real Deal Walk-Through",
    ctaCount: 3,
    newsPegRequired: false,
    clientSituationRequired: true,
    questionsRequired: false,
  },
  listicle: {
    slug: "listicle",
    label: "Listicle",
    hint: "Top-funnel CTR engine. Title and thumbnail must lead with a number.",
    funnel: "top",
    defaultLength: "standard",
    minutesLabel: "7–9 min",
    wordsLabel: "~1,300–1,500 words",
    hookFormula: "E",
    hookName: "Numbered Curiosity",
    ctaCount: 3,
    newsPegRequired: false,
    clientSituationRequired: false,
    questionsRequired: false,
  },
  qa_mailbag: {
    slug: "qa_mailbag",
    label: "Q&A / Mailbag",
    hint: "Bottom-funnel. 4–7 viewer questions, direct one-sentence answers, then reasoning.",
    funnel: "bottom",
    defaultLength: "standard",
    minutesLabel: "8–12 min",
    wordsLabel: "~1,400–1,800 words",
    hookFormula: "F",
    hookName: "Direct Address",
    ctaCount: 3,
    newsPegRequired: false,
    clientSituationRequired: false,
    questionsRequired: true,
  },
}

// =============================================================================
// PROMPT MAP
// =============================================================================

const FORMAT_PROMPTS: Record<Format, string> = {
  authority_analysis: AUTHORITY_ANALYSIS_PROMPT,
  myth_buster: MYTH_BUSTER_PROMPT,
  reaction: REACTION_PROMPT,
  case_study: CASE_STUDY_PROMPT,
  listicle: LISTICLE_PROMPT,
  qa_mailbag: QA_MAILBAG_PROMPT,
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Compose the full system prompt for a generation request: shared brand-level
 * immutables + the format-specific prompt.
 */
export function getSystemPrompt(format: Format): string {
  return `${SHARED_IMMUTABLES}\n\n---\n\n${FORMAT_PROMPTS[format]}`
}

/**
 * Ordered list of formats for UI iteration (pills, dropdowns, etc.).
 * Order is: Authority Analysis (anchor), then top-funnel CTR drivers,
 * then bottom-funnel community formats.
 */
export const FORMATS_IN_DISPLAY_ORDER: Format[] = [
  "authority_analysis",
  "myth_buster",
  "listicle",
  "reaction",
  "case_study",
  "qa_mailbag",
]

/**
 * Default format used when none is specified (e.g., backfill of legacy
 * scripts that were generated before format selection existed).
 */
export const DEFAULT_FORMAT: Format = "authority_analysis"

/**
 * Type guard — narrows an arbitrary string to a valid Format.
 * Returns false for unknown values; callers should fall back to DEFAULT_FORMAT.
 */
export function isFormat(value: unknown): value is Format {
  return typeof value === "string" && value in FORMAT_PROMPTS
}

/**
 * Coerce an unknown value to a valid Format, defaulting to authority_analysis.
 */
export function toFormat(value: unknown): Format {
  return isFormat(value) ? value : DEFAULT_FORMAT
}
