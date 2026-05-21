/**
 * CATALYST - Success Step
 *
 * For download mode: shows success then redirects after a brief delay.
 * For Calendly URLs: embeds Calendly's official widget with prefill + booking
 * postMessage hook. For Google Calendar appointment URLs: embeds the booking
 * page in an iframe with name/email/phone prefilled via query params.
 */

"use client"

import { useEffect, useRef, useState } from "react"
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

  // Booking embed (Calendly or Google Calendar appointment scheduling).
  if (calendlyUrl) {
    const vendor = detectBookingVendor(calendlyUrl)

    if (vendor === "google") {
      const embedUrl = buildGoogleCalendarUrl(calendlyUrl, data)
      return (
        <iframe
          src={embedUrl}
          title="Book your call"
          className="lead-form__booking-iframe"
          style={{
            width: "100%",
            minWidth: "320px",
            height: "780px",
            border: 0,
          }}
        />
      )
    }

    const embedUrl = buildCalendlyUrl(calendlyUrl, data)
    return (
      <>
        <CalendlyBookingListener data={data} redirectUrl={redirectUrl} />
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
      case "event":
        return "You're registered. Check your email and WhatsApp for the confirmation and live link."
      case "newsletter":
        return "You're subscribed. Look out for our next briefing."
      case "property-enquiry":
        return "Thanks — your property enquiry is in. A specialist will be in touch shortly."
      default:
        return "Thanks — we'll be in touch shortly."
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
 * Listens for Calendly's `event_scheduled` postMessage and fires a
 * follow-up POST to /api/leads marking the lead as having booked a
 * meeting. The CRM dedups against the original submission via
 * submissionId / email and upgrades the lead to HOT tier.
 *
 * The basic Calendly widget only exposes event/invitee URIs in the
 * postMessage payload — actual meeting time + invitee details are
 * available via Calendly's webhook or API. We forward the URIs so the
 * CRM can resolve them server-side if needed.
 *
 * @see https://help.calendly.com/hc/en-us/articles/360020052833
 */
function CalendlyBookingListener({
  data,
  redirectUrl,
}: {
  data: Partial<LeadFormData>
  redirectUrl?: string
}) {
  // Guard against double-firing if Calendly emits the same event twice
  // for any reason (e.g. iframe reload).
  const firedRef = useRef(false)
  // Pin the latest form data in a ref so the listener stays mounted across
  // re-renders. Reading from the ref inside the handler always sees the
  // current value without re-binding the listener every render.
  const dataRef = useRef(data)

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    function isCalendlyEvent(event: MessageEvent): boolean {
      return (
        event.origin === "https://calendly.com" &&
        typeof event.data === "object" &&
        event.data !== null &&
        typeof (event.data as { event?: unknown }).event === "string" &&
        (event.data as { event: string }).event.startsWith("calendly.")
      )
    }

    function handler(event: MessageEvent) {
      if (!isCalendlyEvent(event)) return
      const payload = event.data as {
        event: string
        payload?: {
          event?: { uri?: string }
          invitee?: { uri?: string }
        }
      }
      if (payload.event !== "calendly.event_scheduled") return
      if (firedRef.current) return
      firedRef.current = true

      const d = dataRef.current
      const meetingPayload = {
        // Identity carried forward so the CRM can reconcile against the
        // original submission. submissionId is the canonical idempotency
        // key — same value on both POSTs means the CRM knows it's the
        // same person, not a new lead.
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        whatsapp: d.whatsapp,
        formMode: d.formMode || "contact",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        submittedAt: new Date().toISOString(),
        submissionId: d.submissionId,
        sessionId: d.sessionId,

        // Booking signal
        scheduledMeeting: true,
        meetingEventUri: payload.payload?.event?.uri,
        meetingInviteeUri: payload.payload?.invitee?.uri,
        meetingInviteeName:
          [d.firstName, d.lastName].filter(Boolean).join(" ") || undefined,
        meetingInviteeEmail: d.email,

        // Forward routing context so the CRM can re-confirm assignment.
        referringProperty: d.referringProperty,
        referringTeamMember: d.referringTeamMember,
        referringTeamMemberEmail: d.referringTeamMemberEmail,
        leadTag: d.leadTag,

        // Honeypot stays empty.
        website: "",
      }

      // Fire-and-forget. Failure here is non-blocking — the meeting is
      // still booked in Calendly, and Calendly's own webhook into the
      // CRM is the authoritative path.
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetingPayload),
        keepalive: true,
      }).catch((err) => {
        console.warn("[CalendlyBookingListener] follow-up POST failed", err)
      })

      if (redirectUrl) {
        window.setTimeout(() => {
          window.location.href = redirectUrl
        }, 600)
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [redirectUrl])

  return null
}

function detectBookingVendor(url: string): "calendly" | "google" | "unknown" {
  // Parse the host explicitly — the previous string regex required a literal
  // dot before the hostname, which never matched the canonical
  // `https://calendar.google.com/...` URL (slash, not dot, precedes the host).
  try {
    const host = new URL(url).hostname.toLowerCase()
    if (/(^|\.)calendly\.com$/.test(host)) return "calendly"
    if (/(^|\.)calendar\.(app\.)?google\.com$/.test(host)) return "google"
  } catch {
    // Malformed URL falls through to unknown
  }
  return "unknown"
}

/**
 * Build Google Calendar appointment URL with prefill params.
 * Google decodes %20 for spaces in name; we keep it explicit to match Calendly's
 * pattern and avoid the `+` ambiguity that URLSearchParams introduces.
 */
function buildGoogleCalendarUrl(
  baseUrl: string,
  data: Partial<LeadFormData>,
): string {
  const parts: string[] = ["gv=true"]
  const add = (key: string, value: string) => {
    parts.push(`${key}=${encodeURIComponent(value)}`)
  }

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ")
  if (fullName) add("name", fullName)
  if (data.email) add("email", data.email)
  if (data.whatsapp) add("phone", data.whatsapp)

  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}${parts.join("&")}`
}

/**
 * Build Calendly URL with prefill and display params.
 * @see https://calendly.com/help/how-to-customize-your-embed
 */
function buildCalendlyUrl(baseUrl: string, data: Partial<LeadFormData>): string {
  // Calendly expects %20 for spaces, not + (which URLSearchParams uses).
  // Build the query string manually with encodeURIComponent.
  const parts: string[] = []
  const add = (key: string, value: string) => {
    parts.push(`${key}=${encodeURIComponent(value)}`)
  }

  // Brand colors (spruce / ash)
  add("primary_color", "576c75")
  add("text_color", "3f4142")

  // Clean embed
  add("hide_event_type_details", "1")
  add("hide_gdpr_banner", "1")

  // Invitee prefill
  if (data.firstName)
    add("name", `${data.firstName} ${data.lastName || ""}`.trim())
  if (data.email) add("email", data.email)

  // Custom question prefill (must match Calendly question order)
  if (data.whatsapp) add("a1", data.whatsapp)
  if (data.propertyName) add("a2", data.propertyName)
  if (data.propertyLocation) add("a3", data.propertyLocation)
  if (data.concerns) add("a4", data.concerns)

  const separator = baseUrl.includes("?") ? "&" : "?"
  return `${baseUrl}${separator}${parts.join("&")}`
}
