/**
 * CATALYST - About Page
 *
 * Prime Capital Dubai's story, values, and approach.
 * Matches design: hero with image, story with stats, values grid, Dubai opportunity, differentiators, CTA
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckIcon } from "lucide-react"

export const metadata = {
  title: "About Us | Prime Capital Dubai",
  description: "Learn about Prime Capital Dubai's boutique approach to real estate advisory.",
}

export default function AboutPage() {
  return (
    <div className="web-about">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Story Section */}
      <StorySection />
      
      {/* Values Section */}
      <ValuesSection />
      
      {/* Dubai Opportunity Section */}
      <DubaiOpportunitySection />
      
      {/* What Sets Us Apart */}
      <DifferentiatorsSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-width hero with background image
// =============================================================================

function HeroSection() {
  return (
    <section
      className="relative min-h-[70vh] flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }}
    >
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            About Us
          </span>
          
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,52px)] font-normal leading-[1.15] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            In a market saturated with noise,
            <br />
            we chose a different path
          </h1>

          <Text
            className="text-white/80 text-[clamp(14px,1.6vw,17px)] font-light leading-relaxed max-w-[500px] mt-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Boutique Real Estate Advisory. Guiding discerning investors since
          </Text>
          
          <div className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5vw,56px)] font-normal mt-2">
            2020.
          </div>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// STORY SECTION
// Two columns: image with badge + text with stats
// =============================================================================

function StorySection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left Column - Header + Image */}
          <div>
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Our Story
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,3.5vw,38px)] font-normal leading-[1.25] mb-8"
            >
              Built for investors who expect more
            </Title>
            
            {/* Image with badge */}
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                  alt="Prime Capital Dubai Office"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Established badge */}
                <div className="absolute bottom-0 left-0 bg-[var(--web-ash)] px-6 py-4">
                  <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mb-1">
                    Established
                  </div>
                  <div className="font-headline text-[var(--web-off-white)] text-2xl">
                    2020
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Text + Stats */}
          <div className="lg:pt-16">
            <Text className="text-[var(--web-ash)] text-[15px] font-medium leading-relaxed mb-6">
              Prime Capital was founded with a simple observation: sophisticated investors deserve sophisticated service.
            </Text>
            
            <Stack gap="md" className="mb-10">
              <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed">
                Too often, Dubai real estate is sold with high-pressure tactics and surface-level analysis.
                We saw an opportunity to do things differently—to bring the rigour of institutional
                investment to private real estate advisory.
              </Text>
              
              <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed">
                Our team brings backgrounds in private banking, institutional investment, and family
                office advisory. We understand that for our clients, a property purchase is rarely just
                about the property—it's about portfolio diversification, tax efficiency, residency planning,
                or generational wealth transfer.
              </Text>
              
              <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed">
                We limit our client roster intentionally. This isn't a volume business. Every client receives
                direct access to senior advisors and a level of attention that high-volume agencies simply
                cannot provide.
              </Text>
            </Stack>

            {/* Stats */}
            <div className="flex gap-12 pt-8 border-t border-[var(--web-serenity)]/30">
              <div>
                <div className="font-headline text-[var(--web-ash)] text-[clamp(32px,4vw,44px)] font-normal leading-none">
                  AED 6.5B+
                </div>
                <div className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] mt-2">
                  Transaction Volume
                </div>
              </div>
              <div>
                <div className="font-headline text-[var(--web-ash)] text-[clamp(32px,4vw,44px)] font-normal leading-none">
                  750+
                </div>
                <div className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] mt-2">
                  Properties Transacted
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// VALUES SECTION
// Dark background with 2x2 grid of values
// =============================================================================

function ValuesSection() {
  const values = [
    {
      number: "01",
      title: "Substance Over Salesmanship",
      description: "We don't chase deals. We build relationships grounded in honest advice and genuine value creation.",
    },
    {
      number: "02",
      title: "Discretion & Confidentiality",
      description: "Your affairs remain private. We operate with the discretion expected in high-value transactions.",
    },
    {
      number: "03",
      title: "Long-Term Perspective",
      description: "We measure success in years, not transactions. Our advice considers your entire investment horizon.",
    },
    {
      number: "04",
      title: "Institutional Rigour",
      description: "Every recommendation is backed by thorough research and due diligence, never guesswork.",
    },
  ]

  return (
    <section className="bg-[var(--web-ash)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Stack gap="xl" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Values
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            What guides us
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 gap-px bg-[var(--web-spruce)]/30">
          {values.map((value) => (
            <div
              key={value.number}
              className="bg-[var(--web-ash)] p-8 lg:p-12 relative"
            >
              {/* Number in top right */}
              <div className="absolute top-8 right-8 lg:top-12 lg:right-12 font-headline text-[var(--web-spruce)]/30 text-[48px] lg:text-[64px] leading-none">
                {value.number}
              </div>
              
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-xl lg:text-2xl font-normal mb-4 pr-16"
              >
                {value.title}
              </Title>
              <Text className="text-[var(--web-serenity)] text-[14px] font-light leading-relaxed max-w-[320px]">
                {value.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// DUBAI OPPORTUNITY SECTION
// Dark section with stats about Dubai
// =============================================================================

function DubaiOpportunitySection() {
  const dubaiStats = [
    { value: "0%", label: "Income Tax", description: "No personal income tax on earnings or capital gains" },
    { value: "10yr", label: "Golden Visa", description: "Long-term residency through property investment" },
    { value: "100%", label: "Foreign Ownership", description: "Full property ownership rights in designated areas" },
    { value: "#1", label: "Global Ranking", description: "World's most visited city and business hub" },
  ]

  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(63,65,66,0.97) 0%, rgba(63,65,66,0.85) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="xl">
        <div className="max-w-[600px] mb-12">
          <span className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
            The Opportunity
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25] mb-6"
          >
            Why Dubai continues to attract global capital
          </Title>
          <Text className="text-white/70 text-[15px] font-light leading-relaxed">
            Strategic location, investor-friendly policies, and world-class infrastructure
            make Dubai one of the world's most compelling real estate markets.
          </Text>
        </div>

        <Grid cols={2} className="md:grid-cols-4 gap-6">
          {dubaiStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--web-off-white)] rounded-[2px] p-6 text-center"
            >
              <div className="font-headline text-[var(--web-ash)] text-[clamp(32px,4vw,44px)] font-normal leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] mb-3">
                {stat.label}
              </div>
              <Text className="text-[var(--web-spruce)] text-[12px] font-light leading-relaxed">
                {stat.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// DIFFERENTIATORS SECTION
// Two columns: checkmarks list + image with stats overlay
// =============================================================================

function DifferentiatorsSection() {
  const differentiators = [
    "Direct access to senior advisors, not junior agents",
    "Pre-market access to premium developer inventory",
    "Investment analysis, not just property listings",
    "End-to-end service from search to handover",
    "Ongoing relationship, not one-time transaction",
    "Institutional-grade due diligence on every property",
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Our Difference
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,3.5vw,38px)] font-normal leading-[1.25] mb-8"
            >
              What sets us apart
            </Title>
            
            <Stack gap="sm" className="mb-8">
              {differentiators.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 text-[var(--web-spruce)] shrink-0 mt-0.5" />
                  <Text className="text-[var(--web-spruce)] text-[15px] font-light">
                    {item}
                  </Text>
                </div>
              ))}
            </Stack>

            <Link
              href="/services"
              className="text-[var(--web-spruce)] text-[13px] font-normal uppercase tracking-[0.15em] inline-flex items-center gap-2 hover:text-[var(--web-ash)] transition-colors"
            >
              View Our Services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Column - Image with Stats */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
                alt="Client consultation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Stats overlay */}
              <div className="absolute bottom-0 right-0 bg-[var(--web-spruce)] px-8 py-6 flex gap-8">
                <div className="text-center">
                  <div className="font-headline text-[var(--web-off-white)] text-3xl">
                    94%
                  </div>
                  <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                    Client Retention
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-headline text-[var(--web-off-white)] text-3xl">
                    15+
                  </div>
                  <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                    Years Experience
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA SECTION
// Dark background with centered content
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)]"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.95) 0%, rgba(63,65,66,0.98) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
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
            Let's discuss your objectives
          </Title>

          <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-[480px]">
            Whether you're exploring Dubai for the first time or expanding an existing
            portfolio, we're here to help.
          </Text>

          <Button
            nativeButton={false}
            size="lg"
            className="mt-4 h-12 px-10 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Start a Conversation
          </Button>
        </Stack>
      </Container>
    </section>
  )
}
