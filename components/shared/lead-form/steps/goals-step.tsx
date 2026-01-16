/**
 * CATALYST - Goals Step
 *
 * Multi-select goals with keyboard shortcuts (1-6).
 * Elegant option tiles with checkmarks.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, LeadGoal } from "../types"
import { GOAL_OPTIONS } from "../types"

interface GoalsStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function GoalsStep({ data, onUpdate, onNext }: GoalsStepProps) {
  const [selectedGoals, setSelectedGoals] = useState<LeadGoal[]>(data.goals || [])
  const [error, setError] = useState<string | null>(null)

  const toggleGoal = useCallback((goal: LeadGoal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    )
    setError(null)
  }, [])

  // Keyboard navigation: 1-6 to toggle options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const num = parseInt(e.key)
      if (num >= 1 && num <= GOAL_OPTIONS.length) {
        const option = GOAL_OPTIONS[num - 1]
        if (option) {
          toggleGoal(option.value)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleGoal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedGoals.length === 0) {
      setError("Please select at least one option")
      return
    }

    onUpdate({ goals: selectedGoals })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">
          What brings you here today?
        </h2>
        <p className="lead-form__subtext">
          Select all that apply
        </p>
      </div>

      <div className="lead-form__options">
        {GOAL_OPTIONS.map((option, idx) => {
          const isSelected = selectedGoals.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleGoal(option.value)}
              className={cn(
                "lead-form__option",
                isSelected && "lead-form__option--selected"
              )}
            >
              <span className="lead-form__option-key">{idx + 1}</span>
              <span className="lead-form__option-content">
                <span className="lead-form__option-label">{option.label}</span>
              </span>
              <span className="lead-form__option-check">
                {isSelected && <CheckIcon size={14} />}
              </span>
            </button>
          )
        })}
      </div>

      <p className="lead-form__keyboard-hint">
        Press 1-{GOAL_OPTIONS.length} to select
      </p>

      {error && <p className="lead-form__error">{error}</p>}

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
      </div>
    </form>
  )
}
