/**
 * CATALYST - Prime Capital Dubai Homepage
 *
 * The main public-facing landing page for Prime Capital Dubai.
 * Trust-first approach: brand positioning before property content.
 */

import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import {
  getProperties,
  getTeamMembers,
  getTestimonials,
  getStats,
  getServices,
} from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PropertyCard, TeamCard, TestimonialCard, StatsBar } from "@/components/shared"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BuildingIcon,
  UsersIcon,
  TrendingUpIcon,
  MapPinIcon,
} from "lucide-react"

export default function HomePage() {
  const properties = getProperties().slice(0, 3) // Featured properties
  const team = getTeamMembers().slice(0, 3) // Featured team
  const testimonials = getTestimonials()
  const stats = getStats()
  const services = getServices()

  return (
    <Stack gap="none" className="overflow-hidden">
      <HeroSection />
      <StatsSection stats={stats} />
      <PositioningSection />
      <ServicesSection services={services} />
      {config.features.properties && properties.length > 0 && (
        <PropertiesSection properties={properties} />
      )}
      <TestimonialsSection testimonials={testimonials} />
      {config.features.team && team.length > 0 && (
        <TeamSection team={team} />
      )}
      <CTASection />
    </Stack>
  )
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <Section padding="xl" className="relative min-h-[80vh] flex items-center bg-gradient-to-b from-primary/5 to-background">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Container size="xl">
        <Grid cols={2} gap="xl" className="items-center">
          {/* Left: Content */}
          <Stack gap="lg" className="max-w-xl">
            <Badge variant="secondary" className="w-fit">
              Boutique Real Estate Advisory
            </Badge>

            <Title as="h1" size="h1" className="font-headline text-5xl md:text-6xl lg:text-7xl leading-tight">
              We move complexity{" "}
              <span className="text-primary">out of sight</span>.
            </Title>

            <Text size="lg" className="text-muted-foreground leading-relaxed">
              {config.app.description}
            </Text>

            <Row gap="md" className="pt-4 flex-col sm:flex-row">
              <Button
                nativeButton={false}
                size="lg"
                className="h-12 px-8"
                render={<Link href="/strategy-kit" />}
              >
                Download Strategy Kit
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                size="lg"
                className="h-12 px-8"
                render={<Link href="/contact" />}
              >
                Speak With Us
              </Button>
            </Row>
          </Stack>

          {/* Right: Image placeholder */}
          <div className="hidden lg:block relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <BuildingIcon className="h-24 w-24 text-primary/30 mx-auto mb-4" />
                <Text variant="muted">Premium Property Image</Text>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </Section>
  )
}

// =============================================================================
// STATS SECTION
// =============================================================================

function StatsSection({ stats }: { stats: ReturnType<typeof getStats> }) {
  return (
    <Section padding="none">
      <Container size="xl">
        <StatsBar stats={stats} />
      </Container>
    </Section>
  )
}

// =============================================================================
// POSITIONING SECTION
// =============================================================================

function PositioningSection() {
  return (
    <Section padding="xl" className="bg-muted/30">
      <Container size="lg">
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" className="max-w-2xl text-center">
            <Title as="h2" size="h2" className="font-headline">
              In a market saturated with noise,{" "}
              <span className="text-primary">we chose a different path</span>.
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              Prime Capital exists as the antidote to the typical Dubai real estate experience.
              No pressure, no hype—just honest guidance from advisors who understand sophisticated investors.
            </Text>
          </Stack>

          <Grid cols={3} gap="lg" className="w-full">
            <Stack gap="md" className="p-6 rounded-xl bg-background border">
              <ShieldCheckIcon className="h-10 w-10 text-primary" />
              <Title as="h3" size="h4" className="font-headline">Discretion First</Title>
              <Text size="sm" variant="muted">
                Your investment decisions remain private. We earn trust through restraint, not aggressive pitches.
              </Text>
            </Stack>

            <Stack gap="md" className="p-6 rounded-xl bg-background border">
              <TrendingUpIcon className="h-10 w-10 text-primary" />
              <Title as="h3" size="h4" className="font-headline">Data-Led Insight</Title>
              <Text size="sm" variant="muted">
                Every recommendation is backed by rigorous market analysis and decades of local expertise.
              </Text>
            </Stack>

            <Stack gap="md" className="p-6 rounded-xl bg-background border">
              <UsersIcon className="h-10 w-10 text-primary" />
              <Title as="h3" size="h4" className="font-headline">Long-Term Partnership</Title>
              <Text size="sm" variant="muted">
                We succeed when you succeed. 94% of our clients return for additional investments.
              </Text>
            </Stack>
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// SERVICES SECTION
// =============================================================================

function ServicesSection({ services }: { services: ReturnType<typeof getServices> }) {
  return (
    <Section padding="xl">
      <Container size="xl">
        <Stack gap="xl">
          <Stack gap="md" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">How We Help</Title>
            <Text size="lg" variant="muted" className="max-w-2xl">
              From initial strategy through ongoing asset management, we provide comprehensive support
              for international investors in Dubai's premium property market.
            </Text>
          </Stack>

          <Grid cols={2} gap="lg">
            {services.map((service) => (
              <Stack
                key={service.id}
                gap="md"
                className="p-6 rounded-xl border bg-card hover:border-primary/30 transition-colors"
              >
                <Title as="h3" size="h4" className="font-headline">{service.title}</Title>
                <Text size="sm" variant="muted" className="line-clamp-2">
                  {service.description}
                </Text>
                <ul className="space-y-2">
                  {service.features.slice(0, 3).map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </Stack>
            ))}
          </Grid>

          <Row justify="center">
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/services" />}
            >
              View All Services
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Row>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// PROPERTIES SECTION
// =============================================================================

function PropertiesSection({ properties }: { properties: ReturnType<typeof getProperties> }) {
  return (
    <Section padding="xl" className="bg-muted/30">
      <Container size="xl">
        <Stack gap="xl">
          <Row justify="between" align="end" className="flex-col sm:flex-row gap-4">
            <Stack gap="sm">
              <Title as="h2" size="h2" className="font-headline">Featured Properties</Title>
              <Text variant="muted">
                A curated selection from our portfolio of premium Dubai real estate.
              </Text>
            </Stack>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/properties" />}
            >
              View All Properties
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Row>

          <Grid cols={3} gap="lg">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// TESTIMONIALS SECTION
// =============================================================================

function TestimonialsSection({ testimonials }: { testimonials: ReturnType<typeof getTestimonials> }) {
  if (testimonials.length === 0) return null

  return (
    <Section padding="xl">
      <Container size="xl">
        <Stack gap="xl">
          <Stack gap="md" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">What Our Clients Say</Title>
            <Text variant="muted" className="max-w-2xl">
              Trusted by sophisticated investors across Europe, Asia, and the Middle East.
            </Text>
          </Stack>

          <Grid cols={3} gap="lg">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// TEAM SECTION
// =============================================================================

function TeamSection({ team }: { team: ReturnType<typeof getTeamMembers> }) {
  return (
    <Section padding="xl" className="bg-muted/30">
      <Container size="xl">
        <Stack gap="xl">
          <Row justify="between" align="end" className="flex-col sm:flex-row gap-4">
            <Stack gap="sm">
              <Title as="h2" size="h2" className="font-headline">Meet Our Team</Title>
              <Text variant="muted">
                Experienced advisors dedicated to your investment success.
              </Text>
            </Stack>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/team" />}
            >
              View Full Team
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Row>

          <Grid cols={3} gap="lg">
            {team.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
    <Section padding="xl" className="bg-primary text-primary-foreground">
      <Container size="md">
        <Stack gap="lg" align="center" className="text-center">
          <Title as="h2" size="h2" className="font-headline">
            Ready to explore Dubai real estate?
          </Title>
          <Text size="lg" className="opacity-90 max-w-xl">
            Download our Strategy Kit for a comprehensive overview of Dubai's property market,
            or speak directly with our advisory team.
          </Text>
          <Row gap="md" justify="center" className="pt-4 flex-col sm:flex-row">
            <Button
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="h-12 px-8"
              render={<Link href="/strategy-kit" />}
            >
              Get Strategy Kit
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              className="h-12 px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              render={<Link href="/contact" />}
            >
              Contact Us
            </Button>
          </Row>
        </Stack>
      </Container>
    </Section>
  )
}
