/**
 * CATALYST - About Page
 *
 * Prime Capital Dubai's story, values, and approach.
 * World-class UI with parallax, micro-interactions, and refined typography.
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckIcon, ShieldCheckIcon, EyeIcon, TrendingUpIcon, SearchIcon } from "lucide-react"
import { ParallaxHero } from "../_surface/parallax-hero"

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
// Parallax background matching legacy design typography
// =============================================================================

function HeroSection() {
  return (
    <ParallaxHero
      imageUrl="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
      overlay="linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)"
      intensity={0.12}
      className="about-hero relative min-h-[55vh] flex flex-col justify-center items-center text-center"
    >
      <Container size="lg" className="relative z-10 px-4">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto about-hero-content">
          {/* Eyebrow - matches legacy "ABOUT US" */}
          <span className="text-[var(--web-off-white)]/70 text-[11px] font-normal uppercase tracking-[0.25em]">
            About Us
          </span>
          
          {/* Main headline - matches legacy sizing */}
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,52px)] font-normal leading-[1.15] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            In a market saturated with noise,
            <br />
            we chose a different path
          </h1>

          {/* Subtitle - matches legacy format */}
          <Text
            className="text-[var(--web-off-white)]/80 text-[clamp(14px,1.6vw,17px)] font-light leading-relaxed max-w-[500px] mt-2"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Boutique Real Estate Advisory. Guiding discerning investors since
            2020.
          </Text>
        </Stack>
      </Container>
    </ParallaxHero>
  )
}

// =============================================================================
// STORY SECTION
// Simple two-column layout
// =============================================================================

function StorySection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
          {/* Left Column - Image with Badge */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
                alt="Prime Capital Dubai Office"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Established Badge */}
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

          {/* Right Column - Content */}
          <div>
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Our Story
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(26px,3vw,34px)] font-normal leading-[1.2] mb-6"
            >
              Built for investors who expect more
            </Title>
            
            <Text className="text-[var(--web-ash)] text-[15px] font-medium leading-[1.7] mb-5">
              Prime Capital was founded with a simple observation: sophisticated investors deserve sophisticated service.
            </Text>
            
            <Stack gap="sm" className="mb-8">
              <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.75]">
                Too often, Dubai real estate is sold with high-pressure tactics and surface-level analysis. We saw an opportunity to bring the rigour of institutional investment to private real estate advisory.
              </Text>
              
              <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.75]">
                Our team brings backgrounds in private banking, institutional investment, and family office advisory. We understand that a property purchase is rarely just about the property—it's about portfolio diversification, tax efficiency, residency planning, or generational wealth transfer.
              </Text>
              
              <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.75]">
                We limit our client roster intentionally. Every client receives direct access to senior advisors and a level of attention that high-volume agencies simply cannot provide.
              </Text>
            </Stack>

            {/* Stats - 3 columns */}
            <div className="flex gap-8 lg:gap-12 pt-6 border-t border-[var(--web-serenity)]/30">
              <div>
                <div className="font-headline text-[var(--web-ash)] text-[clamp(22px,2.5vw,28px)] font-normal leading-none">
                  <span className="text-[0.6em]">AED </span>6.5B+
                </div>
                <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.12em] mt-2">
                  Transaction Volume
                </div>
              </div>
              <div>
                <div className="font-headline text-[var(--web-ash)] text-[clamp(22px,2.5vw,28px)] font-normal leading-none">
                  750+
                </div>
                <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.12em] mt-2">
                  Properties Transacted
                </div>
              </div>
              <div>
                <div className="font-headline text-[var(--web-ash)] text-[clamp(22px,2.5vw,28px)] font-normal leading-none">
                  94%
                </div>
                <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.12em] mt-2">
                  Client Retention
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
// Dark background with refined 2x2 grid, hover effects, and better visual hierarchy
// =============================================================================

function ValuesSection() {
  const values = [
    {
      number: "01",
      title: "Substance Over Salesmanship",
      description: "We don't chase deals. We build relationships grounded in honest advice and genuine value creation.",
      icon: ShieldCheckIcon,
    },
    {
      number: "02",
      title: "Discretion & Confidentiality",
      description: "Your affairs remain private. We operate with the discretion expected in high-value transactions.",
      icon: EyeIcon,
    },
    {
      number: "03",
      title: "Long-Term Perspective",
      description: "We measure success in years, not transactions. Our advice considers your entire investment horizon.",
      icon: TrendingUpIcon,
    },
    {
      number: "04",
      title: "Institutional Rigour",
      description: "Every recommendation is backed by thorough research and due diligence, never guesswork.",
      icon: SearchIcon,
    },
  ]

  return (
    <section className="bg-[var(--web-ash)] py-[var(--web-section-gap)] overflow-hidden">
      <Container size="xl">
        <Stack gap="xl" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
            Our Values
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,44px)] font-normal leading-[1.2]"
          >
            What guides every decision
          </Title>
          <Text className="text-white/60 text-[15px] font-light max-w-[480px]">
            Four principles that define how we work with every client, every time.
          </Text>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 gap-4 lg:gap-5">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div
                key={value.number}
                className="value-card group relative bg-[var(--web-spruce)]/10 hover:bg-[var(--web-spruce)]/20 border border-[var(--web-spruce)]/20 hover:border-[var(--web-serenity)]/30 p-8 lg:p-10 rounded transition-all duration-300"
              >
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[var(--web-serenity)]/40 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-px bg-gradient-to-b from-[var(--web-serenity)]/40 to-transparent" />
                </div>
                
                {/* Icon + Number row */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)]/20 flex items-center justify-center group-hover:bg-[var(--web-serenity)]/10 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[var(--web-serenity)]" strokeWidth={1.5} />
                  </div>
                  <span className="font-headline text-[var(--web-spruce)]/40 text-2xl group-hover:text-[var(--web-serenity)]/30 transition-colors duration-300">
                    {value.number}
                  </span>
                </div>
                
                <Title
                  as="h3"
                  className="font-headline text-[var(--web-off-white)] text-xl lg:text-[22px] font-normal mb-4 leading-[1.3]"
                >
                  {value.title}
                </Title>
                <Text className="text-[var(--web-serenity)]/80 text-[14px] font-light leading-[1.7]">
                  {value.description}
                </Text>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// DUBAI OPPORTUNITY SECTION
// Light section with unique visual treatment and refined stat cards
// =============================================================================

function DubaiOpportunitySection() {
  const dubaiStats = [
    { value: "0%", label: "Income Tax" },
    { value: "10yr", label: "Golden Visa" },
    { value: "100%", label: "Ownership" },
    { value: "#1", label: "Global City" },
  ]

  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(63,65,66,0.95) 0%, rgba(63,65,66,0.85) 100%), url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
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

        <Grid cols={2} className="md:grid-cols-4 gap-4">
          {dubaiStats.map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--web-off-white)] p-6 text-center"
            >
              <div className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[var(--web-spruce)] text-[10px] uppercase tracking-[0.15em]">
                {stat.label}
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// DIFFERENTIATORS SECTION
// Light background to break up the dark sections
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
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,3.5vw,40px)] font-normal leading-[1.2] mb-8"
            >
              What sets us apart
            </Title>
            
            <Stack gap="sm" className="mb-10">
              {differentiators.map((item) => (
                <div key={item} className="flex items-start gap-4 py-2">
                  <CheckIcon className="h-5 w-5 text-[var(--web-spruce)] shrink-0 mt-0.5" strokeWidth={2} />
                  <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-[1.6]">
                    {item}
                  </Text>
                </div>
              ))}
            </Stack>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[var(--web-spruce)] text-[13px] font-normal uppercase tracking-[0.15em] hover:text-[var(--web-ash)] transition-colors"
            >
              View Our Services
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Column - Image with stats overlay */}
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=1200&auto=format&fit=crop"
                alt="Client consultation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Stats overlay - bottom of image */}
              <div className="absolute bottom-0 left-0 right-0 bg-[var(--web-spruce)] py-4 px-6">
                <div className="flex justify-around">
                  <div className="text-center">
                    <div className="font-headline text-[var(--web-off-white)] text-2xl lg:text-3xl">
                      94%
                    </div>
                    <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                      Client Retention
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-headline text-[var(--web-off-white)] text-2xl lg:text-3xl">
                      15+
                    </div>
                    <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em] mt-1">
                      Years Experience
                    </div>
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
// Unique treatment with clean design and strong visual hierarchy
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundColor: "#4a5a5e", // Slightly lighter than footer for contrast
      }}
    >
      {/* Subtle cityscape silhouette */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }}
      />
      
      <Container size="md" className="relative z-10">
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
            size="lg"
            className="btn-hover-lift mt-4 h-14 px-12 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Start a Conversation
          </Button>
        </Stack>
      </Container>
      
      {/* Bottom separator line for visual break with footer */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
