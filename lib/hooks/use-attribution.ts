/**
 * CATALYST - useAttribution Hook
 *
 * Extends useUTMParams with first-touch attribution + sessionId tracking.
 *
 * - Last-touch: read fresh from URL on every page load (existing behaviour).
 * - First-touch: captured ONCE on the visitor's first page load and persisted
 *   in a 30-day cookie (UTMs + referrer + landing page + timestamp).
 * - Session: a stable UUID stored in a 30-day cookie, used to thread
 *   multi-form journeys ("downloaded the guide → enquired on a property")
 *   even when the same person bounces across sessions/devices on the
 *   same browser.
 *
 * Why first-touch matters: Dubai property funnels are long. Last-touch
 * alone (e.g. they Googled the address before booking a viewing) hides
 * which campaign actually originated the lead.
 */

"use client"

import * as React from "react"
import { useUTMParams, type UTMParams } from "./use-utm-params"

const FIRST_TOUCH_COOKIE = "pc_first_touch"
const SESSION_COOKIE = "pc_session_id"
const COOKIE_MAX_AGE_DAYS = 30

interface FirstTouch {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  referrer?: string
  landingPage?: string
  at?: string // ISO timestamp
}

export interface AttributionPayload extends UTMParams {
  // last-touch
  referrer?: string

  // first-touch (from cookie)
  firstTouchUtmSource?: string
  firstTouchUtmMedium?: string
  firstTouchUtmCampaign?: string
  firstTouchUtmContent?: string
  firstTouchUtmTerm?: string
  firstTouchReferrer?: string
  firstTouchLandingPage?: string
  firstTouchAt?: string

  // session
  sessionId?: string
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`),
  )
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string, maxAgeDays: number) {
  if (typeof document === "undefined") return
  const maxAgeSec = maxAgeDays * 24 * 60 * 60
  // SameSite=Lax keeps cookies on top-level navigations (CTAs from emails,
  // ads etc.) but blocks unrelated third-party use.
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax`
}

function generateUUID(): string {
  // crypto.randomUUID is available in modern browsers + edge runtime.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }
  // Fallback (still RFC4122 v4-shaped) for older browsers.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * One-shot capture: reads first-touch from cookie if present, otherwise
 * builds it from the current URL/referrer/landing page and writes the
 * cookie for next time. Also ensures a sessionId cookie exists.
 *
 * Runs once per component mount via useState lazy initialiser. Safe in
 * SSR — returns empty object on the server.
 */
export function useAttribution(): AttributionPayload {
  const lastTouch = useUTMParams()

  const [snapshot] = React.useState<AttributionPayload>(() => {
    if (typeof window === "undefined") return {}

    // --- Session ---
    let sessionId = readCookie(SESSION_COOKIE)
    if (!sessionId) {
      sessionId = generateUUID()
      writeCookie(SESSION_COOKIE, sessionId, COOKIE_MAX_AGE_DAYS)
    }

    // --- First touch ---
    let firstTouch: FirstTouch | null = null
    const cookieRaw = readCookie(FIRST_TOUCH_COOKIE)
    if (cookieRaw) {
      try {
        firstTouch = JSON.parse(cookieRaw) as FirstTouch
      } catch {
        firstTouch = null
      }
    }
    if (!firstTouch) {
      const params = new URLSearchParams(window.location.search)
      firstTouch = {
        utmSource: params.get("utm_source") || undefined,
        utmMedium: params.get("utm_medium") || undefined,
        utmCampaign: params.get("utm_campaign") || undefined,
        utmContent: params.get("utm_content") || undefined,
        utmTerm: params.get("utm_term") || undefined,
        referrer: document.referrer || undefined,
        landingPage: window.location.href,
        at: new Date().toISOString(),
      }
      try {
        writeCookie(FIRST_TOUCH_COOKIE, JSON.stringify(firstTouch), COOKIE_MAX_AGE_DAYS)
      } catch {
        /* quota or serialisation error — non-fatal */
      }
    }

    return {
      referrer: document.referrer || undefined,
      firstTouchUtmSource: firstTouch?.utmSource,
      firstTouchUtmMedium: firstTouch?.utmMedium,
      firstTouchUtmCampaign: firstTouch?.utmCampaign,
      firstTouchUtmContent: firstTouch?.utmContent,
      firstTouchUtmTerm: firstTouch?.utmTerm,
      firstTouchReferrer: firstTouch?.referrer,
      firstTouchLandingPage: firstTouch?.landingPage,
      firstTouchAt: firstTouch?.at,
      sessionId: sessionId || undefined,
    }
  })

  // Merge last-touch (URL params) with the captured snapshot. Last-touch
  // wins for the utm* fields because the visitor may have arrived via a
  // different campaign than their first hit.
  return { ...snapshot, ...lastTouch }
}

/**
 * Per-submission UUID. Generated fresh each call — the form should call
 * this once when the user hits submit and resend the same value on retry
 * so the CRM can dedup transient retries.
 */
export function generateSubmissionId(): string {
  return generateUUID()
}
