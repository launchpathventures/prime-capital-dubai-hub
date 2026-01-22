/**
 * CATALYST - Success Step
 *
 * Elegant confirmation after form submission.
 * Refined, celebratory but not excessive.
 * 
 * For download mode with a redirectUrl, shows success and then redirects
 * after a brief delay so users can see the confirmation.
 */

"use client"

import { useEffect, useState } from "react"
import { CheckIcon, ExternalLinkIcon } from "lucide-react"
import type { LeadFormData, FormTheme, FormMode } from "../types"

interface SuccessStepProps {
  data: Partial<LeadFormData>
  theme: FormTheme
  mode: FormMode
  downloadAsset?: string
  customMessage?: string
  redirectUrl?: string
  redirectDelay?: number
}

export function SuccessStep({
  data,
  mode,
  // downloadAsset reserved for future use
  customMessage,
  redirectUrl,
  redirectDelay = 3000,
}: SuccessStepProps) {
  const firstName = data.firstName || "there"
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000))
  // Initialize redirect state based on mode
  const shouldRedirect = mode === "download" && !!redirectUrl
  const [isRedirecting] = useState(shouldRedirect)

  // Handle redirect for download mode
  useEffect(() => {
    if (!shouldRedirect) return
      
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirect after delay
    const redirectTimeout = setTimeout(() => {
      window.location.href = redirectUrl!
    }, redirectDelay)

    return () => {
      clearInterval(countdownInterval)
      clearTimeout(redirectTimeout)
    }
  }, [shouldRedirect, redirectUrl, redirectDelay])

  // Default messages per mode
  const getDefaultMessage = () => {
    switch (mode) {
      case "download":
        if (redirectUrl && isRedirecting) {
          return `Opening your Strategy Kit in ${countdown} second${countdown !== 1 ? 's' : ''}...`
        }
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

  // Manual redirect button for download mode
  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }

  return (
    <div className="lead-form__success">
      <div className="lead-form__success-icon">
        <CheckIcon size={24} />
      </div>

      <h2 className="lead-form__success-title">
        Thank you, {firstName}
      </h2>

      <p className="lead-form__success-message">{message}</p>

      {mode === "download" && redirectUrl && (
        <>
          {/* Progress bar for redirect */}
          <div className="lead-form__redirect-progress" style={{ marginTop: "1.5rem" }}>
            <div 
              className="lead-form__redirect-bar"
              style={{ 
                animationDuration: `${redirectDelay}ms`,
              }}
            />
          </div>
          
          {/* Manual link as backup */}
          <button
            onClick={handleManualRedirect}
            className="lead-form__submit"
            style={{ marginTop: "1rem" }}
          >
            <ExternalLinkIcon size={16} style={{ marginRight: "0.5rem" }} />
            Open Strategy Kit Now
          </button>
          
          <p className="lead-form__redirect-note" style={{ marginTop: "0.75rem" }}>
            You'll also receive a copy via email.
          </p>
        </>
      )}
    </div>
  )
}
