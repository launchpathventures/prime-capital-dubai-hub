/**
 * CATALYST - Prime Capital Private
 *
 * Ultra-high-net-worth investor channel. A separate front door for $5–10M+
 * investors who arrive via intermediaries, not marketing. The design is
 * intentionally distinct from the main brand: darker, quieter, more spacious.
 *
 * Design philosophy: The luxury is in the restraint. No image galleries,
 * no stock photography. One cinematic hero, then typography, space, and
 * muted gold accents do the work. Every section earns its place.
 *
 * Structure:
 * 1. Full-viewport parallax hero — cinematic, very dark
 * 2. Positioning — centred text, generous space, validating
 * 3. Pillars — refined card grid, icon-led, no images
 * 4. How we work — numbered steps on warm ivory
 * 5. Credentials — quiet stats, dark background
 * 6. CTA — two-column with embedded lead form
 */

import Link from "next/link"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/shared/lead-form"
import { config } from "@/lib/config"
import { ParallaxHero } from "../_surface/parallax-hero"
import {
  ShieldCheckIcon,
  LockKeyholeIcon,
  GlobeIcon,
  HandshakeIcon,
  ChevronDownIcon,
} from "lucide-react"

export const metadata = {
  title: "Private",
  description:
    "Private real estate advisory for investors and their advisors deploying significant capital into Dubai.",
  alternates: {
    canonical: "/private",
  },
}

export default function PrivatePage() {
  return (
    <div className="pcp">
      <HeroSection />
      <PositioningSection />
      <PillarsSection />
      <EngagementSection />
      <CredentialsSection />
      <CTASection />
    </div>
  )
}

// =============================================================================
// HERO — Cinematic parallax. One image for the entire page. Very dark.
// =============================================================================

function HeroSection() {
  return (
    <ParallaxHero
      imageUrl="https://images.unsplash.com/photo-1751473058035-3b7ef98d0367?q=80&w=2400&auto=format&fit=crop"
      overlay="linear-gradient(to bottom, rgba(26,26,31,0.45) 0%, rgba(26,26,31,0.65) 50%, rgba(26,26,31,0.92) 100%)"
      intensity={0.08}
      className="pcp-hero"
      priority
    >
      <Container size="md" className="relative z-10 px-6">
        <Stack gap="lg" align="center" className="text-center pcp-hero-content">
          {/* Wordmark */}
          <div className="pcp-wordmark">
            <span className="pcp-wordmark-prime">Prime Capital</span>
            <span className="pcp-wordmark-divider" />
            <span className="pcp-wordmark-private">Private</span>
          </div>

          {/* Headline */}
          <h1 className="pcp-headline">
            Private real estate advisory
            <br className="hidden sm:block" />
            {" "}for significant investors
          </h1>

          {/* Subline */}
          <p className="pcp-subline">
            For investors and their advisors deploying
            <br className="hidden sm:block" />
            {" "}meaningful capital into Dubai real estate.
          </p>

          {/* CTA */}
          <Button
            size="lg"
            className="pcp-hero-cta"
            render={<Link href="#enquire" />}
          >
            Arrange a Conversation
          </Button>
        </Stack>
      </Container>

      {/* Scroll indicator */}
      <div className="pcp-scroll-hint">
        <ChevronDownIcon className="h-5 w-5" />
      </div>
    </ParallaxHero>
  )
}

// =============================================================================
// POSITIONING — Centred. Generous space. No image — the words do the work.
// =============================================================================

function PositioningSection() {
  return (
    <section className="pcp-section pcp-positioning">
      <Container size="sm" className="px-6">
        <Stack gap="lg" align="center" className="text-center">
          <span className="pcp-eyebrow">Who This Is For</span>

          <Title as="h2" className="pcp-section-headline">
            A different kind of engagement
          </Title>

          <div className="pcp-divider" />

          <Text className="pcp-body max-w-[540px]">
            Deploying significant capital into a new market brings real
            questions — about how funds move, how privacy is maintained,
            how residency works, and who you&#39;re actually dealing with.
          </Text>

          <Text className="pcp-body max-w-[540px]">
            Prime Capital Private is for investors and their professional
            advisors who need these questions answered properly before
            anything else happens.
          </Text>

          <Text className="pcp-body-emphasis max-w-[480px]">
            No sales pressure. No marketing noise.
            <br />
            Just substance, clarity, and discretion.
          </Text>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// PILLARS — Refined card grid. Icon-led. No images. Let the detail breathe.
// =============================================================================

function PillarsSection() {
  const pillars = [
    {
      icon: ShieldCheckIcon,
      title: "Capital Movement",
      description:
        "Clear, compliant pathways for moving funds into Dubai. Coordinated with your existing legal and tax advisors.",
      points: [
        "Regulated transaction frameworks",
        "Coordination with your counsel",
        "Escrow and settlement oversight",
      ],
    },
    {
      icon: LockKeyholeIcon,
      title: "Privacy",
      description:
        "Confidentiality throughout. Your transactions are not marketed, your details are not shared.",
      points: [
        "NDA-protected engagements",
        "No public transaction records",
        "Direct principal communication",
      ],
    },
    {
      icon: GlobeIcon,
      title: "Residency & Visa",
      description:
        "Golden Visa facilitation integrated into your investment strategy, coordinated with immigration counsel.",
      points: [
        "10-year residency through qualifying assets",
        "Family sponsorship structuring",
        "Banking and business setup support",
      ],
    },
    {
      icon: HandshakeIcon,
      title: "Portfolio Strategy",
      description:
        "Multi-asset deployment across Dubai&#39;s prime corridors. Strategy, not just transactions.",
      points: [
        "Diversified across areas and asset types",
        "Off-market and pre-launch access",
        "Ongoing asset management",
      ],
    },
  ]

  return (
    <section className="pcp-section pcp-pillars">
      <Container size="lg" className="px-6">
        <Stack gap="lg" align="center" className="text-center mb-16">
          <span className="pcp-eyebrow">What We Address</span>
          <Title as="h2" className="pcp-section-headline">
            The questions that come first
          </Title>
        </Stack>

        <Grid cols={1} className="md:grid-cols-2 gap-px pcp-pillars-grid">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <div key={pillar.title} className="pcp-pillar-card">
                <div className="pcp-pillar-icon">
                  <Icon className="h-5 w-5" />
                </div>

                <Title as="h3" className="pcp-pillar-title">
                  {pillar.title}
                </Title>

                <Text className="pcp-pillar-description">
                  {pillar.description}
                </Text>

                <ul className="pcp-pillar-points">
                  {pillar.points.map((point) => (
                    <li key={point}>
                      <span className="pcp-pillar-bullet" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </Grid>
      </Container>
    </section>
  )
}

// =============================================================================
// ENGAGEMENT — Numbered steps on warm ivory. No image — focus on the process.
// =============================================================================

function EngagementSection() {
  const steps = [
    {
      number: "01",
      title: "Conversation",
      description:
        "A private call with a founding principal. We listen — your objectives, timeline, advisory relationships, and concerns. Nothing is pitched.",
    },
    {
      number: "02",
      title: "Strategy",
      description:
        "A tailored deployment plan: which assets, which areas, how capital moves, and how residency integrates. Shared with your advisors for review.",
    },
    {
      number: "03",
      title: "Execution",
      description:
        "Coordinated acquisition, settlement, and ongoing management. One relationship, full transparency.",
    },
  ]

  return (
    <section className="pcp-section pcp-engagement">
      <Container size="md" className="px-6">
        <Stack gap="lg" align="center" className="text-center mb-16">
          <span className="pcp-eyebrow">How We Work</span>
          <Title as="h2" className="pcp-section-headline-dark">
            A simple, structured process
          </Title>
          <Text className="pcp-body-dark max-w-[460px]">
            Every engagement follows a clear path — designed for
            confidence, not complexity.
          </Text>
        </Stack>

        <div className="pcp-steps">
          {steps.map((step, i) => (
            <div key={step.number} className="pcp-step">
              <div className="pcp-step-number">{step.number}</div>
              <div className="pcp-step-content">
                <Title as="h3" className="pcp-step-title">
                  {step.title}
                </Title>
                <Text className="pcp-step-description">
                  {step.description}
                </Text>
              </div>
              {i < steps.length - 1 && <div className="pcp-step-line" />}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

// =============================================================================
// CREDENTIALS — Quiet stats. Dark. No background image — just numbers.
// =============================================================================

function CredentialsSection() {
  const credentials = [
    { value: "AED 6.5B+", label: "Transaction Volume" },
    { value: "15+", label: "Years in Dubai" },
    { value: "94%", label: "Client Retention" },
  ]

  return (
    <section className="pcp-section pcp-credentials">
      <Container size="md" className="px-6">
        <Stack gap="lg" align="center" className="text-center mb-12">
          <span className="pcp-eyebrow">Track Record</span>
          <Title as="h2" className="pcp-section-headline">
            Proven delivery
          </Title>
        </Stack>

        <div className="pcp-credentials-grid">
          {credentials.map((cred) => (
            <div key={cred.label} className="pcp-credential">
              <div className="pcp-credential-value">{cred.value}</div>
              <div className="pcp-credential-label">{cred.label}</div>
            </div>
          ))}
        </div>

        <Text className="pcp-body-muted text-center max-w-[380px] mx-auto mt-10">
          Anonymised case studies and references available during consultation.
        </Text>
      </Container>
    </section>
  )
}

// =============================================================================
// CTA — Two-column with embedded lead form
// =============================================================================

function CTASection() {
  return (
    <section id="enquire" className="pcp-section pcp-cta">
      <Container size="xl" className="px-6">
        <div className="pcp-cta-layout">
          {/* Left: copy */}
          <Stack gap="md" className="pcp-cta-copy">
            <div className="pcp-cta-rule" />

            <Title as="h2" className="pcp-section-headline">
              Start a conversation
            </Title>

            <Text className="pcp-body max-w-[440px]">
              Whether you&#39;re an investor or an advisor representing one,
              we&#39;re happy to talk. Share a few details and a senior member of
              our team will be in touch within one business day.
            </Text>

            <Stack gap="xs" className="mt-4">
              <Text className="pcp-body-muted text-[13px]">
                Or contact us directly
              </Text>
              <a
                href={`mailto:${config.contact.email}?subject=Private Enquiry`}
                className="pcp-inline-link text-[15px]"
              >
                {config.contact.email}
              </a>
              <a
                href={`tel:${config.contact.phone}`}
                className="pcp-inline-link text-[15px]"
              >
                {config.contact.phone}
              </a>
            </Stack>

            <div className="pcp-cta-rule mt-6" />
          </Stack>

          {/* Right: lead form */}
          <div className="pcp-cta-form-wrapper">
            <LeadForm mode="private" theme="dark" />
          </div>
        </div>
      </Container>
    </section>
  )
}
