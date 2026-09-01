/**
 * CATALYST - Second Opinion Review Step
 *
 * Captures the investor objective and the exact claims that need testing.
 */

"use client"

import { useState } from "react"
import { CheckIcon, FileTextIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { LeadFormData } from "../types"
import { LeadFormBackButton } from "./back-button"

interface SecondOpinionReviewStepProps {
  data: Partial<LeadFormData>
  onSubmit: (data: Partial<LeadFormData>) => Promise<void>
  isSubmitting: boolean
  submitLabel?: string
  onBack?: () => void
  canGoBack?: boolean
}

export function SecondOpinionReviewStep({
  data,
  onSubmit,
  isSubmitting,
  submitLabel = "Send my Second Opinion request",
  onBack,
  canGoBack,
}: SecondOpinionReviewStepProps) {
  const [objective, setObjective] = useState(
    data.leadMagnetFields?.objective || "",
  )
  const [whatToCheck, setWhatToCheck] = useState(data.enquiryNotes || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const sourceLabel = data.propertyUrl
    ? "Property link attached"
    : data.leadMagnetDocuments?.length
      ? `${data.leadMagnetDocuments.length} document${data.leadMagnetDocuments.length === 1 ? "" : "s"} attached`
      : data.propertyName
        ? `${data.propertyName}${data.locations?.[0] ? ` · ${data.locations[0]}` : ""}`
        : "Property details attached"

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!objective.trim()) {
      next.objective = "Tell us what you are trying to achieve."
    }
    if (!whatToCheck.trim()) {
      next.whatToCheck = "Tell us which claims or documents you want checked."
    }
    if (whatToCheck.length > 4000) {
      next.whatToCheck = "Keep this request under 4,000 characters."
    }
    setErrors(next)
    if (Object.keys(next).length) return

    void onSubmit({
      enquiryNotes: whatToCheck.trim(),
      leadMagnetFields: {
        ...data.leadMagnetFields,
        objective: objective.trim(),
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step" noValidate>
      <div>
        <p className="lead-form__greeting">The property is attached.</p>
        <h2 className="lead-form__question">What should Prime test?</h2>
        <p className="lead-form__subtext">
          Your objective and the uncertain claims are what make this a review,
          rather than a general property enquiry.
        </p>
      </div>

      <div className="lead-form__review-source">
        <FileTextIcon aria-hidden="true" />
        <span>{sourceLabel}</span>
        <CheckIcon aria-hidden="true" />
      </div>

      <div className="lead-form__fields">
        <div className="lead-form__field">
          <label htmlFor="second-opinion-objective" className="lead-form__label">
            What are you trying to achieve?
          </label>
          <Textarea
            id="second-opinion-objective"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            placeholder="Income, capital growth, a home, or another specific outcome"
            className={cn(
              "lead-form__textarea",
              errors.objective && "lead-form__input--error",
            )}
            rows={3}
            aria-invalid={Boolean(errors.objective)}
          />
          {errors.objective && (
            <span className="lead-form__error">{errors.objective}</span>
          )}
        </div>

        <div className="lead-form__field">
          <label htmlFor="second-opinion-check" className="lead-form__label">
            What do you want us to check?
          </label>
          <Textarea
            id="second-opinion-check"
            value={whatToCheck}
            onChange={(event) => setWhatToCheck(event.target.value)}
            placeholder="Name the claims, assumptions or documents you are unsure about"
            className={cn(
              "lead-form__textarea",
              errors.whatToCheck && "lead-form__input--error",
            )}
            rows={5}
            maxLength={4000}
            aria-invalid={Boolean(errors.whatToCheck)}
          />
          {errors.whatToCheck && (
            <span className="lead-form__error">{errors.whatToCheck}</span>
          )}
        </div>
      </div>

      <div className="lead-form__review-promise">
        Prime will use this request to discuss what appears supported, what remains
        unproven, and the next decision to make.
      </div>

      <div className="lead-form__actions">
        <Button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <Loader2Icon className="lead-form__spinner" />
              Recording your request
            </span>
          ) : (
            <>
              <CheckIcon className="lead-form__submit-icon" aria-hidden="true" />
              {submitLabel}
            </>
          )}
        </Button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}
