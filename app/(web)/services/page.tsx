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
      className="relative flex flex-col"
    >
      {/* Hero Image Area */}
      <div 
        className="min-h-[55vh] flex items-center justify-center relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(63,65,66,0.55) 0%, rgba(63,65,66,0.65) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container size="lg" className="relative z-10 px-4">
          <Stack gap="md" align="center" className="text-center max-w-[800px] mx-auto">
            <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.25em]">
              What We Do
            </span>
            
            <h1
              className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight"
              style={{ textShadow: "0 4px 30px rgba(0,0,0,0.3)" }}
            >
              Full-service advisory for
              <br />
              discerning investors
            </h1>

            <Text
              className="text-white/80 text-[clamp(15px,1.8vw,18px)] font-light leading-relaxed max-w-[580px] mt-2"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}
            >
              From initial acquisition to eventual exit, we manage the complexity so you can
              focus on what matters.
            </Text>
          </Stack>
        </Container>
      </div>

      {/* Stats Bar */}
      <div className="bg-[var(--web-spruce)]">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,44px)] font-normal leading-none mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--web-serenity)] text-[11px] uppercase tracking-[0.15em]">
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
        <Stack gap="sm" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Services
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-ash)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.3]"
          >
            Comprehensive support at every stage
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 gap-5">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.number}
                className="group bg-white border border-[var(--web-serenity)]/20 overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                {/* Image with overlays */}
                <div className="relative h-[180px] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Number badge - top left */}
                  <div className="absolute top-4 left-4 text-white/80 text-[10px] uppercase tracking-[0.15em]">
                    {service.number}
                  </div>
                  {/* Icon - bottom right */}
                  <div className="absolute bottom-4 right-4 bg-white rounded-full p-2.5 shadow-md">
                    <Icon className="h-4 w-4 text-[var(--web-spruce)]" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <Title
                    as="h3"
                    className="font-headline text-[var(--web-ash)] text-[17px] font-normal mb-2"
                  >
                    {service.title}
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-relaxed mb-4">
                    {service.description}
                  </Text>
                  
                  <Stack gap="xs">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckIcon className="h-3.5 w-3.5 text-[var(--web-spruce)] shrink-0 mt-0.5" />
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
      description: "Our relationship continues post-transaction with management and future planning.",
    },
  ]

  return (
    <section 
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundColor: "var(--web-ash)",
      }}
    >
      {/* Background cityscape silhouette */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      
      <Container size="lg" className="relative z-10">
        <Stack gap="sm" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Our Process
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,42px)] font-normal leading-[1.2]"
          >
            How we work
          </Title>
          <Text className="text-white/50 text-[15px] font-light max-w-[420px]">
            A structured approach that delivers consistent results
          </Text>
        </Stack>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              {/* Filled circle with number */}
              <div className="inline-flex items-center justify-center mb-6">
                <div className="w-[72px] h-[72px] rounded-full bg-[var(--web-serenity)]/70 flex items-center justify-center">
                  <span className="font-headline text-[var(--web-off-white)] text-[22px]">
                    {step.number}
                  </span>
                </div>
              </div>
              
              <h3 className="font-headline text-[var(--web-off-white)] text-[20px] font-normal mb-4">
                {step.title}
              </h3>
              
              <p className="text-[var(--web-serenity)] text-[14px] font-light leading-[1.75]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
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
    { text: "10-year renewable residency", icon: "globe" },
    { text: "No UAE sponsor required", icon: "check" },
    { text: "Sponsor family members", icon: "check" },
    { text: "UAE banking access", icon: "check" },
    { text: "100% property ownership", icon: "check" },
    { text: "No minimum stay", icon: "check" },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        <Grid cols={1} className="lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column - Content */}
          <div className="lg:pr-4">
            <span className="block text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em] mb-4">
              Featured Service
            </span>
            <Title
              as="h2"
              className="font-headline text-[var(--web-ash)] text-[clamp(32px,4vw,44px)] font-normal leading-[1.15] mb-6"
            >
              UAE Golden Visa
            </Title>
            
            <Text className="text-[var(--web-spruce)] text-[16px] font-light leading-[1.75] mb-8">
              The UAE Golden Visa offers 10-year renewable residency to property
              investors meeting the AED 2 million threshold. Beyond the visa itself, it
              opens doors to UAE banking, business setup, and family sponsorship.
            </Text>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
              {benefits.map((benefit, index) => (
                <div key={benefit.text} className="flex items-center gap-3">
                  {benefit.icon === "globe" ? (
                    <svg className="h-4 w-4 text-[var(--web-spruce)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ) : (
                    <CheckIcon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                  )}
                  <span className="text-[var(--web-spruce)] text-[14px] font-light">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              render={<Link href="/contact" />}
            >
              Enquire About Golden Visa
              <ArrowRightIcon className="ml-3 h-4 w-4" />
            </Button>
          </div>

          {/* Right Column - Image with rounded corners and overlapping stat */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1200&auto=format&fit=crop"
                alt="UAE Golden Visa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* Stats badge - overlapping bottom right */}
            <div className="absolute -bottom-4 right-4 lg:right-8 bg-[var(--web-spruce)] rounded-lg px-6 py-4 flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <CheckIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-headline text-[var(--web-off-white)] text-2xl leading-none">
                  100+
                </div>
                <div className="text-[var(--web-serenity)] text-[10px] uppercase tracking-[0.12em] mt-1">
                  Visas Facilitated
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
            className="font-headline text-[var(--web-off-white)] text-[clamp(26px,3.5vw,36px)] font-normal leading-[1.3]"
          >
            Ready to discuss your requirements?
          </Title>

          <Text className="text-white/60 text-[14px] font-light leading-relaxed max-w-[440px]">
            Every client relationship begins with a conversation. No obligation, no
            pressure.
          </Text>

          <Button
            size="lg"
            className="btn-hover-lift mt-2 h-12 px-10 bg-transparent text-[var(--web-off-white)] hover:bg-[var(--web-off-white)] hover:text-[var(--web-ash)] border border-[var(--web-off-white)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
            render={<Link href="/contact" />}
          >
            Start a Conversation
          </Button>

          <Text className="text-white/50 text-[13px] font-light mt-2">
            Or email us directly at{" "}
            <a href="mailto:contact@primecapital.ae" className="text-white/60 hover:text-white underline">
              contact@primecapital.ae
            </a>
          </Text>
        </Stack>
      </Container>
      
      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
