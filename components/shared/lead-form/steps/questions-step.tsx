/**
 * CATALYST - Questions Step
 *
 * Simple yes/no question with optional textarea.
 * Uses elegant binary choice with auto-reveal.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme } from "../types"

interface QuestionsStepProps {
  data: Partial<LeadFormData>
  onSubmit: (data: Partial<LeadFormData>) => void
  isSubmitting: boolean
  theme: FormTheme
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function QuestionsStep({ data, onSubmit, isSubmitting, theme }: QuestionsStepProps) {
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
  // Don't intercept keystrokes when user is typing in an input/textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

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

    onSubmit({ hasQuestions, questionsText: hasQuestions ? questionsText : undefined })
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

      <div
        role="radiogroup"
        aria-label="Do you have questions before we meet?"
        aria-required="true"
        className="lead-form__options"
        style={{ flexDirection: "row", gap: "1rem" }}
      >
        <button
          type="button"
          role="radio"
          aria-checked={hasQuestions === true}
          onClick={() => selectOption(true)}
          className={cn(
            "lead-form__option",
            hasQuestions === true && "lead-form__option--selected"
          )}
          style={{ flex: 1 }}
        >
          <span className="lead-form__option-key" aria-hidden="true">Y</span>
          <span className="lead-form__option-content">
            <span className="lead-form__option-label">Yes</span>
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={hasQuestions === false}
          onClick={() => selectOption(false)}
          className={cn(
            "lead-form__option",
            hasQuestions === false && "lead-form__option--selected"
          )}
          style={{ flex: 1 }}
        >
          <span className="lead-form__option-key" aria-hidden="true">N</span>
          <span className="lead-form__option-content">
            <span className="lead-form__option-label">No</span>
          </span>
        </button>
      </div>

      {hasQuestions && (
        <div className="lead-form__field" style={{ animationName: "lf-enter" }}>
          <label htmlFor="questionsText" className="lead-form__label">Your questions</label>
          <textarea
            id="questionsText"
            value={questionsText}
            onChange={(e) => {
              setQuestionsText(e.target.value)
              setError(null)
            }}
            placeholder="Share any questions or topics you'd like to discuss..."
            rows={4}
            aria-required="true"
            aria-invalid={!!(error && !questionsText.trim())}
            aria-describedby={error && !questionsText.trim() ? "questionsText-error" : undefined}
            className="lead-form__textarea"
            autoFocus
          />
        </div>
      )}

      {error && <p id="questionsText-error" role="alert" className="lead-form__error">{error}</p>}

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : (
            <>
              Submit
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
