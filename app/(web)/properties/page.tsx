/**
 * CATALYST - Properties Listing Page
 *
 * Portfolio of Prime Capital Dubai's curated properties.
 * Matches design: hero with image/stats, filter tabs, property cards with details, CTA section
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { getProperties } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import { PropertiesFilter } from "./_components/properties-filter"

export const metadata = {
  title: "Properties | Prime Capital Dubai",
  description: "Curated selection of premium Dubai real estate opportunities.",
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  if (!config.features.properties) {
    return (
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="lg">
          <Stack gap="md" align="center" className="text-center py-20">
            <Title as="h1" className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)]">
              Properties Coming Soon
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-md">
              Our curated portfolio is being prepared. Contact us directly to discuss 
              available opportunities.
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

  // Calculate stats
  const propertyCount = properties.length
  const categoryCount = new Set(properties.map(p => p.type)).size
  const areaCount = new Set(properties.map(p => p.location)).size

  // Prepare properties for client component
  const clientProperties = properties.map(p => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    location: p.location,
    price: p.priceFrom 
      ? p.priceFrom >= 1000000 
        ? `AED ${(p.priceFrom / 1000000).toFixed(1)}M`
        : `AED ${p.priceFrom.toLocaleString()}`
      : "Price on Request",
    bedrooms: p.bedroomsFrom,
    bathrooms: p.bathrooms || 0,
    area: p.sizeFrom ? `${p.sizeFrom.toLocaleString()} ${p.sizeUnit}` : "",
    description: p.description || "",
    featured: p.featured,
    status: p.completionStatus,
  }))

  return (
    <div className="web-properties">
      {/* Hero Section */}
      <HeroSection 
        propertyCount={propertyCount} 
        categoryCount={categoryCount} 
        areaCount={areaCount} 
      />
      
      {/* Filter + Grid (Client Component) */}
      <PropertiesFilter properties={clientProperties} />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-width image with stats
// =============================================================================

function HeroSection({ 
  propertyCount, 
  categoryCount, 
  areaCount 
}: { 
  propertyCount: number
  categoryCount: number
  areaCount: number 
}) {
  return (
    <section
      className="relative min-h-[55vh] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.55) 0%, rgba(63,65,66,0.65) 100%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
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
            A curated selection of premium properties representing the
            finest of Dubai real estate.
          </Text>

          {/* Stats */}
          <div className="flex gap-12 mt-6">
            <div className="text-center">
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-none">
                {propertyCount}
              </div>
              <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                Properties
              </div>
            </div>
            <div className="text-center">
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-none">
                {categoryCount}
              </div>
              <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                Categories
              </div>
            </div>
            <div className="text-center">
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-none">
                {areaCount}
              </div>
              <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                Prime Areas
              </div>
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA SECTION
// Dark section with inquiry form prompt
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundColor: "#4a5a5e", // Matches Services/About CTA
      }}
    >
      {/* Subtle cityscape silhouette */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />
      
      <Container size="xl" className="relative z-10">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 items-center">
          {/* Left - Content */}
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

          {/* Right - CTA Box */}
          <div className="bg-white/10 rounded-[2px] p-8">
            <Title
              as="h3"
              className="font-headline text-[var(--web-off-white)] text-xl font-normal mb-3"
            >
              Private Inquiry
            </Title>
            <Text className="text-[var(--web-serenity)] text-[14px] font-light mb-6">
              Tell us your budget, preferred areas, and must-have features.
              We'll respond within 24 hours.
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
      
      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
