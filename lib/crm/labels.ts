/**
 * CATALYST - CRM Label Helpers (Client-Safe)
 *
 * Site-authored labels for CRM-canonical machine values. The CRM owns the
 * vocabulary (`60_40`, `off_plan`, etc.); this module owns how those values
 * are presented to humans.
 */

import type { CrmListingType, CrmPaymentPlanPreset } from "./types"

/** Short label for a payment-plan preset, used in dropdown options. */
export const PAYMENT_PLAN_PRESET_LABELS: Record<CrmPaymentPlanPreset, string> = {
  "60_40": "60/40",
  "50_50": "50/50",
  "40_60": "40/60",
  "20_80": "20/80",
  "10_90": "10/90",
  other: "Other / Non-standard",
}

/** Expanded explainer for the construction/handover split. */
export const PAYMENT_PLAN_PRESET_SUBLABELS: Record<CrmPaymentPlanPreset, string> = {
  "60_40": "60% during construction, 40% on handover",
  "50_50": "50% during construction, 50% on handover",
  "40_60": "40% during construction, 60% on handover",
  "20_80": "20% during construction, 80% on handover",
  "10_90": "10% during construction, 90% on handover",
  other: "Bespoke or post-handover plans",
}

/** "60_40" → "60/40 — 60% during construction, 40% on handover" */
export function formatPaymentPlanPreset(preset: CrmPaymentPlanPreset): string {
  return `${PAYMENT_PLAN_PRESET_LABELS[preset]} — ${PAYMENT_PLAN_PRESET_SUBLABELS[preset]}`
}

/**
 * Sort preset values for display. `other` (~57% of off-plan rows) always
 * sorts last so it doesn't dominate the dropdown.
 */
export function sortPaymentPlanPresets(presets: CrmPaymentPlanPreset[]): CrmPaymentPlanPreset[] {
  const STANDARD: CrmPaymentPlanPreset[] = ["60_40", "50_50", "40_60", "20_80", "10_90"]
  const standard = STANDARD.filter((p) => presets.includes(p))
  const includesOther = presets.includes("other")
  return includesOther ? [...standard, "other"] : standard
}

export const LISTING_TYPE_LABELS: Record<CrmListingType, string> = {
  off_plan: "Off-plan",
  secondary: "Secondary",
}
