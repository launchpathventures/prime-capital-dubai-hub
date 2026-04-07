/**
 * CATALYST - Contact Step
 *
 * Capture email and WhatsApp with a personal greeting.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, FormMode } from "../types"
import { contactStepSchema } from "../schema"

interface ContactStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  mode?: FormMode
  isLastStep?: boolean
  isSubmitting?: boolean
  onSubmit?: (data: Partial<LeadFormData>) => void
  /** Optional: show a property name/location field with this label */
  propertyLabel?: string
  /** Optional: custom label for the submit button when this is the last step */
  submitLabel?: string
}

export function ContactStep({
  data,
  onUpdate,
  onNext,
  mode,
  isLastStep = false,
  isSubmitting = false,
  onSubmit,
  propertyLabel,
  submitLabel,
}: ContactStepProps) {
  const [email, setEmail] = useState(data.email || "")
  const [whatsapp, setWhatsapp] = useState(data.whatsapp || "")
  const [propertyLocation, setPropertyLocation] = useState(data.propertyLocation || "")
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
    const updates: Partial<LeadFormData> = { email, whatsapp }
    if (propertyLabel) updates.propertyLocation = propertyLocation
    if (isLastStep && onSubmit) {
      onSubmit(updates)
    } else {
      onUpdate(updates)
      onNext()
    }
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        {mode === "private" ? (
          <>
            <h2 className="lead-form__question">
              How should we reach you?
            </h2>
            <p className="lead-form__subtext">
              Your details remain strictly confidential.
            </p>
          </>
        ) : (
          <>
            <p className="lead-form__greeting">Nice to meet you, {firstName}.</p>
            <h2 className="lead-form__question">
              How can we best reach you?
            </h2>
            <p className="lead-form__subtext">
              We cherish our clients&#39; privacy and never share your details with 3rd parties.
            </p>
          </>
        )}
      </div>

      <div className="lead-form__fields">
        <div className="lead-form__field">
          <label htmlFor="email" className="lead-form__label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn("lead-form__input", errors.email && "lead-form__input--error")}
            autoFocus={mode !== "private"}
            autoComplete="email"
          />
          {errors.email && (
            <span id="email-error" role="alert" className="lead-form__error">{errors.email}</span>
          )}
        </div>

        <div className="lead-form__field">
          <label htmlFor="whatsapp" className="lead-form__label">WhatsApp / Mobile</label>
          <input
            id="whatsapp"
            type="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+971 50 123 4567"
            aria-required="true"
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            className={cn("lead-form__input", errors.whatsapp && "lead-form__input--error")}
            autoComplete="tel"
            inputMode="tel"
          />
          {errors.whatsapp && (
            <span id="whatsapp-error" role="alert" className="lead-form__error">{errors.whatsapp}</span>
          )}
        </div>

        {propertyLabel && (
          <div className="lead-form__field">
            <label htmlFor="propertyLocation" className="lead-form__label">{propertyLabel}</label>
            <input
              id="propertyLocation"
              type="text"
              value={propertyLocation}
              onChange={(e) => setPropertyLocation(e.target.value)}
              placeholder="e.g. Marina Gate Tower 2, Dubai Marina"
              className="lead-form__input"
              autoComplete="off"
            />
          </div>
        )}
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
              {submitLabel || "Submit"}
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
