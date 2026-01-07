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
      console.error("Error fetching site config:", error)
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
    console.error("Error fetching site config:", err)
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
      console.error("Error fetching properties:", error)
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    console.error("Error fetching properties:", err)
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
      console.error("Error fetching featured properties:", error)
      return []
    }

    return (data as PropertyRow[]).map(mapProperty)
  } catch (err) {
    console.error("Error fetching featured properties:", err)
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
      console.error("Error fetching property by slug:", error)
      return null
    }

    return mapProperty(data as PropertyRow)
  } catch (err) {
    console.error("Error fetching property by slug:", err)
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
      .order("display_order")

    if (error) {
      console.error("Error fetching team members:", error)
      return []
    }

    return (data as TeamMemberRow[]).map(mapTeamMember)
  } catch (err) {
    console.error("Error fetching team members:", err)
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
      .order("display_order")

    if (error) {
      console.error("Error fetching founders:", error)
      return []
    }

    return (data as TeamMemberRow[]).map(mapTeamMember)
  } catch (err) {
    console.error("Error fetching founders:", err)
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
      .single()

    if (error) {
      console.error("Error fetching team member by slug:", error)
      return null
    }

    return mapTeamMember(data as TeamMemberRow)
  } catch (err) {
    console.error("Error fetching team member by slug:", err)
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
      console.error("Error fetching testimonials:", error)
      return []
    }

    return (data as TestimonialRow[]).map(mapTestimonial)
  } catch (err) {
    console.error("Error fetching testimonials:", err)
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
      console.error("Error fetching stats:", error)
      return []
    }

    return (data as StatRow[]).map(mapStat)
  } catch (err) {
    console.error("Error fetching stats:", err)
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
      console.error("Error fetching services:", error)
      return []
    }

    return (data as ServiceRow[]).map(mapService)
  } catch (err) {
    console.error("Error fetching services:", err)
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
      console.error("Error fetching service by slug:", error)
      return null
    }

    return mapService(data as ServiceRow)
  } catch (err) {
    console.error("Error fetching service by slug:", err)
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
      console.error("Error fetching property slugs:", error)
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    console.error("Error fetching property slugs:", err)
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

    if (error) {
      console.error("Error fetching team member slugs:", error)
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    console.error("Error fetching team member slugs:", err)
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
      console.error("Error fetching service slugs:", error)
      return []
    }

    return (data as { slug: string }[]).map((row) => row.slug)
  } catch (err) {
    console.error("Error fetching service slugs:", err)
    return []
  }
}
