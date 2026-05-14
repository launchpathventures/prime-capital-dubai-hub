/**
 * CATALYST - useAttribution Hook
 *
 * Extends useUTMParams with session-persistent UTM attribution + sessionId
 * tracking.
 *
 * - UTM attribution: capture utm_* params once, persist them for the session,
 *   and attach them to every form submission. Existing values are not
 *   overwritten by later page views.
 * - First-touch: captured once and persisted in a 30-day cookie for journey
 *   context (referrer + landing page + timestamp).
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
import { captureSessionUtm, readUtmFromSearch } from "@/lib/leads/attribution"

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
  // ads etc.) but blocks unrelated third-party use. Add Secure on HTTPS so
  // the cookie can't leak over an HTTP downgrade in production.
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : ""
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSec}; Path=/; SameSite=Lax${secure}`
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
 * One-shot capture: reads stored UTM attribution if present, otherwise stores
 * the current utm_* params. Also ensures a sessionId cookie exists and keeps
 * first-touch context for debugging/analytics.
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

    // --- First touch context ---
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
      const currentUtm = readUtmFromSearch(window.location.search)
      firstTouch = {
        ...currentUtm,
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

    // --- Session UTM attribution ---
    const storedUtm = captureSessionUtm(window.location.search)

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
      ...(storedUtm || {}),
    }
  })

  // Preserve non-UTM params like `source`/`manychat` from the current URL, but
  // let session-persisted utm* values win for CRM attribution.
  return { ...lastTouch, ...snapshot }
}

/**
 * Per-submission UUID. Generated fresh each call — the form should call
 * this once when the user hits submit and resend the same value on retry
 * so the CRM can dedup transient retries.
 */
export function generateSubmissionId(): string {
  return generateUUID()
}
