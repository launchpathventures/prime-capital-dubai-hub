/**
 * CATALYST - Property Detail Page
 *
 * Individual property listing with full details.
 * Enhanced design with investment data, comparables, and developer info.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPropertyBySlug, getPropertySlugs, formatPriceRange, formatBedroomRange, formatSizeRange } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  CheckCircleIcon,
  LightbulbIcon,
  BathIcon,
  PlaneIcon,
  Building2Icon,
  CarIcon,
  StarIcon,
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
  const hasInvestmentData = investment && (
    investment.reasonsToInvest?.length ||
    investment.pricePerSqFt ||
    investment.comparables?.length ||
    investment.developerTrackRecord
  )

  return (
    <Stack gap="none">
      {/* Hero Section with Overlays */}
      <Section padding="none" className="relative">
        <div className="relative aspect-[21/9] min-h-[400px] bg-muted">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <BuildingIcon className="h-24 w-24 text-primary/30" />
            </div>
          )}
          
          {/* Dark overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Back Button Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Properties
            </Link>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-6 right-6 z-10">
              <Badge className="bg-amber-500 text-white border-0">
                <StarIcon className="h-3 w-3 mr-1 fill-current" />
                FEATURED
              </Badge>
            </div>
          )}

          {/* Bottom Overlay - Title, Status, Price, CTA */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
            <Container size="xl">
              <Row className="justify-between items-end flex-wrap gap-4">
                <Stack gap="sm">
                  <Row gap="sm" align="center">
                    <Badge className="bg-emerald-500 text-white border-0 uppercase text-xs font-semibold">
                      {statusBadge}
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30 capitalize">
                      {property.type}
                    </Badge>
                  </Row>
                  <Title as="h1" size="h1" className="font-headline text-white">
                    {property.title}
                  </Title>
                  <Row gap="sm" align="center" className="text-white/80">
                    <MapPinIcon className="h-4 w-4" />
                    <Text className="text-white/80">{property.location}</Text>
                    {property.developer && (
                      <>
                        <span className="mx-2 text-white/50">•</span>
                        <Text className="text-white/80">by {property.developer}</Text>
                      </>
                    )}
                  </Row>
                </Stack>
                
                <Stack gap="sm" align="end">
                  <Text size="sm" className="text-white/70">Starting from</Text>
                  <Title as="div" size="h2" className="text-white font-headline">
                    {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
                  </Title>
                  <Button
                    nativeButton={false}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                    render={<Link href="/contact" />}
                  >
                    Enquire Now
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </Stack>
              </Row>
            </Container>
          </div>
        </div>
      </Section>

      {/* Key Metrics Bar */}
      <Section padding="md" className="bg-slate-50 dark:bg-slate-900 border-b">
        <Container size="xl">
          <Row className="justify-center gap-8 md:gap-16 flex-wrap">
            <Stack gap="xs" align="center">
              <BedDoubleIcon className="h-6 w-6 text-muted-foreground" />
              <Text weight="bold" size="lg">
                {formatBedroomRange(property.bedroomsFrom, property.bedroomsTo)}
              </Text>
              <Text size="sm" variant="muted">Bedrooms</Text>
            </Stack>
            
            {property.bathrooms && (
              <Stack gap="xs" align="center">
                <BathIcon className="h-6 w-6 text-muted-foreground" />
                <Text weight="bold" size="lg">{property.bathrooms}</Text>
                <Text size="sm" variant="muted">Bathrooms</Text>
              </Stack>
            )}
            
            <Stack gap="xs" align="center">
              <RulerIcon className="h-6 w-6 text-muted-foreground" />
              <Text weight="bold" size="lg">
                {formatSizeRange(property.sizeFrom, property.sizeTo, property.sizeUnit)}
              </Text>
              <Text size="sm" variant="muted">Size</Text>
            </Stack>
            
            <Stack gap="xs" align="center">
              <Badge className="bg-emerald-500 text-white border-0 px-3 py-1">
                {statusBadge}
              </Badge>
              <Text size="sm" variant="muted">Status</Text>
            </Stack>
            
            {property.completionDate && (
              <Stack gap="xs" align="center">
                <CalendarIcon className="h-6 w-6 text-muted-foreground" />
                <Text weight="bold" size="lg">
                  {new Date(property.completionDate).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
                <Text size="sm" variant="muted">Completion</Text>
              </Stack>
            )}
          </Row>
        </Container>
      </Section>

      {/* Content */}
      <Section padding="xl">
        <Container size="xl">
          <Grid cols={3} gap="xl">
            {/* Main Content */}
            <Stack gap="xl" className="col-span-2">
              {/* Investment Rationale Card */}
              {investment?.reasonsToInvest && investment.reasonsToInvest.length > 0 && (
                <Card className="bg-slate-800 dark:bg-slate-900 text-white border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-white">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <LightbulbIcon className="h-5 w-5 text-emerald-400" />
                      </div>
                      Why Invest in {property.title}?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      {investment.reasonsToInvest.map((reason, index) => (
                        <Row key={index} gap="sm" align="start">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          <Text className="text-slate-200">{reason}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <Stack gap="md">
                <Title as="h2" size="h4" className="font-headline">About This Property</Title>
                <Text className="leading-relaxed whitespace-pre-line">
                  {property.description}
                </Text>
              </Stack>

              {/* Value Analysis Section */}
              {investment?.pricePerSqFt && investment?.areaAvgPricePerSqFt && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Value Analysis</Title>
                  <Grid cols={2} gap="md">
                    <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800">
                      <CardContent className="pt-6">
                        <Stack gap="sm" align="center" className="text-center">
                          <Text size="sm" variant="muted" className="uppercase tracking-wide">This Property</Text>
                          <Title as="div" size="h2" className="text-emerald-600 dark:text-emerald-400">
                            AED {investment.pricePerSqFt.toLocaleString()}
                          </Title>
                          <Text size="sm" variant="muted">per sq ft</Text>
                        </Stack>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <Stack gap="sm" align="center" className="text-center">
                          <Text size="sm" variant="muted" className="uppercase tracking-wide">Area Average</Text>
                          <Title as="div" size="h2">
                            AED {investment.areaAvgPricePerSqFt.toLocaleString()}
                          </Title>
                          <Text size="sm" variant="muted">per sq ft</Text>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Text size="sm" variant="muted" className="text-center">
                    {investment.pricePerSqFt > investment.areaAvgPricePerSqFt 
                      ? `Premium positioning reflects superior quality and brand value in ${property.location}`
                      : `Competitive pricing below area average offers strong value proposition`
                    }
                  </Text>
                </Stack>
              )}

              {/* Market Comparables Table */}
              {investment?.comparables && investment.comparables.length > 0 && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Market Comparables</Title>
                  <Card>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-4 font-medium text-sm">Project</th>
                            <th className="text-left p-4 font-medium text-sm">Location</th>
                            <th className="text-right p-4 font-medium text-sm">Price/sq ft</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {/* Current Property Row */}
                          {investment.pricePerSqFt && (
                            <tr className="bg-emerald-50 dark:bg-emerald-950/20">
                              <td className="p-4 font-medium text-emerald-700 dark:text-emerald-400">
                                {property.title} ★
                              </td>
                              <td className="p-4 text-emerald-700 dark:text-emerald-400">{property.location}</td>
                              <td className="p-4 text-right font-medium text-emerald-700 dark:text-emerald-400">
                                AED {investment.pricePerSqFt.toLocaleString()}
                              </td>
                            </tr>
                          )}
                          {/* Comparable Properties */}
                          {investment.comparables.map((comp, index) => (
                            <tr key={index}>
                              <td className="p-4">{comp.project}</td>
                              <td className="p-4 text-muted-foreground">{comp.location}</td>
                              <td className="p-4 text-right font-medium">
                                AED {comp.pricePerSqFt.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </Stack>
              )}

              {/* Features */}
              {property.features.length > 0 && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Key Features</Title>
                  <Grid cols={2} gap="sm">
                    {property.features.map((feature) => (
                      <Row key={feature} gap="sm" align="center">
                        <CheckCircleIcon className="h-4 w-4 text-primary shrink-0" />
                        <Text size="sm">{feature}</Text>
                      </Row>
                    ))}
                  </Grid>
                </Stack>
              )}

              {/* Location & Connectivity */}
              {investment?.locationHighlights && investment.locationHighlights.length > 0 && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Location & Connectivity</Title>
                  <Grid cols={3} gap="md">
                    {investment.locationHighlights.map((highlight, index) => {
                      // Choose icon based on destination name
                      const IconComponent = 
                        highlight.destination.toLowerCase().includes("airport") ? PlaneIcon :
                        highlight.destination.toLowerCase().includes("downtown") || 
                        highlight.destination.toLowerCase().includes("difc") ? Building2Icon :
                        CarIcon
                      
                      return (
                        <Card key={index}>
                          <CardContent className="pt-6">
                            <Stack gap="sm" align="center" className="text-center">
                              <div className="p-3 bg-primary/10 rounded-full">
                                <IconComponent className="h-6 w-6 text-primary" />
                              </div>
                              <Text weight="bold" size="lg">{highlight.time}</Text>
                              <Text size="sm" variant="muted">{highlight.destination}</Text>
                            </Stack>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </Grid>
                </Stack>
              )}

              {/* Gallery */}
              {property.images.length > 1 && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Gallery</Title>
                  <Grid cols={2} gap="md">
                    {property.images.slice(1).map((image, index) => (
                      <div key={index} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
                        <Image
                          src={image}
                          alt={`${property.title} - Image ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </Grid>
                </Stack>
              )}
            </Stack>

            {/* Sidebar */}
            <Stack gap="lg">
              {/* Property Details Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack gap="md">
                    {property.developer && (
                      <Row className="justify-between">
                        <Text size="sm" variant="muted">Developer</Text>
                        <Text size="sm" weight="medium">{property.developer}</Text>
                      </Row>
                    )}
                    <Row className="justify-between">
                      <Text size="sm" variant="muted">Property Type</Text>
                      <Text size="sm" weight="medium" className="capitalize">{property.type}</Text>
                    </Row>
                    <Row className="justify-between">
                      <Text size="sm" variant="muted">Location</Text>
                      <Text size="sm" weight="medium">{property.location}</Text>
                    </Row>
                    <Row className="justify-between items-center">
                      <Text size="sm" variant="muted">Status</Text>
                      <Badge className="bg-emerald-500 text-white border-0 text-xs">
                        {statusBadge}
                      </Badge>
                    </Row>
                    {investment?.estimatedRentalYield && (
                      <Row className="justify-between">
                        <Text size="sm" variant="muted">Est. Rental Yield</Text>
                        <Text size="sm" weight="medium" className="text-emerald-600 dark:text-emerald-400">
                          {investment.estimatedRentalYield}%
                        </Text>
                      </Row>
                    )}
                    {investment?.serviceCharge && (
                      <Row className="justify-between">
                        <Text size="sm" variant="muted">Service Charge</Text>
                        <Text size="sm" weight="medium">AED {investment.serviceCharge}/sq ft</Text>
                      </Row>
                    )}
                    
                    {/* Location Map Placeholder */}
                    <div className="mt-2 aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <Stack gap="xs" align="center">
                        <MapPinIcon className="h-8 w-8 text-muted-foreground/50" />
                        <Text size="sm" variant="muted">{property.location}</Text>
                      </Stack>
                    </div>
                  </Stack>
                </CardContent>
              </Card>

              {/* Developer Info Card */}
              {investment?.developerTrackRecord && property.developer && (
                <Card className="bg-slate-50 dark:bg-slate-900/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Building2Icon className="h-5 w-5 text-primary" />
                      </div>
                      {property.developer}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text size="sm" className="leading-relaxed">
                      {investment.developerTrackRecord}
                    </Text>
                  </CardContent>
                </Card>
              )}

              {/* CTA Card */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <Stack gap="md" align="center" className="text-center">
                    <Title as="h3" size="h5">Interested in this property?</Title>
                    <Text size="sm" className="opacity-90">
                      Contact us for more details, viewings, or investment analysis.
                    </Text>
                    <Button
                      nativeButton={false}
                      variant="secondary"
                      className="w-full"
                      render={<Link href="/contact" />}
                    >
                      Enquire Now
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Container>
      </Section>
    </Stack>
  )
}
