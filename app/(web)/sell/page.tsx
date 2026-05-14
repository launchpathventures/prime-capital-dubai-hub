/**
 * CATALYST - Seller Landing Page
 *
 * Campaign landing page targeting sellers of distressed property in the UAE.
 * Empathetic, advisory tone — selling is only one option. CTA is a 15-minute
 * zero-obligation call with Managing Director Tahir Majithia.
 *
 * Leads tagged "seller" for CRM routing.
 */

export const revalidate = 300 // 5 minutes ISR

import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { getWebTestimonials } from "@/lib/content"
import { config } from "@/lib/config"
import {
  CheckIcon,
  PhoneIcon,
  ShieldCheckIcon,
  UsersIcon,
  HandshakeIcon,
  ScaleIcon,
  ClockIcon,
  MessageCircleIcon,
  AwardIcon,
  BuildingIcon,
  BriefcaseIcon,
} from "lucide-react"

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2500&auto=format&fit=crop"

export const metadata = {
  title: "Considering Selling Your Property? | Prime Capital Dubai",
  description:
    "Speak with Prime Capital Dubai's Managing Director for honest, zero-obligation advice on your property options. Selling is only one path — let's find the right one for you.",
  alternates: {
    canonical: "/sell",
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Considering Selling Your Property? | Prime Capital Dubai",
    description:
      "Honest, zero-obligation advice on your property options from Prime Capital Dubai's Managing Director.",
    url: "/sell",
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dubai property advisory",
      },
    ],
  },
}

export default async function SellPage() {
  const testimonials = await getWebTestimonials()

  return (
    <div className="web-sell">
      <HeroSection />
      <SituationSection />
      <AdvisorSection />
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      <ProcessSection />
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO SECTION
// Empathetic opening — not "sell your property", but "understand your options".
// =============================================================================

function HeroSection() {
  return (
    <section className="relative overflow-hidden lg:min-h-[90vh] flex items-center">
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
            "linear-gradient(135deg, rgba(63,65,66,0.93) 0%, rgba(87,108,117,0.87) 40%, rgba(63,65,66,0.94) 100%)",
        }}
      />

      <Container size="xl" className="relative z-10 w-full">
        <div className="pt-28 pb-12 lg:py-40">
          <Grid
            cols={1}
            className="lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-16 xl:gap-24 items-start"
          >
            {/* Left Column — Content (shown second on mobile, first on desktop) */}
            <div className="order-2 lg:order-1">
              <Text
                className="block text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em] mb-5"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Honest Advice, Not a Hard Sell
              </Text>

              <Title
                as="h1"
                className="font-headline text-[var(--web-off-white)] text-[clamp(34px,5.5vw,54px)] font-normal leading-[1.1] tracking-tight mb-6"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.4)" }}
              >
                Considering Your
                <br />
                Property Options?
              </Title>

              <Text
                className="text-white/80 text-[clamp(15px,2vw,19px)] font-light leading-relaxed mb-6 lg:mb-10 max-w-[520px]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
              >
                Whether you&apos;re thinking about selling, unsure of your next
                step, or just need clarity on where you stand — a 15-minute
                conversation with our Managing Director could save you months of
                uncertainty.
              </Text>

              {/* Benefit list — hidden on mobile to keep form above fold */}
              <div className="hidden lg:block space-y-3 mb-10">
                {[
                  "Zero-obligation, confidential conversation",
                  "Honest assessment — selling isn't always the answer",
                  "Direct access to qualified buyers if you choose to sell",
                  "RERA-licensed, 15+ years UAE market experience",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--web-serenity)]/20 flex items-center justify-center shrink-0">
                      <CheckIcon className="h-3 w-3 text-[var(--web-serenity)]" />
                    </div>
                    <Text className="text-white/70 text-[14px] font-light">
                      {benefit}
                    </Text>
                  </div>
                ))}
              </div>

              {/* Trust line — hidden on mobile */}
              <div className="hidden lg:flex items-center gap-4 pt-5 border-t border-white/10">
                <Text className="text-white/40 text-[12px] font-light tracking-wide">
                  RERA ORN {config.contact.reraOrn} · Trusted by international
                  property owners
                </Text>
              </div>
            </div>

            {/* Right Column — Form Card (shown first on mobile) */}
            <div id="enquiry-form" className="order-1 lg:order-2 lg:sticky lg:top-28">
              <div className="bg-white rounded-[2px] shadow-2xl overflow-hidden">
                {/* Form header */}
                <div className="px-8 pt-8 pb-0">
                  <Title
                    as="h2"
                    className="font-headline text-[var(--web-ash)] text-[22px] font-normal mb-1"
                  >
                    Book a 15-Minute Call
                  </Title>
                  <Text className="text-[var(--web-spruce)] text-[13px] font-light mb-6">
                    Speak directly with Tahir Majithia, Managing Director
                  </Text>
                  <div className="h-px bg-[var(--web-serenity)]/20" />
                </div>

                {/* Form body */}
                <div className="px-8 py-6">
                  <LeadForm
                    mode="landing"
                    theme="light"
                    tag="seller"
                    showPropertyFields
                    showConcerns
                    calendlyUrl={config.links.calendlySeller}
                    successMessage="Pick a time that works — Tahir will call you personally."
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
// SITUATION SECTION
// Addresses three seller personas — empathetic, not salesy.
// =============================================================================

function SituationSection() {
  const situations = [
    {
      icon: ScaleIcon,
      title: "Not Sure If You Should Sell?",
      description:
        "The market is complex. Sometimes holding is the better move. We'll give you an honest assessment of your position, current market conditions, and what each option really looks like financially.",
    },
    {
      icon: ClockIcon,
      title: "Need to Exit Quickly?",
      description:
        "Life changes don't wait for the perfect market. If you need to move fast, we have a backlog of qualified, pre-vetted buyers actively looking. No long listing periods, no uncertainty.",
    },
    {
      icon: HandshakeIcon,
      title: "Want to Understand Your Options?",
      description:
        "Sell, hold, restructure, refinance — there are more paths than most people realise. A 15-minute conversation can map out your options so you can make a decision with confidence.",
    },
  ]

  return (
    <section className="py-[var(--web-section-gap)] bg-white">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <Text className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            We Understand Your Situation
          </Text>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Every property owner&apos;s situation is different
          </Title>
          <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-[560px]">
            That&apos;s why we start with listening — not listing. Tell us where
            you are, and we&apos;ll help you see where you can go.
          </Text>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {situations.map((situation) => {
            const Icon = situation.icon
            return (
              <div
                key={situation.title}
                className="text-center p-8 bg-[var(--web-off-white)] rounded-[2px]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                </div>
                <Title as="h3" className="font-headline text-[var(--web-ash)] text-[18px] font-normal mb-3">
                  {situation.title}
                </Title>
                <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.7]">
                  {situation.description}
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
// ADVISOR SECTION
// Tahir Majithia credibility & background.
// =============================================================================

function AdvisorSection() {
  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <Text className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Your Advisor
          </Text>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            You&apos;ll speak directly with our Managing Director
          </Title>
        </Stack>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[2px] overflow-hidden">
            <Grid
              cols={1}
              className="md:grid-cols-[280px_1fr] items-stretch"
            >
              {/* Photo */}
              <div className="relative aspect-[3/4] md:aspect-auto bg-[var(--web-ash)]">
                <Image
                  src="/images/team/tahir-majithia.jpg"
                  alt="Tahir Majithia, Managing Director of Prime Capital Dubai"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>

              {/* Bio */}
              <div className="p-8 md:p-10">
                <Title
                  as="h3"
                  className="font-headline text-[var(--web-ash)] text-[24px] font-normal mb-1"
                >
                  Tahir Majithia
                </Title>
                <Text className="text-[var(--web-spruce)] text-[14px] font-normal mb-6">
                  Managing Director, Prime Capital Dubai
                </Text>

                <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.8] mb-6">
                  With over 15 years in Dubai real estate and a background in
                  financial services, Tahir founded Prime Capital to bring a
                  different standard of advisory to the market. His approach is
                  simple: understand first, advise second, and only recommend
                  action when it truly serves the client&apos;s interest.
                </Text>

                <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.8] mb-8">
                  He works directly with property owners navigating complex
                  situations — whether that&apos;s a time-sensitive exit, a
                  portfolio restructure, or simply needing an honest second
                  opinion on the right move. No junior agents, no call centres.
                  Just experienced, confidential guidance.
                </Text>

                {/* Credentials */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: AwardIcon,
                      text: "RERA Certified Broker",
                    },
                    {
                      icon: BuildingIcon,
                      text: "750+ Properties Transacted",
                    },
                    {
                      icon: BriefcaseIcon,
                      text: "Financial Services Background",
                    },
                    {
                      icon: UsersIcon,
                      text: "94% Client Retention Rate",
                    },
                  ].map((credential) => {
                    const Icon = credential.icon
                    return (
                      <div
                        key={credential.text}
                        className="flex items-center gap-2.5"
                      >
                        <Icon className="h-4 w-4 text-[var(--web-spruce)] shrink-0" />
                        <Text className="text-[var(--web-ash)] text-[13px] font-normal">
                          {credential.text}
                        </Text>
                      </div>
                    )
                  })}
                </div>
              </div>
            </Grid>
          </div>
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// TESTIMONIALS SECTION
// Social proof from real clients.
// =============================================================================

import type { Testimonial } from "@/lib/content-types"

function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  // Show up to 3 testimonials
  const displayed = testimonials.slice(0, 3)

  return (
    <section className="py-[var(--web-section-gap)] bg-white">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <Text className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            What Our Clients Say
          </Text>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Trusted by property owners across the UAE
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {displayed.map((testimonial) => (
            <div
              key={testimonial.id}
              className="p-8 bg-[var(--web-off-white)] rounded-[2px] relative"
            >
              {/* Quote mark */}
              <div className="text-[var(--web-spruce)]/15 text-[48px] font-serif leading-none absolute top-4 right-6">
                &ldquo;
              </div>

              <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.8] mb-6 relative z-10">
                &ldquo;{testimonial.quote}&rdquo;
              </Text>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--web-spruce)]/10 flex items-center justify-center">
                  <Text className="text-[var(--web-spruce)] text-[13px] font-medium">
                    {testimonial.authorName.charAt(0)}
                  </Text>
                </div>
                <div>
                  <Text className="text-[var(--web-ash)] text-[13px] font-medium">
                    {testimonial.authorName}
                  </Text>
                  {(testimonial.authorTitle ||
                    testimonial.authorLocation) && (
                    <Text className="text-[var(--web-spruce)] text-[12px] font-light">
                      {testimonial.authorTitle &&
                        `${testimonial.authorTitle}`}
                      {testimonial.authorTitle &&
                        testimonial.authorLocation &&
                        ", "}
                      {testimonial.authorLocation}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// PROCESS SECTION
// Simple 3-step process to set expectations.
// =============================================================================

function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: MessageCircleIcon,
      title: "Share Your Situation",
      description:
        "Fill in the short form above, or book a call directly. Tell us as much or as little as you're comfortable with — we'll take it from there.",
    },
    {
      number: "02",
      icon: PhoneIcon,
      title: "Speak with Tahir",
      description:
        "A 15-minute call to understand your goals, timeline, and circumstances. No pressure, no obligation — just honest professional perspective.",
    },
    {
      number: "03",
      icon: ShieldCheckIcon,
      title: "Get a Tailored Recommendation",
      description:
        "Whether it's selling to our buyer network, holding, restructuring, or another path entirely — you'll leave with a clear view of your options.",
    },
  ]

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="lg">
        <Stack gap="md" align="center" className="text-center mb-14">
          <Text className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.2em]">
            How It Works
          </Text>
          <Title
            as="h2"
            align="center"
            className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal leading-[1.25]"
          >
            Three steps to clarity
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="text-center p-8 bg-white rounded-[2px]">
                {/* Step number */}
                <div className="text-[var(--web-serenity)] text-[12px] font-normal tracking-[0.15em] uppercase mb-4">
                  Step {step.number}
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--web-spruce)]/7 flex items-center justify-center mx-auto mb-5">
                  <Icon className="h-5 w-5 text-[var(--web-spruce)]" />
                </div>
                <Title as="h3" className="font-headline text-[var(--web-ash)] text-[18px] font-normal mb-3">
                  {step.title}
                </Title>
                <Text className="text-[var(--web-spruce)] text-[14px] font-light leading-[1.7]">
                  {step.description}
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
// CTA SECTION
// Final push — empathetic, low-pressure.
// =============================================================================

function CTASection() {
  return (
    <section
      className="py-[var(--web-section-gap)] relative overflow-hidden"
      style={{
        backgroundColor: "var(--web-ash)",
        backgroundImage:
          "linear-gradient(135deg, var(--web-ash) 0%, #2a2b2c 100%)",
      }}
    >
      <Container size="md" className="relative z-10">
        <Stack gap="lg" align="center" className="text-center">
          <Text className="text-[var(--web-serenity)] text-[11px] font-normal uppercase tracking-[0.2em]">
            Start With a Conversation
          </Text>

          <Title
            as="h2"
            className="font-headline text-[var(--web-off-white)] text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.2]"
          >
            15 minutes could change your perspective
          </Title>

          <Text className="text-white/60 text-[15px] font-light leading-relaxed max-w-[500px]">
            No commitment, no pressure. Just an honest conversation with
            someone who&apos;s helped hundreds of property owners navigate
            exactly this situation.
          </Text>

          <a
            href="#enquiry-form"
            className="btn-hover-lift mt-4 h-14 px-12 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-spruce)]/90 rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em] shadow-lg inline-flex items-center justify-center transition-colors no-underline"
          >
            Book Your Free Call
          </a>

          <Text className="text-[var(--web-serenity)] text-[12px] font-light mt-2">
            Confidential · Zero obligation · Response within 24 hours
          </Text>
        </Stack>
      </Container>
    </section>
  )
}
