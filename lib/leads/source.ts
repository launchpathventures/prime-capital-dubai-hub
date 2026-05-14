/**
 * CATALYST - Lead Source Attribution
 *
 * Normalises the CRM site source for website forms. Campaign source belongs
 * in utmSource; `_source` identifies this website integration.
 */

export interface LeadSiteSourceInput {
  pageUrl: string
  leadTag?: string
}

const DEFAULT_LEAD_SOURCE = "prime-capital-website"

export function deriveSiteSource(leadData: LeadSiteSourceInput): string {
  void leadData
  return DEFAULT_LEAD_SOURCE
}
