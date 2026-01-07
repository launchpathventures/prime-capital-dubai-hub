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

import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import {
  getProperties,
  getTestimonials,
  getStats,
  type Property,
  type Testimonial,
  type Stat,
} from "@/lib/content"
import { Container, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"

// Curated imagery for areas
const areaImages: Record<string, string> = {
  "Downtown Dubai": "https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=800&auto=format&fit=crop",
  "Palm Jumeirah": "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800&auto=format&fit=crop",
  "Dubai Marina": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
  "Emirates Hills": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
  "Jumeirah Bay": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&auto=format&fit=crop",
  "Business Bay": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
}

// Property images for types
const propertyImages: Record<string, string> = {
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
  penthouse: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  apartment: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
}

export default async function HomePage() {
  const [properties, testimonials, stats] = await Promise.all([
    getProperties(),
    getTestimonials(),
    getStats(),
  ])
  const featuredProperties = properties.slice(0, 3)

  return (
    <div className="web-homepage">
      <HeroSection />
      <StatsSection stats={stats} />
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

function HeroSection() {
  return (
    <section
      className="web-hero relative min-h-dvh flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      {/* Subtle gradient overlay at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
        }}
      />

      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="lg" align="center" className="max-w-[720px] mx-auto">
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(38px,7vw,76px)] font-normal leading-[1.05] tracking-tight text-center"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            We move complexity out of sight.
          </h1>

          <Text
            className="text-white/80 text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed max-w-[480px]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Boutique real estate advisory for discerning investors.
          </Text>

          <Button
            nativeButton={false}
            size="lg"
            className="mt-4 h-12 px-10 bg-white/95 text-[var(--web-ash)] hover:bg-white border-none rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg"
            render={<Link href="/contact" />}
          >
            Begin Your Journey
          </Button>
        </Stack>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[var(--web-off-white)] text-[11px] font-normal uppercase tracking-[0.15em] opacity-70">
          Discover
        </span>
        <ChevronDownIcon className="h-4 w-4 text-[var(--web-off-white)] opacity-70" />
      </div>
    </section>
  )
}

// =============================================================================
// STATS SECTION
// =============================================================================

function StatsSection({ stats }: { stats: Stat[] }) {
  // Helper to render stat value with AED prefix styled differently
  const renderStatValue = (value: string) => {
    if (value.startsWith('AED ')) {
      const numPart = value.replace('AED ', '')
      return (
        <>
          <span className="text-[0.4em] align-middle mr-1">AED</span>
          {numPart}
        </>
      )
    }
    return value
  }

  return (
    <section id="stats-section" className="bg-[var(--web-ash)]">
      <Container size="xl">
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-8 py-16 text-center">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="stat-item px-4"
              data-index={index}
            >
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(36px,6vw,64px)] font-normal leading-none mb-3">
                {renderStatValue(stat.value)}
              </div>
              <div className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.15em]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
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

          <Text className="text-[var(--web-spruce)] text-[17px] font-light leading-relaxed">
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

function PropertiesSection({ properties }: { properties: Property[] }) {
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
            {properties.map((property) => (
              <Link
                key={property.id}
                href={`/properties/${property.slug}`}
                className="group"
              >
                <div className="bg-white rounded-[2px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Property Image */}
                  <div className="relative h-[280px] overflow-hidden">
                    <Image
                      src={propertyImages[property.type] || propertyImages.default}
                      alt={property.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Gradient overlay */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
                      }}
                    />
                    {/* Status badge */}
                    <Badge
                      variant={property.completionStatus === "ready" ? "default" : "secondary"}
                      className="absolute top-4 left-4 text-[11px] uppercase tracking-wider"
                    >
                      {property.completionStatus === "ready" ? "Ready" : "Off-Plan"}
                    </Badge>
                  </div>

                  {/* Property Info */}
                  <div className="p-6">
                    <div className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em] mb-2">
                      {property.type} · {property.bedroomsFrom === property.bedroomsTo ? `${property.bedroomsFrom} Beds` : `${property.bedroomsFrom}-${property.bedroomsTo} Beds`}
                    </div>
                    <h3 className="font-headline text-[var(--web-ash)] text-xl font-normal mb-3 leading-tight">
                      {property.title}
                    </h3>
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--web-serenity)]/20">
                      <span className="text-[var(--web-spruce)] text-sm">
                        From {property.sizeFrom?.toLocaleString()} {property.sizeUnit}
                      </span>
                      <ArrowRightIcon className="h-4 w-4 text-[var(--web-spruce)]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
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
                className="flex flex-col h-full p-8 rounded-[2px]"
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
              <div
                key={area.name}
                className="relative h-[200px] rounded-[2px] overflow-hidden cursor-pointer group"
              >
                <Image
                  src={areaImages[area.name] || areaImages["Dubai Marina"]}
                  alt={area.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 16vw"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-4"
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
              </div>
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
      className="py-[var(--web-section-gap)]"
      style={{
        backgroundColor: "var(--web-spruce)",
        backgroundImage: `linear-gradient(135deg, rgba(63,65,66,0.95) 0%, rgba(87,108,117,0.9) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2500&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
              A comprehensive 48-page analysis of Dubai's residential market, including area-by-area
              breakdowns, price trend analysis, and our proprietary investment framework.
            </Text>

            {/* Benefits grid */}
            <Grid cols={2} className="gap-x-6 gap-y-4 mt-4">
              {[
                "Current market analysis with 5-year projections",
                "Area-by-area breakdown & pricing",
                "ROI data and historical performance",
                "Golden Visa & Pro Strategies",
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
              48 pages of institutional-grade research
            </Text>

            <Button
              nativeButton={false}
              size="lg"
              className="w-full h-[52px] bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/strategy-kit" />}
            >
              Download Now
            </Button>

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

          <Button
            nativeButton={false}
            size="lg"
            className="mt-4 h-12 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg"
            render={<Link href="/contact" />}
          >
            Start a Conversation
          </Button>

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
