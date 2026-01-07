/**
 * CATALYST - Team Listing Page
 *
 * Meet the Prime Capital Dubai team.
 */

import Link from "next/link"
import { config } from "@/lib/config"
import { getTeamMembers } from "@/lib/content"
import { Container, Section, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { TeamCard } from "@/components/shared"
import { ArrowRightIcon } from "lucide-react"

export const metadata = {
  title: "Our Team | Prime Capital Dubai",
  description: "Meet the experienced advisors at Prime Capital Dubai.",
}

export default async function TeamPage() {
  const team = await getTeamMembers()

  if (!config.features.team) {
    return (
      <Section padding="xl">
        <Container size="lg">
          <Stack gap="md" align="center" className="text-center py-20">
            <Title as="h1" size="h2" className="font-headline">
              Team Profiles Coming Soon
            </Title>
            <Text variant="muted" className="max-w-md">
              We're preparing our team profiles. Contact us to connect directly with our advisors.
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
              Meet Our <span className="text-primary">Team</span>
            </Title>
            <Text size="lg" variant="muted" className="leading-relaxed">
              Experienced advisors with deep Dubai market knowledge, dedicated to 
              helping sophisticated investors achieve their real estate objectives.
            </Text>
          </Stack>
        </Container>
      </Section>

      {/* Team Grid */}
      <Section padding="xl">
        <Container size="xl">
          {team.length > 0 ? (
            <Grid cols={3} gap="lg">
              {team.map((member) => (
                <TeamCard key={member.id} member={member} />
              ))}
            </Grid>
          ) : (
            <Stack gap="md" align="center" className="text-center py-12">
              <Text variant="muted">
                Team profiles are being prepared. Contact us to connect with our advisors.
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
              Ready to connect?
            </Title>
            <Text variant="muted" className="max-w-xl">
              Schedule a consultation with one of our advisors to discuss your investment goals.
            </Text>
            <Button
              nativeButton={false}
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
