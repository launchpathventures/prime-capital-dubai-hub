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
  { id: "name", modes: ["contact", "landing", "download"] },
  { id: "contact", modes: ["contact", "landing", "download"] },
  { id: "goals", modes: ["contact"] },
  {
    id: "timeline-budget",
    modes: ["contact"],
    condition: (data) => {
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
  {
    id: "schedule",
    modes: ["contact"],
    condition: (data) => {
      // Skip schedule for advice-only if that's the only goal
      if (data.goals?.length === 1 && data.goals[0] === "advice-only") {
        return false
      }
      return true
    },
  },
  { id: "success", modes: ["contact", "landing", "download"] },
]

// =============================================================================
// HOOK
// =============================================================================

interface UseLeadFormOptions {
  mode: FormMode
  onSuccess?: (data: LeadFormData) => void
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
  submit: () => Promise<void>

  // Computed
  availableSteps: StepId[]
  progress: number
}

export function useLeadForm({
  mode,
  onSuccess,
}: UseLeadFormOptions): UseLeadFormReturn {
  const utm = useUTMParams()

  // Form data state
  const [data, setData] = useState<Partial<LeadFormData>>({
    formMode: mode,
    goals: [],
  })

  // Current step index (among available steps)
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Calculate available steps based on mode and conditions
  const availableSteps = useMemo(() => {
    return STEPS.filter((step) => {
      // Must be available for this mode
      if (!step.modes.includes(mode)) return false
      // Must pass condition if present
      if (step.condition && !step.condition(data)) return false
      return true
    }).map((s) => s.id)
  }, [mode, data])

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
  const submit = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      const finalData: LeadFormData = {
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        whatsapp: data.whatsapp || "",
        goals: data.goals || [],
        investTimeline: data.investTimeline,
        budget: data.budget,
        propertyLocation: data.propertyLocation,
        propertyType: data.propertyType,
        saleTimeline: data.saleTimeline,
        targetPrice: data.targetPrice,
        hasQuestions: data.hasQuestions,
        questionsText: data.questionsText,
        scheduledMeeting: data.scheduledMeeting,
        calendlyEventId: data.calendlyEventId,
        calendlyInviteeId: data.calendlyInviteeId,
        formMode: mode,
        submittedAt: new Date().toISOString(),
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        ...utm,
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
  }, [data, mode, utm, nextStep, onSuccess])

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
