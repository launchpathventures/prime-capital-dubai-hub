/**
 * CATALYST - YouTube Script Profile Registry
 *
 * A "Script Profile" is the presenter the generator is writing for. The same
 * brand-level rules (banned vocabulary, eight investor fears, CTA inventory)
 * apply to every profile, but the persona — first name, credibility anchor,
 * sign-off, hook examples — comes from the profile.
 *
 * Tahir is the default and current production voice. Ahmed Ashfaq is the
 * second profile, with content populated in a later phase.
 *
 * Add a new profile by:
 *   1. Creating a new file in this directory exporting a ScriptProfile
 *   2. Adding it to PROFILES below
 */

import { TAHIR_PROFILE } from "./tahir"
import { AHMED_PROFILE } from "./ahmed"

// =============================================================================
// TYPES
// =============================================================================

export type ProfileSlug = "tahir" | "ahmed"

export interface ScriptProfile {
  // === Registry identity ===

  /** Canonical slug — also the DB value persisted on a script */
  slug: ProfileSlug
  /** Human-friendly display name shown in the UI */
  displayName: string
  /** Role shown next to the name in the UI (e.g. "Founding Partner") */
  displayRole: string
  /** One-line description shown under the name in the selector */
  description: string

  // === Identity used inside prompts ===

  /** First name only — e.g. "Tahir" in "My name is Tahir." */
  firstName: string
  /** Full name — e.g. "Tahir Majithia" in the sign-off */
  fullName: string
  /** Full identity line for §1 of shared-immutables — e.g. "Tahir Majithia, founder of Prime Capital" */
  speakerLine: string
  /** Short role phrase used inside hooks — e.g. "founder of Prime Capital" */
  brandRole: string
  /** Full role with brand+city — e.g. "founder of Prime Capital Dubai" */
  brandRoleFullName: string
  /** Brand name without city — e.g. "Prime Capital" */
  brandName: string
  /** Brand name with city — e.g. "Prime Capital Dubai" */
  brandFullName: string
  /** Brand descriptor — e.g. "boutique Dubai property advisory" */
  brandDescriptor: string

  // === Track record (used throughout prompts) ===

  /** §1 track record row — e.g. "AED 3 billion+ deployed across multiple market cycles, 20+ years of experience" */
  trackRecordLine: string
  /** Spoken years phrase — e.g. "20 years" (used in "Over the last 20 years…") */
  yearsSpoken: string
  /** Label years phrase — e.g. "20+ years" (used in checklists and the preamble) */
  yearsLabel: string
  /** Spoken capital phrase — e.g. "three billion dirhams" */
  capitalSpoken: string
  /** Spoken capital with "over" prefix — e.g. "over three billion dirhams" */
  capitalSpokenLong: string
  /** Label capital phrase — e.g. "AED 3 billion+" (used in checklists and the preamble) */
  capitalLabel: string
  /** Inline label capital without plus — e.g. "AED 3 billion" (used in "deployed over AED 3 billion") */
  capitalLabelInline: string
  /** Short label capital — e.g. "AED 3B+" (used in short-form QC checklists) */
  capitalLabelShort: string
  /** Cycles phrase — e.g. "multiple market cycles" */
  cyclesPhrase: string
  /** Cycles short — e.g. "multiple cycles" */
  cyclesPhraseShort: string
  /** Dubai-specific cycles phrase — e.g. "multiple Dubai cycles" */
  cyclesDubaiPhrase: string

  // === Brand positioning ===

  /** §1 positioning row — e.g. 'Strategic investment advisor — the "private banker" of Dubai property' */
  positioning: string
  /** §1 anti-positioning row */
  antiPositioning: string
  /** §1 brand promise row — includes surrounding quotes */
  brandPromise: string
  /** §1 motto row — includes surrounding quotes */
  motto: string
  /** §1 audience row */
  audience: string
  /** §1 objective sentence — what every script should make the viewer think */
  objectiveStatement: string

  // === Verbatim sign-off + intro ===

  /** §2 sign-off — exact line spoken at end of every script (no surrounding quotes) */
  signOff: string
  /** Standard intro paragraph — for Authority Analysis only (~50 words) */
  standardIntro: string
  /** §15 QC credibility anchor — short phrase used in QC checklist */
  qcCredibilityAnchor: string

  // === Voice characterisation (for §3.1 of shared-immutables) ===

  /** One-line voice descriptor — e.g. "Confident, restrained, grounded, direct, warm, assured." */
  voiceDescriptor: string
  /** Voice analogy — e.g. "the way a thoughtful senior advisor explains something important to a peer over coffee — measured, clear, occasionally direct, always grounded in evidence." */
  voiceAnalogy: string

  // === Brand-guide labels ===

  /** Role label used in the brand guide identity table — e.g. "Founder" (Tahir's displayRole is "Founding Partner" but the brand-guide table uses the shorter "Founder") */
  brandGuideRoleLabel: string
}

// =============================================================================
// REGISTRY
// =============================================================================

export const PROFILES: Record<ProfileSlug, ScriptProfile> = {
  tahir: TAHIR_PROFILE,
  ahmed: AHMED_PROFILE,
}

/**
 * Ordered list of profiles for UI iteration (selector, dropdowns).
 * Tahir first as the production default.
 */
export const PROFILES_IN_DISPLAY_ORDER: ProfileSlug[] = ["tahir", "ahmed"]

/**
 * The default profile used when no profile slug is supplied (e.g. legacy
 * scripts persisted before the profile column existed).
 */
export const DEFAULT_PROFILE_SLUG: ProfileSlug = "tahir"
export const DEFAULT_PROFILE: ScriptProfile = TAHIR_PROFILE

// =============================================================================
// HELPERS
// =============================================================================

export function isProfileSlug(value: unknown): value is ProfileSlug {
  return typeof value === "string" && value in PROFILES
}

/**
 * Coerce an unknown value to a valid ProfileSlug, defaulting to the default.
 */
export function toProfileSlug(value: unknown): ProfileSlug {
  return isProfileSlug(value) ? value : DEFAULT_PROFILE_SLUG
}

/**
 * Get a profile by slug. Falls back to the default profile if the slug is
 * unknown — never throws.
 */
export function getProfile(slug: unknown): ScriptProfile {
  return PROFILES[toProfileSlug(slug)]
}

export { TAHIR_PROFILE, AHMED_PROFILE }
