/**
 * CATALYST - Ahmed Ashfaq Landing Page
 *
 * YouTube lead-capture page for Ahmed Ashfaq. The page adapts the
 * Tahir home-page funnel shape to Prime Capital branding, with booking
 * in the hero and the strategy kit as the secondary route.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import {
  AhmedBookCallForm,
  AhmedCtaBand,
  AhmedHero,
  AhmedSectionHeader,
  AhmedTrustStrip,
  ahmedProfile,
} from "./_components/ahmed-funnel"
import {
  BarChart3Icon,
  Building2Icon,
  LandmarkIcon,
} from "lucide-react"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Ahmed Ashfaq | Dubai Property Advisory",
  description:
    "Book a call with Ahmed Ashfaq, Arab American Dubai-based real estate broker at Prime Capital Dubai, for data-led investment and luxury property advice.",
  alternates: {
    canonical: "/ahmed-ashfaq",
  },
  openGraph: {
    title: "Ahmed Ashfaq | Dubai Property Advisory",
    description:
      "Data-led Dubai property advice for local and international investors.",
    url: "/ahmed-ashfaq",
    images: [
      {
        url: ahmedProfile.ogImage,
        width: 1200,
        height: 630,
        alt: "Ahmed Ashfaq",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Ashfaq | Dubai Property Advisory",
    description:
      "Data-led Dubai property advice for local and international investors.",
    images: [ahmedProfile.ogImage],
  },
}

const stats = [
  { value: "20+", label: "Years of real estate experience" },
  { value: "4", label: "Languages for investor conversations" },
  { value: "6-10%", label: "Typical Dubai rental-yield range" },
  { value: "0%", label: "Capital gains tax in Dubai" },
]

const advisoryTracks = [
  {
    icon: BarChart3Icon,
    title: "Market-Led Strategy",
    body: "Understand where supply, pricing, rental demand, and developer performance actually support the investment case.",
  },
  {
    icon: LandmarkIcon,
    title: "Luxury Property Selection",
    body: "Shortlist premium homes and branded residences with attention to resale depth, lifestyle value, and ownership experience.",
  },
  {
    icon: Building2Icon,
    title: "Portfolio Management",
    body: "Shape a Dubai property portfolio around income, growth, residency, and long-term capital preservation.",
  },
]

const processSteps = [
  {
    title: "Clarify the brief",
    body: "Budget, time horizon, preferred use, target return, and what you want Dubai property to do for you.",
  },
  {
    title: "Compare routes",
    body: "Off-plan, ready, luxury, income-led, and Golden Visa pathways compared side by side.",
  },
  {
    title: "Move with evidence",
    body: "A focused shortlist with the numbers, trade-offs, and next steps made clear before you commit.",
  },
]

export default function AhmedLandingPage() {
  return (
    <div className="ahmed-page">
      <AhmedHero
        headline={
          <>
            Dubai property, led by <em>data</em>.
          </>
        }
        portrait={{
          src: ahmedProfile.image,
          alt: ahmedProfile.name,
          position: "center 18%",
        }}
        form={<AhmedBookCallForm />}
      />

      <AhmedTrustStrip />

      <section className="ahmed-section ahmed-section--warm">
        <Container size="lg">
          <Grid cols={1} className="ahmed-meet-grid">
            <Stack gap="lg">
              <Text className="ahmed-section-kicker">Meet Ahmed</Text>
              <Title as="h2" className="ahmed-section-title">
                An Arab American advisor, now based in Dubai.
              </Title>
            </Stack>
            <Stack gap="md" className="ahmed-prose">
              <Text>{ahmedProfile.bio}</Text>
              <Text>
                Fluent in four languages, Ahmed specializes in strategic real
                estate investments, luxury properties, and portfolio management
                with a strong focus on data-driven market insights, long-term
                value, and trusted client relationships.
              </Text>
              <div>
                <Link href="/ahmed-ashfaq/strategy-kit" className="ahmed-text-link">
                  Read the 2026 Strategy Kit
                </Link>
              </div>
            </Stack>
          </Grid>
        </Container>
      </section>

      <section className="ahmed-stats-band">
        <Container size="lg">
          <Grid cols={2} className="md:grid-cols-4 ahmed-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="ahmed-stat">
                <Text className="ahmed-stat__value">{stat.value}</Text>
                <Text className="ahmed-stat__label">{stat.label}</Text>
              </div>
            ))}
          </Grid>
        </Container>
      </section>

      <section className="ahmed-section bg-white">
        <Container size="lg">
          <AhmedSectionHeader
            eyebrow="How Ahmed Helps"
            headline="Advice for investors who want clarity before they move."
            lead="The call is built to separate signal from noise: market context, property fit, numbers, and next steps."
          />
          <Grid cols={3} className="ahmed-card-grid">
            {advisoryTracks.map((track) => {
              const Icon = track.icon
              return (
                <article key={track.title} className="ahmed-advisory-card">
                  <div className="ahmed-advisory-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Title as="h3" className="ahmed-card-title">
                    {track.title}
                  </Title>
                  <Text className="ahmed-card-body">{track.body}</Text>
                </article>
              )
            })}
          </Grid>
        </Container>
      </section>

      <section className="ahmed-section ahmed-section--dark">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <Stack gap="md">
              <Text className="ahmed-section-kicker ahmed-section-kicker--light">
                From YouTube To A Plan
              </Text>
              <Title as="h2" className="ahmed-section-title ahmed-section-title--light">
                Bring the question. Ahmed will help you frame the decision.
              </Title>
              <Text className="ahmed-dark-copy">
                Whether you are comparing communities, weighing off-plan against
                ready property, or trying to understand where Dubai fits in your
                wider portfolio, the conversation starts with your goal and the
                evidence behind the market.
              </Text>
            </Stack>
            <Grid cols={1} className="sm:grid-cols-3 gap-4">
              {processSteps.map((step, index) => (
                <article key={step.title} className="ahmed-process-card">
                  <Text className="ahmed-process-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                  <Title as="h3" className="ahmed-process-card__title">
                    {step.title}
                  </Title>
                  <Text className="ahmed-process-card__body">{step.body}</Text>
                </article>
              ))}
            </Grid>
          </Grid>
        </Container>
      </section>

      <section className="ahmed-section ahmed-section--warm">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[1fr_1fr] gap-10 items-center">
            <Stack gap="md">
              <Text className="ahmed-section-kicker">Free Investor Resource</Text>
              <Title as="h2" className="ahmed-section-title">
                Want to read first? Start with the Strategy Kit.
              </Title>
              <Text className="ahmed-prose-text">
                The kit gives you the market framework behind the conversations
                Ahmed has with serious investors: strategy types, area logic,
                payment plans, ROI context, and Golden Visa considerations.
              </Text>
            </Stack>
            <div className="ahmed-kit-panel">
              <div className="ahmed-kit-panel__book">
                <span>Dubai</span>
                <strong>Investor Strategy Kit</strong>
                <small>2026 Edition</small>
              </div>
              <div className="ahmed-kit-panel__copy">
                <Text className="ahmed-kit-panel__eyebrow">Prime Capital Dubai</Text>
                <Title as="h3" className="ahmed-kit-panel__title">
                  Read the guide, then book the follow-up call.
                </Title>
                <Link href="/ahmed-ashfaq/strategy-kit" className="ahmed-btn ahmed-btn--primary">
                  Get the kit
                </Link>
              </div>
            </div>
          </Grid>
        </Container>
      </section>

      <AhmedCtaBand
        eyebrow="Next Step"
        headline="Book a focused call with Ahmed."
        body="Share your goals, pick a time, and leave with a clearer view of which Dubai property route is worth exploring."
        primaryCta={{ label: "Book a call", href: "#enquiry-form" }}
        secondaryCta={{
          label: "Read the strategy kit",
          href: "/ahmed-ashfaq/strategy-kit",
        }}
      />
    </div>
  )
}
