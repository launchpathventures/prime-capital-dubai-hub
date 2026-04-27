/**
 * CATALYST - Contact Step
 *
 * Capture email and WhatsApp with a personal greeting.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PhoneInput } from "@/components/ui/phone-input/phone-input"
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
  /** Optional: show a combined property name/location field with this label */
  propertyLabel?: string
  /** Optional: show separate property name and location fields */
  showPropertyFields?: boolean
  /** Optional: show a concerns/notes textarea */
  showConcerns?: boolean
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
  showPropertyFields,
  showConcerns,
  submitLabel,
}: ContactStepProps) {
  const [email, setEmail] = useState(data.email || "")
  const [whatsapp, setWhatsapp] = useState(data.whatsapp || "")
  const [propertyName, setPropertyName] = useState(data.propertyName || "")
  const [propertyLocation, setPropertyLocation] = useState(data.propertyLocation || "")
  const [concerns, setConcerns] = useState(data.concerns || "")
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
    if (showPropertyFields) {
      updates.propertyName = propertyName
      updates.propertyLocation = propertyLocation
    } else if (propertyLabel) {
      updates.propertyLocation = propertyLocation
    }
    if (showConcerns) updates.concerns = concerns
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
          <PhoneInput
            id="whatsapp"
            value={whatsapp}
            onChange={(v) => setWhatsapp(v ?? "")}
            placeholder="50 123 4567"
            aria-required
            aria-invalid={!!errors.whatsapp}
            aria-describedby={errors.whatsapp ? "whatsapp-error" : undefined}
            error={!!errors.whatsapp}
            autoComplete="tel"
          />
          {errors.whatsapp && (
            <span id="whatsapp-error" role="alert" className="lead-form__error">{errors.whatsapp}</span>
          )}
        </div>

        {showPropertyFields ? (
          <>
            <div className="lead-form__field">
              <label htmlFor="propertyName" className="lead-form__label">Property Name</label>
              <input
                id="propertyName"
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="e.g. Marina Gate Tower 2"
                className="lead-form__input"
                autoComplete="off"
              />
            </div>
            <div className="lead-form__field">
              <label htmlFor="propertyLocation" className="lead-form__label">Location</label>
              <input
                id="propertyLocation"
                type="text"
                value={propertyLocation}
                onChange={(e) => setPropertyLocation(e.target.value)}
                placeholder="e.g. Dubai Marina"
                className="lead-form__input"
                autoComplete="off"
              />
            </div>
          </>
        ) : propertyLabel ? (
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
        ) : null}

        {showConcerns && (
          <div className="lead-form__field">
            <label htmlFor="concerns" className="lead-form__label">Your Concerns</label>
            <textarea
              id="concerns"
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="Tell us about your situation or any concerns you have..."
              className="lead-form__input"
              rows={4}
              style={{ resize: "vertical" }}
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
