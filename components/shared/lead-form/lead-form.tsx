/**
 * CATALYST - Lead Capture Form
 *
 * Multi-step, conversational lead capture form with conditional branching.
 * Supports three modes: contact (full qualification), landing (quick capture),
 * and download (lead magnet).
 *
 * @example
 * <LeadForm mode="contact" theme="light" />
 * <LeadForm mode="download" downloadAsset="Strategy Kit" theme="dark" />
 */

"use client"

import "./lead-form.css"
import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useLeadForm } from "./use-lead-form"
import {
  NameStep,
  ContactStep,
  GoalsStep,
  TimelineBudgetStep,
  PropertyStep,
  QuestionsStep,
  ScheduleStep,
  SuccessStep,
} from "./steps"
import type { LeadFormProps } from "./types"

// Default Calendly URL
const DEFAULT_CALENDLY_URL = "https://calendly.com/tahirmajithia/30min"

export function LeadForm({
  mode,
  downloadAsset,
  successMessage,
  onSuccess,
  className,
  theme = "light",
}: LeadFormProps) {
  const formRef = useRef<HTMLDivElement>(null)
  
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    data,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    canGoBack,
    updateData,
    submit,
    progress,
    availableSteps,
  } = useLeadForm({ mode, onSuccess })

  // Scroll to top of form when step changes
  useEffect(() => {
    if (formRef.current) {
      const rect = formRef.current.getBoundingClientRect()
      const headerOffset = 112 // 5rem header + 2rem breathing room
      
      // Scroll if form is cut off at top or too far down the viewport
      if (rect.top < headerOffset || rect.top > window.innerHeight * 0.4) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }
  }, [currentStep])

  const calendlyUrl =
    process.env.NEXT_PUBLIC_CALENDLY_URL || DEFAULT_CALENDLY_URL

  // Determine if contact step is the last step (for landing/download modes)
  const isContactLastStep = mode === "landing" || mode === "download"

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case "name":
        return (
          <NameStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
          />
        )

      case "contact":
        return (
          <ContactStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
            isLastStep={isContactLastStep}
            isSubmitting={isSubmitting}
            onSubmit={submit}
          />
        )

      case "goals":
        return (
          <GoalsStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
          />
        )

      case "timeline-budget":
        return (
          <TimelineBudgetStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
          />
        )

      case "property":
        return (
          <PropertyStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
          />
        )

      case "questions":
        return (
          <QuestionsStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            theme={theme}
          />
        )

      case "schedule":
        return (
          <ScheduleStep
            data={data}
            onUpdate={updateData}
            onNext={nextStep}
            onSubmit={submit}
            isSubmitting={isSubmitting}
            theme={theme}
            calendlyUrl={calendlyUrl}
          />
        )

      case "success":
        return (
          <SuccessStep
            data={data}
            theme={theme}
            mode={mode}
            downloadAsset={downloadAsset}
            customMessage={successMessage}
          />
        )

      default:
        return null
    }
  }

  const isDark = theme === "dark"

  return (
    <div
      ref={formRef}
      className={cn(
        "lead-form",
        isDark ? "lead-form--dark" : "lead-form--light",
        className
      )}
      data-mode={mode}
      data-step={currentStep}
    >
      <div className="lead-form__container">
        {/* Form content */}
        <div className="lead-form__content" key={currentStep}>
          {renderStep()}
        </div>

        {/* Error display */}
        {error && (
          <div className="lead-form__error" style={{ marginTop: "1rem" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
