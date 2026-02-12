/**
 * CATALYST - JSON-LD Structured Data Helpers
 *
 * Reusable functions and component for generating JSON-LD structured data
 * for SEO and rich search results.
 */

import { config } from "@/lib/config"

// =============================================================================
// JSON-LD COMPONENT
// =============================================================================

/**
 * Renders JSON-LD structured data as a script tag.
 * Use in page components to add structured data to the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// =============================================================================
// ORGANIZATION SCHEMA
// =============================================================================

/**
 * Organization/RealEstateAgent structured data.
 * Add to root layout for site-wide organization info.
 */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Prime Capital Dubai",
    "description": "Premium real estate advisory for high-net-worth investors in Dubai",
    "url": "https://primecapitaldubai.com",
    "logo": "https://primecapitaldubai.com/icon.svg",
    "telephone": config.contact.phone,
    "email": config.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "API Business Suites, Office 101, Sheikh Zayed Rd",
      "addressLocality": "Al Barsha, Dubai",
      "addressCountry": "AE"
    },
    "sameAs": [
      config.social?.linkedin,
      config.social?.instagram
    ].filter(Boolean),
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  }
}

// =============================================================================
// WEBSITE SCHEMA
// =============================================================================

/**
 * WebSite structured data.
 * Add to root layout for site-wide website info.
 */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Prime Capital Dubai",
    "url": "https://primecapitaldubai.com"
  }
}

// =============================================================================
// PROPERTY SCHEMA
// =============================================================================

interface PropertyJsonLdInput {
  title: string
  description?: string | null
  slug: string
  cover_image?: string | null
  created_at?: string | null
  price?: number | null
  area?: string | null
  bedrooms?: number | null
  size_sqft?: number | null
}

/**
 * RealEstateListing structured data for property detail pages.
 */
export function propertyJsonLd(property: PropertyJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `https://primecapitaldubai.com/properties/${property.slug}`,
    "image": property.cover_image,
    "datePosted": property.created_at,
    ...(property.price && {
      "offers": {
        "@type": "Offer",
        "price": property.price,
        "priceCurrency": "AED"
      }
    }),
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.area,
      "addressCountry": "AE"
    },
    ...(property.bedrooms && { "numberOfRooms": property.bedrooms }),
    ...(property.size_sqft && {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.size_sqft,
        "unitCode": "FTK"
      }
    })
  }
}

// =============================================================================
// BREADCRUMB SCHEMA
// =============================================================================

interface BreadcrumbItem {
  name: string
  url?: string
}

/**
 * BreadcrumbList structured data for navigation breadcrumbs.
 */
export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url })
    }))
  }
}

// =============================================================================
// PERSON SCHEMA (for team members)
// =============================================================================

interface PersonJsonLdInput {
  name: string
  role?: string | null
  bio?: string | null
  slug: string
  photo?: string | null
  email?: string | null
  linkedin?: string | null
}

/**
 * Person structured data for team member detail pages.
 */
export function personJsonLd(person: PersonJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "jobTitle": person.role,
    "description": person.bio,
    "url": `https://primecapitaldubai.com/team/${person.slug}`,
    "image": person.photo,
    ...(person.email && { "email": person.email }),
    "worksFor": {
      "@type": "Organization",
      "name": "Prime Capital Dubai",
      "url": "https://primecapitaldubai.com"
    },
    ...(person.linkedin && {
      "sameAs": [person.linkedin]
    })
  }
}
