/**
 * CATALYST - Content Data Provider
 *
 * Dual-source data provider that tries Supabase first, then falls back to JSON.
 * Used for all CMS content: properties, team, testimonials, stats, services.
 */

import siteConfigData from "@/data/config.json"
import propertiesData from "@/data/properties.json"
import teamData from "@/data/team.json"
import testimonialsData from "@/data/testimonials.json"
import statsData from "@/data/stats.json"
import servicesData from "@/data/services.json"

// =============================================================================
// TYPES
// =============================================================================

export interface Property {
  id: string
  slug: string
  title: string
  type: string
  location: string
  developer: string
  priceFrom: number
  priceTo: number
  currency: string
  bedroomsFrom: number
  bedroomsTo: number
  sizeFrom: number
  sizeTo: number
  sizeUnit: string
  completionDate: string | null
  completionStatus: "ready" | "off-plan"
  description: string
  features: string[]
  images: string[]
  published: boolean
  displayOrder: number
}

export interface TeamMember {
  id: string
  slug: string
  name: string
  role: string
  bio: string
  expertise: string[]
  imageUrl: string
  email: string
  phone: string
  linkedinUrl: string
  published: boolean
  displayOrder: number
}

export interface Testimonial {
  id: string
  quote: string
  authorName: string
  authorTitle: string | null
  authorLocation: string
  published: boolean
  displayOrder: number
}

export interface Stat {
  id: string
  label: string
  value: string
  description: string
  displayOrder: number
}

export interface Service {
  id: string
  slug: string
  title: string
  description: string
  features: string[]
  icon: string
  displayOrder: number
}

export interface SiteConfig {
  features: {
    properties: boolean
    team: boolean
    testimonials: boolean
    blog: boolean
  }
  site: {
    name: string
    tagline: string
    description: string
    email: string
    phone: string
    address: string
  }
  social: {
    linkedin: string
    instagram: string
  }
  forms: {
    contact: string
    strategyKit: string
  }
}

// =============================================================================
// DATA GETTERS (JSON fallback only for now)
// Future: Add Supabase queries that fall back to these JSON functions
// =============================================================================

/**
 * Get site configuration.
 */
export function getSiteConfig(): SiteConfig {
  return siteConfigData as SiteConfig
}

/**
 * Get all published properties, sorted by display order.
 */
export function getProperties(): Property[] {
  return (propertiesData as Property[])
    .filter((p) => p.published)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Get a single property by slug.
 */
export function getPropertyBySlug(slug: string): Property | undefined {
  return (propertiesData as Property[]).find(
    (p) => p.slug === slug && p.published
  )
}

/**
 * Get all published team members, sorted by display order.
 */
export function getTeamMembers(): TeamMember[] {
  return (teamData as TeamMember[])
    .filter((t) => t.published)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Get a single team member by slug.
 */
export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return (teamData as TeamMember[]).find(
    (t) => t.slug === slug && t.published
  )
}

/**
 * Get all published testimonials, sorted by display order.
 */
export function getTestimonials(): Testimonial[] {
  return (testimonialsData as Testimonial[])
    .filter((t) => t.published)
    .sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Get all stats, sorted by display order.
 */
export function getStats(): Stat[] {
  return (statsData as Stat[]).sort((a, b) => a.displayOrder - b.displayOrder)
}

/**
 * Get all services, sorted by display order.
 */
export function getServices(): Service[] {
  return (servicesData as Service[]).sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
}

/**
 * Get a single service by slug.
 */
export function getServiceBySlug(slug: string): Service | undefined {
  return (servicesData as Service[]).find((s) => s.slug === slug)
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format price in AED with proper formatting.
 */
export function formatPrice(price: number, currency: string = "AED"): string {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Format price range (e.g., "AED 15M - 25M").
 */
export function formatPriceRange(
  from: number,
  to: number,
  currency: string = "AED"
): string {
  const formatShort = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  if (from === to) {
    return `${currency} ${formatShort(from)}`
  }
  return `${currency} ${formatShort(from)} - ${formatShort(to)}`
}

/**
 * Format bedroom range (e.g., "5-7 BR" or "5 BR").
 */
export function formatBedroomRange(from: number, to: number): string {
  if (from === to) return `${from} BR`
  return `${from}-${to} BR`
}

/**
 * Format size range (e.g., "8,000 - 15,000 sqft").
 */
export function formatSizeRange(
  from: number,
  to: number,
  unit: string = "sqft"
): string {
  const format = (n: number) => n.toLocaleString("en-AE")

  if (from === to) {
    return `${format(from)} ${unit}`
  }
  return `${format(from)} - ${format(to)} ${unit}`
}
