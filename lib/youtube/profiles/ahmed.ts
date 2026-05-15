/**
 * CATALYST - Ahmed Ashfaq Script Profile
 *
 * Second presenter profile for the channel. Ahmed is an advisor on the Prime
 * Capital Dubai team — not the founder — so he speaks the firm's track record
 * in the first-person plural ("we've deployed…"), which every prompt template
 * already uses. The capital + cycle figures are therefore the firm's record
 * (identical to Tahir's) and remain truthful in Ahmed's voice; what changes is
 * the persona: name, role ("advisor", not "founder"), audience (local AND
 * international, multilingual reach), and sign-off.
 *
 * Persona sourced from the live funnel:
 *   app/(web)/ahmed-ashfaq/page.tsx + _components/ahmed-funnel.tsx
 *     - Arab-American, Dubai-based, 20+ years, fluent in four languages
 *     - Serves local and international investors; data-led positioning
 *
 * Brand-level fields (positioning, promise, motto, voice) are the Prime
 * Capital channel's immutables and stay identical to Tahir by design.
 */

import type { ScriptProfile } from "./index"

export const AHMED_PROFILE: ScriptProfile = {
  // === Registry identity ===
  slug: "ahmed",
  displayName: "Ahmed Ashfaq",
  displayRole: "Advisor",
  description: "Advisor. Arab-American, Dubai-based, four-language coverage.",

  // === Identity ===
  firstName: "Ahmed",
  fullName: "Ahmed Ashfaq",
  speakerLine: "Ahmed Ashfaq, advisor at Prime Capital",
  brandRole: "advisor at Prime Capital",
  brandRoleFullName: "advisor at Prime Capital Dubai",
  brandName: "Prime Capital",
  brandFullName: "Prime Capital Dubai",
  brandDescriptor: "boutique Dubai property advisory",

  // === Track record (Prime Capital firm record — Ahmed speaks it as "we") ===
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

  // === Brand positioning (Prime Capital level — same as Tahir) ===
  positioning: 'Strategic investment advisor — the "private banker" of Dubai property',
  antiPositioning: "Not a volume agency. Not a commission-driven salesman. Not part of the Dubai hustle.",
  brandPromise: '"We move complexity out of sight."',
  motto: '"With a plan, not a pitch."',
  audience:
    "Local and international investors placing serious capital into Dubai property — including Arab-American and GCC buyers who value an advisor who speaks their language, literally. Analytical, evidence-led, hype-allergic.",
  objectiveStatement:
    'make a sophisticated international investor think, *"This is the person I want managing my Dubai investment."*',

  // === Verbatim sign-off + intro ===
  signOff: "I'm Ahmed Ashfaq. Prime Capital Dubai. With a plan, not a pitch.",
  standardIntro:
    "My name is Ahmed. At Prime Capital Dubai, we help local and international investors place serious capital into Dubai property — with a plan, not a pitch. Over the last 20 years and across multiple cycles, we've deployed more than three billion dirhams for clients. So in this video, I'm going to [show you / break down / walk you through]…",
  qcCredibilityAnchor: "AED 3 billion+ deployed / 20+ years / multiple market cycles",

  // === Voice (Prime Capital channel voice — brand immutable, same as Tahir) ===
  voiceDescriptor: "Confident, restrained, grounded, direct, warm, assured.",
  voiceAnalogy:
    "the way a thoughtful senior advisor explains something important to a peer over coffee — measured, clear, occasionally direct, always grounded in evidence.",

  // === Brand-guide labels ===
  brandGuideRoleLabel: "Advisor",
}
