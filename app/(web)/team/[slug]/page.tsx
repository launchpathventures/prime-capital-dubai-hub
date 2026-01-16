/**
 * CATALYST - Team Member Detail Page
 *
 * Individual team member profile with brand styling.
 * Features: Hero with photo, expertise card, credentials, contact CTA.
 */

import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTeamMemberBySlug, getTeamMemberSlugs } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  LinkedinIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
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
    <div className="web-team-member">
      {/* Hero Section */}
      <section
        className="relative min-h-[50vh] flex flex-col justify-center"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(63,65,66,0.98) 0%, rgba(63,65,66,0.85) 50%, rgba(63,65,66,0.7) 100%)`,
          backgroundColor: "var(--web-ash)",
        }}
      >
        {/* Back Button */}
        <div className="absolute top-24 left-6 z-10">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-[2px] text-white text-[13px] hover:bg-white/20 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Team
          </Link>
        </div>

        <Container size="xl" className="py-20">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Photo */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-[2px] overflow-hidden bg-[var(--web-spruce)]">
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
                  <UserIcon className="h-24 w-24 text-[var(--web-serenity)]/50" />
                </div>
              )}
            </div>

            {/* Name, Role, Short Bio */}
            <Stack gap="md" className="text-center md:text-left">
              {member.isFounder && (
                <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
                  Founder
                </span>
              )}
              <h1 className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.1]">
                {member.name}
              </h1>
              <div className="text-[var(--web-serenity)] text-[18px] font-light">
                {member.role}
              </div>
              {member.shortBio && (
                <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-xl">
                  {member.shortBio}
                </Text>
              )}
              
              {/* Contact Button */}
              {member.email && (
                <div className="pt-2">
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[var(--web-off-white)] border border-[var(--web-off-white)]/50 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] transition-colors"
                  >
                    <MailIcon className="h-4 w-4" />
                    Email
                  </a>
                </div>
              )}
            </Stack>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Grid cols={1} className="lg:grid-cols-[2fr_1fr] gap-12">
            {/* Left Column: About + Credentials */}
            <Stack gap="xl">
              {/* Background & Experience */}
              <div>
                <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-3">
                  About
                </span>
                <Title as="h2" className="font-headline text-[var(--web-ash)] text-[clamp(24px,3vw,32px)] font-normal mb-6">
                  Background & Experience
                </Title>
                <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed whitespace-pre-line">
                  {bioContent}
                </Text>
              </div>

              {/* Credentials */}
              {hasBackground && (
                <div className="bg-white rounded-[2px] p-6 shadow-sm">
                  <Title as="h3" className="font-headline text-[var(--web-ash)] text-lg font-normal mb-6">
                    Credentials
                  </Title>
                  <Stack gap="sm">
                    {member.background.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckIcon className="h-5 w-5 text-[var(--web-spruce)] shrink-0 mt-0.5" />
                        <Text className="text-[var(--web-spruce)] text-[14px] font-light">{item}</Text>
                      </div>
                    ))}
                  </Stack>
                </div>
              )}
            </Stack>

            {/* Right Column: Expertise + Contact */}
            <Stack gap="lg">
              {/* Areas of Expertise Card */}
              {hasExpertise && (
                <div className="bg-[var(--web-ash)] rounded-[2px] p-6">
                  <Title as="h3" className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-6">
                    Areas of Expertise
                  </Title>
                  <Stack gap="sm">
                    {member.expertise.map((skill, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckIcon className="h-5 w-5 text-[var(--web-serenity)] shrink-0" />
                        <Text className="text-white/80 text-[14px] font-light">{skill}</Text>
                      </div>
                    ))}
                  </Stack>
                </div>
              )}

              {/* Get in Touch Card */}
              <div className="bg-white rounded-[2px] p-6 shadow-sm">
                <Title as="h3" className="font-headline text-[var(--web-ash)] text-lg font-normal mb-4">
                  Get in Touch
                </Title>
                <Text className="text-[var(--web-spruce)] text-[13px] font-light mb-6">
                  Ready to discuss your investment goals? Connect with {member.name.split(" ")[0]} today.
                </Text>
                
                <Stack gap="md">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-3 text-[var(--web-spruce)] text-[14px] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <MailIcon className="h-4 w-4" />
                      <span>{member.email}</span>
                    </a>
                  )}
                  
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-3 text-[var(--web-spruce)] text-[14px] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      <span>{member.phone}</span>
                    </a>
                  )}
                  
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--web-spruce)] text-[14px] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  )}

                  <div className="pt-4">
                    <Button
                      className="w-full h-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
                      render={<Link href="/contact" />}
                    >
                      Schedule Consultation
                    </Button>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section
        className="py-[var(--web-section-gap)]"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.98) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container size="md">
          <Stack gap="lg" align="center" className="text-center">
            <Title
              as="h2"
              className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
            >
              Ready to invest in Dubai real estate?
            </Title>

            <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-[480px]">
              Our team of expert advisors is here to guide you through every step
              of your investment journey in the UAE property market.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                size="lg"
                className="h-12 px-8 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
                render={<Link href="/contact" />}
              >
                Get In Touch
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                className="h-12 px-8 bg-transparent text-[var(--web-off-white)] hover:bg-white/10 border border-white/30 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
                render={<Link href="/team" />}
              >
                Meet the Team
              </Button>
            </div>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
