/**
 * CATALYST - Questions Step
 *
 * Simple yes/no question with optional textarea.
 * Uses elegant binary choice with auto-reveal.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme } from "../types"

interface QuestionsStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function QuestionsStep({ data, onUpdate, onNext }: QuestionsStepProps) {
  const [hasQuestions, setHasQuestions] = useState<boolean | undefined>(
    data.hasQuestions
  )
  const [questionsText, setQuestionsText] = useState(data.questionsText || "")
  const [error, setError] = useState<string | null>(null)

  const selectOption = useCallback((value: boolean) => {
    setHasQuestions(value)
    setError(null)
  }, [])

  // Keyboard navigation: Y/N or 1/2
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "y" || e.key === "Y" || e.key === "1") {
        selectOption(true)
      } else if (e.key === "n" || e.key === "N" || e.key === "2") {
        selectOption(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectOption])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (hasQuestions === undefined) {
      setError("Please select an option")
      return
    }

    if (hasQuestions && !questionsText.trim()) {
      setError("Please enter your questions")
      return
    }

    onUpdate({ hasQuestions, questionsText: hasQuestions ? questionsText : undefined })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">
          Any questions before we meet?
        </h2>
        <p className="lead-form__subtext">
          Is there anything specific you'd like us to address?
        </p>
      </div>

      <div className="lead-form__options" style={{ flexDirection: "row", gap: "1rem" }}>
        <button
          type="button"
          onClick={() => selectOption(true)}
          className={cn(
            "lead-form__option",
            hasQuestions === true && "lead-form__option--selected"
          )}
          style={{ flex: 1 }}
        >
          <span className="lead-form__option-key">Y</span>
          <span className="lead-form__option-content">
            <span className="lead-form__option-label">Yes</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => selectOption(false)}
          className={cn(
            "lead-form__option",
            hasQuestions === false && "lead-form__option--selected"
          )}
          style={{ flex: 1 }}
        >
          <span className="lead-form__option-key">N</span>
          <span className="lead-form__option-content">
            <span className="lead-form__option-label">No</span>
          </span>
        </button>
      </div>

      {hasQuestions && (
        <div className="lead-form__field" style={{ animationName: "lf-enter" }}>
          <label className="lead-form__label">Your questions</label>
          <textarea
            value={questionsText}
            onChange={(e) => {
              setQuestionsText(e.target.value)
              setError(null)
            }}
            placeholder="Share any questions or topics you'd like to discuss..."
            rows={4}
            className="lead-form__textarea"
            autoFocus
          />
        </div>
      )}

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
