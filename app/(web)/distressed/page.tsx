/**
 * CATALYST - Distressed Property Landing Page
 *
 * Campaign landing page for distressed property leads.
 * Simple hero with form card — optimised for quick capture.
 * All leads tagged "distressed" for Bitrix CRM routing.
 */

import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { CheckIcon, ClockIcon, ShieldCheckIcon, PhoneIcon } from "lucide-react"

const HERO_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2500&auto=format&fit=crop"

export const metadata = {
  title: "Distressed Property Opportunities | Prime Capital Dubai",
  description:
    "Access exclusive distressed property deals in Dubai. Below-market pricing, fast turnarounds, and expert guidance from Prime Capital Dubai.",
  alternates: {
    canonical: "/distressed",
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Distressed Property Opportunities | Prime Capital Dubai",
    description:
      "Access exclusive distressed property deals in Dubai. Below-market pricing, fast turnarounds, and expert guidance.",
    url: "/distressed",
    images: [{ url: HERO_IMAGE, width: 1200, height: 630, alt: "Dubai distressed property opportunities" }],
  },
}

export default function DistressedPage() {
  return (
    <div className="web-distressed">
      <HeroSection />
      <WhySection />
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-bleed image with side-by-side content + form card.
// =============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background image */}
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(63,65,66,0.92) 0%, rgba(87,108,117,0.85) 40%, rgba(63,65,66,0.93) 100%)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full">
        <div className="py-32 lg:py-40">
          <Grid
            cols={1}
            className="lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 xl:gap-24 items-start"
          >
            {/* Left Column — Content */}
            <div>
              <span
                className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-5"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Exclusive Opportunities
              </span>

              <h1
                className="font-headline text-[var(--web-off-white)] text-[clamp(36px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight mb-6"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
              >
                Distressed Property
                <br />
                Deals in Dubai
              </h1>

              <p
                className="text-white/80 text-[clamp(16px,2vw,19px)] font-light leading-relaxed mb-10 max-w-[500px]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Below-market properties from motivated sellers.
                Time-sensitive deals that require fast, informed action
                — and an advisor who knows how to move.
              </p>

              {/* Benefit list */}
              <div className="space-y-3 mb-10">
                {[
                  "Properties priced 15–30% below market value",
                  "Vetted opportunities from our network",
                  "End-to-end transaction support",
                  "Confidential, no-obligation consultation",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--web-serenity)]/20 flex items-center justify-center shrink-0">
                      <CheckIcon className="h-3 w-3 text-[var(--web-serenity)]" />
                    </div>
                    <span className="text-white/70 text-[14px] font-light">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Trust line */}
              <div className="flex items-center gap-4 pt-5 border-t border-white/10">
                <span className="text-white/40 text-[12px] font-light tracking-wide">
                  RERA Licensed · Trusted by international investors
                </span>
              </div>
            </div>

            {/* Right Column — Form Card */}
            <div id="enquiry-form" className="lg:sticky lg:top-28">
              <div className="bg-white rounded-[2px] shadow-2xl overflow-hidden">
                {/* Form header */}
                <div className="px-8 pt-8 pb-0">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-ash)] text-[22px] font-normal mb-1"
                  >
                    Register Your Interest
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[13px] font-light mb-6">
                    We&apos;ll share available deals that match your criteria
                  </Text>
                  <div className="h-px bg-[var(--web-serenity)]/20" />
                </div>

                {/* Form body */}
                <div className="px-8 py-6">
                  <LeadForm
                    mode="landing"
                    theme="light"
                    tag="distressed"
                    successMessage="Thank you for your interest. We'll be in touch within 24 hours with available opportunities."
                  />
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// WHY SECTION
// Three value props — speed, access, protection.
// =============================================================================

function WhySection() {
  const reasons = [
    {
      icon: ClockIcon,
      title: "Speed Matters",
      description:
        "Distressed deals move fast. We identify, vet, and present opportunities before they reach the open market.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Due Diligence Included",
      description:
        "Every property is checked for liens, encumbrances, and legal issues. You buy with full transparency.",
    },
    {
      icon: PhoneIcon,
      title: "Direct Access",
      description:
        "Work directly with a senior advisor. No call centres, no junior agents — just experienced guidance.",
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Why Work With Us
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Distressed deals require a different approach
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.title}
                className="text-center p-8 bg-white rounded-[2px]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                </div>
                <h3 className="font-headline text-[var(--web-ash)] text-[18px] font-normal mb-3">
                  {reason.title}
                </h3>
                <p className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.7]">
                  {reason.description}
                </p>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA SECTION
// Final push — scroll back to form.
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative overflow-hidden"
      style={{
        backgroundColor: "var(--web-ash)",
        backgroundImage: "linear-gradient(135deg, var(--web-ash) 0%, #2a2b2c 100%)",
      }}
    >
      <Container size="md" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Limited Availability
          </span>

          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.2]"
          >
            These opportunities don&apos;t last
          </Title>

          <Text className="text-white/60 text-[15px] font-light leading-relaxed max-w-[460px]">
            Register your interest and we&apos;ll contact you within 24 hours
            with current distressed opportunities that match your criteria.
          </Text>

          <a
            href="#enquiry-form"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-spruce)]/90 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg inline-flex items-center justify-center transition-colors"
          >
            Register Interest
          </a>

          <Text className="text-[var(--web-serenity)] text-[12px] font-light mt-2">
            Confidential · No obligation · Response within 24 hours
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
