/**
 * CATALYST - Property Detail Page
 *
 * Individual property listing with full details.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getPropertyBySlug, getProperties, formatPriceRange, formatBedroomRange, formatSizeRange } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  CalendarIcon,
  BuildingIcon,
  CheckCircleIcon,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const properties = getProperties()
  return properties.map((property) => ({
    slug: property.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)
  
  if (!property) {
    return { title: "Property Not Found" }
  }

  return {
    title: `${property.title} | Prime Capital Dubai`,
    description: property.description.slice(0, 160),
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)

  if (!property) {
    notFound()
  }

  const statusBadge = property.completionStatus === "off-plan" ? "Off-Plan" : "Ready"
  const statusVariant = property.completionStatus === "off-plan" ? "secondary" : "default"

  return (
    <Stack gap="none">
      {/* Back Link */}
      <Section padding="sm" className="border-b">
        <Container size="xl">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Properties
          </Link>
        </Container>
      </Section>

      {/* Hero Image */}
      <Section padding="none">
        <div className="relative aspect-[21/9] bg-muted">
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
        </div>
      </Section>

      {/* Content */}
      <Section padding="xl">
        <Container size="xl">
          <Grid cols={3} gap="xl">
            {/* Main Content */}
            <Stack gap="xl" className="col-span-2">
              {/* Header */}
              <Stack gap="md">
                <Row gap="md" align="center" wrap>
                  <Badge variant={statusVariant}>{statusBadge}</Badge>
                  <Badge variant="outline" className="capitalize">{property.type}</Badge>
                </Row>

                <Title as="h1" size="h1" className="font-headline">
                  {property.title}
                </Title>

                <Row gap="sm" align="center" className="text-muted-foreground">
                  <MapPinIcon className="h-4 w-4" />
                  <Text>{property.location}</Text>
                  {property.developer && (
                    <>
                      <span className="mx-2">•</span>
                      <Text>by {property.developer}</Text>
                    </>
                  )}
                </Row>
              </Stack>

              {/* Description */}
              <Stack gap="md">
                <Title as="h2" size="h4" className="font-headline">About This Property</Title>
                <Text className="leading-relaxed whitespace-pre-line">
                  {property.description}
                </Text>
              </Stack>

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
              {/* Price Card */}
              <Card>
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <Text size="sm" variant="muted">Price Range</Text>
                    <Title as="div" size="h2" className="text-primary">
                      {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
                    </Title>

                    <div className="h-px bg-border my-2" />

                    {/* Specs */}
                    <Grid cols={2} gap="md">
                      <Stack gap="xs">
                        <Row gap="sm" align="center" className="text-muted-foreground">
                          <BedDoubleIcon className="h-4 w-4" />
                          <Text size="sm">Bedrooms</Text>
                        </Row>
                        <Text weight="medium">
                          {formatBedroomRange(property.bedroomsFrom, property.bedroomsTo)}
                        </Text>
                      </Stack>

                      <Stack gap="xs">
                        <Row gap="sm" align="center" className="text-muted-foreground">
                          <RulerIcon className="h-4 w-4" />
                          <Text size="sm">Size</Text>
                        </Row>
                        <Text weight="medium">
                          {formatSizeRange(property.sizeFrom, property.sizeTo, property.sizeUnit)}
                        </Text>
                      </Stack>

                      {property.completionDate && (
                        <Stack gap="xs" className="col-span-2">
                          <Row gap="sm" align="center" className="text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <Text size="sm">Completion</Text>
                          </Row>
                          <Text weight="medium">
                            {new Date(property.completionDate).toLocaleDateString("en-GB", {
                              month: "long",
                              year: "numeric",
                            })}
                          </Text>
                        </Stack>
                      )}
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>

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
