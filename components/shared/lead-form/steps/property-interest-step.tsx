/**
 * CATALYST - Property Interest Step
 *
 * Captures what the prospect wants to know and what caught their eye.
 * Uses property metadata to generate contextual preset options.
 */

"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, PropertyContext } from "../types"
import {
  ENQUIRY_INTENT_OPTIONS,
  PROPERTY_APPEAL_OPTIONS,
  CONDITIONAL_APPEAL_OPTIONS,
} from "../types"

interface PropertyInterestStepProps {
  data: Partial<LeadFormData>
  onSubmit: (data: Partial<LeadFormData>) => void
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  isSubmitting: boolean
  isLastStep: boolean
  theme: FormTheme
  propertyContext: PropertyContext
}

export function PropertyInterestStep({
  data,
  onSubmit,
  onUpdate,
  onNext,
  isSubmitting,
  isLastStep,
  propertyContext,
}: PropertyInterestStepProps) {
  const [selectedIntents, setSelectedIntents] = useState<string[]>(data.enquiryIntent || [])
  const [selectedAppeals, setSelectedAppeals] = useState<string[]>(data.propertyAppeals || [])
  const [notes, setNotes] = useState(data.enquiryNotes || "")

  // Build appeal options based on property context
  const appealOptions = [
    ...PROPERTY_APPEAL_OPTIONS,
    ...CONDITIONAL_APPEAL_OPTIONS.filter((opt) => opt.condition(propertyContext)),
  ]

  const toggleIntent = (value: string) => {
    setSelectedIntents((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const toggleAppeal = (value: string) => {
    setSelectedAppeals((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updates: Partial<LeadFormData> = {
      enquiryIntent: selectedIntents,
      propertyAppeals: selectedAppeals,
      enquiryNotes: notes.trim() || undefined,
    }

    if (isLastStep) {
      onSubmit(updates)
    } else {
      onUpdate(updates)
      onNext()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      {/* Section 1: What would you like to know? */}
      <div>
        <h2 className="lead-form__question">
          What would you like to know?
        </h2>
        <p className="lead-form__subtext">
          Select all that apply — helps us prepare the right information
        </p>
      </div>

      <div role="group" aria-label="What would you like to know?" className="lead-form__options">
        {ENQUIRY_INTENT_OPTIONS.map((option, idx) => {
          const isSelected = selectedIntents.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleIntent(option.value)}
              className={cn(
                "lead-form__option",
                isSelected && "lead-form__option--selected"
              )}
            >
              <span className="lead-form__option-key" aria-hidden="true">{idx + 1}</span>
              <span className="lead-form__option-content">
                <span className="lead-form__option-label">{option.label}</span>
              </span>
              <span className="lead-form__option-check" aria-hidden="true">
                {isSelected && <CheckIcon size={14} />}
              </span>
            </button>
          )
        })}
      </div>

      {/* Section 2: What caught your eye? */}
      <div style={{ marginTop: "2rem" }}>
        <h3 className="lead-form__question" style={{ fontSize: "clamp(18px, 2.5vw, 22px)" }}>
          What caught your eye?
        </h3>
        <p className="lead-form__subtext">
          About {propertyContext.title}
        </p>
      </div>

      <div role="group" aria-label="What caught your eye?" className="lead-form__options">
        {appealOptions.map((option) => {
          const isSelected = selectedAppeals.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggleAppeal(option.value)}
              className={cn(
                "lead-form__option",
                isSelected && "lead-form__option--selected"
              )}
            >
              <span className="lead-form__option-content">
                <span className="lead-form__option-label">{option.label}</span>
              </span>
              <span className="lead-form__option-check" aria-hidden="true">
                {isSelected && <CheckIcon size={14} />}
              </span>
            </button>
          )
        })}
      </div>

      {/* Section 3: Anything else? (optional) */}
      <div className="lead-form__field" style={{ marginTop: "1.5rem" }}>
        <label htmlFor="enquiryNotes" className="lead-form__label">Anything else?</label>
        <textarea
          id="enquiryNotes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific questions or requirements..."
          rows={3}
          className="lead-form__textarea"
        />
      </div>

      {/* Submit / Continue */}
      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : isLastStep ? (
            <>
              Submit
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
            </>
          ) : (
            <>
              Continue
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
