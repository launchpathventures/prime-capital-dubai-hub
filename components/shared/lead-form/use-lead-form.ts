/**
 * CATALYST - useLeadForm Hook
 *
 * Manages multi-step form state, navigation, and submission.
 */

"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useAttribution, generateSubmissionId } from "@/lib/hooks/use-attribution"
import type {
  LeadFormData,
  FormJourney,
  FormMode,
  StepId,
  LeadGoal,
} from "./types"

// =============================================================================
// STEP DEFINITIONS
// =============================================================================

interface StepDef {
  id: StepId
  modes: FormMode[]
  condition?: (data: Partial<LeadFormData>) => boolean
}

const ALL_MODES: FormMode[] = [
  "contact",
  "landing",
  "download",
  "private",
  "property-enquiry",
  "newsletter",
  "event",
]

// Buyer-side goals (everything except "sell" and "advice-only") gate the
// timeline + budget, preferences, and locations steps. Property-enquiry mode
// always sees the buyer chain since the visitor came from a property page.
const BUYER_GOALS: LeadGoal[] = [
  "invest-offplan",
  "buy-ready",
  "build-wealth",
  "golden-visa",
]

function isBuyerStep(data: Partial<LeadFormData>) {
  if (data.formMode === "property-enquiry") return true
  return data.goals?.some((g) => BUYER_GOALS.includes(g)) ?? false
}

const STEPS: StepDef[] = [
  { id: "name", modes: ALL_MODES },
  { id: "contact", modes: ALL_MODES },
  { id: "enquiry-intent", modes: ["property-enquiry"] },
  { id: "property-appeal", modes: ["property-enquiry"] },
  { id: "goals", modes: ["contact"] },
  {
    id: "timeline-budget",
    modes: ["contact", "property-enquiry"],
    condition: isBuyerStep,
  },
  {
    id: "preferences",
    modes: ["contact", "property-enquiry"],
    condition: isBuyerStep,
  },
  {
    id: "locations",
    modes: ["contact", "property-enquiry"],
    condition: isBuyerStep,
  },
  {
    id: "property",
    modes: ["contact"],
    condition: (data) => data.goals?.includes("sell") ?? false,
  },
  { id: "questions", modes: ["contact"] },
  { id: "private-context", modes: ["private"] },
  { id: "success", modes: ALL_MODES },
]

const SECOND_OPINION_STEPS: StepId[] = [
  "name",
  "contact",
  "second-opinion-property",
  "second-opinion-review",
  "success",
]

// Returning leads (property-enquiry with bitrixLeadId) skip these steps —
// they go straight to enquiry-intent → property-appeal → success.
const RETURNING_LEAD_SKIP_STEPS: StepId[] = [
  "name",
  "contact",
  "goals",
  "timeline-budget",
  "preferences",
  "locations",
  "property",
  "questions",
]

// =============================================================================
// HOOK
// =============================================================================

interface UseLeadFormOptions {
  mode: FormMode
  journey?: FormJourney
  onSuccess?: (data: LeadFormData) => void
  honeypot?: string
  tag?: string
  bitrixLeadId?: string
  leadMagnet?: string
  leadMagnetId?: LeadFormData["leadMagnetId"]
  leadMagnetFields?: LeadFormData["leadMagnetFields"]
  initialData?: Partial<LeadFormData>
  persistKey?: string
  prefillKey?: string
  skipPrefilledContact?: boolean
}

interface UseLeadFormReturn {
  // Current state
  currentStep: StepId
  currentStepIndex: number
  totalSteps: number
  data: Partial<LeadFormData>
  isSubmitting: boolean
  error: string | null

  // Navigation
  nextStep: () => void
  prevStep: () => void
  canGoBack: boolean
  canGoNext: boolean

  // Data updates
  updateData: (updates: Partial<LeadFormData>) => void

  // Submission
  submit: (finalUpdates?: Partial<LeadFormData>) => Promise<void>

  // Computed
  availableSteps: StepId[]
  progress: number
}

export function useLeadForm({
  mode,
  journey = "default",
  onSuccess,
  honeypot,
  tag,
  bitrixLeadId,
  leadMagnet,
  leadMagnetId,
  leadMagnetFields,
  initialData,
  persistKey,
  prefillKey,
  skipPrefilledContact,
}: UseLeadFormOptions): UseLeadFormReturn {
  // Returning lead: has Bitrix Lead ID, skips name/contact/goals/budget
  const isReturningLead = mode === "property-enquiry" && !!bitrixLeadId
  const attribution = useAttribution()

  // Stable submissionId for the lifetime of this form instance — survives
  // retries so the CRM can dedupe network glitches.
  const submissionIdRef = useRef<string>("")
  if (!submissionIdRef.current) submissionIdRef.current = generateSubmissionId()

  // Read context params from URL (property, team member). Omit keys when the
  // URL doesn't carry them so a missing param can't clobber an initialData
  // default — e.g. the Ahmed funnel seeds `referringTeamMember: "ahmed-ashfaq"`
  // via initialData and would otherwise be wiped to undefined here.
  const contextParams = useMemo(() => {
    if (typeof window === "undefined") return {}
    const params = new URLSearchParams(window.location.search)
    const property = params.get("property") || undefined
    const teamMember = params.get("teamMember") || undefined
    const teamMemberEmail = params.get("teamMemberEmail") || undefined
    const share = params.get("share") || undefined
    // AgentCRM welcome-email link params: `ref` binds the existing prospect,
    // `email` prefills + secondary-matches. Read once at mount and seeded into
    // form state so they survive multi-step navigation and re-renders.
    // Only prefill `email` when `ref` is present (i.e. a genuine welcome-email
    // link) so an unrelated ?email= tracking param can't silently pre-fill and
    // submit the wrong address.
    const ref = params.get("ref") || undefined
    const email = ref ? params.get("email")?.trim() || undefined : undefined
    return {
      ...(property ? { referringProperty: property } : {}),
      ...(teamMember ? { referringTeamMember: teamMember } : {}),
      ...(teamMemberEmail ? { referringTeamMemberEmail: teamMemberEmail } : {}),
      ...(ref ? { ref } : {}),
      ...(share ? { share } : {}),
      ...(email ? { email } : {}),
    }
  }, [])

  const [prefillData] = useState<Partial<LeadFormData>>(() => ({
    ...initialData,
  }))

  // Form data state — seed with submissionId + sessionId so downstream
  // steps (including the success/Calendly step) can carry them on the
  // post-booking follow-up POST.
  const [data, setData] = useState<Partial<LeadFormData>>(() => ({
    goals: [],
    ...prefillData,
    ...contextParams,
    formMode: mode,
    ...(bitrixLeadId ? { bitrixLeadId } : {}),
    ...(leadMagnet ? { leadMagnet } : {}),
    ...(leadMagnetId ? { leadMagnetId } : {}),
    ...(leadMagnetFields ? { leadMagnetFields } : {}),
    ...(tag ? { leadTag: tag } : {}),
    submissionId: submissionIdRef.current,
    sessionId: attribution.sessionId,
  }))

  // Current step index (among available steps)
  const [stepIndex, setStepIndex] = useState(() => {
    if (!skipPrefilledContact || !hasContactPrefill(data)) return 0

    return getStepAfterContactIndex(mode, data, isReturningLead, journey)
  })
  const [firstStepIndex, setFirstStepIndex] = useState(() => {
    if (!skipPrefilledContact || !hasContactPrefill(data)) return 0

    return getStepAfterContactIndex(mode, data, isReturningLead, journey)
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const didRestorePrefillRef = useRef(false)

  useEffect(() => {
    if (didRestorePrefillRef.current || !prefillKey) return
    didRestorePrefillRef.current = true

    const restored = readLeadFormPrefill(prefillKey)
    if (!Object.keys(restored).length) return

    setData((prev) => {
      const nextData: Partial<LeadFormData> = {
        ...prev,
        ...restored,
        formMode: mode,
        ...(leadMagnet ? { leadMagnet } : {}),
        ...(leadMagnetId ? { leadMagnetId } : {}),
        ...(leadMagnetFields ? { leadMagnetFields } : {}),
        ...(tag ? { leadTag: tag } : {}),
      }

      if (skipPrefilledContact && hasContactPrefill(nextData)) {
        const restoredStepIndex = getStepAfterContactIndex(
          mode,
          nextData,
          isReturningLead,
          journey,
        )
        setFirstStepIndex(restoredStepIndex)
        setStepIndex(restoredStepIndex)
      }

      return nextData
    })
  }, [
    isReturningLead,
    journey,
    leadMagnet,
    leadMagnetFields,
    leadMagnetId,
    mode,
    prefillKey,
    skipPrefilledContact,
    tag,
  ])

  // Calculate available steps based on mode and conditions
  const availableSteps = useMemo(() => {
    return getAvailableStepIds(mode, data, isReturningLead, journey)
  }, [mode, data, isReturningLead, journey])

  const currentStep = availableSteps[stepIndex] ?? "name"
  const currentStepIndex = Math.max(0, stepIndex - firstStepIndex)
  const totalSteps = Math.max(
    1,
    availableSteps.length - 1 - firstStepIndex,
  ) // Exclude success and any prefilled steps from the visible journey.
  const progress = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / totalSteps) * 100),
  )

  const canGoBack = stepIndex > firstStepIndex && currentStep !== "success"
  const canGoNext = stepIndex < availableSteps.length - 1

  // Navigation
  const nextStep = useCallback(() => {
    if (stepIndex < availableSteps.length - 1) {
      setStepIndex((i) => i + 1)
    }
  }, [stepIndex, availableSteps.length])

  const prevStep = useCallback(() => {
    if (stepIndex > firstStepIndex) {
      setStepIndex((i) => i - 1)
    }
  }, [firstStepIndex, stepIndex])

  // Data updates
  const updateData = useCallback((updates: Partial<LeadFormData>) => {
    setData((prev) => ({ ...prev, ...updates }))
  }, [])

  // Submission
  const submit = useCallback(async (finalUpdates?: Partial<LeadFormData>) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const mergedData: Partial<LeadFormData> = finalUpdates
        ? { ...data, ...finalUpdates }
        : data

      // Keep in-memory state aligned so success step/callback always has latest values.
      if (finalUpdates) {
        setData((prev) => ({ ...prev, ...finalUpdates }))
      }

      const finalData: LeadFormData = {
        firstName: mergedData.firstName || "",
        lastName: mergedData.lastName || "",
        email: mergedData.email || "",
        whatsapp: mergedData.whatsapp || "",
        goals: mergedData.goals || [],
        investTimeline: mergedData.investTimeline,
        budget: mergedData.budget,
        propertyTypes: mergedData.propertyTypes,
        locations: mergedData.locations,
        bedrooms: mergedData.bedrooms,
        propertyName: mergedData.propertyName,
        propertyUrl: mergedData.propertyUrl,
        propertyLocation: mergedData.propertyLocation,
        concerns: mergedData.concerns,
        propertyType: mergedData.propertyType,
        saleTimeline: mergedData.saleTimeline,
        targetPrice: mergedData.targetPrice,
        hasQuestions: mergedData.hasQuestions,
        questionsText: mergedData.questionsText,
        // Private mode fields
        privateRole: mergedData.privateRole,
        deploymentRange: mergedData.deploymentRange,
        preferredContact: mergedData.preferredContact,
        privateContext: mergedData.privateContext,
        // Property enquiry fields — use prop directly as authoritative source
        bitrixLeadId: bitrixLeadId || mergedData.bitrixLeadId,
        enquiryIntent: mergedData.enquiryIntent,
        propertyAppeals: mergedData.propertyAppeals,
        enquiryNotes: mergedData.enquiryNotes,
        formMode: mode,
        submittedAt: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        // Attribution (last-touch + first-touch + sessionId)
        ...attribution,
        // Idempotency
        submissionId: submissionIdRef.current,
        // Context from referring pages
        referringProperty: mergedData.referringProperty,
        referringTeamMember: mergedData.referringTeamMember,
        referringTeamMemberEmail: mergedData.referringTeamMemberEmail,
        // CRM prospect binder from the welcome-email link (?ref=…)
        ref: mergedData.ref,
        // Lead tagging for CRM categorisation
        leadMagnet: mergedData.leadMagnet || leadMagnet,
        leadTag: mergedData.leadTag || tag,
        leadMagnetId: mergedData.leadMagnetId || leadMagnetId,
        leadMagnetFields: mergedData.leadMagnetFields || leadMagnetFields,
        leadMagnetDocuments: mergedData.leadMagnetDocuments,
        consent: mergedData.consent,
        share: mergedData.share,
        // Honeypot for bot protection
        website: honeypot,
      }

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to submit form")
      }

      writeLeadFormPrefill(persistKey, finalData)

      // Move to success step
      nextStep()
      onSuccess?.(finalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [
    data,
    mode,
    attribution,
    honeypot,
    bitrixLeadId,
    leadMagnet,
    leadMagnetFields,
    leadMagnetId,
    persistKey,
    tag,
    nextStep,
    onSuccess,
  ])

  return {
    currentStep,
    currentStepIndex,
    totalSteps,
    data,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    canGoBack,
    canGoNext,
    updateData,
    submit,
    availableSteps,
    progress,
  }
}

function getAvailableStepIds(
  mode: FormMode,
  data: Partial<LeadFormData>,
  isReturningLead: boolean,
  journey: FormJourney,
) {
  if (journey === "second-opinion") return SECOND_OPINION_STEPS

  return STEPS.filter((step) => {
    if (!step.modes.includes(mode)) return false
    if (isReturningLead && RETURNING_LEAD_SKIP_STEPS.includes(step.id)) return false
    if (step.condition && !step.condition(data)) return false
    return true
  }).map((s) => s.id)
}

function getStepAfterContactIndex(
  mode: FormMode,
  data: Partial<LeadFormData>,
  isReturningLead: boolean,
  journey: FormJourney,
) {
  const initialSteps = getAvailableStepIds(
    mode,
    data,
    isReturningLead,
    journey,
  )
  const contactIndex = initialSteps.indexOf("contact")
  if (contactIndex === -1) return 0

  const nextIndex = Math.min(contactIndex + 1, initialSteps.length - 1)
  return initialSteps[nextIndex] === "success" ? 0 : nextIndex
}

function hasContactPrefill(data: Partial<LeadFormData>) {
  return Boolean(
    data.firstName?.trim() &&
      data.lastName?.trim() &&
      data.email?.trim() &&
      data.whatsapp?.trim()
  )
}

function getLeadFormPrefillData(data: Partial<LeadFormData>) {
  const firstName = getPrefillString(data.firstName)
  const lastName = getPrefillString(data.lastName)
  const email = getPrefillString(data.email)
  const whatsapp = getPrefillString(data.whatsapp)
  const consent = data.consent === true ? true : undefined

  return {
    ...(firstName ? { firstName } : {}),
    ...(lastName ? { lastName } : {}),
    ...(email ? { email } : {}),
    ...(whatsapp ? { whatsapp } : {}),
    ...(consent ? { consent } : {}),
  } satisfies Partial<LeadFormData>
}

function getPrefillString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : undefined
}

function readLeadFormPrefill(key?: string): Partial<LeadFormData> {
  if (!key || typeof window === "undefined") return {}

  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return {}

    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {}

    return getLeadFormPrefillData(parsed as Partial<LeadFormData>)
  } catch {
    return {}
  }
}

function writeLeadFormPrefill(key: string | undefined, data: Partial<LeadFormData>) {
  if (!key || typeof window === "undefined") return

  const prefill = getLeadFormPrefillData(data)
  if (!Object.keys(prefill).length) return

  try {
    window.sessionStorage.setItem(key, JSON.stringify(prefill))
  } catch {
    // Non-fatal: the next form simply falls back to asking for contact details.
  }
}
