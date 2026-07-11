/**
 * CATALYST - Prime Capital Dubai Homepage
 *
 * The main public-facing landing page for Prime Capital Dubai.
 * Trust-first approach: brand positioning before property content.
 * 
 * Structure:
 * 1. Hero (full viewport, dark, minimal)
 * 2. Stats bar (proof)
 * 3. Positioning section (values)
 * 4. Featured Properties
 * 5. Testimonials (social proof)
 * 6. Areas coverage
 * 7. Strategy Kit (lead magnet)
 * 8. Contact CTA
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"

export const revalidate = 3600 // 1 hour ISR

export const metadata: Metadata = {
  title: "Dubai Real Estate Advisory",
  description:
    "Boutique real estate advisory for discerning international investors seeking quality exposure to Dubai's premium property market.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dubai Real Estate Advisory",
    description:
      "Boutique real estate advisory for discerning international investors seeking quality exposure to Dubai's premium property market.",
    url: "/",
    images: [
      {
        url: "/images/hero/prime-capital-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Prime Capital Dubai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubai Real Estate Advisory",
    description:
      "Boutique real estate advisory for discerning international investors seeking quality exposure to Dubai's premium property market.",
    images: ["/images/hero/prime-capital-hero.jpg"],
  },
}
import Image from "next/image"
import { config } from "@/lib/config"
import {
  getWebTestimonials,
  getWebStats,
  type Testimonial,
} from "@/lib/content"
import { getCrmProperties } from "@/lib/crm/client"
import { fetchPropertyFacets } from "@/lib/crm/facets"
import {
  formatCrmBedrooms,
  formatCrmPriceRange,
  isOffPlanListing,
  type CrmProperty,
} from "@/lib/crm"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon } from "lucide-react"
import { AnimatedStatsSection } from "./_surface/animated-stats"
import { ParallaxHero } from "./_surface/parallax-hero"
import { PropertySearch } from "./_surface/property-search"
import { propertyTypeImages } from "./_surface/property-images"
import heroImage from "@/public/images/hero/prime-capital-hero.jpg"

// Curated imagery for areas
const areaImages: Record<string, string> = {
  "Downtown Dubai": "https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=800&auto=format&fit=crop",
  "Palm Jumeirah": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop",
  "Dubai Marina": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
  "Emirates Hills": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  "Jumeirah Bay": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop",
  "Business Bay": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
}


export default async function HomePage() {
  // Handle root redirect if configured (e.g., redirect "/" to "/learn" during dev)
  if (config.features.rootRedirect) {
    redirect(config.features.rootRedirect)
  }

  // Featured strip + hero search span the full live inventory (off-plan and
  // secondary). "newest" surfaces the most recently listed picks up top.
  const [propertiesResult, testimonials, stats, facets] = await Promise.all([
    getCrmProperties({ limit: 12, sort: "newest" }),
    getWebTestimonials(),
    getWebStats(),
    fetchPropertyFacets(),
  ])
  const properties = propertiesResult.properties
  const featuredProperties = properties.slice(0, 3)

  // Hero search dropdowns are populated from the canonical CRM facets, not
  // inferred from the loaded property list.
  const propertyTypes = facets.propertyTypes.map((option) => option.value)
  const propertyLocations = facets.areas.map((option) => option.value)

  // Fallback stats when database is empty (must match data/stats.json)
  const fallbackStats = [
    { id: "1", value: "AED 6.5B+", label: "Transaction Volume" },
    { id: "2", value: "750+", label: "Properties Transacted" },
    { id: "3", value: "94%", label: "Client Retention" },
    { id: "4", value: "15+", label: "Years Experience" },
  ]
  const displayStats = stats.length > 0 ? stats : fallbackStats

  return (
    <div className="web-homepage">
      {/* Above-the-fold: hero fills first viewport on mobile; stats follow below */}
      <div className="web-fold">
        <HeroSection types={propertyTypes} locations={propertyLocations} />
        <AnimatedStatsSection stats={displayStats} />
      </div>
      <PositioningSection />
      {config.features.properties && featuredProperties.length > 0 && (
        <PropertiesSection properties={featuredProperties} />
      )}
      <TestimonialsSection testimonials={testimonials} />
      <AreasSection />
      <StrategyKitSection />
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full viewport, dark, deliberately minimal
// =============================================================================

function HeroSection({ types, locations }: { types: string[]; locations: string[] }) {
  return (
    <ParallaxHero
      imageUrl={heroImage}
      overlay="linear-gradient(to bottom, rgba(20,22,26,0.45) 0%, rgba(20,22,26,0.25) 35%, rgba(20,22,26,0.4) 65%, rgba(16,18,22,0.75) 100%)"
      objectPosition="center 65%"
      intensity={0.12}
      priority
      className="web-hero flex-none min-h-[100dvh] md:flex-1 md:min-h-0 flex flex-col items-center max-md:justify-center text-center relative"
    >
      {/* Hero content — centred in available space, pt accounts for navbar */}
      <div className="max-md:pt-[var(--web-header-height)] flex-1 flex items-center pb-16 max-md:flex-none max-md:pb-0">
        <Container size="lg" className="relative z-10 px-4">
          <Stack gap="lg" align="center" className="max-w-[720px] mx-auto max-md:max-w-full">
            <h1
              className="font-headline text-[var(--web-off-white)] text-[clamp(36px,6vw,64px)] font-normal leading-[1.1] tracking-tight text-center"
              style={{ textShadow: "0 2px 40px rgba(0,0,0,0.4)" }}
            >
              We move complexity out of sight.
            </h1>

            <p
              className="text-white/85 text-[clamp(16px,1.8vw,20px)] font-light leading-relaxed max-w-[480px] mt-2"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.25)" }}
            >
              Boutique real estate advisory for discerning investors.
            </p>

            <Link
              href="/contact"
              className="web-hero-cta"
            >
              Start A Conversation
            </Link>
          </Stack>
        </Container>
      </div>

      {/* Search bar — straddles the hero bottom edge */}
      <div className="web-hero-search">
        <Container size="lg" className="px-4">
          <PropertySearch types={types} locations={locations} />
        </Container>
      </div>
    </ParallaxHero>
  )
}

// =============================================================================
// POSITIONING SECTION
// =============================================================================

function PositioningSection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <div className="max-w-[800px] mx-auto text-center">
          <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-6">
            Our Approach
          </span>

          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,44px)] font-normal leading-[1.25] mb-6 text-center"
          >
            In a market saturated with noise, we chose a different path.
          </Title>

          <Text className="text-[var(--web-spruce)] text-[17px] font-light leading-[1.8]">
            Prime Capital is not a high-volume agency. We're a boutique advisory
            built for investors who value substance over salesmanship, and
            relationships over transactions.
          </Text>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// PROPERTIES SECTION
// =============================================================================

function PropertiesSection({ properties }: { properties: CrmProperty[] }) {
  return (
    <section className="bg-[var(--web-off-white)] pb-[var(--web-section-gap)]">
      <Container size="xl">
        <Stack gap="xl">
          {/* Section Header */}
          <Stack gap="md" align="center" className="text-center">
            <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em]">
              Portfolio
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
            >
              Selected Properties
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-[500px]">
              Hand-picked opportunities representing the finest of Dubai real estate.
            </Text>
          </Stack>

          {/* Property Cards */}
          <Grid cols={1} className="md:grid-cols-3 gap-6">
            {properties.map((property) => {
              const isOffPlan = isOffPlanListing(property)
              const cardImage =
                property.images[0] ||
                propertyTypeImages[property.propertyType.toLowerCase()] ||
                propertyTypeImages.default

              return (
                <Link
                  key={property.id}
                  href={`/properties/${property.slug}`}
                  className="group"
                >
                  <div className="card-lift bg-white rounded-[2px] overflow-hidden shadow-sm">
                    <div className="relative h-[280px] overflow-hidden">
                      <Image
                        src={cardImage}
                        alt={property.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
                        }}
                      />
                      <Badge
                        variant={isOffPlan ? "secondary" : "default"}
                        className="absolute top-4 left-4 text-[11px] uppercase tracking-wider"
                      >
                        {isOffPlan ? "Off-Plan" : "Ready"}
                      </Badge>
                    </div>

                    <div className="p-6">
                      <div className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em] mb-2 capitalize">
                        {property.propertyType} · {formatCrmBedrooms(property)}
                      </div>
                      <h3 className="font-headline text-[var(--web-ash)] text-xl font-normal mb-3 leading-tight">
                        {property.title}
                      </h3>
                      <div className="flex justify-between items-center pt-3 border-t border-[var(--web-serenity)]/20">
                        <span className="text-[var(--web-spruce)] text-sm">
                          {formatCrmPriceRange(property)}
                        </span>
                        <ArrowRightIcon className="h-4 w-4 text-[var(--web-spruce)]" />
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </Grid>

          {/* View All Link */}
          <Row justify="center">
            <Link
              href="/properties"
              className="text-[var(--web-spruce)] text-[13px] font-normal uppercase tracking-[0.15em] inline-flex items-center gap-2 hover:text-[var(--web-ash)] transition-colors"
            >
              View All Properties
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Row>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================

function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <section
      className="py-[var(--web-section-gap)]"
      style={{
        backgroundColor: "var(--web-ash)",
        backgroundImage: "linear-gradient(135deg, var(--web-ash) 0%, #2a2b2c 100%)",
      }}
    >
      <Container size="xl">
        <Stack gap="xl">
          {/* Section Header */}
          <Stack gap="md" align="center" className="text-center">
            <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em]">
              Client Perspectives
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
            >
              What our clients say
            </Title>
          </Stack>

          {/* Testimonial Cards */}
          <Grid cols={1} className="md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial) => (
              <div
                key={testimonial.id}
                className="testimonial-card flex flex-col h-full p-8 rounded-[2px]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Large quote mark */}
                <div className="font-headline text-[var(--web-spruce)] text-7xl leading-none -mb-4 opacity-50">
                  "
                </div>

                {/* Quote */}
                <blockquote className="text-[var(--web-off-white)] text-[15px] font-light leading-relaxed italic flex-1">
                  {testimonial.quote}
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-4 mt-7">
                  <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)] flex items-center justify-center">
                    <span className="font-headline text-[var(--web-off-white)] text-lg">
                      {testimonial.authorName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-[var(--web-off-white)] text-sm font-medium">
                      {testimonial.authorName}
                    </div>
                    <div className="text-[var(--web-serenity)] text-xs mt-0.5">
                      {testimonial.authorLocation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// AREAS SECTION
// =============================================================================

function AreasSection() {
  const areas = [
    { name: "Downtown Dubai", description: "Iconic skyline living" },
    { name: "Palm Jumeirah", description: "Waterfront prestige" },
    { name: "Dubai Marina", description: "Urban sophistication" },
    { name: "Emirates Hills", description: "Private estate living" },
    { name: "Jumeirah Bay", description: "Ultra-luxury exclusivity" },
    { name: "Business Bay", description: "Central connectivity" },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Stack gap="xl">
          {/* Section Header */}
          <Stack gap="md" align="center" className="text-center">
            <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em]">
              Coverage
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
            >
              Dubai's Premier Addresses
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-[500px]">
              Deep expertise across Dubai's most sought-after communities.
            </Text>
          </Stack>

          {/* Area Tiles */}
          <Grid cols={2} className="md:grid-cols-3 lg:grid-cols-6 gap-4">
            {areas.map((area) => (
              <Link
                key={area.name}
                href={`/properties?area=${encodeURIComponent(area.name)}`}
                className="area-tile relative h-[200px] rounded-[2px] overflow-hidden group block focus:outline-none focus:ring-2 focus:ring-[var(--web-serenity)] focus:ring-offset-2"
              >
                <Image
                  src={areaImages[area.name] || areaImages["Dubai Marina"]}
                  alt=""
                  aria-hidden="true"
                  fill
                  className="img-zoom object-cover"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                {/* Overlay */}
                <div
                  className="area-tile-overlay absolute inset-0 flex flex-col justify-end p-4"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
                  }}
                >
                  <div className="font-headline text-[var(--web-off-white)] text-sm font-normal mb-0.5">
                    {area.name}
                  </div>
                  <div className="text-white/70 text-[11px]">
                    {area.description}
                  </div>
                </div>
              </Link>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// STRATEGY KIT SECTION
// =============================================================================

function StrategyKitSection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{ backgroundColor: "var(--web-spruce)" }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2500&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(63,65,66,0.95) 0%, rgba(87,108,117,0.9) 100%)" }}
        />
      </div>
      <Container size="xl">
        <Grid cols={1} className="md:grid-cols-[1.4fr_1fr] gap-16 items-center">
          {/* Left: Content */}
          <Stack gap="lg">
            <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em]">
              Free Resource
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
            >
              Dubai 2026 Investment Strategy Kit
            </Title>
            <Text className="text-white/80 text-[17px] font-light leading-relaxed">
              A complete investment framework for Dubai real estate — three proven strategies,
              area-by-area market zones, full cost transparency, and a step-by-step buying process.
            </Text>

            {/* Benefits grid */}
            <Grid cols={2} className="gap-x-6 gap-y-4 mt-4">
              {[
                "Three strategies: income, growth & legacy",
                "Four market zones mapped & rated",
                "Off-plan leverage & branded premiums",
                "Golden Visa & full cost transparency",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="text-[var(--web-off-white)] text-sm font-light flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-[var(--web-serenity)] shrink-0 mt-0.5">
                    ✓
                  </span>
                  {benefit}
                </div>
              ))}
            </Grid>
          </Stack>

          {/* Right: CTA Card */}
          <div className="bg-white/[0.98] rounded-[2px] p-10 text-center shadow-2xl">
            {/* Book mockup */}
            <div
              className="w-[120px] h-[160px] mx-auto mb-6 rounded-[2px] flex flex-col items-center justify-center p-4"
              style={{
                backgroundColor: "var(--web-ash)",
                boxShadow: "8px 8px 0 rgba(0,0,0,0.1)",
              }}
            >
              <div className="font-headline text-[var(--web-off-white)] text-[11px] text-center leading-tight">
                Dubai
                <br />
                Investment
                <br />
                Strategy Kit
              </div>
              <div className="text-[var(--web-serenity)] text-[8px] mt-2">
                2026 EDITION
              </div>
            </div>

            <div className="font-headline text-[var(--web-ash)] text-2xl mb-2">
              Get Your Free Copy
            </div>
            <Text className="text-[var(--web-spruce)] text-sm mb-6">
              Your complete Dubai investment framework
            </Text>

            <Link
              href="/strategy-kit"
              className="btn-hover-lift w-full h-[52px] bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] inline-flex items-center justify-center"
            >
              Download Now
            </Link>

            <Text className="text-[var(--web-serenity)] text-xs mt-4">
              No spam. Instant access.
            </Text>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)] relative overflow-hidden">
      {/* Decorative element */}
      <div
        className="absolute -top-[100px] -right-[100px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(166,181,176,0.15) 0%, transparent 70%)",
        }}
      />

      <Container size="lg" className="relative">
        <Stack gap="lg" align="center" className="text-center">
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.2]"
          >
            Ready to explore Dubai?
          </Title>

          <Text className="text-[var(--web-spruce)] text-[17px] font-light leading-relaxed max-w-[520px]">
            Let's discuss how Prime Capital can support your investment objectives.
          </Text>

          <Link
            href="/contact"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg inline-flex items-center justify-center"
          >
            Start a Conversation
          </Link>

          {/* Trust indicators */}
          <Row gap="xl" className="mt-12 flex-wrap justify-center">
            {[
              { label: "Response Time", value: "Under 24 hours" },
              { label: "Consultation", value: "Complimentary" },
              { label: "Commitment", value: "Zero pressure" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
                  {item.label}
                </div>
                <div className="font-headline text-[var(--web-ash)] text-lg mt-1">
                  {item.value}
                </div>
              </div>
            ))}
          </Row>
        </Stack>
      </Container>
    </section>
  )
}
