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
import type { LeadFormData, FormTheme } from "../types"
import { nameStepSchema } from "../schema"

interface NameStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function NameStep({ data, onUpdate, onNext }: NameStepProps) {
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
          Let's start with your name
        </h2>
        <p className="lead-form__subtext">
          So we know who we're speaking with
        </p>
      </div>

      <div className="lead-form__fields">
        <div className="lead-form__field-row">
          <div className="lead-form__field">
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className={cn("lead-form__input", errors.firstName && "lead-form__input--error")}
              autoFocus
            />
            {errors.firstName && (
              <span className="lead-form__error">{errors.firstName}</span>
            )}
          </div>
          <div className="lead-form__field">
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className={cn("lead-form__input", errors.lastName && "lead-form__input--error")}
            />
            {errors.lastName && (
              <span className="lead-form__error">{errors.lastName}</span>
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
