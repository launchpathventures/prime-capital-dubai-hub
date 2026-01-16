/**
 * CATALYST - Success Step
 *
 * Elegant confirmation after form submission.
 * Refined, celebratory but not excessive.
 */

"use client"

import { CheckIcon, DownloadIcon } from "lucide-react"
import type { LeadFormData, FormTheme, FormMode } from "../types"

interface SuccessStepProps {
  data: Partial<LeadFormData>
  theme: FormTheme
  mode: FormMode
  downloadAsset?: string
  customMessage?: string
}

export function SuccessStep({
  data,
  mode,
  downloadAsset,
  customMessage,
}: SuccessStepProps) {
  const firstName = data.firstName || "there"

  // Default messages per mode
  const getDefaultMessage = () => {
    switch (mode) {
      case "download":
        return "Your download is ready. Check your email for the link."
      case "landing":
        return "We've received your details and will be in touch shortly."
      case "contact":
        if (data.scheduledMeeting) {
          return "Your consultation is confirmed. We look forward to speaking with you."
        }
        return "We've received your enquiry. A member of our team will reach out within one business day."
    }
  }

  const message = customMessage || getDefaultMessage()

  return (
    <div className="lead-form__success">
      <div className="lead-form__success-icon">
        <CheckIcon size={24} />
      </div>

      <h2 className="lead-form__success-title">
        Thank you, {firstName}
      </h2>

      <p className="lead-form__success-message">{message}</p>

      {mode === "download" && downloadAsset && (
        <button className="lead-form__submit" style={{ marginTop: "1.5rem" }}>
          <DownloadIcon size={16} style={{ marginRight: "0.5rem" }} />
          Download {downloadAsset}
        </button>
      )}
    </div>
  )
}
