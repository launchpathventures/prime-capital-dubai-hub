/**
 * CATALYST - Contact Step
 *
 * Capture email and WhatsApp with a personal greeting.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme } from "../types"
import { contactStepSchema } from "../schema"

interface ContactStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  isLastStep?: boolean
  isSubmitting?: boolean
  onSubmit?: () => void
}

export function ContactStep({
  data,
  onUpdate,
  onNext,
  isLastStep = false,
  isSubmitting = false,
  onSubmit,
}: ContactStepProps) {
  const [email, setEmail] = useState(data.email || "")
  const [whatsapp, setWhatsapp] = useState(data.whatsapp || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = contactStepSchema.safeParse({ email, whatsapp })
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
    onUpdate({ email, whatsapp })

    if (isLastStep && onSubmit) {
      onSubmit()
    } else {
      onNext()
    }
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Nice to meet you, {firstName}.</p>
        <h2 className="lead-form__question">
          How can we reach you?
        </h2>
        <p className="lead-form__subtext">
          We respect your privacy and never share your details.
        </p>
      </div>

      <div className="lead-form__fields">
        <div className="lead-form__field">
          <label className="lead-form__label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={cn("lead-form__input", errors.email && "lead-form__input--error")}
            autoFocus
          />
          {errors.email && (
            <span className="lead-form__error">{errors.email}</span>
          )}
        </div>

        <div className="lead-form__field">
          <label className="lead-form__label">WhatsApp / Mobile</label>
          <input
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+971 50 123 4567"
            className={cn("lead-form__input", errors.whatsapp && "lead-form__input--error")}
          />
          {errors.whatsapp && (
            <span className="lead-form__error">{errors.whatsapp}</span>
          )}
        </div>
      </div>

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : isLastStep ? (
            <>
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
              Submit
            </>
          ) : (
            <>
              Continue
              <ArrowRightIcon className="lead-form__submit-icon" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
