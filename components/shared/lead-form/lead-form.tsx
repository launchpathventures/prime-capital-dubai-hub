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
import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useLeadForm } from "./use-lead-form"
import {
  NameStep,
  ContactStep,
  GoalsStep,
  TimelineBudgetStep,
  PreferencesStep,
  LocationsStep,
  PropertyStep,
  QuestionsStep,
  PrivateContextStep,
  EnquiryIntentStep,
  PropertyAppealStep,
  SuccessStep,
} from "./steps"
import type { LeadFormProps } from "./types"

export function LeadForm({
  mode,
  successMessage,
  onSuccess,
  className,
  theme = "light",
  redirectUrl,
  redirectDelay,
  downloadAsset,
  calendlyUrl,
  propertyLabel,
  showPropertyFields,
  showConcerns,
  autoFocus = true,
  tag,
  propertyContext,
  bitrixLeadId,
  initialData,
  persistKey,
  prefillKey,
  skipPrefilledContact,
}: LeadFormProps) {
  const formRef = useRef<HTMLDivElement>(null)
  const previousStepRef = useRef<string | null>(null)
  const shouldScrollStepRef = useRef(false)
  const [honeypot, setHoneypot] = useState("")

  const {
    currentStep,
    data,
    isSubmitting,
    error,
    nextStep,
    prevStep,
    canGoBack,
    updateData,
    submit,
  } = useLeadForm({
    mode,
    onSuccess,
    honeypot,
    tag,
    bitrixLeadId,
    leadMagnet: downloadAsset,
    initialData,
    persistKey,
    prefillKey,
    skipPrefilledContact,
  })

  const advanceStep = () => {
    shouldScrollStepRef.current = true
    nextStep()
  }

  // Recover the form into view only when the visitor has scrolled past it.
  // We deliberately do NOT scroll when the form is already visible — that
  // yanks the page on every step transition, which is jarring inside a hero.
  useEffect(() => {
    if (previousStepRef.current === null) {
      previousStepRef.current = currentStep
      return
    }

    if (previousStepRef.current === currentStep) {
      return
    }

    previousStepRef.current = currentStep

    if (!shouldScrollStepRef.current) {
      return
    }

    shouldScrollStepRef.current = false

    if (!formRef.current) return

    const rect = formRef.current.getBoundingClientRect()
    const headerOffset = 112 // 5rem sticky header + 2rem breathing room
    const isAboveViewport = rect.top < headerOffset
    const isBelowViewport = rect.top > window.innerHeight

    if (isAboveViewport || isBelowViewport) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [currentStep])

  // Determine if contact step is the last step (for landing/download modes)
  const isContactLastStep = mode === "landing" || mode === "download" || mode === "event"
  // For returning leads, property-appeal is the last step before success
  const isReturningLead = mode === "property-enquiry" && !!bitrixLeadId

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case "name":
        return (
          <NameStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            mode={mode}
            autoFocus={autoFocus}
          />
        )

      case "contact":
        return (
          <ContactStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            mode={mode}
            isLastStep={isContactLastStep}
            isSubmitting={isSubmitting}
            onSubmit={submit}
            propertyLabel={propertyLabel}
            showPropertyFields={showPropertyFields}
            showConcerns={showConcerns}
            submitLabel={calendlyUrl ? "Book Call" : undefined}
            autoFocus={autoFocus}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "goals":
        return (
          <GoalsStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "timeline-budget":
        return (
          <TimelineBudgetStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "preferences":
        return (
          <PreferencesStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "locations":
        return (
          <LocationsStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "property":
        return (
          <PropertyStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "questions":
        return (
          <QuestionsStep
            data={data}
            onSubmit={submit}
            isSubmitting={isSubmitting}
            theme={theme}
            submitLabel={calendlyUrl ? "Continue to booking" : undefined}
            submitLeadsToBooking={!!calendlyUrl}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "private-context":
        return (
          <PrivateContextStep
            data={data}
            onSubmit={submit}
            isSubmitting={isSubmitting}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "enquiry-intent":
        return (
          <EnquiryIntentStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            theme={theme}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        )

      case "property-appeal":
        return propertyContext ? (
          <PropertyAppealStep
            data={data}
            onUpdate={updateData}
            onNext={advanceStep}
            onSubmit={submit}
            isSubmitting={isSubmitting}
            isLastStep={isReturningLead}
            theme={theme}
            propertyContext={propertyContext}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        ) : null

      case "success":
        return (
          <SuccessStep
            data={data}
            theme={theme}
            mode={mode}
            downloadAsset={downloadAsset}
            customMessage={successMessage}
            redirectUrl={redirectUrl}
            redirectDelay={redirectDelay}
            calendlyUrl={calendlyUrl}
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
        {/* Honeypot field for bot protection - hidden from users */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        {/* Form content */}
        <div className="lead-form__content" key={currentStep}>
          {renderStep()}
        </div>

        {/* Error display - aria-live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true">
          {error && (
            <div role="alert" className="lead-form__error" style={{ marginTop: "1rem" }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
