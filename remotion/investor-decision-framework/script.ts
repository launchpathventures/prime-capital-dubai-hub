/**
 * CATALYST - Investor Decision Framework Video Script and Timing
 */

import {
  FRAMEWORK_CHECKS,
  FRAMEWORK_WALKTHROUGH_CAPTIONS,
} from "../../lib/lead-magnets/content"

export const FRAMEWORK_VIDEO_FPS = 30
export const FRAMEWORK_VIDEO_WIDTH = 1920
export const FRAMEWORK_VIDEO_HEIGHT = 1080

export type FrameworkVideoScene = {
  id: string
  durationInFrames: number
  eyebrow: string
  title: string
  narration: string
  captions: readonly string[]
  detailLines: readonly string[]
  record?: string
  checkIndex?: number
  treatment: "hero" | "check" | "close"
}

export const FRAMEWORK_VIDEO_SCENES: readonly FrameworkVideoScene[] = [
  {
    id: "opening",
    durationInFrames: 330,
    eyebrow: "Prime Capital · Investor working reference",
    title: "Five checks before a reservation becomes a decision.",
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[0],
    captions: [
      "Use this framework with one specific property in front of you.",
      "Write down the outcome it must deliver and your intended holding period.",
    ],
    detailLines: ["One property", "One objective", "Your own notes"],
    treatment: "hero",
  },
  {
    id: "objective-fit",
    durationInFrames: 354,
    eyebrow: "Check 01 · Objective fit",
    title: FRAMEWORK_CHECKS[0].title,
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[1],
    captions: [
      "Check one: objective fit.",
      "Define success before you test whether the property belongs in your plan.",
    ],
    detailLines: [
      "Required outcome",
      "Intended holding period",
      "One disqualifying condition",
    ],
    record: "Objective / holding period / disqualifying condition",
    checkIndex: 0,
    treatment: "check",
  },
  {
    id: "financial-commitment",
    durationInFrames: 390,
    eyebrow: "Check 02 · Cost",
    title: FRAMEWORK_CHECKS[1].title,
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[2],
    captions: [
      "Check two: the full financial commitment.",
      "Put every payment and continuing cost beside the quoted price.",
      "Mark anything still estimated.",
    ],
    detailLines: [
      "Purchase price + dated payments",
      "Transaction + finance costs",
      "Fit-out + continuing costs",
    ],
    record: "Cash now / cash later / costs still estimated",
    checkIndex: 1,
    treatment: "check",
  },
  {
    id: "evidence",
    durationInFrames: 426,
    eyebrow: "Check 03 · Evidence",
    title: FRAMEWORK_CHECKS[2].title,
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[3],
    captions: [
      "Check three: separate every claim from its source.",
      "Record the date, the evidence and whether it relates to this property.",
      "Repetition is not evidence.",
    ],
    detailLines: [
      "Claim → source",
      "Source → date",
      "Status → supported, projected or unproven",
    ],
    record: "Claim / source / date / status",
    checkIndex: 2,
    treatment: "check",
  },
  {
    id: "competition",
    durationInFrames: 390,
    eyebrow: "Check 04 · Competition",
    title: FRAMEWORK_CHECKS[3].title,
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[4],
    captions: [
      "Check four: identify the real competition and supply.",
      "Record what the same buyer or tenant can choose now.",
      "Then add relevant completed stock and future supply.",
    ],
    detailLines: [
      "Current alternatives",
      "Relevant completed stock",
      "Future supply in the holding period",
    ],
    record: "Three alternatives / differences / future supply",
    checkIndex: 3,
    treatment: "check",
  },
  {
    id: "exit",
    durationInFrames: 390,
    eyebrow: "Check 05 · Exit",
    title: FRAMEWORK_CHECKS[4].title,
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[5],
    captions: [
      "Check five: define the future buyer or tenant.",
      "Why may this property remain relevant to them?",
      "What can they afford, and what else could they choose?",
    ],
    detailLines: [
      "Future audience",
      "Reason to choose",
      "Strongest competing alternative",
    ],
    record: "Audience / reason to choose / strongest alternative",
    checkIndex: 4,
    treatment: "check",
  },
  {
    id: "close",
    durationInFrames: 420,
    eyebrow: "Complete the decision file",
    title: "Finish with three lines.",
    narration: FRAMEWORK_WALKTHROUGH_CAPTIONS[6],
    captions: [
      "Finish with what appears supported and what remains unproven.",
      "Then record the next decision to make.",
      "An unclear line tells you exactly what must be established next.",
    ],
    detailLines: [
      "What appears supported",
      "What remains unproven",
      "The next decision to make",
    ],
    treatment: "close",
  },
]

export const FRAMEWORK_VIDEO_TOTAL_FRAMES = FRAMEWORK_VIDEO_SCENES.reduce(
  (total, scene) => total + scene.durationInFrames,
  0
)
