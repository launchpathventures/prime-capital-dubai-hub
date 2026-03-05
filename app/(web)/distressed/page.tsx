/**
 * CATALYST - Distressed Property Landing Page
 *
 * Campaign landing page for distressed property leads.
 * Hero with form card + property preview cards + value props.
 * All leads tagged "distressed" for Bitrix CRM routing.
 */

export const revalidate = 300 // 5 minutes ISR

import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { Badge } from "@/components/ui/badge"
import { getWebDistressedProperties } from "@/lib/content"
import { formatPriceRange, formatSizeRange } from "@/lib/content-types"
import {
  CheckIcon,
  ClockIcon,
  ShieldCheckIcon,
  PhoneIcon,
  MapPinIcon,
  BedDoubleIcon,
  RulerIcon,
  TagIcon,
} from "lucide-react"

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

export default async function DistressedPage() {
  const properties = await getWebDistressedProperties()

  return (
    <div className="web-distressed">
      <HeroSection />
      {properties.length > 0 && <DealsPreviewSection properties={properties} />}
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
// DEALS PREVIEW SECTION
// Shows distressed property cards from the database.
// =============================================================================

import type { Property } from "@/lib/content-types"

function DealsPreviewSection({ properties }: { properties: Property[] }) {
  return (
    <section className="py-[var(--web-section-gap)] bg-white">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Current Opportunities
          </span>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Available Distressed Deals
          </Title>
          <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-[520px]">
            Below-market properties from motivated sellers. Register your interest to get full details.
          </Text>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <DistressedPropertyCard key={property.id} property={property} />
          ))}
        </Grid>

        {/* CTA below cards */}
        <div className="text-center mt-12">
          <a
            href="#enquiry-form"
            className="btn-hover-lift inline-flex items-center justify-center h-12 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-spruce)]/90 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] transition-colors"
          >
            Enquire About These Deals
          </a>
        </div>
      </Container>
    </section>
  )
}

function DistressedPropertyCard({ property }: { property: Property }) {
  const hasDiscount = property.priceFrom && property.priceTo && property.priceFrom < property.priceTo

  return (
    <div className="group overflow-hidden rounded-[2px] border border-[var(--web-ash)]/8 bg-white transition-all hover:shadow-lg hover:border-[var(--web-spruce)]/20">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--web-off-white)]">
        {property.images[0] ? (
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[var(--web-spruce)]/40 text-sm">No image</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-[var(--web-ash)] text-[var(--web-serenity)] border-0 text-[10px] uppercase tracking-wider">
            <TagIcon className="h-3 w-3 mr-1" />
            Distressed Sale
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-[10px] capitalize border-0">
            {property.type}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-headline text-[var(--web-ash)] text-[16px] font-medium leading-tight mb-2 line-clamp-2">
          {property.title}
        </h3>

        <div className="flex items-center gap-1.5 text-[var(--web-spruce)] text-[13px] mb-3">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0" />
          <span>{property.location}</span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="text-[var(--web-ash)] text-[20px] font-semibold">
            {formatPriceRange(property.priceFrom, property.priceFrom, property.currency)}
          </div>
          {hasDiscount && (
            <div className="text-[var(--web-spruce)]/60 text-[13px] line-through">
              Original: {formatPriceRange(property.priceTo, property.priceTo, property.currency)}
            </div>
          )}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-[13px] text-[var(--web-spruce)] mb-4">
          <div className="flex items-center gap-1.5">
            <BedDoubleIcon className="h-3.5 w-3.5" />
            <span>{property.bedroomsFrom} Bed</span>
          </div>
          {(property.sizeFrom || property.sizeTo) && (
            <div className="flex items-center gap-1.5">
              <RulerIcon className="h-3.5 w-3.5" />
              <span>{formatSizeRange(property.sizeFrom, property.sizeTo, property.sizeUnit)}</span>
            </div>
          )}
        </div>

        {/* Key features preview */}
        {property.features.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {property.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-[11px] px-2 py-0.5 rounded-sm bg-[var(--web-off-white)] text-[var(--web-spruce)] border border-[var(--web-ash)]/5"
              >
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
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
