/**
 * CATALYST - Content Data Provider (Server Only)
 *
 * Fetches content from Supabase for all CMS content:
 * properties, team, testimonials, stats, services.
 * 
 * All functions are async and use the server-side Supabase client.
 * 
 * NOTE: This file can only be imported in Server Components.
 * For types and helper functions that work in Client Components,
 * import from "@/lib/content-types" instead.
 */

import "server-only"
import { createClient, createStaticClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { unstable_cache } from "next/cache"
import { trackSupabaseError } from "@/lib/error-tracking"

// Re-export types and helpers from content-types for convenience
export type {
  Property,
  TeamMember,
  Testimonial,
  Stat,
  Service,
  SiteConfig,
} from "@/lib/content-types"

export {
  formatPrice,
  formatPriceRange,
  formatBedroomRange,
  formatSizeRange,
} from "@/lib/content-types"

import type {
  Property,
  TeamMember,
  Testimonial,
  Stat,
  Service,
  SiteConfig,
} from "@/lib/content-types"

/**
 * Shared cache tags for public web data.
 * CMS server actions can revalidate these tags after content updates.
 */
export const WEB_CONTENT_TAGS = {
  siteConfig: "web:site-config",
  properties: "web:properties",
  team: "web:team",
  testimonials: "web:testimonials",
  stats: "web:stats",
  services: "web:services",
} as const

const WEB_CONTENT_REVALIDATE_SECONDS = 60 * 5

// =============================================================================
// SUPABASE ROW TYPES (snake_case from database)
// =============================================================================

interface PropertyRow {
  id: string
  slug: string
  title: string
  type: string
  location: string
  city: string | null
  country: string | null
  developer: string | null
  developer_website: string | null
  project_website: string | null
  price: string | null
  price_from: number | null
  price_to: number | null
  currency: string
  status: string
  sale_status: string | null
  completion_date: string | null
  bedrooms: string | null
  bathrooms: number | null
  size_from: number | null
  size_to: number | null
  size_unit: string
  description: string | null
  features: string[] | null
  cover_image: string | null
  images: string[] | null
  master_plan_images: string[] | null
  interior_images: string[] | null
  lobby_images: string[] | null
  architecture_images: string[] | null
  coordinates: { lat: number; lng: number } | null
  investment: Record<string, unknown> | null
  unit_types: Record<string, unknown> | null
  featured: boolean | null
  is_partner_project: boolean | null
  display_order: number | null
  tags: string[] | null
}

interface TeamMemberRow {
  id: string
  slug: string
  name: string
  role: string
  short_bio: string | null
  full_bio: string | null
  expertise: string[] | null
  background: string[] | null
  email: string | null
  phone: string | null
  photo: string | null
  linkedin: string | null
  is_founder: boolean | null
  published: boolean
  display_order: number | null
}

interface TestimonialRow {
  id: string
  quote: string
  author: string
  location: string | null
  context: string | null
  display_order: number | null
}

interface StatRow {
  id: string
  label: string
  value: string
  description: string | null
  display_order: number | null
}

interface ServiceRow {
  id: string
  slug: string
  title: string
  short_description: string | null
  description: string | null
  features: string[] | null
  icon: string | null
  display_order: number | null
}

interface SiteSettingRow {
  key: string
  value: Record<string, unknown>
}

// =============================================================================
// MAPPERS (snake_case → camelCase)
// =============================================================================

/**
 * Parse bedroom string (e.g., "3", "3-5") into from/to numbers
 */
function parseBedroomRange(bedrooms: string | null): { from: number; to: number } {
  if (!bedrooms) return { from: 0, to: 0 }
  const parts = bedrooms.split("-").map((s) => parseInt(s.trim(), 10))
  const from = parts[0] || 0
  const to = parts[1] || from
  return { from, to }
}

function mapProperty(row: PropertyRow): Property {
  const bedroomRange = parseBedroomRange(row.bedrooms)
  // Build images array: coverImage first, then gallery images
  const images: string[] = []
  if (row.cover_image) images.push(row.cover_image)
  if (row.images) images.push(...row.images)
  
  // Determine completion status from status field
  const statusLower = (row.status || "").toLowerCase()
  const completionStatus: "ready" | "off-plan" = 
    statusLower.includes("ready") || statusLower.includes("complete") ? "ready" : "off-plan"

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    location: row.location,
    city: row.city,
    country: row.country,
    developer: row.developer,
    developerWebsite: row.developer_website,
    projectWebsite: row.project_website,
    price: row.price,
    priceFrom: row.price_from,
    priceTo: row.price_to,
    currency: row.currency || "AED",
    status: row.status,
    saleStatus: row.sale_status,
    completionDate: row.completion_date,
    bedrooms: row.bedrooms,
    bedroomsFrom: bedroomRange.from,
    bedroomsTo: bedroomRange.to,
    bathrooms: row.bathrooms,
    sizeFrom: row.size_from,
    sizeTo: row.size_to,
    sizeUnit: row.size_unit || "sq ft",
    description: row.description,
    features: row.features || [],
    coverImage: row.cover_image,
    images,
    masterPlanImages: row.master_plan_images || [],
    interiorImages: row.interior_images || [],
    lobbyImages: row.lobby_images || [],
    architectureImages: row.architecture_images || [],
    coordinates: row.coordinates,
    investment: row.investment,
    unitTypes: row.unit_types,
    featured: row.featured ?? false,
    isPartnerProject: row.is_partner_project ?? false,
    displayOrder: row.display_order ?? 0,
    tags: row.tags || [],
    completionStatus,
  }
}

function mapTeamMember(row: TeamMemberRow): TeamMember {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    shortBio: row.short_bio,
    bio: row.short_bio || "", // backward compat
    fullBio: row.full_bio,
    expertise: row.expertise || [],
    background: row.background || [],
    email: row.email,
    phone: row.phone,
    photo: row.photo,
    imageUrl: row.photo, // backward compat
    linkedin: row.linkedin,
    linkedinUrl: row.linkedin, // backward compat
    isFounder: row.is_founder ?? false,
    published: row.published ?? true,
    displayOrder: row.display_order ?? 0,
  }
}

function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    authorName: row.author, // backward compat
    location: row.location,
    authorLocation: row.location, // backward compat
    context: row.context,
    authorTitle: row.context, // backward compat
    displayOrder: row.display_order ?? 0,
  }
}

function mapStat(row: StatRow): Stat {
  return {
    id: row.id,
    label: row.label,
    value: row.value,
    description: row.description,
    displayOrder: row.display_order ?? 0,
  }
}

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    features: row.features || [],
    icon: row.icon,
    displayOrder: row.display_order ?? 0,
  }
}

// =============================================================================
// PUBLIC WEB DATA (cache-friendly, no request cookies)
// =============================================================================

async function fetchPublicSiteConfig(): Promise<SiteConfig> {
  if (!isSupabaseConfigured()) return getDefaultSiteConfig()
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")

    if (error) {
      trackSupabaseError(error, "site_settings", "select", { function: "fetchPublicSiteConfig" })
      return getDefaultSiteConfig()
    }

    const settings = (data as SiteSettingRow[]).reduce(
      (acc, row) => ({ ...acc, [row.key]: row.value }),
      {} as Record<string, Record<string, unknown>>
    )

    return {
      features: {
        properties: (settings.feature_flags?.properties as boolean) ?? true,
        team: (settings.feature_flags?.team as boolean) ?? true,
        testimonials: (settings.feature_flags?.testimonials as boolean) ?? true,
        blog: (settings.feature_flags?.blog as boolean) ?? false,
      },
      company: {
        name: (settings.company?.name as string) ?? "Prime Capital Dubai",
        tagline: (settings.company?.tagline as string) ?? "",
        description: (settings.company?.description as string) ?? "",
        legalName: (settings.company?.legalName as string) ?? "",
        founded: (settings.company?.founded as string) ?? "",
      },
      contact: {
        email: (settings.contact?.email as string) ?? "",
        phone: (settings.contact?.phone as string) ?? "",
        hours: (settings.contact?.hours as string) ?? "",
        address: {
          line1: ((settings.contact?.address as Record<string, string>)?.line1) ?? "",
          line2: ((settings.contact?.address as Record<string, string>)?.line2) ?? "",
          city: ((settings.contact?.address as Record<string, string>)?.city) ?? "",
          country: ((settings.contact?.address as Record<string, string>)?.country) ?? "",
        },
      },
      strategyKit: {
        title: (settings.strategy_kit?.title as string) ?? "",
        subtitle: (settings.strategy_kit?.subtitle as string) ?? "",
        description: (settings.strategy_kit?.description as string) ?? "",
        benefits: (settings.strategy_kit?.benefits as string[]) ?? [],
        formUrl: (settings.strategy_kit?.formUrl as string | null) ?? null,
      },
    }
  } catch (err) {
    trackSupabaseError(err, "site_settings", "select", { function: "fetchPublicSiteConfig" })
    return getDefaultSiteConfig()
  }
}

async function fetchPublicProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "fetchPublicProperties" })
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "fetchPublicProperties" })
    return []
  }
}

async function fetchPublicPropertyBySlug(slug: string): Promise<Property | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "fetchPublicPropertyBySlug", slug })
      return null
    }

    return mapProperty(data as PropertyRow)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "fetchPublicPropertyBySlug", slug })
    return null
  }
}

async function fetchPublicTeamMembers(): Promise<TeamMember[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("published", true)
      .not("photo", "is", null)
      .neq("photo", "")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "fetchPublicTeamMembers" })
      return []
    }

    return (data as TeamMemberRow[]).map(mapTeamMember)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "fetchPublicTeamMembers" })
    return []
  }
}

async function fetchPublicTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  if (!isSupabaseConfigured()) return null
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .not("photo", "is", null)
      .neq("photo", "")
      .single()

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "fetchPublicTeamMemberBySlug", slug })
      return null
    }

    return mapTeamMember(data as TeamMemberRow)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "fetchPublicTeamMemberBySlug", slug })
    return null
  }
}

async function fetchPublicTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "testimonials", "select", { function: "fetchPublicTestimonials" })
      return []
    }

    return (data as TestimonialRow[]).map(mapTestimonial)
  } catch (err) {
    trackSupabaseError(err, "testimonials", "select", { function: "fetchPublicTestimonials" })
    return []
  }
}

async function fetchPublicStats(): Promise<Stat[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "stats", "select", { function: "fetchPublicStats" })
      return []
    }

    return (data as StatRow[]).map(mapStat)
  } catch (err) {
    trackSupabaseError(err, "stats", "select", { function: "fetchPublicStats" })
    return []
  }
}

async function fetchPublicServices(): Promise<Service[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "services", "select", { function: "fetchPublicServices" })
      return []
    }

    return (data as ServiceRow[]).map(mapService)
  } catch (err) {
    trackSupabaseError(err, "services", "select", { function: "fetchPublicServices" })
    return []
  }
}

const getCachedWebSiteConfig = unstable_cache(
  fetchPublicSiteConfig,
  ["web-site-config"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.siteConfig],
  }
)

const getCachedWebProperties = unstable_cache(
  fetchPublicProperties,
  ["web-properties"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.properties],
  }
)

async function fetchPublicDistressedProperties(): Promise<Property[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .contains("tags", ["distressed"])
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "fetchPublicDistressedProperties" })
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "fetchPublicDistressedProperties" })
    return []
  }
}

const getCachedWebDistressedProperties = unstable_cache(
  fetchPublicDistressedProperties,
  ["web-distressed-properties"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.properties],
  }
)

const getCachedWebPropertyBySlug = unstable_cache(
  fetchPublicPropertyBySlug,
  ["web-property-by-slug"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.properties],
  }
)

const getCachedWebTeamMembers = unstable_cache(
  fetchPublicTeamMembers,
  ["web-team-members"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.team],
  }
)

const getCachedWebTeamMemberBySlug = unstable_cache(
  fetchPublicTeamMemberBySlug,
  ["web-team-member-by-slug"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.team],
  }
)

const getCachedWebTestimonials = unstable_cache(
  fetchPublicTestimonials,
  ["web-testimonials"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.testimonials],
  }
)

const getCachedWebStats = unstable_cache(
  fetchPublicStats,
  ["web-stats"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.stats],
  }
)

const getCachedWebServices = unstable_cache(
  fetchPublicServices,
  ["web-services"],
  {
    revalidate: WEB_CONTENT_REVALIDATE_SECONDS,
    tags: [WEB_CONTENT_TAGS.services],
  }
)

/**
 * Public web data getters.
 *
 * These functions are cache-first and use the static Supabase client so pages
 * can be generated and served quickly without request cookie coupling.
 */
export async function getWebSiteConfig(): Promise<SiteConfig> {
  return getCachedWebSiteConfig()
}

export async function getWebProperties(): Promise<Property[]> {
  return getCachedWebProperties()
}

export async function getWebDistressedProperties(): Promise<Property[]> {
  return getCachedWebDistressedProperties()
}

export async function getWebPropertyBySlug(slug: string): Promise<Property | null> {
  return getCachedWebPropertyBySlug(slug)
}

export async function getWebTeamMembers(): Promise<TeamMember[]> {
  return getCachedWebTeamMembers()
}

export async function getWebTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  return getCachedWebTeamMemberBySlug(slug)
}

export async function getWebTestimonials(): Promise<Testimonial[]> {
  return getCachedWebTestimonials()
}

export async function getWebStats(): Promise<Stat[]> {
  return getCachedWebStats()
}

export async function getWebServices(): Promise<Service[]> {
  return getCachedWebServices()
}

// =============================================================================
// DATA GETTERS (Supabase)
// =============================================================================

/**
 * Get site configuration from Supabase site_settings table.
 */
export async function getSiteConfig(): Promise<SiteConfig> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value")

    if (error) {
      trackSupabaseError(error, "site_settings", "select", { function: "getSiteConfig" })
      return getDefaultSiteConfig()
    }

    const settings = (data as SiteSettingRow[]).reduce(
      (acc, row) => ({ ...acc, [row.key]: row.value }),
      {} as Record<string, Record<string, unknown>>
    )

    return {
      features: {
        properties: (settings.feature_flags?.properties as boolean) ?? true,
        team: (settings.feature_flags?.team as boolean) ?? true,
        testimonials: (settings.feature_flags?.testimonials as boolean) ?? true,
        blog: (settings.feature_flags?.blog as boolean) ?? false,
      },
      company: {
        name: (settings.company?.name as string) ?? "Prime Capital Dubai",
        tagline: (settings.company?.tagline as string) ?? "",
        description: (settings.company?.description as string) ?? "",
        legalName: (settings.company?.legalName as string) ?? "",
        founded: (settings.company?.founded as string) ?? "",
      },
      contact: {
        email: (settings.contact?.email as string) ?? "",
        phone: (settings.contact?.phone as string) ?? "",
        hours: (settings.contact?.hours as string) ?? "",
        address: {
          line1: ((settings.contact?.address as Record<string, string>)?.line1) ?? "",
          line2: ((settings.contact?.address as Record<string, string>)?.line2) ?? "",
          city: ((settings.contact?.address as Record<string, string>)?.city) ?? "",
          country: ((settings.contact?.address as Record<string, string>)?.country) ?? "",
        },
      },
      strategyKit: {
        title: (settings.strategy_kit?.title as string) ?? "",
        subtitle: (settings.strategy_kit?.subtitle as string) ?? "",
        description: (settings.strategy_kit?.description as string) ?? "",
        benefits: (settings.strategy_kit?.benefits as string[]) ?? [],
        formUrl: (settings.strategy_kit?.formUrl as string | null) ?? null,
      },
    }
  } catch (err) {
    trackSupabaseError(err, "site_settings", "select", { function: "getSiteConfig" })
    return getDefaultSiteConfig()
  }
}

function getDefaultSiteConfig(): SiteConfig {
  return {
    features: { properties: true, team: true, testimonials: true, blog: false },
    company: { name: "Prime Capital Dubai", tagline: "", description: "", legalName: "", founded: "" },
    contact: { email: "", phone: "", hours: "", address: { line1: "", line2: "", city: "", country: "" } },
    strategyKit: { title: "", subtitle: "", description: "", benefits: [], formUrl: null },
  }
}

/**
 * Get all properties, sorted by display order.
 */
export async function getProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "getProperties" })
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "getProperties" })
    return []
  }
}

/**
 * Get featured properties only, sorted by display order.
 */
export async function getFeaturedProperties(): Promise<Property[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("featured", true)
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "getFeaturedProperties" })
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "getFeaturedProperties" })
    return []
  }
}

/**
 * Get a single property by slug.
 */
export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "getPropertyBySlug", slug })
      return null
    }

    return mapProperty(data as PropertyRow)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "getPropertyBySlug", slug })
    return null
  }
}

/**
 * Get all team members, sorted by display order.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("published", true)
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "getTeamMembers" })
      return []
    }

    return (data as TeamMemberRow[]).map(mapTeamMember)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "getTeamMembers" })
    return []
  }
}

/**
 * Get founder team members only, sorted by display order.
 */
export async function getFounders(): Promise<TeamMember[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("is_founder", true)
      .eq("published", true)
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "getFounders" })
      return []
    }

    return (data as TeamMemberRow[]).map(mapTeamMember)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "getFounders" })
    return []
  }
}

/**
 * Get a single team member by slug.
 */
export async function getTeamMemberBySlug(slug: string): Promise<TeamMember | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .single()

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "getTeamMemberBySlug", slug })
      return null
    }

    return mapTeamMember(data as TeamMemberRow)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "getTeamMemberBySlug", slug })
    return null
  }
}

/**
 * Get all testimonials, sorted by display order.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "testimonials", "select", { function: "getTestimonials" })
      return []
    }

    return (data as TestimonialRow[]).map(mapTestimonial)
  } catch (err) {
    trackSupabaseError(err, "testimonials", "select", { function: "getTestimonials" })
    return []
  }
}

/**
 * Get all stats, sorted by display order.
 */
export async function getStats(): Promise<Stat[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("stats")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "stats", "select", { function: "getStats" })
      return []
    }

    return (data as StatRow[]).map(mapStat)
  } catch (err) {
    trackSupabaseError(err, "stats", "select", { function: "getStats" })
    return []
  }
}

/**
 * Get all services, sorted by display order.
 */
export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order")

    if (error) {
      trackSupabaseError(error, "services", "select", { function: "getServices" })
      return []
    }

    return (data as ServiceRow[]).map(mapService)
  } catch (err) {
    trackSupabaseError(err, "services", "select", { function: "getServices" })
    return []
  }
}

/**
 * Get a single service by slug.
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      trackSupabaseError(error, "services", "select", { function: "getServiceBySlug", slug })
      return null
    }

    return mapService(data as ServiceRow)
  } catch (err) {
    trackSupabaseError(err, "services", "select", { function: "getServiceBySlug", slug })
    return null
  }
}

// =============================================================================
// STATIC BUILD FUNCTIONS (for generateStaticParams - no cookies required)
// =============================================================================

/**
 * Get all property slugs for static generation.
 * Use this in generateStaticParams to pre-render property pages.
 */
export async function getPropertySlugs(): Promise<string[]> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("properties")
      .select("slug")

    if (error) {
      trackSupabaseError(error, "properties", "select", { function: "getPropertySlugs" })
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    trackSupabaseError(err, "properties", "select", { function: "getPropertySlugs" })
    return []
  }
}

/**
 * Get all team member slugs for static generation.
 * Use this in generateStaticParams to pre-render team pages.
 */
export async function getTeamMemberSlugs(): Promise<string[]> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("team_members")
      .select("slug")
      .eq("published", true)

    if (error) {
      trackSupabaseError(error, "team_members", "select", { function: "getTeamMemberSlugs" })
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    trackSupabaseError(err, "team_members", "select", { function: "getTeamMemberSlugs" })
    return []
  }
}

/**
 * Get all service slugs for static generation.
 * Use this in generateStaticParams to pre-render service pages.
 */
export async function getServiceSlugs(): Promise<string[]> {
  try {
    const supabase = createStaticClient()
    const { data, error } = await supabase
      .from("services")
      .select("slug")

    if (error) {
      trackSupabaseError(error, "services", "select", { function: "getServiceSlugs" })
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    trackSupabaseError(err, "services", "select", { function: "getServiceSlugs" })
    return []
  }
}
