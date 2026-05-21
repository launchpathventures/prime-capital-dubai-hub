/**
 * CATALYST - Enquiry Intent Step
 *
 * "What would you like to know?" — multi-select of intent options.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme } from "../types"
import { ENQUIRY_INTENT_OPTIONS } from "../types"
import { LeadFormBackButton } from "./back-button"

interface EnquiryIntentStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  onBack?: () => void
  canGoBack?: boolean
}

export function EnquiryIntentStep({ data, onUpdate, onNext, onBack, canGoBack }: EnquiryIntentStepProps) {
  const [selected, setSelected] = useState<string[]>(data.enquiryIntent || [])

  const toggle = (value: string) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ enquiryIntent: selected })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">
          What would you like to know?
        </h2>
        <p className="lead-form__subtext">
          Select all that apply
        </p>
      </div>

      <div role="group" aria-label="What would you like to know?" className="lead-form__options">
        {ENQUIRY_INTENT_OPTIONS.map((option, idx) => {
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

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}
