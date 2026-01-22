/**
 * CATALYST - useUTMParams Hook
 *
 * Extracts UTM parameters from the URL on mount.
 * Used by lead forms to capture marketing attribution.
 *
 * @example
 * const utm = useUTMParams()
 * // { utmSource: "google", utmMedium: "cpc", ... }
 */

"use client"

import * as React from "react"

export interface UTMParams {
  source?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  manychat?: string
}

/**
 * Extract UTM parameters from URL search params.
 * Only runs on client-side.
 */
export function useUTMParams(): UTMParams {
  // Initialize with extracted params directly to avoid setState in effect
  const [params] = React.useState<UTMParams>(() => {
    if (typeof window === "undefined") return {}

    const searchParams = new URLSearchParams(window.location.search)

    return {
      source: searchParams.get("source") || undefined,
      utmSource: searchParams.get("utm_source") || undefined,
      utmMedium: searchParams.get("utm_medium") || undefined,
      utmCampaign: searchParams.get("utm_campaign") || undefined,
      utmContent: searchParams.get("utm_content") || undefined,
      utmTerm: searchParams.get("utm_term") || undefined,
      manychat: searchParams.get("manychat") || undefined,
    }
  })

  return params
}

/**
 * Get UTM params synchronously (for server-side or one-time extraction).
 * Returns empty object if window is not available.
 */
export function getUTMParams(): UTMParams {
  if (typeof window === "undefined") return {}

  const searchParams = new URLSearchParams(window.location.search)

  return {
    source: searchParams.get("source") || undefined,
    utmSource: searchParams.get("utm_source") || undefined,
    utmMedium: searchParams.get("utm_medium") || undefined,
    utmCampaign: searchParams.get("utm_campaign") || undefined,
    utmContent: searchParams.get("utm_content") || undefined,
    utmTerm: searchParams.get("utm_term") || undefined,
    manychat: searchParams.get("manychat") || undefined,
  }
}
