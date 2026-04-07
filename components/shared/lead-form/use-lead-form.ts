/**
 * CATALYST - useLeadForm Hook
 *
 * Manages multi-step form state, navigation, and submission.
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import { useUTMParams } from "@/lib/hooks/use-utm-params"
import type { LeadFormData, FormMode, StepId, LeadGoal } from "./types"

// =============================================================================
// STEP DEFINITIONS
// =============================================================================

interface StepDef {
  id: StepId
  modes: FormMode[]
  condition?: (data: Partial<LeadFormData>) => boolean
}

const STEPS: StepDef[] = [
  { id: "name", modes: ["contact", "landing", "download", "private", "property-enquiry"] },
  { id: "contact", modes: ["contact", "landing", "download", "private", "property-enquiry"] },
  { id: "enquiry-intent", modes: ["property-enquiry"] },
  { id: "property-appeal", modes: ["property-enquiry"] },
  { id: "goals", modes: ["contact"] },
  {
    id: "timeline-budget",
    modes: ["contact", "property-enquiry"],
    condition: (data) => {
      // In property-enquiry mode, always show (no goals gating)
      if (data.formMode === "property-enquiry") return true
      const buyerGoals: LeadGoal[] = ["invest-offplan", "buy-ready", "build", "build-wealth"]
      return data.goals?.some((g) => buyerGoals.includes(g)) ?? false
    },
  },
  {
    id: "property",
    modes: ["contact"],
    condition: (data) => data.goals?.includes("sell") ?? false,
  },
  { id: "questions", modes: ["contact"] },
  { id: "private-context", modes: ["private"] },
  { id: "success", modes: ["contact", "landing", "download", "private", "property-enquiry"] },
]

// =============================================================================
// HOOK
// =============================================================================

interface UseLeadFormOptions {
  mode: FormMode
  onSuccess?: (data: LeadFormData) => void
  honeypot?: string
  tag?: string
  bitrixLeadId?: string
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
  onSuccess,
  honeypot,
  tag,
  bitrixLeadId,
}: UseLeadFormOptions): UseLeadFormReturn {
  // Returning lead: has Bitrix Lead ID, skips name/contact/goals/budget
  const isReturningLead = mode === "property-enquiry" && !!bitrixLeadId
  const utm = useUTMParams()

  // Read context params from URL (property, team member)
  const contextParams = useMemo(() => {
    if (typeof window === "undefined") return {}
    const params = new URLSearchParams(window.location.search)
    return {
      referringProperty: params.get("property") || undefined,
      referringTeamMember: params.get("teamMember") || undefined,
      referringTeamMemberEmail: params.get("teamMemberEmail") || undefined,
    }
  }, [])

  // Form data state
  const [data, setData] = useState<Partial<LeadFormData>>({
    formMode: mode,
    goals: [],
    ...contextParams,
    ...(bitrixLeadId ? { bitrixLeadId } : {}),
  })

  // Current step index (among available steps)
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Returning leads see: enquiry-intent → property-appeal → success
  const returningLeadSkipSteps: StepId[] = ["name", "contact", "goals", "timeline-budget", "property", "questions"]

  // Calculate available steps based on mode and conditions
  const availableSteps = useMemo(() => {
    return STEPS.filter((step) => {
      // Must be available for this mode
      if (!step.modes.includes(mode)) return false
      // Returning leads skip most steps
      if (isReturningLead && returningLeadSkipSteps.includes(step.id)) return false
      // Must pass condition if present
      if (step.condition && !step.condition(data)) return false
      return true
    }).map((s) => s.id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data, isReturningLead])

  const currentStep = availableSteps[stepIndex] ?? "name"
  const totalSteps = availableSteps.length - 1 // Exclude success step from count
  const progress = Math.round((stepIndex / totalSteps) * 100)

  const canGoBack = stepIndex > 0 && currentStep !== "success"
  const canGoNext = stepIndex < availableSteps.length - 1

  // Navigation
  const nextStep = useCallback(() => {
    if (stepIndex < availableSteps.length - 1) {
      setStepIndex((i) => i + 1)
    }
  }, [stepIndex, availableSteps.length])

  const prevStep = useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1)
    }
  }, [stepIndex])

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
        propertyName: mergedData.propertyName,
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
        ...utm,
        // Context from referring pages
        referringProperty: mergedData.referringProperty,
        referringTeamMember: mergedData.referringTeamMember,
        referringTeamMemberEmail: mergedData.referringTeamMemberEmail,
        // Lead tagging for CRM categorisation
        leadTag: tag,
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

      // Move to success step
      nextStep()
      onSuccess?.(finalData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }, [data, mode, utm, honeypot, bitrixLeadId, tag, nextStep, onSuccess])

  return {
    currentStep,
    currentStepIndex: stepIndex,
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
