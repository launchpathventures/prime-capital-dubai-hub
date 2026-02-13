/**
 * CATALYST - Team Member Detail Page
 *
 * Individual team member profile with brand styling.
 * Features: Hero with photo, expertise card, credentials, contact CTA.
 */

import Link from "next/link"
import Image from "next/image"

export const revalidate = 86400 // 24 hours ISR
import { notFound } from "next/navigation"
import { getWebTeamMemberBySlug, getTeamMemberSlugs } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { JsonLd, personJsonLd, breadcrumbJsonLd } from "@/lib/json-ld"
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
  const member = await getWebTeamMemberBySlug(slug)

  if (!member) {
    return { title: "Team Member Not Found" }
  }

  return {
    title: member.name,
    description: member.shortBio || member.bio?.slice(0, 160) || `Meet ${member.name}, ${member.role} at Prime Capital Dubai.`,
    alternates: {
      canonical: `/team/${member.slug}`,
    },
    openGraph: {
      title: `${member.name} - ${member.role}`,
      description: member.shortBio || member.bio?.slice(0, 160) || `Meet ${member.name}, ${member.role} at Prime Capital Dubai.`,
      images: member.photo ? [{ url: member.photo, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params
  const member = await getWebTeamMemberBySlug(slug)

  if (!member) {
    notFound()
  }

  // Use fullBio if available, otherwise fall back to shortBio/bio
  const bioContent = member.fullBio || member.shortBio || member.bio
  const hasExpertise = member.expertise && member.expertise.length > 0
  const hasBackground = member.background && member.background.length > 0

  return (
    <div className="web-team-member">
      {/* JSON-LD Structured Data */}
      <JsonLd data={personJsonLd({
        name: member.name,
        role: member.role,
        bio: member.shortBio || member.bio,
        slug: member.slug,
        photo: member.photo,
        email: member.email,
        linkedin: member.linkedin,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", url: "https://primecapitaldubai.com" },
        { name: "Team", url: "https://primecapitaldubai.com/team" },
        { name: member.name }
      ])} />

      {/* Hero Section */}
      <section className="relative min-h-[55vh] flex flex-col justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover object-[center_40%]"
            sizes="100vw"
          />
        </div>
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(to right, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.92) 40%, rgba(63,65,66,0.85) 70%, rgba(63,65,66,0.75) 100%)`,
          }}
        />
        {/* Subtle Vignette */}
        <div 
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 50%, transparent 0%, rgba(0,0,0,0.15) 100%)`,
          }}
        />

        <Container size="xl" className="relative z-10 pt-28 pb-16">
          {/* Back Link - Inline with content */}
          <Link
            href="/team"
            className="group inline-flex items-center gap-2 text-white/60 text-[13px] hover:text-white/90 transition-colors mb-8"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Team
          </Link>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Profile Photo */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0 rounded-[2px] overflow-hidden shadow-2xl ring-1 ring-white/10">
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--web-spruce)]">
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
              <h1 
                className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.1]"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
              >
                {member.name}
              </h1>
              <div className="text-[var(--web-serenity)] text-[18px] font-light">
                {member.role}
              </div>
              {member.shortBio && (
                <Text 
                  className="text-white/70 text-[15px] font-light leading-relaxed max-w-xl"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
                >
                  {member.shortBio}
                </Text>
              )}
              
              {/* Contact Buttons */}
              {(member.email || member.phone) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[var(--web-off-white)] border border-[var(--web-off-white)]/50 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      Call
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`https://wa.me/${member.phone.replace(/[\s+\-()]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[var(--web-off-white)] border border-[var(--web-off-white)]/50 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-transparent text-[var(--web-off-white)] border border-[var(--web-off-white)]/50 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <MailIcon className="h-4 w-4" />
                      Email
                    </a>
                  )}
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

                  {member.phone && (
                    <a
                      href={`https://wa.me/${member.phone.replace(/[\s+\-()]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[var(--web-spruce)] text-[14px] hover:text-[var(--web-ash)] transition-colors"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span>WhatsApp</span>
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
                    <Link
                      href={`/contact?teamMember=${encodeURIComponent(member.slug)}${member.email ? `&teamMemberEmail=${encodeURIComponent(member.email)}` : ''}`}
                      className="flex items-center justify-center w-full h-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors"
                    >
                      Schedule Consultation
                    </Link>
                  </div>
                </Stack>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-[var(--web-section-gap)] relative">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.98) 100%)" }}
          />
        </div>
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
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors"
              >
                Get In Touch
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/team"
                className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-[var(--web-off-white)] hover:bg-white/10 border border-white/30 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors"
              >
                Meet the Team
              </Link>
            </div>
          </Stack>
        </Container>
      </section>
    </div>
  )
}
