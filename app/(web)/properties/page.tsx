/**
 * CATALYST - Properties Listing Page
 *
 * Curated portfolio sourced from the AgentCRM public API. The list endpoint
 * is hard-gated to promotion_status=top_property — featured picks only.
 */

import Link from "next/link"
import Image from "next/image"

import { config } from "@/lib/config"
import { getCrmProperties } from "@/lib/crm/client"
import type { CrmListFilters, CrmPropertyType, CrmSort } from "@/lib/crm"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

import { PropertiesFilter } from "./_components/properties-filter"
import propertiesImage from "@/public/images/hero/properties.jpg"

export const revalidate = 300 // Match CRM Cache-Control max-age

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
    property_type?: string | string[]
    area?: string | string[]
    bedrooms_min?: string | string[]
    bedrooms_max?: string | string[]
    price_min?: string | string[]
    price_max?: string | string[]
    sort?: string | string[]
  }>
}

const ALLOWED_SORTS: CrmSort[] = ["price_asc", "price_desc", "newest", "oldest"]

function singleParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}

function numericParam(value: string | string[] | undefined): number | undefined {
  const raw = singleParam(value)
  if (raw == null || raw === "") return undefined
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseFilters(
  params: Awaited<PropertiesPageProps["searchParams"]>
): CrmListFilters {
  const sortRaw = singleParam(params.sort)
  const sort = ALLOWED_SORTS.includes(sortRaw as CrmSort) ? (sortRaw as CrmSort) : undefined
  const propertyType = singleParam(params.property_type) as CrmPropertyType | undefined

  return {
    propertyType: propertyType && propertyType !== "all" ? propertyType : undefined,
    area: singleParam(params.area),
    bedroomsMin: numericParam(params.bedrooms_min),
    bedroomsMax: numericParam(params.bedrooms_max),
    priceMin: numericParam(params.price_min),
    priceMax: numericParam(params.price_max),
    sort,
    limit: 50,
  }
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const params = await searchParams

  if (!config.features.properties) {
    return <FeatureDisabledState />
  }

  const filters = parseFilters(params)
  const { properties, total } = await getCrmProperties(filters)

  if (properties.length === 0) {
    return <EmptyState />
  }

  const propertyCount = total || properties.length
  const categoryCount = new Set(properties.map((p) => p.propertyType.toLowerCase())).size
  const areaCount = new Set(properties.map((p) => p.area.toLowerCase())).size

  const activeType = singleParam(params.property_type) ?? "all"
  const areaFilter = singleParam(params.area) ?? ""

  return (
    <div className="web-properties">
      <HeroSection
        propertyCount={propertyCount}
        categoryCount={categoryCount}
        areaCount={areaCount}
      />

      <PropertiesFilter
        properties={properties}
        activeType={activeType}
        areaFilter={areaFilter}
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
