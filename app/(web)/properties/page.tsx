/**
 * CATALYST - Properties Listing Page
 *
 * Portfolio of Prime Capital Dubai's curated properties.
 * Matches design: hero with image/stats, filter tabs, property cards with details, CTA section
 */

import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import { getProperties } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, MapPinIcon } from "lucide-react"

export const metadata = {
  title: "Properties | Prime Capital Dubai",
  description: "Curated selection of premium Dubai real estate opportunities.",
}

// Property images for types
const propertyImages: Record<string, string> = {
  villa: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
  penthouse: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  apartment: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
  townhouse: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
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
              nativeButton={false}
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

  return (
    <div className="web-properties">
      {/* Hero Section */}
      <HeroSection 
        propertyCount={propertyCount} 
        categoryCount={categoryCount} 
        areaCount={areaCount} 
      />
      
      {/* Filter Tabs */}
      <FilterTabs properties={properties} />
      
      {/* Properties Grid */}
      <PropertiesGrid properties={properties} />
      
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
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[700px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Portfolio
          </span>
          
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(36px,6vw,56px)] font-normal leading-[1.1] tracking-tight italic"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            Selected Properties
          </h1>

          <Text
            className="text-white/80 text-[clamp(14px,1.6vw,16px)] font-light leading-relaxed max-w-[480px]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
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
// FILTER TABS
// Horizontal filter buttons
// =============================================================================

function FilterTabs({ properties }: { properties: Awaited<ReturnType<typeof getProperties>> }) {
  // Get unique types
  const types = Array.from(new Set(properties.map(p => p.type)))
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = properties.filter(p => p.type === type).length
    return acc
  }, {} as Record<string, number>)

  return (
    <section className="bg-[var(--web-off-white)] py-8 border-b border-[var(--web-serenity)]/20">
      <Container size="xl">
        <div className="flex flex-wrap justify-center gap-3">
          <button className="px-5 py-2 bg-[var(--web-ash)] text-[var(--web-off-white)] rounded-[2px] text-[12px] uppercase tracking-wider">
            All Properties ({properties.length})
          </button>
          {types.map((type) => (
            <button
              key={type}
              className="px-5 py-2 bg-transparent text-[var(--web-spruce)] border border-[var(--web-spruce)]/30 rounded-[2px] text-[12px] uppercase tracking-wider hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
            >
              {type} ({typeCounts[type]})
            </button>
          ))}
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// PROPERTIES GRID
// Grid of property cards
// =============================================================================

function PropertiesGrid({ properties }: { properties: Awaited<ReturnType<typeof getProperties>> }) {
  if (properties.length === 0) {
    return (
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Stack gap="md" align="center" className="text-center py-12">
            <Text className="text-[var(--web-spruce)] text-[15px] font-light">
              No properties currently available. Contact us to discuss off-market opportunities.
            </Text>
            <Button
              nativeButton={false}
              variant="outline"
              className="border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
              render={<Link href="/contact" />}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// Property Card Component
function PropertyCard({ property }: { property: Awaited<ReturnType<typeof getProperties>>[0] }) {
  const imageUrl = property.coverImage || propertyImages[property.type.toLowerCase()] || propertyImages.default
  
  // Format price
  const formatPrice = (price: number | null) => {
    if (!price) return null
    if (price >= 1000000) {
      return `AED ${(price / 1000000).toFixed(1)}M`
    }
    return `AED ${price.toLocaleString()}`
  }

  return (
    <Link href={`/properties/${property.slug}`} className="group block">
      <div className="bg-white rounded-[2px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative h-[240px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className="bg-[var(--web-ash)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px]">
              {property.completionStatus === "ready" ? "Ready" : "Off-Plan"}
            </Badge>
            {property.featured && (
              <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px]">
                Featured
              </Badge>
            )}
          </div>

          {/* Location badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-[12px]">
            <MapPinIcon className="h-3 w-3" />
            {property.location}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Type + Developer */}
          <div className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] mb-2">
            {property.type} · {property.developer || "Prime Selection"}
          </div>
          
          {/* Title */}
          <h3 className="font-headline text-[var(--web-ash)] text-lg font-normal mb-3 leading-tight group-hover:text-[var(--web-spruce)] transition-colors">
            {property.title}
          </h3>

          {/* Specs */}
          <div className="text-[var(--web-spruce)] text-[13px] font-light mb-4">
            {property.bedroomsFrom === property.bedroomsTo 
              ? `${property.bedroomsFrom} Beds`
              : `${property.bedroomsFrom}-${property.bedroomsTo} Beds`}
            {property.bathrooms && ` · ${property.bathrooms} Baths`}
            {property.sizeFrom && ` · ${property.sizeFrom.toLocaleString()} ${property.sizeUnit}`}
          </div>

          {/* Price + CTA */}
          <div className="flex justify-between items-center pt-4 border-t border-[var(--web-serenity)]/20">
            <div className="font-headline text-[var(--web-ash)] text-lg">
              {property.priceFrom ? formatPrice(property.priceFrom) : "Price on Request"}
            </div>
            <span className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] flex items-center gap-1">
              View Details
              <ArrowRightIcon className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// CTA SECTION
// Dark section with inquiry form prompt
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.98) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="xl">
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
              nativeButton={false}
              size="lg"
              className="w-full h-12 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Discuss Your Requirements
            </Button>
          </div>
        </Grid>
      </Container>
    </section>
  )
}
