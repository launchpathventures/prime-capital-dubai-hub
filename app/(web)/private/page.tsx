/**
 * CATALYST - Prime Capital Private
 *
 * Ultra-high-net-worth investor channel. A separate front door for $5–10M+
 * investors who arrive via intermediaries, not marketing. The design is
 * intentionally distinct from the main brand: darker, quieter, more spacious.
 *
 * Structure:
 * 1. Full-viewport hero — dark, minimal, serif headline
 * 2. Positioning — who this is for, what it solves
 * 3. Pillars — the 4 concerns UHNW investors have
 * 4. How we work — 3-step engagement
 * 5. Credentials — quiet proof
 * 6. CTA — private consultation
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Grid, Text, Title } from "@/components/core"
import { Button } from "@/components/ui/button"
import { LeadForm } from "@/components/shared/lead-form"
import { config } from "@/lib/config"
import {
  ShieldCheckIcon,
  LockKeyholeIcon,
  GlobeIcon,
  HandshakeIcon,
  ChevronDownIcon,
} from "lucide-react"

export const metadata = {
  title: "Private | Prime Capital Dubai",
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
// HERO
// =============================================================================

function HeroSection() {
  return (
    <section className="pcp-hero">
      {/* Background — Emirates Hills villa, quiet luxury */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2400&auto=format&fit=crop"
          alt=""
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="pcp-hero-overlay" />
      </div>

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
    </section>
  )
}

// =============================================================================
// POSITIONING
// =============================================================================

function PositioningSection() {
  return (
    <section className="pcp-section pcp-positioning">
      <Container size="sm" className="px-6">
        <Stack gap="lg" align="center" className="text-center">
          <Title
            as="h2"
            className="pcp-section-headline"
          >
            A different kind of engagement
          </Title>

          <div className="pcp-divider" />

          <Text className="pcp-body max-w-[520px]">
            Deploying significant capital into a new market brings real
            questions — about how funds move, how privacy is maintained,
            how residency works, and who you're actually dealing with.
          </Text>

          <Text className="pcp-body max-w-[520px]">
            Prime Capital Private is for investors and their professional
            advisors who need these questions answered properly before
            anything else happens.
          </Text>
        </Stack>
      </Container>
    </section>
  )
}

// =============================================================================
// PILLARS
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
        "Multi-asset deployment across Dubai's prime corridors. Strategy, not just transactions.",
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

        <Grid cols={1} className="md:grid-cols-2 gap-6 pcp-pillars-grid">
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
// ENGAGEMENT — How it works
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
// CREDENTIALS
// =============================================================================

function CredentialsSection() {
  const credentials = [
    { value: "AED 6.5B+", label: "Transaction Volume" },
    { value: "15+", label: "Years in Dubai" },
    { value: "94%", label: "Client Retention" },
  ]

  return (
    <section className="pcp-section pcp-credentials">
      {/* Subtle background image — Dubai skyline, very faint */}
      <div className="absolute inset-0 -z-10 opacity-[0.04]">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2800&auto=format&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <Container size="md" className="relative z-10 px-6">
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
// CTA
// =============================================================================

function CTASection() {
  return (
    <section id="enquire" className="pcp-section pcp-cta">
      <Container size="sm" className="px-6">
        <Stack gap="lg" align="center" className="text-center">
          <div className="pcp-cta-rule" />

          <Title as="h2" className="pcp-section-headline">
            Start a conversation
          </Title>

          <Text className="pcp-body max-w-[400px]">
            Whether you're an investor or an advisor representing one,
            we're happy to talk.
          </Text>
        </Stack>

        {/* Private lead form — dark theme to match page */}
        <div className="mt-12 max-w-[480px] mx-auto">
          <LeadForm mode="private" theme="dark" />
        </div>

        <Stack gap="sm" align="center" className="mt-10 text-center">
          <Text className="pcp-body-muted text-[13px]">
            Or email{" "}
            <a
              href={`mailto:${config.contact.email}?subject=Private Enquiry`}
              className="pcp-inline-link"
            >
              {config.contact.email}
            </a>
          </Text>

          <div className="pcp-cta-rule" />
        </Stack>
      </Container>
    </section>
  )
}
