/**
 * CATALYST - About Page
 *
 * Prime Capital Dubai's story, values, and approach.
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { getStats, getTeamMembers } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { TeamCard, StatsBar } from "@/components/shared"
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  TargetIcon,
  HeartHandshakeIcon,
  AwardIcon,
} from "lucide-react"

export const metadata = {
  title: "About Us | Prime Capital Dubai",
  description: "Learn about Prime Capital Dubai's boutique approach to real estate advisory.",
}

export default function AboutPage() {
  const stats = getStats()
  const team = getTeamMembers()

  return (
    <Stack gap="none">
      {/* Hero */}
      <Section padding="xl" className="bg-gradient-to-b from-primary/5 to-background">
        <Container size="lg">
          <Stack gap="lg" align="center" className="text-center max-w-3xl mx-auto">
            <Title as="h1" size="h1" className="font-headline">
              The antidote to the{" "}
              <span className="text-primary">Dubai hustle</span>.
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              In a market saturated with noise and aggressive sales tactics, Prime Capital exists 
              to serve sophisticated investors who value discretion, expertise, and integrity.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Stats */}
      <Section padding="none">
        <Container size="xl">
          <StatsBar stats={stats} />
        </Container>
      </Section>

      {/* Story */}
      <Section padding="xl">
        <Container size="lg">
          <Grid cols={2} gap="xl" className="items-center">
            <Stack gap="lg">
              <Title as="h2" size="h2" className="font-headline">Our Story</Title>
              <Stack gap="md">
                <Text className="leading-relaxed">
                  Prime Capital Dubai was founded on a simple observation: the most successful 
                  international investors don't respond to pushy sales tactics. They respond to 
                  expertise, transparency, and genuine partnership.
                </Text>
                <Text className="leading-relaxed">
                  Our founders spent years in the Dubai market, witnessing both the remarkable 
                  opportunities and the frustrating experiences that sophisticated buyers often face. 
                  We built Prime Capital to be different—a boutique advisory that treats every 
                  client relationship as a long-term partnership.
                </Text>
                <Text className="leading-relaxed">
                  Today, we serve a select group of HNW individuals, family offices, and 
                  professional referrers who appreciate our restrained approach and deep market 
                  knowledge.
                </Text>
              </Stack>
            </Stack>

            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl aspect-square flex items-center justify-center">
              <Text variant="muted">Office / Team Image</Text>
            </div>
          </Grid>
        </Container>
      </Section>

      {/* Values */}
      <Section padding="xl" className="bg-muted/30">
        <Container size="xl">
          <Stack gap="xl">
            <Stack gap="md" align="center" className="text-center">
              <Title as="h2" size="h2" className="font-headline">Our Values</Title>
              <Text variant="muted" className="max-w-2xl">
                The principles that guide every client interaction and investment recommendation.
              </Text>
            </Stack>

            <Grid cols={4} gap="lg">
              <Stack gap="md" className="p-6 rounded-xl bg-background border text-center">
                <ShieldCheckIcon className="h-10 w-10 text-primary mx-auto" />
                <Title as="h3" size="h5" className="font-headline">Discretion</Title>
                <Text size="sm" variant="muted">
                  Your investments remain private. We never pressure, never overshare.
                </Text>
              </Stack>

              <Stack gap="md" className="p-6 rounded-xl bg-background border text-center">
                <TargetIcon className="h-10 w-10 text-primary mx-auto" />
                <Title as="h3" size="h5" className="font-headline">Expertise</Title>
                <Text size="sm" variant="muted">
                  Deep market knowledge and rigorous analysis behind every recommendation.
                </Text>
              </Stack>

              <Stack gap="md" className="p-6 rounded-xl bg-background border text-center">
                <HeartHandshakeIcon className="h-10 w-10 text-primary mx-auto" />
                <Title as="h3" size="h5" className="font-headline">Integrity</Title>
                <Text size="sm" variant="muted">
                  We say no to deals that don't fit. Your success is our only measure.
                </Text>
              </Stack>

              <Stack gap="md" className="p-6 rounded-xl bg-background border text-center">
                <AwardIcon className="h-10 w-10 text-primary mx-auto" />
                <Title as="h3" size="h5" className="font-headline">Excellence</Title>
                <Text size="sm" variant="muted">
                  Uncompromising standards in every aspect of our service.
                </Text>
              </Stack>
            </Grid>
          </Stack>
        </Container>
      </Section>

      {/* Team Preview */}
      {config.features.team && team.length > 0 && (
        <Section padding="xl">
          <Container size="xl">
            <Stack gap="xl">
              <Row justify="between" align="end" className="flex-col sm:flex-row gap-4">
                <Stack gap="sm">
                  <Title as="h2" size="h2" className="font-headline">Our Team</Title>
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
                {team.slice(0, 3).map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </Grid>
            </Stack>
          </Container>
        </Section>
      )}

      {/* CTA */}
      <Section padding="xl" className="bg-primary text-primary-foreground">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">
              Ready to start the conversation?
            </Title>
            <Text size="lg" className="opacity-90 max-w-xl">
              No pressure, no obligation. Let's discuss whether Dubai real estate 
              makes sense for your portfolio.
            </Text>
            <Button
              nativeButton={false}
              variant="secondary"
              size="lg"
              className="h-12 px-8"
              render={<Link href="/contact" />}
            >
              Get In Touch
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </Section>
    </Stack>
  )
}
