/**
 * CATALYST - Team Member Detail Page
 *
 * Individual team member profile.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTeamMemberBySlug, getTeamMembers } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const team = getTeamMembers()
  return team.map((member) => ({
    slug: member.slug,
  }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)
  
  if (!member) {
    return { title: "Team Member Not Found" }
  }

  return {
    title: `${member.name} | Prime Capital Dubai`,
    description: member.bio.slice(0, 160),
  }
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params
  const member = getTeamMemberBySlug(slug)

  if (!member) {
    notFound()
  }

  return (
    <Stack gap="none">
      {/* Back Link */}
      <Section padding="sm" className="border-b">
        <Container size="xl">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Team
          </Link>
        </Container>
      </Section>

      {/* Content */}
      <Section padding="xl">
        <Container size="lg">
          <Grid cols={3} gap="xl">
            {/* Image & Contact */}
            <Stack gap="lg">
              {/* Profile Image */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                {member.imageUrl ? (
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserIcon className="h-24 w-24 text-primary/30" />
                  </div>
                )}
              </div>

              {/* Contact Card */}
              <Card>
                <CardContent className="pt-6">
                  <Stack gap="md">
                    <Title as="h3" size="h5" className="font-headline">Contact</Title>
                    
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <MailIcon className="h-4 w-4" />
                        <span>{member.email}</span>
                      </a>
                    )}
                    
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                    
                    {member.linkedinUrl && (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>

            {/* Bio & Expertise */}
            <Stack gap="xl" className="col-span-2">
              <Stack gap="md">
                <Title as="h1" size="h1" className="font-headline">
                  {member.name}
                </Title>
                <Text size="lg" className="text-primary">
                  {member.role}
                </Text>
              </Stack>

              <Stack gap="md">
                <Title as="h2" size="h4" className="font-headline">About</Title>
                <Text className="leading-relaxed whitespace-pre-line">
                  {member.bio}
                </Text>
              </Stack>

              {member.expertise.length > 0 && (
                <Stack gap="md">
                  <Title as="h2" size="h4" className="font-headline">Areas of Expertise</Title>
                  <Row gap="sm" wrap>
                    {member.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </Row>
                </Stack>
              )}

              {/* CTA */}
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <Row justify="between" align="center" className="flex-col sm:flex-row gap-4">
                    <Stack gap="xs">
                      <Title as="h3" size="h5">Ready to connect?</Title>
                      <Text size="sm" className="opacity-90">
                        Schedule a consultation with {member.name.split(" ")[0]}.
                      </Text>
                    </Stack>
                    <Button
                      nativeButton={false}
                      variant="secondary"
                      render={<Link href="/contact" />}
                    >
                      Get In Touch
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </Row>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Container>
      </Section>
    </Stack>
  )
}
