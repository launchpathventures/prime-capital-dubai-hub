/**
 * CATALYST - Private Context Step
 *
 * For the "private" form mode only.
 * Captures: role (investor/advisor/family office), deployment range,
 * preferred contact method, and optional context.
 * Minimal, discreet, no over-asking.
 */

"use client"

import { useState } from "react"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  LeadFormData,
  FormTheme,
  PrivateRole,
  DeploymentRange,
  PreferredContact,
} from "../types"
import {
  PRIVATE_ROLE_OPTIONS,
  DEPLOYMENT_RANGE_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
} from "../types"
import { privateContextStepSchema } from "../schema"

interface PrivateContextStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onSubmit: () => void
  isSubmitting: boolean
  theme: FormTheme
}

export function PrivateContextStep({
  data,
  onUpdate,
  onSubmit,
  isSubmitting,
}: PrivateContextStepProps) {
  const [privateRole, setPrivateRole] = useState<PrivateRole | undefined>(data.privateRole)
  const [deploymentRange, setDeploymentRange] = useState<DeploymentRange | undefined>(data.deploymentRange)
  const [preferredContact, setPreferredContact] = useState<PreferredContact | undefined>(data.preferredContact)
  const [privateContext, setPrivateContext] = useState(data.privateContext || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = privateContextStepSchema.safeParse({
      privateRole,
      deploymentRange,
      preferredContact,
      privateContext: privateContext || undefined,
    })

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
    onUpdate({ privateRole, deploymentRange, preferredContact, privateContext: privateContext || undefined })
    onSubmit()
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Thank you, {firstName}.</p>
        <h2 className="lead-form__question">
          A few details so we can prepare
        </h2>
        <p className="lead-form__subtext">
          All information is held in strict confidence.
        </p>
      </div>

      <div className="lead-form__fields">
        {/* Role */}
        <div className="lead-form__field">
          <label className="lead-form__label">Your role</label>
          <div className="lead-form__select-group" role="radiogroup" aria-label="Your role">
            {PRIVATE_ROLE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={privateRole === option.value}
                onClick={() => { setPrivateRole(option.value); setErrors((e) => ({ ...e, privateRole: "" })) }}
                className={cn(
                  "lead-form__select-option",
                  privateRole === option.value && "lead-form__select-option--selected"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.privateRole && (
            <span role="alert" className="lead-form__error">{errors.privateRole}</span>
          )}
        </div>

        {/* Deployment range */}
        <div className="lead-form__field">
          <label className="lead-form__label">Anticipated deployment</label>
          <div className="lead-form__select-group" role="radiogroup" aria-label="Anticipated deployment range">
            {DEPLOYMENT_RANGE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={deploymentRange === option.value}
                onClick={() => { setDeploymentRange(option.value); setErrors((e) => ({ ...e, deploymentRange: "" })) }}
                className={cn(
                  "lead-form__select-option",
                  deploymentRange === option.value && "lead-form__select-option--selected"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.deploymentRange && (
            <span role="alert" className="lead-form__error">{errors.deploymentRange}</span>
          )}
        </div>

        {/* Preferred contact method */}
        <div className="lead-form__field">
          <label className="lead-form__label">Preferred contact method</label>
          <div className="lead-form__select-group lead-form__select-group--row" role="radiogroup" aria-label="Preferred contact method">
            {PREFERRED_CONTACT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={preferredContact === option.value}
                onClick={() => { setPreferredContact(option.value); setErrors((e) => ({ ...e, preferredContact: "" })) }}
                className={cn(
                  "lead-form__select-option",
                  preferredContact === option.value && "lead-form__select-option--selected"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.preferredContact && (
            <span role="alert" className="lead-form__error">{errors.preferredContact}</span>
          )}
        </div>

        {/* Optional context */}
        <div className="lead-form__field">
          <label htmlFor="privateContext" className="lead-form__label">
            Anything we should know ahead of the call?
            <span className="lead-form__label-optional"> (optional)</span>
          </label>
          <textarea
            id="privateContext"
            value={privateContext}
            onChange={(e) => setPrivateContext(e.target.value)}
            placeholder="E.g. specific areas of interest, timeline, advisory relationships"
            className="lead-form__input lead-form__textarea"
            rows={3}
            maxLength={500}
          />
        </div>
      </div>

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : (
            <>
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
              Submit
            </>
          )}
        </button>
      </div>
    </form>
  )
}
