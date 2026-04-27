/**
 * CATALYST - Property Enquiry Widget
 *
 * Inline iframe embed of the AgentCRM enquiry widget on PDPs.
 *
 * Sizing contract (post bundle fix, 2026-04):
 * - Embedder owns iframe sizing; widget fills the box.
 * - Iframe is set to height: 100% of a sized parent (.frame), which uses a
 *   clamp() expression so the widget gets a 640px floor and grows with the
 *   viewport on taller screens (up to 880px). No more compact-vs-chat height
 *   negotiation; the chat surface fills whatever we give it.
 * - widget.resize is now inert (echoes the iframe's own height back); we
 *   ignore it. Origin allowlist still applies for security.
 *
 * Skeleton:
 * - Sits stacked over the iframe in the same wrapper.
 * - Cross-fades via opacity. Iframe stays mounted at all times so postMessage
 *   keeps working underneath.
 * - isReady flips on the first of: widget.ready, iframe onLoad (extension-
 *   blocked postMessage safety net), 8s setTimeout (network hang).
 *
 * Origin allowlist: explicit Set, no wildcards. Add new origins here AND in
 * next.config.ts CSP frame-src or messages get dropped silently.
 */

"use client"

import { useEffect, useState } from "react"

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

/** Drop the skeleton even if no postMessage / onLoad arrives within 8s. */
const READY_FALLBACK_MS = 8000

/**
 * Explicit allowlist — no wildcards. Add new origins here AND in
 * next.config.ts CSP frame-src or messages get dropped silently.
 */
const ALLOWED_ORIGINS: ReadonlySet<string> = new Set([getCrmOrigin()])

interface WidgetMessage {
  type?: string
  payload?: {
    leadUuid?: string
    contactId?: string
    propertyRef?: string
    [k: string]: unknown
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
    lead_id: (payload?.leadUuid as string | undefined) ?? null,
    contact_id: (payload?.contactId as string | undefined) ?? null,
    property_ref: (payload?.propertyRef as string | undefined) ?? null,
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
  const [isReady, setIsReady] = useState(false)

  // Build the iframe URL on mount so we can fold in UTM params from
  // window.location.search before the iframe loads (single load, no flash).
  useEffect(() => {
    const params: WidgetUrlParams = {
      property: slug,
      propertyName,
      propertyUrl,
      pageUrl: typeof window !== "undefined" ? window.location.href : propertyUrl,
      ...readAttributionParams(),
      ...(prefill ?? {}),
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- defer-mount: read window once on the client.
    setSrc(buildWidgetUrl(params))
  }, [slug, propertyName, propertyUrl, prefill])

  // postMessage bridge: ready + analytics. Always validate origin.
  useEffect(() => {
    function handler(event: MessageEvent<WidgetMessage>) {
      if (!ALLOWED_ORIGINS.has(event.origin)) return
      const data = event.data
      if (!data || typeof data.type !== "string") return
      if (!data.type.startsWith("widget.")) return

      if (process.env.NODE_ENV !== "production") {
        // Protocol-drift visibility — strip if tracing a noisy flow.
        console.debug("[widget]", data.type, data)
      }

      switch (data.type) {
        case "widget.ready": {
          setIsReady(true)
          break
        }
        case "widget.enquiry.submitted": {
          fireAnalyticsLead(data.payload)
          break
        }
        default:
          // widget.resize is intentionally not handled — the new bundle
          // echoes the iframe's own height back at us, so it's a no-op.
          break
      }
    }

    window.addEventListener("message", handler)

    // Final safety net: if neither widget.ready nor onLoad fires within 8s
    // (extension-blocked postMessage / hung CRM), drop the skeleton anyway.
    const fallback = window.setTimeout(() => setIsReady(true), READY_FALLBACK_MS)

    return () => {
      window.removeEventListener("message", handler)
      window.clearTimeout(fallback)
    }
  }, [])

  return (
    <div className="property-enquiry-widget" data-slot="property-enquiry-widget">
      <div className="property-enquiry-widget__frame">
        {src ? (
          <iframe
            id="agentcrm-widget"
            src={src}
            title={title}
            className="property-enquiry-widget__iframe"
            data-ready={isReady ? "true" : "false"}
            loading="lazy"
            onLoad={() => setIsReady(true)}
          />
        ) : null}
        <div
          className="property-enquiry-widget__skeleton"
          data-visible={isReady ? "false" : "true"}
          aria-hidden={isReady}
          role="status"
          aria-label="Loading enquiry widget"
        >
          <div className="property-enquiry-widget__skeleton-row">
            <div className="property-enquiry-widget__skeleton-avatar" />
            <div className="property-enquiry-widget__skeleton-stack">
              <div className="property-enquiry-widget__skeleton-line property-enquiry-widget__skeleton-line--title" />
              <div className="property-enquiry-widget__skeleton-line property-enquiry-widget__skeleton-line--subtitle" />
            </div>
          </div>
          <div className="property-enquiry-widget__skeleton-divider" />
          <div className="property-enquiry-widget__skeleton-line property-enquiry-widget__skeleton-line--full" />
          <div className="property-enquiry-widget__skeleton-line property-enquiry-widget__skeleton-line--full" />
          <div className="property-enquiry-widget__skeleton-line property-enquiry-widget__skeleton-line--short" />
          <div className="property-enquiry-widget__skeleton-button" />
        </div>
      </div>
    </div>
  )
}
