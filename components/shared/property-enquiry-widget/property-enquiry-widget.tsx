/**
 * CATALYST - Property Enquiry Widget
 *
 * Inline iframe embed of the AgentCRM enquiry widget on PDPs.
 *
 * Sizing strategy (per Steven Leckie's working integration, plus a high-
 * water-mark guard to handle CRM-side ResizeObserver jitter our widget
 * version exhibits):
 * - Initial height intentionally BELOW the widget's natural compact-card
 *   height (~340-460). Means widget.resize always animates upward, reading
 *   as the widget settling rather than collapsing.
 * - Resize handler does an imperative DOM write via ref — routing every
 *   widget.resize through React state causes reconciliation churn that
 *   visibly stutters the height transition during chat streaming.
 * - Defensive height extraction: the widget contract is
 *   { type: "widget.resize", payload: { height } } but real payloads drift,
 *   so we accept payload.height/contentHeight/scrollHeight, top-level height,
 *   and string forms ("640px").
 * - MAX_HEIGHT_PX caps a malformed payload from blowing the iframe off-screen.
 * - Only-grow guard: the widget posts t.contentRect.height (CONTENT box,
 *   not border box). When the widget's internal padding/border or layout
 *   transitions during an interaction, contentRect can transiently shrink
 *   while the rendered element is unchanged — visible to the user as the
 *   iframe collapsing mid-click. We track max height seen this session and
 *   ignore reports below it. Trade-off: closing chat back to compact leaves
 *   some empty space below the compact card, but that beats clipping or
 *   visible shrinkage during active use.
 *
 * Skeleton:
 * - Sits stacked over the iframe in the same wrapper.
 * - Cross-fade via opacity. iframe stays mounted at all times so postMessage
 *   keeps working underneath.
 * - isReady flips on the FIRST of: widget.ready, any widget.resize (proves
 *   the widget has painted), iframe onLoad (extension-blocked postMessage
 *   safety net), 8s setTimeout (network hang).
 *
 * Origin allowlist: explicit Set, no wildcards. Add new origins here AND in
 * next.config.ts's CSP frame-src or the iframe loads but resize messages
 * get dropped at the origin check.
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

/** Below the widget's observed compact-card floor so resize animates upward. */
const INITIAL_HEIGHT_PX = 320

/** Defensive cap so a malformed payload can't blow the iframe off-screen. */
const MAX_HEIGHT_PX = 2000

/** Drop the skeleton even if no postMessage / onLoad arrives within 8s. */
const READY_FALLBACK_MS = 8000

// NOTE: We previously tried to boost iframe height to a "roomy" value when
// the widget opened chat. It doesn't work — the CRM widget hardcodes its
// chat surface to `height: 640px` (inline style on the chat view's outer
// div). Growing the iframe beyond that just adds dead space below the
// widget. To give visitors more chat room, the CRM team needs to remove
// that fixed height or expose it as a config.

/**
 * Explicit allowlist — no wildcards. Add new origins here AND in
 * next.config.ts CSP frame-src or messages get dropped silently.
 */
const ALLOWED_ORIGINS: ReadonlySet<string> = new Set([getCrmOrigin()])

interface WidgetMessage {
  type?: string
  payload?: {
    height?: number | string
    contentHeight?: number | string
    scrollHeight?: number | string
    leadUuid?: string
    contactId?: string
    propertyRef?: string
    [k: string]: unknown
  }
  height?: number | string
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (...args: unknown[]) => void
  }
}

function parsePixelValue(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v
  if (typeof v === "string") {
    const m = v.match(/^(\d+(?:\.\d+)?)/)
    if (m) {
      const n = Number(m[1])
      return Number.isFinite(n) ? n : null
    }
  }
  return null
}

/**
 * Real widgets drift. Try documented payload.height first, fall back through
 * common alternates, finally accept top-level height / string forms.
 */
function extractResizeHeight(data: WidgetMessage): number | null {
  const candidates: unknown[] = [
    data.payload?.height,
    data.payload?.contentHeight,
    data.payload?.scrollHeight,
    data.height,
  ]
  for (const c of candidates) {
    const n = parsePixelValue(c)
    if (n !== null) return n
  }
  return null
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
  /** High-water mark for applied iframe height — see only-grow guard above. */
  const maxAppliedHeightRef = useRef<number>(INITIAL_HEIGHT_PX)

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

  // postMessage bridge: resize + ready + analytics. Always validate origin.
  // setIsReady(true) is idempotent, so calling it on every relevant event
  // is fine (React bails on same-value setState).
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
          const h = extractResizeHeight(data)
          if (iframe && h !== null) {
            const target = Math.min(Math.ceil(h), MAX_HEIGHT_PX)
            // Only-grow: the widget's ResizeObserver reports contentRect
            // (content box, not border box) which can transiently shrink
            // during state transitions while the rendered element stays
            // the same size. Ignoring shrinks prevents visible collapse.
            if (target > maxAppliedHeightRef.current) {
              maxAppliedHeightRef.current = target
              iframe.style.height = `${target}px`
            }
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
          style={{ height: INITIAL_HEIGHT_PX }}
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
