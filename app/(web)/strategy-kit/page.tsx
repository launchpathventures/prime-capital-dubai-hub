/**
 * CATALYST - Strategy Kit Page
 *
 * Lead magnet download page for Prime Capital Dubai.
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/shared"
import {
  ArrowRightIcon,
  CheckCircleIcon,
  FileTextIcon,
  TrendingUpIcon,
  MapIcon,
  ShieldCheckIcon,
} from "lucide-react"

export const metadata = {
  title: "Dubai Investment Strategy Kit | Prime Capital Dubai",
  description: "Download our comprehensive guide to Dubai real estate investment.",
}

export default function StrategyKitPage() {
  return (
    <Stack gap="none">
      {/* Hero */}
      <Section padding="xl" className="bg-gradient-to-b from-primary/5 to-background">
        <Container size="xl">
          <Grid cols={2} gap="xl" className="items-center">
            {/* Content */}
            <Stack gap="lg">
              <Title as="h1" size="h1" className="font-headline">
                Dubai Investment{" "}
                <span className="text-primary">Strategy Kit</span>
              </Title>
              <Text size="lg" variant="muted" className="leading-relaxed">
                A comprehensive guide to Dubai's premium real estate market, designed 
                for sophisticated investors seeking informed decision-making.
              </Text>

              <Stack gap="sm">
                {[
                  "Market overview and current trends",
                  "Investment structures and tax implications",
                  "Due diligence checklist for international buyers",
                  "Golden Visa qualification pathways",
                  "Risk assessment framework",
                ].map((item) => (
                  <Row key={item} gap="sm" align="center">
                    <CheckCircleIcon className="h-5 w-5 text-primary shrink-0" />
                    <Text>{item}</Text>
                  </Row>
                ))}
              </Stack>
            </Stack>

            {/* Preview Image */}
            <div className="hidden lg:block">
              <Card className="overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <Stack gap="md" align="center">
                    <FileTextIcon className="h-24 w-24 text-primary/30" />
                    <Text variant="muted">Strategy Kit Preview</Text>
                  </Stack>
                </div>
              </Card>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* What's Inside */}
      <Section padding="xl" className="bg-muted/30">
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="md" align="center" className="text-center">
              <Title as="h2" size="h2" className="font-headline">What's Inside</Title>
              <Text variant="muted" className="max-w-2xl">
                40+ pages of actionable insights and analysis to inform your Dubai investment decisions.
              </Text>
            </Stack>

            <Grid cols={3} gap="lg">
              <Card>
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUpIcon className="h-6 w-6 text-primary" />
                    </div>
                    <Title as="h3" size="h5" className="font-headline">Market Analysis</Title>
                    <Text size="sm" variant="muted">
                      Current market conditions, price trends, and forecasts from 
                      leading analysts and our own research.
                    </Text>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapIcon className="h-6 w-6 text-primary" />
                    </div>
                    <Title as="h3" size="h5" className="font-headline">Area Guides</Title>
                    <Text size="sm" variant="muted">
                      Detailed profiles of Dubai's premium districts, including 
                      rental yields, capital appreciation, and buyer demographics.
                    </Text>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShieldCheckIcon className="h-6 w-6 text-primary" />
                    </div>
                    <Title as="h3" size="h5" className="font-headline">Risk Framework</Title>
                    <Text size="sm" variant="muted">
                      Objective assessment of market risks and mitigation strategies 
                      for international investors.
                    </Text>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* Download Form */}
      <Section padding="xl">
        <Container size="md">
          <Stack gap="xl" align="center">
            <Stack gap="md" align="center" className="text-center">
              <Title as="h2" size="h2" className="font-headline">
                Download Your Copy
              </Title>
              <Text variant="muted" className="max-w-xl">
                Enter your details below to receive instant access to the Strategy Kit. 
                We'll also send you occasional market updates (you can unsubscribe anytime).
              </Text>
            </Stack>

            <div className="w-full max-w-lg">
              <LeadForm formId={config.forms.strategyKit} minHeight={400} />
            </div>

            <Text size="sm" variant="muted" className="text-center max-w-md">
              By downloading, you agree to receive communications from Prime Capital Dubai. 
              We respect your privacy and will never share your information.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* CTA */}
      <Section padding="xl" className="bg-primary text-primary-foreground">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">
              Prefer to speak directly?
            </Title>
            <Text size="lg" className="opacity-90 max-w-xl">
              Our team is available to answer questions and discuss your specific 
              investment objectives.
            </Text>
            <Button
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="h-12 px-8"
              render={<Link href="/contact" />}
            >
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </Section>
    </Stack>
  )
}
