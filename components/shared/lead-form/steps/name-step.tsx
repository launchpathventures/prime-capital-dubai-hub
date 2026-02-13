/**
 * CATALYST - Name Step
 *
 * First step: Warm greeting and name capture.
 * Typography-first, conversational approach.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, FormMode } from "../types"
import { nameStepSchema } from "../schema"

interface NameStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  mode?: FormMode
  autoFocus?: boolean
}

export function NameStep({ data, onUpdate, onNext, mode, autoFocus = true }: NameStepProps) {
  const [firstName, setFirstName] = useState(data.firstName || "")
  const [lastName, setLastName] = useState(data.lastName || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = nameStepSchema.safeParse({ firstName, lastName })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onUpdate({ firstName, lastName })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">
          {mode === "private" ? "Your name" : "Hello. Who am I speaking with today?"}
        </h2>
        {mode !== "private" && (
          <p className="lead-form__subtext">
            So we know who we&#39;re speaking with
          </p>
        )}
      </div>

      <div className="lead-form__fields">
        <div className="lead-form__field-row">
          <div className="lead-form__field">
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              aria-label="First name"
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
              className={cn("lead-form__input", errors.firstName && "lead-form__input--error")}
              autoFocus={autoFocus && mode !== "private"}
              autoComplete="given-name"
            />
            {errors.firstName && (
              <span id="firstName-error" role="alert" className="lead-form__error">{errors.firstName}</span>
            )}
          </div>
          <div className="lead-form__field">
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              aria-label="Last name"
              aria-required="true"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
              className={cn("lead-form__input", errors.lastName && "lead-form__input--error")}
              autoComplete="family-name"
            />
            {errors.lastName && (
              <span id="lastName-error" role="alert" className="lead-form__error">{errors.lastName}</span>
            )}
          </div>
        </div>
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
