/**
 * CATALYST - Success Step
 *
 * For download mode: shows success then redirects after a brief delay.
 * For calendly mode: uses Calendly's official inline widget embed
 * with Next.js Script component for proper loading.
 */

"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
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
  calendlyUrl?: string
}

export function SuccessStep({
  data,
  mode,
  customMessage,
  redirectUrl,
  redirectDelay = 3000,
  calendlyUrl,
}: SuccessStepProps) {
  const firstName = data.firstName || "there"
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000))
  const shouldRedirect = mode === "download" && !!redirectUrl && !calendlyUrl
  const [isRedirecting] = useState(shouldRedirect)

  // Handle redirect for download mode
  useEffect(() => {
    if (!shouldRedirect) return

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const redirectTimeout = setTimeout(() => {
      window.location.href = redirectUrl!
    }, redirectDelay)

    return () => {
      clearInterval(countdownInterval)
      clearTimeout(redirectTimeout)
    }
  }, [shouldRedirect, redirectUrl, redirectDelay])

  // Calendly mode
  if (calendlyUrl) {
    const embedUrl = buildCalendlyUrl(calendlyUrl, data)
    return (
      <>
        <div
          className="calendly-inline-widget"
          data-url={embedUrl}
          style={{ minWidth: "320px", height: "700px" }}
        />
        <Script
          src="https://assets.calendly.com/assets/external/widget.js"
          strategy="lazyOnload"
        />
      </>
    )
  }

  // Standard success message
  const getDefaultMessage = () => {
    switch (mode) {
      case "download":
        if (redirectUrl && isRedirecting) {
          return `Opening your Strategy Kit in ${countdown} second${countdown !== 1 ? "s" : ""}...`
        }
        return "Your download is ready. Check your email for the link."
      case "landing":
        return "We've received your details and will be in touch shortly."
      case "private":
        return "A senior member of our team will be in touch to arrange a call at your convenience."
      case "contact":
        return "We've received your enquiry. A member of our team will reach out within one business day."
    }
  }

  const message = customMessage || getDefaultMessage()

  const handleManualRedirect = () => {
    if (redirectUrl) window.location.href = redirectUrl
  }

  return (
    <div className="lead-form__success">
      <div className="lead-form__success-icon">
        <CheckIcon size={24} />
      </div>

      <h2 className="lead-form__success-title">Thank you, {firstName}</h2>
      <p className="lead-form__success-message">{message}</p>

      {mode === "download" && redirectUrl && (
        <>
          <div className="lead-form__redirect-progress" style={{ marginTop: "1.5rem" }}>
            <div
              className="lead-form__redirect-bar"
              style={{ animationDuration: `${redirectDelay}ms` }}
            />
          </div>
          <button
            onClick={handleManualRedirect}
            className="lead-form__submit"
            style={{ marginTop: "1rem" }}
          >
            <ExternalLinkIcon size={16} style={{ marginRight: "0.5rem" }} />
            Open Strategy Kit Now
          </button>
          <p className="lead-form__redirect-note" style={{ marginTop: "0.75rem" }}>
            You&apos;ll also receive a copy via email.
          </p>
        </>
      )}
    </div>
  )
}

/**
 * Build Calendly URL with prefill and display params.
 * @see https://calendly.com/help/how-to-customize-your-embed
 */
function buildCalendlyUrl(baseUrl: string, data: Partial<LeadFormData>): string {
  const params = new URLSearchParams()

  // Brand colors (spruce / ash)
  params.set("primary_color", "576c75")
  params.set("text_color", "3f4142")

  // Clean embed
  params.set("hide_event_type_details", "1")
  params.set("hide_gdpr_banner", "1")

  // Invitee prefill
  if (data.firstName)
    params.set("name", `${data.firstName} ${data.lastName || ""}`.trim())
  if (data.email) params.set("email", data.email)

  // Custom question prefill
  if (data.whatsapp) params.set("a1", data.whatsapp)
  if (data.propertyLocation) params.set("a2", data.propertyLocation)

  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}${params.toString()}`
}
