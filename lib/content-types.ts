/**
 * CATALYST - Content Types and Helper Functions
 *
 * Client-safe exports for content types and formatting utilities.
 * These can be safely imported from both Server and Client Components.
 * 
 * For data fetching, use lib/content.ts (Server Components only).
 */

// =============================================================================
// TYPES
// =============================================================================

export interface Property {
  id: string
  slug: string
  title: string
  type: string
  location: string
  city: string | null
  country: string | null
  developer: string | null
  developerWebsite: string | null
  projectWebsite: string | null
  price: string | null
  priceFrom: number | null
  priceTo: number | null
  currency: string
  status: string
  saleStatus: string | null
  completionDate: string | null
  /** Bedrooms as text (e.g., "3", "3-5") */
  bedrooms: string | null
  /** Parsed minimum bedrooms for filtering/sorting */
  bedroomsFrom: number
  /** Parsed maximum bedrooms for filtering/sorting */
  bedroomsTo: number
  bathrooms: number | null
  sizeFrom: number | null
  sizeTo: number | null
  sizeUnit: string
  description: string | null
  features: string[]
  coverImage: string | null
  /** All images (coverImage prepended if exists) */
  images: string[]
  masterPlanImages: string[]
  interiorImages: string[]
  lobbyImages: string[]
  architectureImages: string[]
  coordinates: { lat: number; lng: number } | null
  investment: Record<string, unknown> | null
  unitTypes: Record<string, unknown> | null
  featured: boolean
  isPartnerProject: boolean
  displayOrder: number
  /** Computed: "ready" or "off-plan" based on status */
  completionStatus: "ready" | "off-plan"
}

export interface TeamMember {
  id: string
  slug: string
  name: string
  role: string
  /** Short bio text */
  shortBio: string | null
  /** @deprecated Use shortBio - kept for backward compatibility */
  bio: string
  fullBio: string | null
  expertise: string[]
  background: string[]
  email: string | null
  phone: string | null
  photo: string | null
  /** @deprecated Use photo - kept for backward compatibility */
  imageUrl: string | null
  linkedin: string | null
  /** @deprecated Use linkedin - kept for backward compatibility */
  linkedinUrl: string | null
  isFounder: boolean
  displayOrder: number
}

export interface Testimonial {
  id: string
  quote: string
  /** Author name/description */
  author: string
  /** @deprecated Use author - kept for backward compatibility */
  authorName: string
  location: string | null
  /** @deprecated Use location - kept for backward compatibility */
  authorLocation: string | null
  context: string | null
  /** @deprecated Use context - kept for backward compatibility */
  authorTitle: string | null
  displayOrder: number
}

export interface Stat {
  id: string
  label: string
  value: string
  description: string | null
  displayOrder: number
}

export interface Service {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  description: string | null
  features: string[]
  icon: string | null
  displayOrder: number
}

export interface SiteConfig {
  features: {
    properties: boolean
    team: boolean
    testimonials: boolean
    blog: boolean
  }
  company: {
    name: string
    tagline: string
    description: string
    legalName: string
    founded: string
  }
  contact: {
    email: string
    phone: string
    hours: string
    address: {
      line1: string
      line2: string
      city: string
      country: string
    }
  }
  strategyKit: {
    title: string
    subtitle: string
    description: string
    benefits: string[]
    formUrl: string | null
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format price in AED with proper formatting.
 */
export function formatPrice(price: number | null, currency: string = "AED"): string {
  if (price == null) return "Price on Request"
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
  from: number | null,
  to: number | null,
  currency: string = "AED"
): string {
  if (from == null && to == null) return "Price on Request"
  
  const formatShort = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, "")}M`
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
    return n.toString()
  }

  if (from == null) return `From ${currency} ${formatShort(to!)}`
  if (to == null || from === to) return `${currency} ${formatShort(from)}`
  return `${currency} ${formatShort(from)} - ${formatShort(to)}`
}

/**
 * Format bedroom range (e.g., "5-7 BR" or "5 BR").
 */
export function formatBedroomRange(from: number, to: number): string {
  if (from === 0 && to === 0) return "—"
  if (from === to) return `${from} BR`
  return `${from}-${to} BR`
}

/**
 * Format size range (e.g., "8,000 - 15,000 sqft").
 */
export function formatSizeRange(
  from: number | null,
  to: number | null,
  unit: string = "sq ft"
): string {
  if (from == null && to == null) return "—"
  
  const format = (n: number) => n.toLocaleString("en-AE")

  if (from == null) return `Up to ${format(to!)} ${unit}`
  if (to == null || from === to) return `${format(from)} ${unit}`
  return `${format(from)} - ${format(to)} ${unit}`
}
