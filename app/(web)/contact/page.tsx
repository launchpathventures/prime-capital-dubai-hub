/**
 * CATALYST - Contact Page
 *
 * Contact form and information for Prime Capital Dubai.
 * Clean, focused layout: hero with quick contact options, centered form, consultation process.
 */

import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { ParallaxHero } from "../_surface/parallax-hero"
import { ContactBar } from "./contact-bar"
import { ContactFormSection } from "./contact-form-section"
import { getCrmPropertyBySlug } from "@/lib/crm/client"
import { isOffPlanListing } from "@/lib/crm"
import type { PropertyContext } from "@/components/shared/lead-form/types"
import contactImage from "@/public/images/hero/contact.jpg"

export const metadata = {
  title: "Contact Us",
  description: "Get in touch with Prime Capital Dubai for investment advisory.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us",
    description: "Get in touch with Prime Capital Dubai for investment advisory.",
    url: "/contact",
    images: [{ url: "/images/hero/contact.jpg", width: 1200, height: 630, alt: "Contact Prime Capital Dubai" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us",
    description: "Get in touch with Prime Capital Dubai for investment advisory.",
    images: ["/images/hero/contact.jpg"],
  },
}

interface PageProps {
  searchParams: Promise<{ property?: string; bid?: string }>
}

export default async function ContactPage({ searchParams }: PageProps) {
  const { property: propertySlug, bid } = await searchParams

  // If arriving from a property page, fetch property data for context
  let propertyContext: PropertyContext | undefined
  if (propertySlug) {
    const property = await getCrmPropertyBySlug(propertySlug)
    if (property) {
      propertyContext = {
        slug: property.slug,
        title: property.title,
        isOffPlan: isOffPlanListing(property),
        isDistressed: false,
        hasDeveloper: !!property.developer,
        hasRentalYield: false,
        developerName: property.developer ?? undefined,
        coverImage: property.images[0],
      }
    }
  }

  return (
    <div className="web-contact">
      {/* Hero Section */}
      <HeroSection propertyTitle={propertyContext?.title} propertyImage={propertyContext?.coverImage} />

      {/* Contact Form + Details */}
      <ContactFormSection propertyContext={propertyContext} bidFromUrl={bid} />

      {/* Consultation Process */}
      <ConsultationProcessSection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Full-width hero with contact quick links
// =============================================================================

function HeroSection({ propertyTitle, propertyImage }: { propertyTitle?: string; propertyImage?: string }) {
  return (
    <ParallaxHero
      imageUrl={propertyImage || contactImage}
      overlay={propertyImage
        ? "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 100%)"
        : "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.45) 100%)"}
      intensity={0.12}
      objectPosition="center 30%"
      priority
      className="contact-hero relative min-h-[40vh] md:min-h-[55vh] flex flex-col items-center text-center"
    >
      {/* Push content below the transparent fixed header */}
      <div className="pt-[var(--web-header-height)]" />

      {/* Hero copy — vertically centered in remaining space */}
      <div className="relative z-10 flex-1 flex items-center px-4 py-8 md:py-16">
        <Stack gap="md" align="center" className="max-w-[800px] mx-auto">
          <span className="text-[var(--web-off-white)]/70 text-[11px] font-normal uppercase tracking-[0.25em]">
            {propertyTitle ? "Property Enquiry" : "Contact"}
          </span>

          <h1
            className="font-headline text-[var(--web-off-white)] text-[clamp(32px,5.5vw,56px)] font-normal leading-[1.1] tracking-tight"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
          >
            {propertyTitle
              ? <>Enquire about {propertyTitle}</>
              : <>Let&apos;s start a conversation</>}
          </h1>

          <Text
            className="text-[var(--web-off-white)]/80 text-[clamp(14px,1.8vw,18px)] font-light leading-relaxed max-w-[540px]"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            {propertyTitle
              ? "Tell us what you'd like to know and we'll get back to you promptly."
              : "Whether you have a specific property in mind or are exploring your options, we're here to help."}
          </Text>
        </Stack>
      </div>

      {/* Contact bar — pinned to hero bottom, edge-to-edge, brand spruce */}
      <div className="relative z-10 w-full bg-[var(--web-spruce)]">
        <Container size="lg" className="px-4">
          <ContactBar />
        </Container>
      </div>
    </ParallaxHero>
  )
}

// =============================================================================
// CONSULTATION PROCESS SECTION
// Dark background with 3 steps
// =============================================================================

function ConsultationProcessSection() {
  const steps = [
    {
      number: "01",
      title: "Initial Response",
      description: "We'll respond to your enquiry within one business day to schedule a call.",
    },
    {
      number: "02",
      title: "Discovery Call",
      description: "A 30-minute conversation to understand your objectives and answer your questions.",
    },
    {
      number: "03",
      title: "Tailored Proposal",
      description: "Based on our discussion, we'll outline how we can best support your goals.",
    },
  ]

  return (
    <section
      className="py-[var(--web-section-gap)] relative"
      style={{
        backgroundColor: "#4a5a5e", // Blue-slate, consistent with other CTAs
      }}
    >
      {/* Subtle cityscape silhouette */}
      <div className="absolute inset-0 opacity-[0.08]">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-[center_bottom]"
          sizes="100vw"
        />
      </div>
      <Container size="xl" className="relative z-10">
        <Stack gap="xl" align="center" className="text-center mb-16">
          <span className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What to Expect
          </span>
          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.3]"
          >
            Our consultation process
          </Title>
          <Text className="text-white/60 text-[15px] font-light max-w-[500px]">
            A straightforward path from enquiry to tailored advice
          </Text>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white/5 rounded-[2px] p-8 text-center"
            >
              {/* Circle with number */}
              <div className="w-14 h-14 rounded-full border-2 border-[var(--web-serenity)]/40 flex items-center justify-center mx-auto mb-6">
                <span className="font-headline text-[var(--web-off-white)] text-lg">
                  {step.number}
                </span>
              </div>
              
              <Title
                as="h3"
                className="font-headline text-[var(--web-off-white)] text-lg font-normal mb-3 text-center"
              >
                {step.title}
              </Title>
              
              <Text className="text-[var(--web-serenity)] text-[13px] font-light leading-relaxed text-center">
                {step.description}
              </Text>
            </div>
          ))}
        </Grid>
      </Container>
      
      {/* Bottom separator line for visual break with footer */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
    </section>
  )
}
