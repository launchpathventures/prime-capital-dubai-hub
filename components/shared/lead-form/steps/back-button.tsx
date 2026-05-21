/**
 * CATALYST - Lead Form Back Button
 *
 * Shared "Back" control. Sits inside .lead-form__actions, under the primary
 * submit, so both navigation controls live in the same row. Only renders
 * when there's a previous step to return to.
 */

"use client"

import { ArrowLeftIcon } from "lucide-react"

interface LeadFormBackButtonProps {
  onBack?: () => void
  canGoBack?: boolean
}

export function LeadFormBackButton({ onBack, canGoBack }: LeadFormBackButtonProps) {
  if (!canGoBack || !onBack) return null

  return (
    <button
      type="button"
      className="lead-form__back"
      onClick={onBack}
      aria-label="Go back to previous step"
    >
      <ArrowLeftIcon className="lead-form__back-icon" aria-hidden="true" />
      Back
    </button>
  )
}
