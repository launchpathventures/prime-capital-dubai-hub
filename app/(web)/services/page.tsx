/**
 * CATALYST - Services Page
 *
 * Prime Capital Dubai's service offerings.
 * Matches design: hero with stats, 2x2 service cards with images, process timeline, Golden Visa feature, CTA
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import {
  ArrowRightIcon,
  CheckIcon,
  SearchIcon,
  CreditCardIcon,
  HomeIcon,
  TrendingUpIcon,
} from "lucide-react"

export const metadata = {
  title: "Services | Prime Capital Dubai",
  description: "Investment advisory, acquisition support, Golden Visa guidance, and asset management.",
}

export default function ServicesPage() {
  return (
    <div className="web-services">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Services Grid */}
      <ServicesSection />
      
      {/* Process Section */}
      <ProcessSection />
      
      {/* Golden Visa Feature */}
      <GoldenVisaSection />
      
      {/* CTA Section */}
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-width image with headline and stats bar
// =============================================================================

function HeroSection() {
  const stats = [
    { value: "4", label: "Core Services" },
    { value: "100+", label: "Golden Visas Facilitated" },
    { value: "AED 800M+", label: "Transaction Value" },
    { value: "98%", label: "Client Satisfaction" },
  ]

  return (
    <section
      className="relative min-h-[60vh] flex flex-col justify-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2800&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="lg" className="relative z-10 px-4 py-20">
        <Stack gap="md" align="center" className="text-center max-w-[700px] mx-auto">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What We Do
          </span>
          
          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5vw,48px)] font-normal leading-[1.15] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            Full-service advisory for
            <br />
            discerning investors
          </h1>

          <Text
            className="text-white/80 text-[clamp(14px,1.6vw,16px)] font-light leading-relaxed max-w-[500px]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            From initial acquisition to eventual exit, we manage the complexity so you can
            focus on what matters.
          </Text>
        </Stack>
      </Container>

      {/* Stats Bar */}
      <div className="bg-[var(--web-spruce)]">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-headline text-[var(--web-off-white)] text-[clamp(24px,3vw,36px)] font-normal leading-none mb-1">
                  {stat.value}
                </div>
                <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.15em]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  )
}

// =============================================================================
// SERVICES SECTION
// 2x2 grid of service cards with images
// =============================================================================

function ServicesSection() {
  const services = [
    {
      number: "01",
      icon: SearchIcon,
      title: "Acquisition Advisory",
      description: "Strategic property acquisition with access to off-market opportunities and preferential developer terms.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop",
      features: [
        "Pre-market access to premium developments",
        "Negotiated payment plans and pricing",
        "Comprehensive due diligence on all properties",
      ],
    },
    {
      number: "02",
      icon: CreditCardIcon,
      title: "Golden Visa Facilitation",
      description: "End-to-end support for UAE residency through qualifying property investments.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      features: [
        "Qualifying property identification",
        "Document preparation and submission",
        "Government liaison and follow-up",
      ],
    },
    {
      number: "03",
      icon: HomeIcon,
      title: "Property Management",
      description: "Hands-off ownership with comprehensive property and tenancy management.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop",
      features: [
        "Tenant sourcing and vetting",
        "Lease management and renewals",
        "Rent collection and disbursement",
      ],
    },
    {
      number: "04",
      icon: TrendingUpIcon,
      title: "Exit Strategy",
      description: "Optimised sale execution when it's time to realise your investment returns.",
      image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop",
      features: [
        "Market timing analysis",
        "Property presentation and marketing",
        "Qualified buyer sourcing",
      ],
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Stack gap="xl" align="center" className="text-center mb-12">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Services
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            Comprehensive support at every stage
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                className="bg-white rounded-[2px] overflow-hidden shadow-sm"
              >
                {/* Image */}
                <div className="relative h-[200px]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Number badge */}
                  <div className="absolute top-4 left-4 bg-[var(--web-spruce)]/90 text-[var(--web-off-white)] text-[10px] uppercase tracking-wider px-3 py-1 rounded-[2px]">
                    {service.number}
                  </div>
                  {/* Icon */}
                  <div className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg">
                    <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <Title
                    as="h3"
                    className="font-headline text-[var(--web-ash)] text-xl font-normal mb-3"
                  >
                    {service.title}
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed mb-4">
                    {service.description}
                  </Text>
                  
                  <Stack gap="xs">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0 mt-0.5" />
                        <Text className="text-[var(--web-spruce)] text-[13px] font-light">
                          {feature}
                        </Text>
                      </div>
                    ))}
                  </Stack>
                </div>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// PROCESS SECTION
// Dark background with numbered steps
// =============================================================================

function ProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Discovery",
      description: "We begin with a detailed conversation about your investment objectives, timeline, and preferences.",
    },
    {
      number: "02",
      title: "Strategy",
      description: "Based on your profile, we develop a tailored approach and identify suitable opportunities.",
    },
    {
      number: "03",
      title: "Execution",
      description: "We handle negotiations, due diligence, and all documentation on your behalf.",
    },
    {
      number: "04",
      title: "Ongoing Support",
      description: "Our relationship continues with instruction, with management and future planning.",
    },
  ]

  return (
    <section className="bg-[var(--web-ash)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Stack gap="xl" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Process
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            How we work
          </Title>
          <Text className="text-white/60 text-[15px] font-light max-w-[500px]">
            A structured approach that delivers consistent results
          </Text>
        </Stack>

        <Grid cols={2} className="md:grid-cols-4 gap-8">
          {steps.map((step) => (
            <Stack key={step.number} gap="md" align="center" className="text-center">
              {/* Circle with number */}
              <div className="w-16 h-16 rounded-full border-2 border-[var(--web-serenity)]/40 flex items-center justify-center">
                <span className="font-headline text-[var(--web-off-white)] text-xl">
                  {step.number}
                </span>
              </div>
              
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-lg font-normal"
              >
                {step.title}
              </Title>
              
              <Text className="text-[var(--web-serenity)] text-[13px] font-light leading-relaxed">
                {step.description}
              </Text>
            </Stack>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// GOLDEN VISA SECTION
// Featured service with image
// =============================================================================

function GoldenVisaSection() {
  const benefits = [
    "10-year renewable residency",
    "No UAE sponsor required",
    "Sponsor family members",
    "UAE banking access",
    "100% property ownership",
    "No minimum stay",
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div>
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Featured Service
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(28px,3.5vw,38px)] font-normal leading-[1.25] mb-6"
            >
              UAE Golden Visa
            </Title>
            
            <Text className="text-[var(--web-spruce)] text-[15px] font-light leading-relaxed mb-8">
              The UAE Golden Visa offers 10-year renewable residency to property
              investors meeting the AED 2 million threshold. Beyond the visa itself, it
              opens doors to UAE banking, business setup, and family sponsorship.
            </Text>

            <Grid cols={2} className="gap-x-6 gap-y-3 mb-8">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                  <Text className="text-[var(--web-spruce)] text-[14px] font-light">
                    {benefit}
                  </Text>
                </div>
              ))}
            </Grid>

            <Button
              nativeButton={false}
              size="lg"
              className="h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Enquire About Golden Visa
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-[2px] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop"
                alt="UAE Golden Visa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Stats overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-[var(--web-spruce)]/95 rounded-[2px] px-6 py-4 flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="font-headline text-[var(--web-off-white)] text-lg">
                    100+
                  </div>
                  <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.1em]">
                    Visas Facilitated
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
            Ready to discuss your requirements?
          </Title>

          <Text className="text-white/70 text-[15px] font-light leading-relaxed max-w-[480px]">
            Every client relationship begins with a conversation. No obligation, no
            pressure.
          </Text>

          <Button
            nativeButton={false}
            size="lg"
            className="mt-4 h-12 px-10 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Start a Conversation
          </Button>

          <Text className="text-white/50 text-[13px] font-light mt-4">
            Or email us directly at{" "}
            <a href="mailto:contact@primecapital.ae" className="text-white/70 hover:text-white underline">
              contact@primecapital.ae
            </a>
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
