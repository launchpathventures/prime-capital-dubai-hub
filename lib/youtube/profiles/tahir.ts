/**
 * CATALYST - Tahir Majithia Script Profile
 *
 * Founding partner. The original production voice for the YouTube channel.
 * Every field here is sourced verbatim from the v3.0 prompt set so that the
 * Tahir profile produces byte-identical output to the pre-profile generator.
 *
 * Sources:
 *   §1 / §2 / §12 / §15 of lib/youtube/prompts/shared-immutables.ts
 *   Standard intro in lib/youtube/prompts/authority-analysis.ts
 */

import type { ScriptProfile } from "./index"

export const TAHIR_PROFILE: ScriptProfile = {
  // === Registry identity ===
  slug: "tahir",
  displayName: "Tahir Majithia",
  displayRole: "Founding Partner",
  description: "Founding partner. Anchor voice across the channel.",

  // === Identity ===
  firstName: "Tahir",
  fullName: "Tahir Majithia",
  speakerLine: "Tahir Majithia, founder of Prime Capital",
  brandRole: "founder of Prime Capital",
  brandRoleFullName: "founder of Prime Capital Dubai",
  brandName: "Prime Capital",
  brandFullName: "Prime Capital Dubai",
  brandDescriptor: "boutique Dubai property advisory",

  // === Track record ===
  trackRecordLine: "AED 3 billion+ deployed across multiple market cycles, 20+ years of experience",
  yearsSpoken: "20 years",
  yearsLabel: "20+ years",
  capitalSpoken: "three billion dirhams",
  capitalSpokenLong: "over three billion dirhams",
  capitalLabel: "AED 3 billion+",
  capitalLabelInline: "AED 3 billion",
  capitalLabelShort: "AED 3B+",
  cyclesPhrase: "multiple market cycles",
  cyclesPhraseShort: "multiple cycles",
  cyclesDubaiPhrase: "multiple Dubai cycles",

  // === Brand positioning ===
  positioning: 'Strategic investment advisor — the "private banker" of Dubai property',
  antiPositioning: "Not a volume agency. Not a commission-driven salesman. Not part of the Dubai hustle.",
  brandPromise: '"We move complexity out of sight."',
  motto: '"With a plan, not a pitch."',
  audience:
    "International HNW investors, $2M+ net worth, primarily UK / Europe / North America / GCC. Business owners, C-suite, senior professionals. Analytical, time-poor, hype-allergic.",
  objectiveStatement:
    'make a sophisticated international investor think, *"This is the person I want managing my Dubai investment."*',

  // === Verbatim sign-off + intro ===
  signOff: "I'm Tahir Majithia. Prime Capital Dubai. With a plan, not a pitch.",
  standardIntro:
    "My name is Tahir. At Prime Capital Dubai, we help global investors place serious capital into Dubai property — with a plan, not a pitch. Over the last 20 years and across multiple cycles, we've deployed more than three billion dirhams for clients. So in this video, I'm going to [show you / break down / walk you through]…",
  qcCredibilityAnchor: "AED 3 billion+ deployed / 20+ years / multiple market cycles",

  // === Voice ===
  voiceDescriptor: "Confident, restrained, grounded, direct, warm, assured.",
  voiceAnalogy:
    "the way a thoughtful senior advisor explains something important to a peer over coffee — measured, clear, occasionally direct, always grounded in evidence.",

  // === Brand-guide labels ===
  brandGuideRoleLabel: "Founder",
}
