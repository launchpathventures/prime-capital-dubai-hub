/**
 * CATALYST - AgentCRM Public API Types
 *
 * Mirrors the response shapes documented at
 * https://crm.primecapitaldubai.com/api/public/properties.
 *
 * Field names are kept snake_case where the API returns them that way; the
 * mappers in client.ts convert to camelCase for consumption inside the app.
 *
 * Client-safe: no server-only imports here.
 */

// =============================================================================
// API RESPONSE SHAPES (snake_case from CRM)
// =============================================================================

export type CrmListingType = "secondary" | "off_plan"

export type CrmPropertyStatus =
  | "available"
  | "sold"
  | "under-offer"
  | "off-market"
  | (string & {})

export type CrmPropertyType =
  | "apartment"
  | "villa"
  | "townhouse"
  | "penthouse"
  | "studio"
  | "duplex"
  | "land"
  | "commercial"
  | "office"
  | (string & {})

export type CrmFurnished = "unfurnished" | "furnished" | "semi-furnished" | (string & {})

export interface CrmPaymentInstallment {
  milestone: string
  percentage: number
  date: string | null
}

export interface CrmPaymentPlan {
  installments: CrmPaymentInstallment[]
  summary: string | null
  dld_waiver: boolean
  post_handover: boolean
  post_handover_years: number | null
}

export interface CrmUnitType {
  name: string
  bedrooms: number | null
  bathrooms: number | null
  size_sqft: number | null
  price_from: number | null
  price_to: number | null
  available_units: number
  total_units: number
}

export interface CrmMedia {
  brochure_url: string | null
  video_url: string | null
  tour_3d_url: string | null
}

export interface CrmNote {
  id: string
  category: string
  summary: string
  date: string
}

/** List endpoint property — every documented field. */
export interface CrmPropertyListItem {
  id: string
  title: string
  slug: string | null
  reference: string | null
  description: string | null

  area: string
  building_name: string | null

  price: number
  price_from: number | null
  price_to: number | null

  property_type: CrmPropertyType
  status: CrmPropertyStatus
  promotion_status: string | null
  bedrooms: number | null
  bedrooms_min: number | null
  bedrooms_max: number | null
  bathrooms: number | null
  sqft: number | null
  floor: string | null
  view: string | null
  furnished: CrmFurnished

  developer: string | null
  completion_date: string | null
  construction_progress: number | null
  amenities: string[]

  images: string[]

  created_at: string
  listing_date: string | null

  embed_url: string
  embed_html: string
}

/** Detail endpoint extends list shape with rich fields + markdown blocks. */
export interface CrmPropertyDetail extends CrmPropertyListItem {
  unit_number: string | null
  address: string | null
  features: string[]

  payment_plan: CrmPaymentPlan | null

  unit_types: CrmUnitType[] | null

  media: CrmMedia | null
  master_plan_url: string | null
  factsheet_url: string | null

  reasons_to_invest: string | null
  /** Curator-authored "About this property" body. Falls back on the CRM side
   *  to the Reelly-parsed paste (project facts) so it's always populated for
   *  Reelly-sourced listings. Prefer `overview ?? description` in renders —
   *  the raw description blob may contain H5 headings duplicated by the
   *  paste cards below. */
  overview: string | null
  location_and_views: string | null
  about_developer: string | null
  payment_plan_details: string | null
  units_markdown: string | null
  units_pricing_markdown: string | null
  amenities_markdown: string | null
  // Unit fit-out cards — Reelly paste with curator override.
  finishing_and_materials: string | null
  kitchen_and_appliances: string | null
  furnishings: string | null

  notes: CrmNote[]

  /** Internal — never display publicly. */
  commission_rate: number | null
}

export interface CrmPagination {
  next_cursor: string | null
  has_more: boolean
  total: number
}

export interface CrmListResponse {
  data: CrmPropertyListItem[]
  pagination: CrmPagination
}

// =============================================================================
// APP-SHAPED TYPES (camelCase, used by pages/components)
// =============================================================================

export interface CrmProperty {
  id: string
  title: string
  /** Preferred URL segment. Falls back to id when null at the API. */
  slug: string
  reference: string | null
  description: string | null

  area: string
  buildingName: string | null

  price: number
  priceFrom: number | null
  priceTo: number | null

  propertyType: CrmPropertyType
  status: CrmPropertyStatus
  promotionStatus: string | null
  bedrooms: number | null
  bedroomsMin: number | null
  bedroomsMax: number | null
  bathrooms: number | null
  sqft: number | null
  floor: string | null
  view: string | null
  furnished: CrmFurnished

  developer: string | null
  completionDate: string | null
  constructionProgress: number | null
  amenities: string[]

  images: string[]

  createdAt: string
  listingDate: string | null

  embedUrl: string
  embedHtml: string
}

export interface CrmPropertyFull extends CrmProperty {
  unitNumber: string | null
  address: string | null
  features: string[]

  paymentPlan: CrmPaymentPlan | null
  unitTypes: CrmUnitType[] | null

  media: CrmMedia | null
  masterPlanUrl: string | null
  factsheetUrl: string | null

  reasonsToInvest: string | null
  /** Cleaned "About this property" body. Prefer `overview ?? description` in
   *  renders — `description` is the raw source blob (may contain H5 headings
   *  duplicated by the paste cards). */
  overview: string | null
  locationAndViews: string | null
  aboutDeveloper: string | null
  paymentPlanDetails: string | null
  unitsMarkdown: string | null
  unitsPricingMarkdown: string | null
  amenitiesMarkdown: string | null
  finishingAndMaterials: string | null
  kitchenAndAppliances: string | null
  furnishings: string | null

  notes: CrmNote[]
}

// =============================================================================
// LIST QUERY FILTERS
// =============================================================================

export type CrmSort = "price_asc" | "price_desc" | "newest" | "oldest"

export interface CrmListFilters {
  listingType?: CrmListingType
  area?: string
  propertyType?: CrmPropertyType
  bedroomsMin?: number
  bedroomsMax?: number
  priceMin?: number
  priceMax?: number
  status?: CrmPropertyStatus
  sort?: CrmSort
  cursor?: string
  /** Default 20, max 50. */
  limit?: number
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * True when the property should display a non-available badge on the PDP.
 * The API does not hide sold/off-market on detail — UI must render the badge.
 */
export function getStatusBadge(status: CrmPropertyStatus): string | null {
  switch (status) {
    case "sold":
      return "Sold"
    case "under-offer":
      return "Under Offer"
    case "off-market":
      return "Off-Market"
    case "available":
      return null
    default:
      return null
  }
}

/**
 * Whether the PDP should render the off-plan layout (unit mix, payment plan).
 */
export function isDevelopmentListing(property: CrmPropertyFull): boolean {
  return Array.isArray(property.unitTypes) && property.unitTypes.length > 0
}

/**
 * Heuristic for the listing card: off-plan if construction is incomplete or
 * the completion date sits in the future. Used where we only have list-shape
 * data (no unit_types).
 */
export function isOffPlanListing(
  property: Pick<CrmProperty, "constructionProgress" | "completionDate" | "bedroomsMin" | "bedroomsMax">
): boolean {
  if (property.constructionProgress != null && property.constructionProgress < 100) return true
  if (property.bedroomsMin != null && property.bedroomsMax != null && property.bedroomsMin !== property.bedroomsMax) {
    return true
  }
  if (property.completionDate) {
    const quarterMatch = property.completionDate.match(/^(\d{4})-Q(\d)$/i)
    if (quarterMatch) {
      const year = Number(quarterMatch[1])
      const quarter = Number(quarterMatch[2])
      const month = (quarter - 1) * 3 + 2
      const completion = new Date(year, month, 1)
      return completion.getTime() > Date.now()
    }
    const parsed = new Date(property.completionDate)
    if (!isNaN(parsed.getTime())) return parsed.getTime() > Date.now()
  }
  return false
}

/**
 * Format a price range string for display. Falls back to single price when
 * range bounds are absent.
 */
export function formatCrmPriceRange(
  property: Pick<CrmProperty, "price" | "priceFrom" | "priceTo">,
  currency: string = "AED"
): string {
  const short = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
    return n.toString()
  }
  if (property.priceFrom != null && property.priceTo != null && property.priceFrom !== property.priceTo) {
    return `${currency} ${short(property.priceFrom)} - ${short(property.priceTo)}`
  }
  if (property.priceFrom != null) return `${currency} ${short(property.priceFrom)}`
  if (property.price > 0) return `${currency} ${short(property.price)}`
  return "Price on Request"
}

/**
 * Format a bedroom range for unit-mix listings, falling back to a single number.
 */
export function formatCrmBedrooms(
  property: Pick<CrmProperty, "bedrooms" | "bedroomsMin" | "bedroomsMax">
): string {
  if (property.bedroomsMin != null && property.bedroomsMax != null && property.bedroomsMin !== property.bedroomsMax) {
    return `${property.bedroomsMin}-${property.bedroomsMax} BR`
  }
  const single = property.bedrooms ?? property.bedroomsMin ?? property.bedroomsMax
  if (single == null) return "—"
  if (single === 0) return "Studio"
  return `${single} BR`
}
