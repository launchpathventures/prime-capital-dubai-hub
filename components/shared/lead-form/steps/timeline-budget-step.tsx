/**
 * CATALYST - Timeline & Budget Step
 *
 * For buyers/investors: Timeline and budget selection.
 * Clean sections with elegant option tiles.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, InvestTimeline, BudgetRange } from "../types"
import { TIMELINE_OPTIONS, BUDGET_OPTIONS } from "../types"

interface TimelineBudgetStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function TimelineBudgetStep({
  data,
  onUpdate,
  onNext,
}: TimelineBudgetStepProps) {
  const [timeline, setTimeline] = useState<InvestTimeline | undefined>(
    data.investTimeline
  )
  const [budget, setBudget] = useState<BudgetRange | undefined>(data.budget)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!timeline) newErrors.timeline = "Please select your timeline"
    if (!budget) newErrors.budget = "Please select your budget"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onUpdate({ investTimeline: timeline, budget })
    onNext()
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Great, {firstName}.</p>
        <h2 className="lead-form__question">
          Tell us about your investment plans
        </h2>
      </div>

      {/* Timeline Section */}
      <div className="lead-form__section">
        <p className="lead-form__section-label">When are you looking to invest?</p>

        <div className="lead-form__options">
          {TIMELINE_OPTIONS.map((option, idx) => {
            const isSelected = timeline === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTimeline(option.value)
                  setErrors((e) => ({ ...e, timeline: "" }))
                }}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected"
                )}
              >
                <span className="lead-form__option-key">{idx + 1}</span>
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.timeline && <p className="lead-form__error">{errors.timeline}</p>}
      </div>

      {/* Budget Section */}
      <div className="lead-form__section">
        <p className="lead-form__section-label">What's your investment budget?</p>

        <div className="lead-form__options lead-form__options--grid">
          {BUDGET_OPTIONS.map((option) => {
            const isSelected = budget === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setBudget(option.value)
                  setErrors((e) => ({ ...e, budget: "" }))
                }}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected"
                )}
              >
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.budget && <p className="lead-form__error">{errors.budget}</p>}
      </div>

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
      </div>
    </form>
  )
}
