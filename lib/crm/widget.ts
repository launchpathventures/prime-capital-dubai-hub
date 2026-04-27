/**
 * CATALYST - AgentCRM Widget URL Builder
 *
 * Produces the iframe src for the inline enquiry widget. Client-safe.
 * Used by the property-enquiry-widget component on PDPs.
 *
 * The widget renders the compact proposal card by default when ?property=
 * is set. Do NOT pass mode=form on PDPs — the compact card converts better.
 */

import { config } from "@/lib/config"

export interface WidgetUrlParams {
  /** Property slug or UUID. */
  property: string
  /** Display name shown in the greeting/card. */
  propertyName?: string
  /** Canonical PDP URL — sent with the lead. */
  propertyUrl?: string
  /** Page hosting the iframe (usually same as propertyUrl). */
  pageUrl?: string
  /** Share/attribution token if visitor came via a tracked link. */
  ref?: string
  /** Pre-fill values for known visitors. */
  name?: string
  email?: string
  phone?: string
  /** UTM forwarding. */
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmContent?: string
  utmTerm?: string
  /** Theme override; default auto. */
  theme?: "light" | "dark" | "auto"
}

const SNAKE_CASE_PARAMS: Array<[keyof WidgetUrlParams, string]> = [
  ["property", "property"],
  ["propertyName", "property_name"],
  ["propertyUrl", "property_url"],
  ["pageUrl", "page_url"],
  ["ref", "ref"],
  ["name", "name"],
  ["email", "email"],
  ["phone", "phone"],
  ["utmSource", "utm_source"],
  ["utmMedium", "utm_medium"],
  ["utmCampaign", "utm_campaign"],
  ["utmContent", "utm_content"],
  ["utmTerm", "utm_term"],
  ["theme", "theme"],
]

export function buildWidgetUrl(params: WidgetUrlParams): string {
  const url = new URL(`/embed/widget/${encodeURIComponent(config.crm.agencyUuid)}`, config.crm.baseUrl)
  for (const [camel, snake] of SNAKE_CASE_PARAMS) {
    const value = params[camel]
    if (value != null && value !== "") url.searchParams.set(snake, String(value))
  }
  return url.toString()
}

/**
 * Returns the configured CRM origin (no trailing slash) for postMessage
 * origin validation in the client-side resize bridge.
 */
export function getCrmOrigin(): string {
  return new URL(config.crm.baseUrl).origin
}
