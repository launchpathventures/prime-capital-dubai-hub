/**
 * CATALYST - Properties Listing Page
 *
 * Full agency inventory sourced from the AgentCRM public API (both off-plan
 * and secondary listings). The CRM caps each request at 50 rows, so the first
 * page renders here and the grid walks the cursor via /api/properties to load
 * the rest (~1.1k rows).
 *
 * Filter values and counts are sourced from the CRM facets endpoint
 * (`/api/public/properties/facets`) — see lib/crm/facets.ts. No hardcoded
 * enums for areas, property types, listing types, or bedrooms live in this
 * surface. Filter parsing is shared with the pagination route via
 * lib/crm/browse-filters.ts so page 1 and pages 2+ agree.
 */

import Link from "next/link"
import Image from "next/image"

import { config } from "@/lib/config"
import { getCrmProperties } from "@/lib/crm/client"
import { fetchPropertyFacets } from "@/lib/crm/facets"
import { parseBrowseFilters } from "@/lib/crm/browse-filters"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

import { PropertiesGrid } from "./_components/properties-filter"
import { PropertiesFilterBar } from "./_components/properties-filter-bar"

const propertiesImage = "/images/hero/properties.jpg"

// The CRM property list is Cache-Control: no-store; do not hold a website ISR
// cache of anonymous property data. This page is dynamic (also reads filters).
export const dynamic = "force-dynamic"

export const metadata = {
  title: "Properties",
  description: "Curated selection of premium Dubai real estate opportunities.",
  alternates: { canonical: "/properties" },
  openGraph: {
    title: "Properties",
    description: "Curated selection of premium Dubai real estate opportunities.",
    url: "/properties",
    images: [
      {
        url: "/images/hero/properties.jpg",
        width: 1200,
        height: 630,
        alt: "Prime Capital Dubai Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties",
    description: "Curated selection of premium Dubai real estate opportunities.",
    images: ["/images/hero/properties.jpg"],
  },
}

interface PropertiesPageProps {
  searchParams: Promise<{
    q?: string | string[]
    property_type?: string | string[]
    area?: string | string[]
    listing_type?: string | string[]
    bedrooms_min?: string | string[]
    bedrooms_max?: string | string[]
    price_min?: string | string[]
    price_max?: string | string[]
    status?: string | string[]
    promotion_status?: string | string[]
    tag?: string | string[]
    sort?: string | string[]
  }>
}

const USER_FILTER_KEYS = [
  "q",
  "property_type",
  "area",
  "listing_type",
  "bedrooms_min",
  "bedrooms_max",
  "price_min",
  "price_max",
  "status",
  "promotion_status",
  "tag",
  "sort",
] as const

function hasAnyUserFilter(params: Awaited<PropertiesPageProps["searchParams"]>): boolean {
  return USER_FILTER_KEYS.some((k) => {
    const v = params[k]
    return v != null && v !== ""
  })
}

/** Normalise the route's params object into URLSearchParams for the shared parser. */
function toSearchParams(params: Awaited<PropertiesPageProps["searchParams"]>): URLSearchParams {
  const sp = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    const single = Array.isArray(value) ? value[0] : value
    if (single != null && single !== "") sp.set(key, single)
  }
  return sp
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams

  if (!config.features.properties) {
    return <FeatureDisabledState />
  }

  const searchParamsObj = toSearchParams(params)
  const filters = parseBrowseFilters(searchParamsObj)
  const [{ properties, total, nextCursor, hasMore }, facets] = await Promise.all([
    getCrmProperties(filters),
    fetchPropertyFacets(filters),
  ])

  // Show the friendly "coming soon" state only when there's genuinely nothing
  // to filter — i.e., no user filters AND no inventory.
  const hasUserFilters = hasAnyUserFilter(params)
  if (!hasUserFilters && properties.length === 0) {
    return <EmptyState />
  }

  // Hero stats span the whole filtered result set, not just the first page.
  // Facets never self-filter (the areas facet still lists every area even when
  // one area is selected), so when the matching filter is active the distinct
  // count collapses to 1 — otherwise use the full facet breadth.
  const propertyCount = total // pagination.total under the active filter set
  const areaCount = filters.area ? 1 : facets.areas.length
  // Floor categories at 1 when results exist: some areas are entirely off-plan,
  // which we hide as a property type, leaving an empty facet that would
  // otherwise misread as "0 Categories" next to N properties.
  const categoryCount = filters.propertyType
    ? 1
    : properties.length === 0
      ? 0
      : Math.max(1, facets.propertyTypes.length)

  return (
    <div className="web-properties">
      <HeroSection
        propertyCount={propertyCount}
        categoryCount={categoryCount}
        areaCount={areaCount}
      />

      <section className="bg-[var(--web-off-white)] py-8 border-b border-[var(--web-serenity)]/20">
        <Container size="xl">
          <PropertiesFilterBar facets={facets} resultCount={propertyCount} />
        </Container>
      </section>

      <PropertiesGrid
        // Remount on filter change so load-more state resets to page 1.
        key={searchParamsObj.toString()}
        initialProperties={properties}
        initialCursor={nextCursor}
        initialHasMore={hasMore}
      />

      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO
// =============================================================================

function HeroSection({
  propertyCount,
  categoryCount,
  areaCount,
}: {
  propertyCount: number
  categoryCount: number
  areaCount: number
}) {
  return (
    <section className="relative min-h-[55vh] flex flex-col justify-center items-center text-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={propertiesImage}
          alt=""
          fill
          priority
          placeholder="blur"
          className="object-cover object-center"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(63,65,66,0.55) 0%, rgba(63,65,66,0.65) 100%)",
          }}
        />
      </div>
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Portfolio
          </span>

          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
          >
            Selected Properties
          </h1>

          <Text
            className="text-white/80 text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed max-w-[520px] mt-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
          >
            A curated selection of premium properties representing the finest of Dubai real estate.
          </Text>

          <div className="flex gap-12 mt-6">
            <HeroStat value={propertyCount} label="Properties" />
            <HeroStat value={categoryCount} label="Categories" />
            <HeroStat value={areaCount} label="Prime Areas" />
          </div>
        </Stack>
      </Container>
    </section>
  )
}

function HeroStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-none">
        {value}
      </div>
      <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
        {label}
      </div>
    </div>
  )
}

// =============================================================================
// EMPTY / DISABLED STATES
// =============================================================================

function EmptyState() {
  return (
    <div className="web-properties">
      <section className="relative min-h-[55vh] flex flex-col justify-center items-center text-center">
        <div className="absolute inset-0 -z-10">
          <Image
            src={propertiesImage}
            alt=""
            fill
            priority
            placeholder="blur"
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(63,65,66,0.55) 0%, rgba(63,65,66,0.65) 100%)",
            }}
          />
        </div>
        <Container size="lg" className="relative z-10 px-4">
          <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
            <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
              Portfolio
            </span>
            <h1
              className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
            >
              Properties Coming Soon
            </h1>
            <Text
              className="text-white/80 text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed max-w-[520px] mt-2"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
            >
              We are currently curating our portfolio. Contact us directly to discuss available
              investment opportunities tailored to your requirements.
            </Text>
            <Button
              className="mt-6 h-12 px-8 bg-[var(--web-off-white)] text-[var(--web-ash)] hover:bg-white rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </section>
      <CTASection />
    </div>
  )
}

function FeatureDisabledState() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center py-20">
          <Title
            as="h1"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)]"
          >
            Properties Coming Soon
          </Title>
          <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-md">
            Our curated portfolio is being prepared. Contact us directly to discuss available
            opportunities.
          </Text>
          <Button
            className="mt-4 h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Contact Us
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{ backgroundColor: "#4a5a5e" }}
    >
      <div className="absolute inset-0 opacity-[0.08]">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-[center_bottom]"
          sizes="100vw"
        />
      </div>

      <Container size="xl" className="relative z-10">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Off-Market Opportunities
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,3.5vw,38px)] font-normal leading-[1.25] mb-6"
            >
              Looking for something specific?
            </Title>
            <Text className="text-white/70 text-[15px] font-light leading-relaxed">
              Our portfolio extends far beyond what's shown here. Many of our finest properties are
              available exclusively to qualified buyers through our private network. Share your
              requirements and we'll source opportunities tailored to your investment criteria.
            </Text>
          </div>

          <div className="bg-white/10 rounded-[2px] p-8">
            <Title
              as="h3"
              className="font-headline text-[var(--web-off-white)] text-xl font-normal mb-3"
            >
              Private Inquiry
            </Title>
            <Text className="text-[var(--web-serenity)] text-[14px] font-light mb-6">
              Tell us your budget, preferred areas, and must-have features. We'll respond within 24
              hours.
            </Text>
            <Button
              size="lg"
              className="btn-hover-lift w-full h-14 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Discuss Your Requirements
            </Button>
          </div>
        </Grid>
      </Container>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
