/**
 * CATALYST - Properties Listing Page
 *
 * Portfolio of Prime Capital Dubai's curated properties.
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { getProperties } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { PropertyCard } from "@/components/shared"
import { ArrowRightIcon } from "lucide-react"

export const metadata = {
  title: "Properties | Prime Capital Dubai",
  description: "Curated selection of premium Dubai real estate opportunities.",
}

export default async function PropertiesPage() {
  const properties = await getProperties()

  if (!config.features.properties) {
    return (
      <Section padding="xl">
        <Container size="lg">
          <Stack gap="md" align="center" className="text-center py-20">
            <Title as="h1" size="h2" className="font-headline">
              Properties Coming Soon
            </Title>
            <Text variant="muted" className="max-w-md">
              Our curated portfolio is being prepared. Contact us directly to discuss 
              available opportunities.
            </Text>
            <Button
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </Section>
    )
  }

  return (
    <Stack gap="none">
      {/* Hero */}
      <Section padding="xl" className="bg-gradient-to-b from-primary/5 to-background">
        <Container size="lg">
          <Stack gap="lg" align="center" className="text-center max-w-3xl mx-auto">
            <Title as="h1" size="h1" className="font-headline">
              Curated <span className="text-primary">Portfolio</span>
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              A carefully selected collection of premium Dubai properties, each representing 
              exceptional value and investment potential.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Properties Grid */}
      <Section padding="xl">
        <Container size="xl">
          {properties.length > 0 ? (
            <Grid cols={3} gap="lg">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </Grid>
          ) : (
            <Stack gap="md" align="center" className="text-center py-12">
              <Text variant="muted">
                No properties currently available. Contact us to discuss off-market opportunities.
              </Text>
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/contact" />}
              >
                Contact Us
              </Button>
            </Stack>
          )}
        </Container>
      </Section>

      {/* CTA */}
      <Section padding="xl" className="bg-muted/30">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">
              Looking for something specific?
            </Title>
            <Text variant="muted" className="max-w-xl">
              Our portfolio represents only a fraction of available opportunities. 
              Tell us what you're looking for and we'll source properties that match your criteria.
            </Text>
            <Row gap="md" justify="center" className="flex-col sm:flex-row">
              <Button
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Discuss Requirements
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/strategy-kit" />}
              >
                Get Strategy Kit
              </Button>
            </Row>
          </Stack>
        </Container>
      </Section>
    </Stack>
  )
}
