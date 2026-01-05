/**
 * CATALYST - Services Page
 *
 * Prime Capital Dubai's service offerings.
 */

import Link from "next/link"
import { getServices } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  TargetIcon,
  BuildingIcon,
  BadgeCheckIcon,
  TrendingUpIcon,
} from "lucide-react"

export const metadata = {
  title: "Services | Prime Capital Dubai",
  description: "Investment advisory, acquisition support, Golden Visa guidance, and asset management.",
}

const iconMap: Record<string, typeof TargetIcon> = {
  target: TargetIcon,
  building: BuildingIcon,
  passport: BadgeCheckIcon,
  chart: TrendingUpIcon,
}

export default function ServicesPage() {
  const services = getServices()

  return (
    <Stack gap="none">
      {/* Hero */}
      <Section padding="xl" className="bg-gradient-to-b from-primary/5 to-background">
        <Container size="lg">
          <Stack gap="lg" align="center" className="text-center max-w-3xl mx-auto">
            <Title as="h1" size="h1" className="font-headline">
              How We <span className="text-primary">Help</span>
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              From initial strategy through ongoing asset management, we provide comprehensive 
              support for international investors in Dubai's premium property market.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section padding="xl">
        <Container size="xl">
          <Grid cols={2} gap="lg">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || TargetIcon
              return (
                <Card key={service.id} className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <Row gap="md" align="center">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <Title as="h2" size="h3" className="font-headline">
                        {service.title}
                      </Title>
                    </Row>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Stack gap="md">
                      <Text className="leading-relaxed">{service.description}</Text>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <CheckCircleIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </Stack>
                  </CardContent>
                </Card>
              )
            })}
          </Grid>
        </Container>
      </Section>

      {/* Process */}
      <Section padding="xl" className="bg-muted/30">
        <Container size="lg">
          <Stack gap="xl">
            <Stack gap="md" align="center" className="text-center">
              <Title as="h2" size="h2" className="font-headline">Our Process</Title>
              <Text variant="muted" className="max-w-2xl">
                Every engagement follows a structured approach designed to ensure 
                alignment with your investment goals.
              </Text>
            </Stack>

            <Grid cols={4} gap="lg">
              {[
                { step: "01", title: "Discovery", desc: "Understanding your goals, timeline, and risk profile" },
                { step: "02", title: "Strategy", desc: "Market analysis and tailored recommendations" },
                { step: "03", title: "Execution", desc: "Seamless transaction management and coordination" },
                { step: "04", title: "Ongoing Support", desc: "Asset management and portfolio optimization" },
              ].map((item) => (
                <Stack key={item.step} gap="md" align="center" className="text-center">
                  <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {item.step}
                  </div>
                  <Title as="h3" size="h5" className="font-headline">{item.title}</Title>
                  <Text size="sm" variant="muted">{item.desc}</Text>
                </Stack>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* CTA */}
      <Section padding="xl" className="bg-primary text-primary-foreground">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">
              Ready to get started?
            </Title>
            <Text size="lg" className="opacity-90 max-w-xl">
              Schedule a consultation to discuss how we can support your Dubai real estate objectives.
            </Text>
            <Button
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="h-12 px-8"
              render={<Link href="/contact" />}
            >
              Schedule Consultation
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </Section>
    </Stack>
  )
}
