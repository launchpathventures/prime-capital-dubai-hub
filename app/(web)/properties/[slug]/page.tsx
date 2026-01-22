/**
 * CATALYST - Property Detail Page
 *
 * Individual property listing with full details.
 * Matches brand: hero with image, key metrics, investment data, gallery, CTA
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPropertyBySlug, getPropertySlugs, formatPriceRange, formatBedroomRange, formatSizeRange } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  CheckIcon,
  BathIcon,
} from "lucide-react"

// =============================================================================
// INVESTMENT DATA TYPES
// =============================================================================

interface InvestmentData {
  reasonsToInvest?: string[]
  pricePerSqFt?: number
  areaAvgPricePerSqFt?: number
  comparables?: Array<{
    project: string
    location: string
    pricePerSqFt: number
  }>
  locationHighlights?: Array<{
    time: string
    destination: string
  }>
  developerTrackRecord?: string
  estimatedRentalYield?: number
  historicalAppreciation?: number
  serviceCharge?: number
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getPropertySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)
  
  if (!property) {
    return { title: "Property Not Found" }
  }

  return {
    title: `${property.title} | Prime Capital Dubai`,
    description: property.description?.slice(0, 160) ?? "",
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = await getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  const statusBadge = property.completionStatus === "off-plan" ? "Off-Plan" : "Ready"
  const investment = property.investment as InvestmentData | null

  return (
    <div className="web-property-detail">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex flex-col justify-end">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[var(--web-ash)]">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <BuildingIcon className="h-24 w-24 text-[var(--web-spruce)]/30" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        {/* Hero Content */}
        <Container size="xl" className="relative z-10 pt-28 pb-12">
          {/* Back Link - Inline with content */}
          <Link
            href="/properties"
            className="group inline-flex items-center gap-2 text-white/60 text-[13px] hover:text-white/90 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Properties
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <Stack gap="sm">
              {/* Badges */}
              <div className="flex gap-2">
                <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px] border-0">
                  {statusBadge}
                </Badge>
                {property.featured && (
                  <Badge className="bg-[var(--web-ash)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider rounded-[2px] border-0">
                    Featured
                  </Badge>
                )}
                <Badge className="bg-white/20 text-white text-[10px] uppercase tracking-wider rounded-[2px] border-0 capitalize">
                  {property.type}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.1]">
                {property.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-white/80 text-[14px]">
                <MapPinIcon className="h-4 w-4" />
                <span>{property.location}</span>
                {property.developer && (
                  <>
                    <span className="mx-2 text-white/40">•</span>
                    <span>by {property.developer}</span>
                  </>
                )}
              </div>
            </Stack>

            {/* Price + CTA */}
            <Stack gap="sm" align="end">
              <div className="text-white/70 text-[13px]">Starting from</div>
              <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)]">
                {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
              </div>
              <Button
                className="h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
                render={<Link href={`/contact?property=${encodeURIComponent(property.slug)}`} />}
              >
                Enquire Now
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Stack>
          </div>
        </Container>
      </section>

      {/* Key Metrics Bar */}
      <section className="bg-[var(--web-ash)]">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 py-8">
            <div className="text-center">
              <BedDoubleIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
              <div className="font-headline text-[var(--web-off-white)] text-xl">
                {formatBedroomRange(property.bedroomsFrom, property.bedroomsTo)}
              </div>
              <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">Bedrooms</div>
            </div>
            
            {property.bathrooms && (
              <div className="text-center">
                <BathIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">{property.bathrooms}</div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">Bathrooms</div>
              </div>
            )}
            
            <div className="text-center">
              <RulerIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
              <div className="font-headline text-[var(--web-off-white)] text-xl">
                {formatSizeRange(property.sizeFrom, property.sizeTo, property.sizeUnit)}
              </div>
              <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">Size</div>
            </div>
            
            {property.completionDate && (
              <div className="text-center">
                <CalendarIcon className="h-6 w-6 text-[var(--web-serenity)] mx-auto mb-2" />
                <div className="font-headline text-[var(--web-off-white)] text-xl">
                  {new Date(property.completionDate).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">Completion</div>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-12">
            {/* Main Content */}
            <Stack gap="xl">
              {/* Why Invest */}
              {investment?.reasonsToInvest && investment.reasonsToInvest.length > 0 && (
                <div className="bg-[var(--web-ash)] rounded-[2px] p-8">
                  <Title as="h2" className="font-headline text-[var(--web-off-white)] text-xl font-normal mb-6">
                    Why Invest in {property.title}?
                  </Title>
                  <Stack gap="sm">
                    {investment.reasonsToInvest.map((reason, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-[var(--web-serenity)] shrink-0 mt-0.5" />
                        <Text className="text-white/80 text-[14px] font-light">{reason}</Text>
                      </div>
                    ))}
                  </Stack>
                </div>
              )}

              {/* Description */}
              <div>
                <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                  About This Property
                </span>
                <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed whitespace-pre-line">
                  {property.description}
                </Text>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Key Features
                  </span>
                  <Grid cols={2} className="gap-3">
                    {property.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                        <Text className="text-[var(--web-spruce)] text-[14px] font-light">{feature}</Text>
                      </div>
                    ))}
                  </Grid>
                </div>
              )}

              {/* Gallery */}
              {property.images.length > 1 && (
                <div>
                  <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
                    Gallery
                  </span>
                  <Grid cols={2} className="gap-4">
                    {property.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-[2px] overflow-hidden bg-[var(--web-serenity)]/20">
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </Grid>
                </div>
              )}
            </Stack>

            {/* Sidebar */}
            <Stack gap="lg">
              {/* Property Details Card */}
              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <Title as="h3" className="font-headline text-[var(--web-ash)] text-lg font-normal mb-6">
                  Property Details
                </Title>
                <Stack gap="md">
                  {property.developer && (
                    <div className="flex justify-between">
                      <span className="text-[var(--web-spruce)] text-[13px]">Developer</span>
                      <span className="text-[var(--web-ash)] text-[13px] font-medium">{property.developer}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[var(--web-spruce)] text-[13px]">Property Type</span>
                    <span className="text-[var(--web-ash)] text-[13px] font-medium capitalize">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--web-spruce)] text-[13px]">Location</span>
                    <span className="text-[var(--web-ash)] text-[13px] font-medium">{property.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--web-spruce)] text-[13px]">Status</span>
                    <Badge className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] rounded-[2px]">
                      {statusBadge}
                    </Badge>
                  </div>
                  {investment?.estimatedRentalYield && (
                    <div className="flex justify-between">
                      <span className="text-[var(--web-spruce)] text-[13px]">Est. Rental Yield</span>
                      <span className="text-[var(--web-spruce)] text-[13px] font-medium">
                        {investment.estimatedRentalYield}%
                      </span>
                    </div>
                  )}

                  {/* Location placeholder */}
                  <div className="mt-4 aspect-video bg-[var(--web-serenity)]/20 rounded-[2px] flex items-center justify-center">
                    <Stack gap="xs" align="center">
                      <MapPinIcon className="h-8 w-8 text-[var(--web-spruce)]/30" />
                      <Text className="text-[var(--web-spruce)] text-[12px]">{property.location}</Text>
                    </Stack>
                  </div>
                </Stack>
              </div>

              {/* Developer Info */}
              {investment?.developerTrackRecord && property.developer && (
                <div className="bg-white rounded-[2px] p-6 shadow-sm">
                  <Title as="h3" className="font-headline text-[var(--web-ash)] text-lg font-normal mb-4">
                    {property.developer}
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed">
                    {investment.developerTrackRecord}
                  </Text>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-[var(--web-spruce)] rounded-[2px] p-6 text-center">
                <Title as="h3" className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-2">
                  Interested in this property?
                </Title>
                <Text className="text-[var(--web-serenity)] text-[13px] font-light mb-6">
                  Contact us for more details, viewings, or investment analysis.
                </Text>
                <Button
                  className="w-full h-12 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
                  render={<Link href={`/contact?property=${encodeURIComponent(property.slug)}`} />}
                >
                  Enquire Now
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>
    </div>
  )
}
