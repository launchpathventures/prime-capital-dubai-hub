/**
 * CATALYST - AgentCRM API Client (Server Only)
 *
 * Reads property data from the public CRM API. The CRM is the source of
 * truth for listings, pricing, payment plans, and the inline enquiry widget.
 *
 * - List endpoint returns the agency's full catalogue (~1.1k rows: off-plan +
 *   secondary) by default. promotionStatus is an optional pass-through filter,
 *   NOT a default gate — the public browse deliberately shows all inventory.
 * - Detail endpoint returns any property regardless of status — UI must show
 *   sold / under-offer / off-market badges from the status field.
 * - All endpoints are public-read with permissive CORS; no auth required.
 *
 * Server-only: do NOT import from a Client Component.
 */

import "server-only"

import { unstable_rethrow } from "next/navigation"

import { config } from "@/lib/config"
import { trackError } from "@/lib/error-tracking"
import type {
  CrmAccess,
  CrmListFilters,
  CrmListResponse,
  CrmProperty,
  CrmPropertyAccess,
  CrmPropertyDetail,
  CrmPropertyFull,
  CrmPropertyListItem,
} from "./types"
import type { SelectedShareToken } from "./share-token"

const CRM_PARAM_MAX_LENGTH = 200

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- reserved for future per-request options.
interface FetchOptions {}

function isCrmConfigured(): boolean {
  return Boolean(
    config.crm.baseUrl &&
      config.crm.agencyUuid &&
      config.crm.agencyUuid.length <= CRM_PARAM_MAX_LENGTH,
  )
}

/**
 * Redact share tokens before a URL reaches error reporting. Token-bearing
 * detail URLs must never appear in Sentry breadcrumbs.
 */
function scrubUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    for (const key of ["ref", "share"]) {
      if (url.searchParams.has(key)) url.searchParams.set(key, "REDACTED")
    }
    return url.toString()
  } catch {
    return rawUrl
  }
}

function buildListUrl(filters: CrmListFilters | undefined): string {
  const url = new URL("/api/public/properties", config.crm.baseUrl)
  url.searchParams.set("agency", config.crm.agencyUuid)

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

function buildDetailUrl(slugOrId: string, shareToken?: SelectedShareToken): string {
  const url = new URL(`/api/public/properties/${encodeURIComponent(slugOrId)}`, config.crm.baseUrl)
  url.searchParams.set("agency", config.crm.agencyUuid)
  // Forward the token under the key the visitor landed with. A present-but-blank
  // value is preserved so the CRM can distinguish "no token" from "blank ref".
  if (shareToken?.present) url.searchParams.set(shareToken.key, shareToken.value)
  return url.toString()
}

async function crmFetch<T>(url: string): Promise<T | null> {
  // Always no-store. The CRM property list/detail contract is
  // `Cache-Control: no-store` for BOTH anonymous and token-bearing responses —
  // a website ISR/TTL cache could keep a full anonymous response public after
  // the agency flips its default to basic. Do not reintroduce a revalidate cache
  // until AgentCRM ships a safe anonymous-cache + invalidation contract.
  const init: RequestInit = {
    headers: { Accept: "application/json" },
    cache: "no-store",
  }

  const safeUrl = scrubUrl(url)

  let res: Response
  try {
    res = await fetch(url, init)
  } catch (error) {
    // A no-store fetch during static generation makes the route dynamic; Next
    // signals that by throwing. Re-throw its control-flow errors (also
    // notFound/redirect) instead of swallowing them as upstream failures.
    unstable_rethrow(error)
    trackError(error, { context: "crm", url: safeUrl, action: "fetch" })
    return null
  }

  if (res.status === 404) return null
  if (res.status === 429) {
    trackError(new Error(`CRM rate limited (${res.status})`), {
      context: "crm",
      url: safeUrl,
      retryAfter: res.headers.get("Retry-After"),
    })
    return null
  }
  if (!res.ok) {
    trackError(new Error(`CRM responded ${res.status}`), {
      context: "crm",
      url: safeUrl,
      status: res.status,
    })
    return null
  }

  try {
    return (await res.json()) as T
  } catch (error) {
    trackError(error, { context: "crm", url: safeUrl, action: "parse" })
    return null
  }
}

/** Map the CRM access block to camelCase. Absent access = full (legacy). */
function mapAccess(access: CrmAccess | null | undefined): CrmPropertyAccess | null {
  if (!access) return null
  return {
    tier: access.tier,
    gated: Boolean(access.gated),
    lockedSections: access.locked_sections ?? [],
    reason: access.reason ?? null,
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

    access: mapAccess(row.access),
  }
}

function mapDetail(row: CrmPropertyDetail): CrmPropertyFull {
  return {
    ...mapListItem(row),
    unitNumber: row.unit_number,
    address: row.address,
    features: row.features ?? [],

    paymentPlan: row.payment_plan,
    unitGroups: row.unit_groups ?? null,

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
 * Fetch one page (max 50 rows) of the agency's property list under the given
 * filters. Returns an empty result on misconfiguration or upstream failure
 * (the marketing site renders a "coming soon" state for empty results).
 */
export async function getCrmProperties(
  filters?: CrmListFilters,
): Promise<GetCrmPropertiesResult> {
  if (!isCrmConfigured()) return EMPTY_RESULT

  const data = await crmFetch<CrmListResponse>(buildListUrl(filters))
  if (!data) return EMPTY_RESULT

  return {
    properties: data.data.map(mapListItem),
    nextCursor: data.pagination.next_cursor,
    hasMore: data.pagination.has_more,
    total: data.pagination.total,
  }
}

/**
 * Walk the list cursor to collect the full result set under a filter. The CRM
 * caps each request at 50 rows, so this pages through until exhausted. Bounded
 * two ways so a slow or misbehaving upstream can't hang the caller: maxPages
 * (hard page cap) and deadlineMs (wall-clock budget). Hitting either returns
 * the rows gathered so far rather than throwing.
 *
 * Used server-side where completeness matters more than a single page (e.g. the
 * sitemap enumerating every property detail URL).
 */
export async function getAllCrmProperties(
  filters?: CrmListFilters,
  maxPages = 40,
  opts?: FetchOptions & { deadlineMs?: number },
): Promise<CrmProperty[]> {
  if (!isCrmConfigured()) return []

  const deadline = Date.now() + (opts?.deadlineMs ?? 25_000)
  const all: CrmProperty[] = []
  let cursor = filters?.cursor
  for (let page = 0; page < maxPages; page++) {
    const data = await crmFetch<CrmListResponse>(buildListUrl({ ...filters, cursor, limit: 50 }))
    if (!data) break
    all.push(...data.data.map(mapListItem))
    if (!data.pagination.has_more || !data.pagination.next_cursor) break
    cursor = data.pagination.next_cursor
    if (Date.now() >= deadline) break // Degrade to a partial set over a timeout.
  }
  return all
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
  opts?: FetchOptions & { shareToken?: SelectedShareToken }
): Promise<CrmPropertyFull | null> {
  if (!isCrmConfigured()) return null
  if (!slugOrId || slugOrId.length > CRM_PARAM_MAX_LENGTH) return null

  // All CRM fetches are no-store (see crmFetch), so anonymous and token-bearing
  // detail responses are equally uncached — the token just unlocks more fields.
  const response = await crmFetch<CrmDetailResponse>(buildDetailUrl(slugOrId, opts?.shareToken))
  if (!response) return null
  const row = "data" in response ? response.data : response
  if (!row) return null
  return mapDetail(row)
}

type CrmDetailResponse = CrmPropertyDetail | { data: CrmPropertyDetail }
