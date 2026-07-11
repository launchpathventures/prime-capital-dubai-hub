/**
 * CATALYST - Property Browse Filter Parsing (Client-safe)
 *
 * Single source of truth for turning URL query params into CrmListFilters.
 * Shared by the /properties server page (initial render) and the
 * /api/properties route (load-more pagination) so both stay in lockstep.
 *
 * No promotion_status default: the public browse shows the agency's full
 * inventory. Callers that want the curated subset pass promotion_status
 * explicitly.
 */

import type {
  CrmListFilters,
  CrmListingType,
  CrmPromotionStatus,
  CrmPropertyStatus,
  CrmPropertyType,
  CrmSort,
} from "./types"

/** Max rows the CRM returns per request; also our page size for load-more. */
export const BROWSE_PAGE_SIZE = 50

const ALLOWED_SORTS: CrmSort[] = ["price_asc", "price_desc", "newest", "oldest"]

function textValue(sp: URLSearchParams, key: string): string | undefined {
  const raw = sp.get(key)?.trim()
  return raw ? raw : undefined
}

function numericValue(sp: URLSearchParams, key: string): number | undefined {
  const raw = sp.get(key)
  if (raw == null || raw === "") return undefined
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

/**
 * Parse browse filters from URL search params. The CRM silently drops
 * invalid values, so we forward strings as-is (cast to the canonical union
 * types) rather than maintaining a site-side allowlist.
 */
export function parseBrowseFilters(sp: URLSearchParams): CrmListFilters {
  const sortRaw = sp.get("sort") ?? undefined
  const sort = ALLOWED_SORTS.includes(sortRaw as CrmSort) ? (sortRaw as CrmSort) : undefined
  const propertyType = sp.get("property_type") ?? undefined

  return {
    q: textValue(sp, "q"),
    propertyType:
      propertyType && propertyType !== "all" ? (propertyType as CrmPropertyType) : undefined,
    area: textValue(sp, "area"),
    listingType: (sp.get("listing_type") as CrmListingType | null) ?? undefined,
    bedroomsMin: numericValue(sp, "bedrooms_min"),
    bedroomsMax: numericValue(sp, "bedrooms_max"),
    priceMin: numericValue(sp, "price_min"),
    priceMax: numericValue(sp, "price_max"),
    status: (sp.get("status") as CrmPropertyStatus | null) ?? undefined,
    promotionStatus: (sp.get("promotion_status") as CrmPromotionStatus | null) ?? undefined,
    tag: textValue(sp, "tag"),
    sort,
    limit: BROWSE_PAGE_SIZE,
  }
}
