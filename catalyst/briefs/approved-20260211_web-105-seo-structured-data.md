# Brief: Web SEO & Structured Data

**ID:** WEB-105
**Status:** Approved
**Priority:** P1 — Pre-Launch
**Surface:** Web
**Estimate:** 1 day
**Tags:** seo, metadata, structured-data, json-ld

---

## Objective

Implement JSON-LD structured data across the web surface, fix sitemap gaps, add per-page OG images for social sharing, and ensure canonical URLs are explicit. For a real estate business, structured data directly impacts Google Business panels, property rich results, and local search visibility.

---

## Background

The audit found:
- **Zero JSON-LD structured data** across the entire codebase
- `/strategy-kit` missing from sitemap
- All sitemap entries use `new Date()` (claims everything just modified)
- Dynamic pages (property/team detail) lack page-specific OG images
- No explicit canonical URLs
- No `apple-touch-icon.png`

The root layout has solid OpenGraph/Twitter defaults, and most pages have proper metadata exports — this brief builds on that foundation.

---

## Tasks

### 1. Add Organization JSON-LD to Root Layout

**File:** `app/layout.tsx`

Add a `<script type="application/ld+json">` in the root layout `<head>` (or body):

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Prime Capital Dubai",
  "description": "Premium real estate advisory for high-net-worth investors in Dubai",
  "url": "https://primecapitaldubai.com",
  "logo": "https://primecapitaldubai.com/icon.svg",
  "telephone": "+971 58 5414720",
  "email": "admin@primecapitaldubai.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "API Business Suites, Office 101, Sheikh Zayed Rd",
    "addressLocality": "Al Barsha, Dubai",
    "addressCountry": "AE"
  },
  "sameAs": [
    "https://www.linkedin.com/company/primecapitaldubai",
    "https://www.instagram.com/primecapitaldxb"
  ],
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "18:00"
  }
}
```

Use `config.contact` and `config.social` values — don't hardcode.

### 2. Add WebSite JSON-LD

**File:** `app/layout.tsx` (alongside Organization)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Prime Capital Dubai",
  "url": "https://primecapitaldubai.com"
}
```

This enables Google sitelinks search box.

### 3. Add RealEstateListing JSON-LD to Property Detail Pages

**File:** `app/(web)/properties/[slug]/page.tsx`

For each property page, add structured data based on the property data:

```json
{
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": "{property.title}",
  "description": "{property.description}",
  "url": "https://primecapitaldubai.com/properties/{property.slug}",
  "image": "{property.cover_image}",
  "datePosted": "{property.created_at}",
  "offers": {
    "@type": "Offer",
    "price": "{property.price}",
    "priceCurrency": "AED"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{property.area}",
    "addressCountry": "AE"
  },
  "numberOfRooms": "{property.bedrooms}",
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": "{property.size_sqft}",
    "unitCode": "FTK"
  }
}
```

Generate dynamically from the property data. Use a helper function to build the JSON-LD object.

### 4. Add BreadcrumbList JSON-LD to Detail Pages

**Files:** `app/(web)/properties/[slug]/page.tsx`, `app/(web)/team/[slug]/page.tsx`

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://primecapitaldubai.com" },
    { "@type": "ListItem", "position": 2, "name": "Properties", "item": "https://primecapitaldubai.com/properties" },
    { "@type": "ListItem", "position": 3, "name": "{property.title}" }
  ]
}
```

### 5. Add `/strategy-kit` to Sitemap

**File:** `app/sitemap.ts`

Add the strategy kit page to the static pages array:

```typescript
{
  url: `${baseUrl}/strategy-kit`,
  lastModified: new Date('2026-02-01'), // Use a fixed date
  changeFrequency: "monthly" as const,
  priority: 0.8,
},
```

### 6. Fix Sitemap `lastModified` Dates

**File:** `app/sitemap.ts`

**Problem:** All entries use `new Date()` which tells search engines every page was just modified on every crawl. This dilutes the signal.

**Fix:**
- Static pages: Use fixed dates, updated when content actually changes
- Dynamic pages: Use the record's `updated_at` or `created_at` from Supabase

```typescript
// Static pages — use meaningful fixed dates
{
  url: baseUrl,
  lastModified: new Date('2026-02-11'),
  changeFrequency: "weekly",
  priority: 1,
},

// Dynamic pages — use database dates
properties.forEach((property) => {
  propertyPages.push({
    url: `${baseUrl}/properties/${property.slug}`,
    lastModified: property.updated_at ? new Date(property.updated_at) : new Date('2026-02-01'),
    changeFrequency: "weekly",
    priority: 0.8,
  })
})
```

### 7. Add Per-Page OG Images for Dynamic Pages

**Files:** `app/(web)/properties/[slug]/page.tsx`, `app/(web)/team/[slug]/page.tsx`

**Problem:** Sharing a property on LinkedIn/WhatsApp shows the generic hero image instead of the property's cover image.

**Fix:** Add `openGraph.images` to the `generateMetadata` export:

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug)
  if (!property) return {}
  
  return {
    title: property.title,
    description: property.description,
    openGraph: {
      title: property.title,
      description: property.description,
      images: property.cover_image ? [{ url: property.cover_image, width: 1200, height: 630 }] : undefined,
    },
  }
}
```

Same pattern for team member pages using their profile photo.

### 8. Add Explicit Canonical URLs

**File:** All page files with `metadata` or `generateMetadata` exports

Add `alternates.canonical` to each page's metadata:

```typescript
// Static pages:
export const metadata: Metadata = {
  title: "About Us | Prime Capital Dubai",
  alternates: {
    canonical: "/about",
  },
}

// Dynamic pages:
return {
  title: property.title,
  alternates: {
    canonical: `/properties/${property.slug}`,
  },
}
```

Next.js will combine with `metadataBase` to produce the full URL.

### 9. Add `apple-touch-icon.png`

**Action:**
- Generate a 180×180 PNG version of the logo/icon from `public/icon.svg`
- Save as `public/apple-touch-icon.png`
- Next.js automatically picks this up from the public folder

Alternatively, add via metadata in root layout:
```typescript
icons: {
  icon: '/icon.svg',
  apple: '/apple-touch-icon.png',
},
```

### 10. Create JSON-LD Helper Utility

**File:** `lib/json-ld.ts` (new)

Create reusable functions to generate structured data:

```typescript
export function organizationJsonLd() { ... }
export function propertyJsonLd(property: Property) { ... }
export function breadcrumbJsonLd(items: { name: string; url?: string }[]) { ... }
export function personJsonLd(member: TeamMember) { ... }
```

And a component to render it:

```typescript
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

---

## Acceptance Criteria

- [ ] Google Rich Results Test validates Organization schema on homepage
- [ ] Google Rich Results Test validates RealEstateListing on property pages
- [ ] BreadcrumbList appears on property and team detail pages
- [ ] `/strategy-kit` appears in the sitemap
- [ ] Sitemap `lastModified` uses meaningful dates, not `new Date()`
- [ ] Sharing a property page on LinkedIn shows the property image and title
- [ ] Sharing a team member page shows their photo
- [ ] All pages have explicit canonical URLs
- [ ] `apple-touch-icon.png` exists and renders on iOS home screen
- [ ] `pnpm build` succeeds

---

## Files to Create

| File | Purpose |
|------|---------|
| `lib/json-ld.ts` | JSON-LD helper functions and component |
| `public/apple-touch-icon.png` | iOS home screen icon (180×180) |

## Files to Modify

| File | Change |
|------|--------|
| `app/layout.tsx` | Organization + WebSite JSON-LD, apple-touch-icon |
| `app/sitemap.ts` | Add strategy-kit, fix lastModified dates |
| `app/(web)/properties/[slug]/page.tsx` | RealEstateListing JSON-LD, OG image, canonical |
| `app/(web)/team/[slug]/page.tsx` | Person JSON-LD, OG image, canonical |
| `app/(web)/about/page.tsx` | Add canonical |
| `app/(web)/contact/page.tsx` | Add canonical |
| `app/(web)/services/page.tsx` | Add canonical |
| `app/(web)/properties/page.tsx` | Add canonical |
| `app/(web)/team/page.tsx` | Add canonical |
| `app/(web)/strategy-kit/page.tsx` | Add canonical |
| `app/(web)/terms/page.tsx` | Add canonical |

---

## Validation

- Use [Google Rich Results Test](https://search.google.com/test/rich-results) to validate JSON-LD
- Use [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) to verify OG tags
- Use [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to verify OG images
- Check sitemap at `/sitemap.xml` after deployment
