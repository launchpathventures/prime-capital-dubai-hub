/**
 * CATALYST - AgentCRM Property Facets (Server Only)
 *
 * Reads count-bearing filter facets from the CRM. The API cross-filters
 * counts using the active browse filters, including free-text `q`.
 *
 * Endpoint: GET /api/public/properties/facets?agency=<slug>
 *
 * Server-only: do NOT import from a Client Component. Pass the resolved
 * facets object as a prop to client filter UIs instead.
 */

import "server-only"

import { config } from "@/lib/config"
import { trackError } from "@/lib/error-tracking"
import type {
  CrmListFilters,
  PublicPropertyFacetOption,
  PublicPropertyFacets,
} from "./types"

const REVALIDATE_SECONDS = 300

interface RawFacetOption {
  value: string
  count: number
}

interface RawFacetsResponse {
  areas?: RawFacetOption[]
  property_types?: RawFacetOption[]
  listing_types?: RawFacetOption[]
  bedrooms?: RawFacetOption[]
}

const EMPTY_FACETS: PublicPropertyFacets = {
  areas: [],
  propertyTypes: [],
  listingTypes: [],
  bedrooms: [],
}

function isCrmConfigured(): boolean {
  return Boolean(config.crm.baseUrl && config.crm.agencySlug)
}

function sortFacetOptions(options: PublicPropertyFacetOption[]): PublicPropertyFacetOption[] {
  return [...options].sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.value.localeCompare(b.value)
  })
}

function mapFacetOptions(options: RawFacetOption[] | undefined): PublicPropertyFacetOption[] {
  if (!Array.isArray(options)) return []
  return sortFacetOptions(
    options
      .filter((option) => typeof option?.value === "string")
      .map((option) => ({
        value: option.value,
        count: Number.isFinite(option.count) ? option.count : 0,
      })),
  )
}

function appendFilterParams(url: URL, filters: CrmListFilters | undefined): void {
  if (!filters) return

  if (filters.q) url.searchParams.set("q", filters.q)
  if (filters.listingType) url.searchParams.set("listing_type", filters.listingType)
  if (filters.area) url.searchParams.set("area", filters.area)
  if (filters.propertyType) url.searchParams.set("property_type", filters.propertyType)
  if (filters.bedroomsMin != null) url.searchParams.set("bedrooms_min", String(filters.bedroomsMin))
  if (filters.bedroomsMax != null) url.searchParams.set("bedrooms_max", String(filters.bedroomsMax))
  if (filters.priceMin != null) url.searchParams.set("price_min", String(filters.priceMin))
  if (filters.priceMax != null) url.searchParams.set("price_max", String(filters.priceMax))
  if (filters.status) url.searchParams.set("status", filters.status)
  if (filters.promotionStatus) url.searchParams.set("promotion_status", filters.promotionStatus)
  if (filters.tag) url.searchParams.set("tag", filters.tag)
}

function mapFacets(raw: RawFacetsResponse): PublicPropertyFacets {
  return {
    areas: mapFacetOptions(raw.areas),
    propertyTypes: mapFacetOptions(raw.property_types),
    listingTypes: mapFacetOptions(raw.listing_types),
    bedrooms: mapFacetOptions(raw.bedrooms),
  }
}

/**
 * Returns live, count-bearing facets for the configured agency and active
 * browse filters. Always resolves with an empty shape on upstream failure.
 */
export async function fetchPropertyFacets(
  filters?: CrmListFilters,
): Promise<PublicPropertyFacets> {
  if (!isCrmConfigured()) return EMPTY_FACETS

  const url = new URL("/api/public/properties/facets", config.crm.baseUrl)
  url.searchParams.set("agency", config.crm.agencySlug)
  appendFilterParams(url, filters)

  let res: Response
  try {
    res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
    })
  } catch (error) {
    trackError(error, { context: "crm-facets", url: url.toString(), action: "fetch" })
    return EMPTY_FACETS
  }

  if (!res.ok) {
    trackError(new Error(`CRM facets responded ${res.status}`), {
      context: "crm-facets",
      url: url.toString(),
      status: res.status,
    })
    return EMPTY_FACETS
  }

  try {
    const raw = (await res.json()) as RawFacetsResponse
    return mapFacets(raw)
  } catch (error) {
    trackError(error, { context: "crm-facets", url: url.toString(), action: "parse" })
    return EMPTY_FACETS
  }
}
