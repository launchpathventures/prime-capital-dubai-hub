/**
 * CATALYST - Property Appeal Step
 *
 * "What caught your eye?" — contextual multi-select plus optional notes.
 * For returning leads this is the last step before submission.
 */

"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, PropertyContext } from "../types"
import { PROPERTY_APPEAL_OPTIONS, CONDITIONAL_APPEAL_OPTIONS } from "../types"
import { LeadFormBackButton } from "./back-button"

interface PropertyAppealStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  onSubmit: (data: Partial<LeadFormData>) => void
  isSubmitting: boolean
  isLastStep: boolean
  theme: FormTheme
  propertyContext: PropertyContext
  onBack?: () => void
  canGoBack?: boolean
}

export function PropertyAppealStep({
  data,
  onUpdate,
  onNext,
  onSubmit,
  isSubmitting,
  isLastStep,
  propertyContext,
  onBack,
  canGoBack,
}: PropertyAppealStepProps) {
  const [selected, setSelected] = useState<string[]>(data.propertyAppeals || [])
  const [notes, setNotes] = useState(data.enquiryNotes || "")

  const appealOptions = [
    ...PROPERTY_APPEAL_OPTIONS,
    ...CONDITIONAL_APPEAL_OPTIONS.filter((opt) => opt.condition(propertyContext)),
  ]

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updates: Partial<LeadFormData> = {
      propertyAppeals: selected,
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
      <div>
        <h2 className="lead-form__question">
          What caught your eye?
        </h2>
        <p className="lead-form__subtext">
          About {propertyContext.title}
        </p>
      </div>

      <div role="group" aria-label="What caught your eye?" className="lead-form__options">
        {appealOptions.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              onClick={() => toggle(option.value)}
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

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : isLastStep ? "Submit" : "Continue"}
        </button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}
