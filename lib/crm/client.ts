/**
 * CATALYST - AgentCRM API Client (Server Only)
 *
 * Reads property data from the public CRM API. The CRM is the source of
 * truth for listings, pricing, payment plans, and the inline enquiry widget.
 *
 * - List callers should pass promotionStatus="top_property" to surface only
 *   curated picks (matches the "Selected Properties" framing on the site).
 *   Without it, the CRM returns the agency's full catalogue (~1.4k rows).
 * - Detail endpoint returns any property regardless of status — UI must show
 *   sold / under-offer / off-market badges from the status field.
 * - All endpoints are public-read with permissive CORS; no auth required.
 *
 * Server-only: do NOT import from a Client Component.
 */

import "server-only"

import { config } from "@/lib/config"
import { trackError } from "@/lib/error-tracking"
import type {
  CrmListFilters,
  CrmListResponse,
  CrmProperty,
  CrmPropertyDetail,
  CrmPropertyFull,
  CrmPropertyListItem,
} from "./types"

const REVALIDATE_SECONDS = 300 // CRM advertises Cache-Control max-age=300
const CRM_PARAM_MAX_LENGTH = 200

interface FetchOptions {
  /** Skip the in-memory ISR cache for this request (e.g., previews). */
  noCache?: boolean
}

function isCrmConfigured(): boolean {
  return Boolean(
    config.crm.baseUrl &&
      config.crm.agencySlug &&
      config.crm.agencySlug.length <= CRM_PARAM_MAX_LENGTH,
  )
}

function buildListUrl(filters: CrmListFilters | undefined): string {
  const url = new URL("/api/public/properties", config.crm.baseUrl)
  url.searchParams.set("agency", config.crm.agencySlug)

  if (filters?.q) url.searchParams.set("q", filters.q)
  if (filters?.listingType) url.searchParams.set("listing_type", filters.listingType)
  if (filters?.area) url.searchParams.set("area", filters.area)
  if (filters?.propertyType) url.searchParams.set("property_type", filters.propertyType)
  if (filters?.bedroomsMin != null) url.searchParams.set("bedrooms_min", String(filters.bedroomsMin))
  if (filters?.bedroomsMax != null) url.searchParams.set("bedrooms_max", String(filters.bedroomsMax))
  if (filters?.priceMin != null) url.searchParams.set("price_min", String(filters.priceMin))
  if (filters?.priceMax != null) url.searchParams.set("price_max", String(filters.priceMax))
  if (filters?.status) url.searchParams.set("status", filters.status)
  if (filters?.promotionStatus)
    url.searchParams.set("promotion_status", filters.promotionStatus)
  if (filters?.paymentPlanPreset)
    url.searchParams.set("payment_plan_preset", filters.paymentPlanPreset)
  if (filters?.completionYearMin != null)
    url.searchParams.set("completion_year_min", String(filters.completionYearMin))
  if (filters?.completionYearMax != null)
    url.searchParams.set("completion_year_max", String(filters.completionYearMax))
  if (filters?.completionMonth != null)
    url.searchParams.set("completion_month", String(filters.completionMonth))
  if (filters?.tag) url.searchParams.set("tag", filters.tag)
  if (filters?.sort) url.searchParams.set("sort", filters.sort)
  if (filters?.cursor) url.searchParams.set("cursor", filters.cursor)
  if (filters?.limit != null) url.searchParams.set("limit", String(Math.min(filters.limit, 50)))

  return url.toString()
}

function buildDetailUrl(slugOrId: string): string {
  const url = new URL(`/api/public/properties/${encodeURIComponent(slugOrId)}`, config.crm.baseUrl)
  url.searchParams.set("agency", config.crm.agencySlug)
  return url.toString()
}

async function crmFetch<T>(url: string, opts: FetchOptions = {}): Promise<T | null> {
  const init: RequestInit & { next?: { revalidate?: number; tags?: string[] } } = {
    headers: { Accept: "application/json" },
    ...(opts.noCache ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS } }),
  }

  let res: Response
  try {
    res = await fetch(url, init)
  } catch (error) {
    trackError(error, { context: "crm", url, action: "fetch" })
    return null
  }

  if (res.status === 404) return null
  if (res.status === 429) {
    trackError(new Error(`CRM rate limited (${res.status})`), {
      context: "crm",
      url,
      retryAfter: res.headers.get("Retry-After"),
    })
    return null
  }
  if (!res.ok) {
    trackError(new Error(`CRM responded ${res.status}`), { context: "crm", url, status: res.status })
    return null
  }

  try {
    return (await res.json()) as T
  } catch (error) {
    trackError(error, { context: "crm", url, action: "parse" })
    return null
  }
}

// =============================================================================
// MAPPERS (snake_case → camelCase)
// =============================================================================

function mapListItem(row: CrmPropertyListItem): CrmProperty {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug ?? row.id,
    reference: row.reference,
    description: row.description,

    area: row.area,
    buildingName: row.building_name,

    price: row.price,
    priceFrom: row.price_from,
    priceTo: row.price_to,

    propertyType: row.property_type,
    status: row.status,
    promotionStatus: row.promotion_status,
    bedrooms: row.bedrooms,
    bedroomsMin: row.bedrooms_min,
    bedroomsMax: row.bedrooms_max,
    bathrooms: row.bathrooms,
    sqft: row.sqft,
    floor: row.floor,
    view: row.view,
    furnished: row.furnished,

    developer: row.developer,
    completionDate: row.completion_date,
    constructionProgress: row.construction_progress,
    amenities: row.amenities ?? [],

    paymentPlanPreset: row.payment_plan_preset ?? null,

    images: row.images ?? [],

    createdAt: row.created_at,
    listingDate: row.listing_date,

    embedUrl: row.embed_url,
    embedHtml: row.embed_html,
  }
}

function mapDetail(row: CrmPropertyDetail): CrmPropertyFull {
  return {
    ...mapListItem(row),
    unitNumber: row.unit_number,
    address: row.address,
    features: row.features ?? [],

    paymentPlan: row.payment_plan,
    unitTypes: row.unit_types,

    media: row.media,
    masterPlanUrl: row.master_plan_url,
    factsheetUrl: row.factsheet_url,

    reasonsToInvest: row.reasons_to_invest,
    overview: row.overview,
    locationAndViews: row.location_and_views,
    aboutDeveloper: row.about_developer,
    paymentPlanDetails: row.payment_plan_details,
    unitsMarkdown: row.units_markdown,
    unitsPricingMarkdown: row.units_pricing_markdown,
    amenitiesMarkdown: row.amenities_markdown,
    finishingAndMaterials: row.finishing_and_materials,
    kitchenAndAppliances: row.kitchen_and_appliances,
    furnishings: row.furnishings,

    notes: row.notes ?? [],
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

export interface GetCrmPropertiesResult {
  properties: CrmProperty[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

const EMPTY_RESULT: GetCrmPropertiesResult = {
  properties: [],
  nextCursor: null,
  hasMore: false,
  total: 0,
}

/**
 * Fetch the curated list of top-promoted properties for an agency.
 * Returns an empty result on misconfiguration or upstream failure (the
 * marketing site renders a "coming soon" state for empty results).
 */
export async function getCrmProperties(
  filters?: CrmListFilters,
  opts?: FetchOptions
): Promise<GetCrmPropertiesResult> {
  if (!isCrmConfigured()) return EMPTY_RESULT

  const data = await crmFetch<CrmListResponse>(buildListUrl(filters), opts)
  if (!data) return EMPTY_RESULT

  return {
    properties: data.data.map(mapListItem),
    nextCursor: data.pagination.next_cursor,
    hasMore: data.pagination.has_more,
    total: data.pagination.total,
  }
}

/**
 * Fetch a single property by slug or UUID. Returns null on 404 / failure so
 * the PDP can fall back to notFound().
 *
 * The detail endpoint wraps the property in `{ data: ... }` (matching the list
 * endpoint envelope), even though the published spec describes a flat shape.
 * We unwrap defensively so either form works.
 */
export async function getCrmPropertyBySlug(
  slugOrId: string,
  opts?: FetchOptions
): Promise<CrmPropertyFull | null> {
  if (!isCrmConfigured()) return null
  if (!slugOrId || slugOrId.length > CRM_PARAM_MAX_LENGTH) return null

  const response = await crmFetch<CrmDetailResponse>(buildDetailUrl(slugOrId), opts)
  if (!response) return null
  const row = "data" in response ? response.data : response
  if (!row) return null
  return mapDetail(row)
}

type CrmDetailResponse = CrmPropertyDetail | { data: CrmPropertyDetail }
