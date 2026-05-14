/**
 * CATALYST - Lead UTM Attribution
 *
 * Captures the first utm_* values for a browser session. `_source` is the
 * site/brand slug; campaign source belongs in utmSource.
 */

export interface UtmAttribution {
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
}

interface UtmStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const UTM_SESSION_STORAGE_KEY = "pc_utm_attribution"

const UTM_PARAM_MAP: Array<[keyof UtmAttribution, string]> = [
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["utmTerm", "utm_term"],
]

function getBrowserSessionStorage(): UtmStorage | null {
  if (typeof window === "undefined") return null
  return window.sessionStorage
}

export function hasUtm(value: Partial<UtmAttribution> | null | undefined): boolean {
  return Boolean(
    value?.utmSource ||
      value?.utmMedium ||
      value?.utmCampaign ||
      value?.utmContent ||
      value?.utmTerm,
  )
}

export function readUtmFromSearch(search: string | URLSearchParams): UtmAttribution {
  const params = typeof search === "string" ? new URLSearchParams(search) : search
  const attribution: UtmAttribution = {}

  for (const [field, param] of UTM_PARAM_MAP) {
    const value = params.get(param)?.trim()
    if (value) attribution[field] = value
  }

  return attribution
}

export function readStoredUtm(storage: UtmStorage | null = getBrowserSessionStorage()): UtmAttribution | null {
  if (!storage) return null

  try {
    const raw = storage.getItem(UTM_SESSION_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<UtmAttribution>
    const attribution: UtmAttribution = {
      utmSource: typeof parsed.utmSource === "string" ? parsed.utmSource : undefined,
      utmMedium: typeof parsed.utmMedium === "string" ? parsed.utmMedium : undefined,
      utmCampaign: typeof parsed.utmCampaign === "string" ? parsed.utmCampaign : undefined,
      utmContent: typeof parsed.utmContent === "string" ? parsed.utmContent : undefined,
      utmTerm: typeof parsed.utmTerm === "string" ? parsed.utmTerm : undefined,
    }

    return hasUtm(attribution) ? attribution : null
  } catch {
    return null
  }
}

export function writeStoredUtm(
  value: UtmAttribution,
  storage: UtmStorage | null = getBrowserSessionStorage(),
) {
  if (!storage || !hasUtm(value)) return

  try {
    storage.setItem(UTM_SESSION_STORAGE_KEY, JSON.stringify(value))
  } catch {
    /* storage unavailable or quota exceeded - non-fatal */
  }
}

export function captureSessionUtm(
  search: string | URLSearchParams = typeof window === "undefined" ? "" : window.location.search,
  storage: UtmStorage | null = getBrowserSessionStorage(),
): UtmAttribution | null {
  const stored = readStoredUtm(storage)
  if (stored) return stored

  const current = readUtmFromSearch(search)
  if (!hasUtm(current)) return null

  writeStoredUtm(current, storage)
  return current
}
