/**
 * CATALYST - Property Enquiry Widget
 *
 * Inline iframe embed of the AgentCRM enquiry widget. Replaces the previous
 * "/contact" CTA on PDPs — the CRM is the source of truth for property leads.
 *
 * - Compact proposal card by default; expands to chat/form on click.
 * - 460px initial height; resizes via postMessage (transition: height 220ms).
 * - Forwards UTM params from the page URL when mounted.
 * - Listens for widget.enquiry.submitted to fire GA4 `generate_lead`.
 *
 * Mounts client-side so we can read UTM params from window.location.search.
 * Renders a same-height skeleton during SSR / before hydration to avoid layout
 * shift.
 */

"use client"

import { useEffect, useRef, useState } from "react"

import { buildWidgetUrl, getCrmOrigin, type WidgetUrlParams } from "@/lib/crm/widget"

import "./property-enquiry-widget.css"

interface PropertyEnquiryWidgetProps {
  /** Property slug or UUID — required to scope the widget. */
  slug: string
  /** Display name shown in the greeting/card. */
  propertyName?: string
  /** Canonical PDP URL — sent with the lead. */
  propertyUrl?: string
  /** Optional pre-fill for known visitors. */
  prefill?: { name?: string; email?: string; phone?: string }
  /** Title attribute for accessibility. */
  title?: string
}

const INITIAL_HEIGHT = 460

interface WidgetMessage {
  type?: string
  payload?: {
    height?: number
    leadUuid?: string
    contactId?: string
    propertyRef?: string
    event?: string
    properties?: Record<string, unknown>
  }
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

function readAttributionParams(): Pick<
  WidgetUrlParams,
  "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm" | "ref"
> {
  if (typeof window === "undefined") return {}
  const search = new URLSearchParams(window.location.search)
  return {
    utmSource: search.get("utm_source") ?? undefined,
    utmMedium: search.get("utm_medium") ?? undefined,
    utmCampaign: search.get("utm_campaign") ?? undefined,
    utmContent: search.get("utm_content") ?? undefined,
    utmTerm: search.get("utm_term") ?? undefined,
    ref: search.get("ref") ?? undefined,
  }
}

function fireAnalyticsLead(payload: WidgetMessage["payload"]): void {
  if (typeof window === "undefined") return
  const eventPayload = {
    event: "generate_lead",
    lead_id: payload?.leadUuid ?? null,
    contact_id: payload?.contactId ?? null,
    property_ref: payload?.propertyRef ?? null,
  }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(eventPayload)
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", eventPayload)
  }
}

export function PropertyEnquiryWidget({
  slug,
  propertyName,
  propertyUrl,
  prefill,
  title = "Enquire about this property",
}: PropertyEnquiryWidgetProps) {
  const [src, setSrc] = useState<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  // Build the iframe URL on mount so we can fold in UTM params from
  // window.location.search before the iframe loads (single load, no flash).
  // Server returns null (skeleton); client computes the full URL once.
  useEffect(() => {
    const params: WidgetUrlParams = {
      property: slug,
      propertyName,
      propertyUrl,
      pageUrl: typeof window !== "undefined" ? window.location.href : propertyUrl,
      ...readAttributionParams(),
      ...(prefill ?? {}),
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer-mount pattern: read window once on the client.
    setSrc(buildWidgetUrl(params))
  }, [slug, propertyName, propertyUrl, prefill])

  // postMessage bridge: resize + analytics. Always validate event.origin.
  useEffect(() => {
    const expectedOrigin = getCrmOrigin()
    function handler(event: MessageEvent<WidgetMessage>) {
      if (event.origin !== expectedOrigin) return
      const data = event.data
      if (!data || typeof data.type !== "string") return
      if (!data.type.startsWith("widget.")) return

      switch (data.type) {
        case "widget.resize": {
          const iframe = iframeRef.current
          const height = data.payload?.height
          if (iframe && typeof height === "number" && Number.isFinite(height)) {
            iframe.style.height = `${Math.ceil(height)}px`
          }
          break
        }
        case "widget.enquiry.submitted": {
          fireAnalyticsLead(data.payload)
          break
        }
        default:
          break
      }
    }

    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  return (
    <div className="property-enquiry-widget" data-slot="property-enquiry-widget">
      {src ? (
        <iframe
          ref={iframeRef}
          id="agentcrm-widget"
          src={src}
          title={title}
          width="100%"
          height={INITIAL_HEIGHT}
          className="property-enquiry-widget__iframe"
          loading="lazy"
        />
      ) : (
        <div
          className="property-enquiry-widget__placeholder"
          aria-hidden="true"
          style={{ height: INITIAL_HEIGHT }}
        />
      )}
    </div>
  )
}
