/**
 * CATALYST - Property Enquiry Widget
 *
 * Inline iframe embed of the AgentCRM enquiry widget on PDPs.
 *
 * Sizing contract (per the CRM team's official integration docs, 2026-04):
 * - Widget is intrinsically short (~460px compact card) and grows to ~640px
 *   when the visitor opens chat or enquire.
 * - Iframe must listen for `widget.resize` postMessage events and update its
 *   own height. Without it, the chat is cropped on expand.
 * - Initial height = 460px. Don't fix any other height; don't use 100%.
 * - `transition: height 220ms ease` on the iframe smooths every resize.
 *
 * Right-column composition: we use Pattern A (sticky widget at `lg:top-24`)
 * on the PDP — see `app/(web)/properties/[slug]/page.tsx`. That keeps the
 * widget visually anchored as the visitor scrolls past the longer left
 * column, so any empty space below the sticky widget feels intentional.
 *
 * Skeleton:
 * - Sits stacked over the iframe in the same wrapper.
 * - Cross-fade via opacity. Iframe stays mounted at all times so postMessage
 *   keeps working underneath.
 * - isReady flips on the first of: widget.ready, any widget.resize (proves
 *   the widget has painted), iframe onLoad (extension-blocked postMessage
 *   safety net), 8s setTimeout (network hang).
 *
 * Origin allowlist: explicit Set, no wildcards. Add new origins here AND in
 * next.config.ts CSP frame-src or messages get dropped silently.
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

/** Per CRM docs: 460 is the widget's compact-card height. Let resize grow it. */
const INITIAL_HEIGHT_PX = 460

/**
 * Sanity floor for resize messages. The widget posts transient sub-compact
 * heights during the compact→chat React mount/remount cycle (the observed
 * root briefly has no children between renders, ResizeObserver fires with
 * near-zero values). 460 matches the widget's smallest legitimate state
 * (compact card), so anything below is glitch noise.
 */
const SANITY_MIN_HEIGHT_PX = 460

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
    height?: number
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
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

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

  // postMessage bridge: ready + resize + analytics. Always validate origin.
  // Height write is imperative via ref so React reconciliation can't stutter
  // the CSS height transition during rapid resize streams.
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
        case "widget.resize": {
          setIsReady(true)
          const iframe = iframeRef.current
          const h = data.payload?.height
          if (iframe && typeof h === "number" && Number.isFinite(h)) {
            // Clamp at compact-card floor — see SANITY_MIN_HEIGHT_PX.
            const target = Math.max(SANITY_MIN_HEIGHT_PX, Math.ceil(h))
            iframe.style.height = `${target}px`
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

    // Final safety net: if neither widget.ready, widget.resize, nor onLoad
    // fire within 8s (extension-blocked postMessage / hung CRM), drop the
    // skeleton anyway so we never get a stuck shimmer.
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
            ref={iframeRef}
            id="agentcrm-widget"
            src={src}
            title={title}
            width="100%"
            height={INITIAL_HEIGHT_PX}
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
