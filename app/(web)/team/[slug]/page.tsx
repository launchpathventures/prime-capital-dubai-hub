/**
 * CATALYST - Team Member Detail Page
 *
 * Individual team member profile with sophisticated layout.
 * Features: Hero with dark overlay, expertise card, credentials, contact CTA.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTeamMemberBySlug, getTeamMemberSlugs } from "@/lib/content"
import { Container, Section, Stack, Row, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
  CalendarIcon,
} from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getTeamMemberSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const member = await getTeamMemberBySlug(slug)
  
  if (!member) {
    return { title: "Team Member Not Found" }
  }

  return {
    title: `${member.name} | Prime Capital Dubai`,
    description: member.shortBio || member.bio?.slice(0, 160) || `Meet ${member.name}, ${member.role} at Prime Capital Dubai.`,
  }
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params
  const member = await getTeamMemberBySlug(slug)

  if (!member) {
    notFound()
  }

  // Use fullBio if available, otherwise fall back to shortBio/bio
  const bioContent = member.fullBio || member.shortBio || member.bio
  const hasExpertise = member.expertise && member.expertise.length > 0
  const hasBackground = member.background && member.background.length > 0

  return (
    <Stack gap="none">
      {/* Hero Section with Dark Overlay */}
      <Section padding="none" className="relative">
        <div className="relative min-h-[400px] md:min-h-[500px] bg-slate-900">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-primary/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
          
          {/* Back Button */}
          <div className="absolute top-6 left-6 z-10">
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Team
            </Link>
          </div>

          {/* Hero Content */}
          <Container size="xl" className="relative z-10 h-full">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 pt-24 pb-12 md:py-24">
              {/* Profile Photo */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/30 to-slate-700 shadow-2xl ring-4 ring-white/10">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UserIcon className="h-24 w-24 text-white/30" />
                  </div>
                )}
              </div>

              {/* Name, Role, Short Bio */}
              <Stack gap="md" className="text-center md:text-left">
                {member.isFounder && (
                  <Text size="sm" className="uppercase tracking-widest text-primary font-medium">
                    Founder
                  </Text>
                )}
                <Title as="h1" size="h1" className="font-headline text-white">
                  {member.name}
                </Title>
                <Text size="xl" className="text-slate-300">
                  {member.role}
                </Text>
                {member.shortBio && (
                  <Text className="text-slate-400 max-w-xl leading-relaxed">
                    {member.shortBio}
                  </Text>
                )}
                
                {/* Email Button */}
                {member.email && (
                  <div className="pt-2">
                    <Button
                      nativeButton={false}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 hover:text-white"
                      render={<a href={`mailto:${member.email}`} />}
                    >
                      <MailIcon className="mr-2 h-4 w-4" />
                      EMAIL
                    </Button>
                  </div>
                )}
              </Stack>
            </div>
          </Container>
        </div>
      </Section>

      {/* Content Section */}
      <Section padding="xl">
        <Container size="xl">
          <Grid cols={3} gap="xl">
            {/* Left Column: About + Credentials */}
            <Stack gap="xl" className="col-span-2">
              {/* Background & Experience */}
              <Stack gap="md">
                <Text size="sm" className="uppercase tracking-widest text-primary font-medium">
                  About
                </Text>
                <Title as="h2" size="h2" className="font-headline">
                  Background & Experience
                </Title>
                <Text className="leading-relaxed whitespace-pre-line text-muted-foreground">
                  {bioContent}
                </Text>
              </Stack>

              {/* Credentials Card */}
              {hasBackground && (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-headline">Credentials</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      {member.background.map((item, index) => (
                        <Row key={index} gap="sm" align="start">
                          <CheckCircleIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <Text>{item}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </Stack>

            {/* Right Column: Expertise + Contact */}
            <Stack gap="lg">
              {/* Areas of Expertise Card (Dark) */}
              {hasExpertise && (
                <Card className="bg-slate-800 dark:bg-slate-900 text-white border-0">
                  <CardHeader>
                    <CardTitle className="text-white font-headline">
                      Areas of Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Stack gap="sm">
                      {member.expertise.map((skill, index) => (
                        <Row key={index} gap="sm" align="center">
                          <CheckCircleIcon className="h-5 w-5 text-emerald-400 shrink-0" />
                          <Text className="text-slate-200">{skill}</Text>
                        </Row>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Get in Touch Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <Stack gap="md">
                    <Text size="sm" variant="muted">
                      Ready to discuss your investment goals? Connect with {member.name.split(" ")[0]} today.
                    </Text>
                    
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{member.email}</span>
                      </a>
                    )}
                    
                    {member.phone && (
                      <a
                        href={`tel:${member.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </a>
                    )}
                    
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                      >
                        <LinkedinIcon className="h-4 w-4 text-muted-foreground" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}

                    <div className="pt-2">
                      <Button
                        nativeButton={false}
                        className="w-full"
                        render={<Link href="/contact" />}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        SCHEDULE CONSULTATION
                      </Button>
                    </div>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Container>
      </Section>

      {/* Full-width Accent Section */}
      <Section padding="none" className="relative">
        <div className="relative h-48 md:h-64 bg-gradient-to-br from-slate-800 via-slate-900 to-primary/30">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      </Section>

      {/* CTA Section */}
      <Section padding="xl" className="bg-muted/30">
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title as="h2" size="h2" className="font-headline">
              Ready to invest in Dubai real estate?
            </Title>
            <Text variant="muted" className="max-w-xl">
              Our team of expert advisors is here to guide you through every step 
              of your investment journey in the UAE property market.
            </Text>
            <Row gap="md" className="flex-col sm:flex-row">
              <Button
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Get In Touch
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                render={<Link href="/team" />}
              >
                Meet the Team
              </Button>
            </Row>
          </Stack>
        </Container>
      </Section>
    </Stack>
  )
}
