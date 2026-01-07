/**
 * CATALYST - Team Listing Page
 *
 * Meet the Prime Capital Dubai team.
 * Matches design: hero section, team grid with cards, CTA
 */

import Link from "next/link"
import Image from "next/image"
import { config } from "@/lib/config"
import { getTeamMembers } from "@/lib/content"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, LinkedinIcon, MailIcon, UserIcon } from "lucide-react"

export const metadata = {
  title: "Our Team | Prime Capital Dubai",
  description: "Meet the experienced advisors at Prime Capital Dubai.",
}

export default async function TeamPage() {
  const team = await getTeamMembers()

  if (!config.features.team) {
    return (
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="lg">
          <Stack gap="md" align="center" className="text-center py-20">
            <Title as="h1" className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)]">
              Team Profiles Coming Soon
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-md">
              We're preparing our team profiles. Contact us to connect directly with our advisors.
            </Text>
            <Button
              nativeButton={false}
              className="mt-4 h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Contact Us
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Stack>
        </Container>
      </section>
    )
  }

  return (
    <div className="web-team">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Team Grid */}
      <TeamGridSection team={team} />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// =============================================================================

function HeroSection() {
  return (
    <section
      className="relative min-h-[50vh] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[700px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Team
          </span>
          
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.15] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            Meet the advisors behind
            <br />
            Prime Capital
          </h1>

          <Text
            className="text-white/80 text-[clamp(14px,1.6vw,16px)] font-light leading-relaxed max-w-[500px]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Experienced professionals with deep Dubai market knowledge, dedicated to
            helping sophisticated investors achieve their real estate objectives.
          </Text>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// TEAM GRID SECTION
// =============================================================================

function TeamGridSection({ team }: { team: Awaited<ReturnType<typeof getTeamMembers>> }) {
  if (team.length === 0) {
    return (
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          <Stack gap="md" align="center" className="text-center py-12">
            <Text className="text-[var(--web-spruce)] text-[15px] font-light">
              Team profiles are being prepared. Contact us to connect with our advisors.
            </Text>
            <Button
              nativeButton={false}
              className="border-[var(--web-spruce)] text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] rounded-[2px]"
              variant="outline"
              render={<Link href="/contact" />}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </section>
    )
  }

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// Team Card Component
function TeamCard({ member }: { member: Awaited<ReturnType<typeof getTeamMembers>>[0] }) {
  return (
    <Link href={`/team/${member.slug}`} className="group block">
      <div className="bg-white rounded-[2px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--web-serenity)]/20">
          {member.photo ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <UserIcon className="h-20 w-20 text-[var(--web-spruce)]/30" />
            </div>
          )}
          
          {/* Founder badge */}
          {member.isFounder && (
            <div className="absolute top-4 left-4 bg-[var(--web-ash)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider px-3 py-1 rounded-[2px]">
              Founder
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-headline text-[var(--web-ash)] text-xl font-normal mb-1 group-hover:text-[var(--web-spruce)] transition-colors">
            {member.name}
          </h3>
          <div className="text-[var(--web-spruce)] text-[13px] font-light mb-3">
            {member.role}
          </div>
          
          {member.shortBio && (
            <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed mb-4 line-clamp-2">
              {member.shortBio}
            </Text>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--web-serenity)]/20">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
              >
                <MailIcon className="h-4 w-4" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-[var(--web-off-white)] flex items-center justify-center text-[var(--web-spruce)] hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)] transition-colors"
              >
                <LinkedinIcon className="h-4 w-4" />
              </a>
            )}
            <span className="ml-auto text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] flex items-center gap-1">
              View Profile
              <ArrowRightIcon className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// =============================================================================
// CTA SECTION
// =============================================================================

function CTASection() {
  return (
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
            Ready to connect?
          </Title>

          <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-[480px]">
            Schedule a consultation with one of our advisors to discuss your investment goals.
          </Text>

          <Button
            nativeButton={false}
            size="lg"
            className="mt-4 h-12 px-10 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Get In Touch
          </Button>
        </Stack>
      </Container>
    </section>
  )
}
