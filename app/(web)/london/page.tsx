/**
 * CATALYST - London Investor Meetings Landing Page
 *
 * Private in-person invitation for London-based investors considering Dubai
 * property. Uses Ahmed's existing booking calendar and CRM routing.
 */

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  BarChart3Icon,
  Building2Icon,
  CalendarDaysIcon,
  CheckIcon,
  CompassIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { config } from "@/lib/config"
import { AHMED_TEAM_MEMBER_SLUG } from "../ahmed-ashfaq/_components/ahmed-funnel"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Dubai Property Investor Meetings in London",
  description:
    "Meet Prime Capital Dubai advisors Ahmed Ashfaq and Ruhaan Chawla in Central London on 1 or 2 August 2026 for a free, no-obligation 30–45 minute discussion about Dubai property investment.",
  alternates: {
    canonical: "/london",
  },
  openGraph: {
    title: "Dubai, beyond the headlines — London investor meetings",
    description:
      "Private, in-person meetings with Prime Capital Dubai advisors Ahmed Ashfaq and Ruhaan Chawla in Central London on 1 and 2 August 2026.",
    url: "/london",
    images: [
      {
        url: "/images/hero/prime-capital-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Prime Capital Dubai investor meetings in London",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubai, beyond the headlines — London investor meetings",
    description:
      "Private, in-person meetings with Prime Capital Dubai advisors Ahmed Ashfaq and Ruhaan Chawla in Central London on 1 and 2 August 2026.",
    images: ["/images/hero/prime-capital-hero.jpg"],
  },
}

const meetingReasons = [
  {
    icon: BarChart3Icon,
    number: "01",
    title: "See the market clearly",
    body: "Separate durable demand, supply, pricing and rental fundamentals from the stories that dominate the headlines.",
  },
  {
    icon: CompassIcon,
    number: "02",
    title: "Find your route in",
    body: "Compare ready, off-plan, income-led and long-term growth strategies against your capital, timeline and risk appetite.",
  },
  {
    icon: Building2Icon,
    number: "03",
    title: "Access what comes next",
    body: "Discuss projects and early-stage opportunities before the next phase of Dubai's growth becomes yesterday's news.",
  },
]

const investorGoals = [
  "Assess whether Dubai belongs in your wider investment portfolio",
  "Diversify beyond UK property and traditional home-market exposure",
  "Compare realistic capital-growth and rental-income opportunities",
  "Explore a future relocation or residency strategy with greater clarity",
  "Shortlist the right property route for your budget, goals and time horizon",
]

const meetingSteps = [
  {
    number: "01",
    title: "Choose a time",
    body: "Select an available appointment on Saturday 1 or Sunday 2 August.",
  },
  {
    number: "02",
    title: "Name the place",
    body: "Tell us where in Central London is most convenient for you.",
  },
  {
    number: "03",
    title: "We come to you",
    body: "Meet Ahmed and Ruhaan for a focused, private conversation in person.",
  },
]

export default function LondonInvestorMeetingsPage() {
  return (
    <div className="london-page">
      <section className="london-hero">
        <div className="london-hero__media" aria-hidden>
          <Image
            src="/images/hero/prime-capital-hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="london-hero__image"
          />
          <div className="london-hero__veil" />
        </div>

        <Container size="xl" className="relative z-10 w-full">
          <Grid cols={1} className="london-hero__grid">
            <Stack gap="lg" className="london-hero__copy">
              <Text className="london-eyebrow">
                Private investor meetings · Central London
              </Text>

              <h1 className="london-display">
                Dubai, beyond
                <br />
                <em>the headlines.</em>
              </h1>

              <Text className="london-hero__lead">
                Meet Prime Capital advisors Ahmed Ashfaq and Ruhaan Chawla in London and get
                a candid, data-led view of the opportunities, risks and on-the-ground
                reality shaping Dubai property now.
              </Text>

              <div className="london-event-details" aria-label="Meeting details">
                <div className="london-event-detail">
                  <CalendarDaysIcon aria-hidden />
                  <div>
                    <Text className="london-event-detail__label">When</Text>
                    <Text className="london-event-detail__value">
                      Saturday 1 &amp; Sunday 2 August 2026
                    </Text>
                  </div>
                </div>
                <div className="london-event-detail">
                  <MapPinIcon aria-hidden />
                  <div>
                    <Text className="london-event-detail__label">Where</Text>
                    <Text className="london-event-detail__value">
                      Central London — you choose the location
                    </Text>
                  </div>
                </div>
              </div>

              <div className="london-hero__assurance">
                <ShieldCheckIcon aria-hidden />
                <Text>Free, private and entirely without obligation.</Text>
              </div>
            </Stack>

            <aside id="book" className="london-booking-card">
              <div className="london-booking-card__header">
                <Text className="london-booking-card__eyebrow">By invitation</Text>
                <Title as="h2" className="london-booking-card__title">
                  Reserve your London meeting
                </Title>
              <Text className="london-booking-card__intro">
                  Share your details, then choose an available 30–45 minute meeting
                  from Ahmed&rsquo;s booking calendar.
                </Text>
              </div>
              <div className="london-booking-card__rule" />
              <div className="london-booking-card__form">
                <LeadForm
                  mode="event"
                  theme="light"
                  autoFocus={false}
                  tag="london-investor-meetings-august-2026"
                  calendlyUrl={config.links.ahmedBooking}
                  initialData={{ referringTeamMember: AHMED_TEAM_MEMBER_SLUG }}
                  propertyLabel="Preferred Central London meeting location"
                  propertyPlaceholder="Hotel, members' club, office or neighbourhood"
                  contactSubmitLabel="View available times"
                  successMessage="Choose a time that works and add your preferred Central London meeting point."
                />
              </div>
              <Text className="london-booking-card__note">
                Two dates only. Your details stay private.
              </Text>
            </aside>
          </Grid>
        </Container>
      </section>

      <section className="london-proof-strip" aria-label="Meeting credentials">
        <Container size="lg">
          <Grid cols={1} className="md:grid-cols-3 london-proof-strip__grid">
            <div className="london-proof-strip__item">
              <Text className="london-proof-strip__value">2</Text>
              <Text className="london-proof-strip__label">Dubai advisors, in person</Text>
            </div>
            <div className="london-proof-strip__item">
              <Text className="london-proof-strip__value">20+</Text>
              <Text className="london-proof-strip__label">Years across market cycles</Text>
            </div>
            <div className="london-proof-strip__item">
              <Text className="london-proof-strip__value">30–45</Text>
              <Text className="london-proof-strip__label">Minutes, shaped around you</Text>
            </div>
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--paper">
        <Container size="lg">
          <Grid cols={1} className="london-intro-grid">
            <Stack gap="md">
              <Text className="london-section-kicker">Why meet now</Text>
              <Title as="h2" className="london-section-title">
                Stop wondering whether Dubai is viable. Start with the evidence.
              </Title>
            </Stack>
            <Stack gap="md" className="london-prose">
              <Text>
                Dubai property attracts no shortage of attention. What investors
                need is not another headline, but a clear view of what is actually
                happening on the ground — where the market is supported, where the
                risks sit, and which opportunities deserve conviction.
              </Text>
              <Text>
                This is an unhurried, private conversation with people working in
                the market every day. Bring your questions, assumptions and concerns.
                Leave with a better framework for deciding what to do next.
              </Text>
            </Stack>
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--dark">
        <Container size="lg">
          <div className="london-section-heading london-section-heading--light">
            <Text align="center" className="london-section-kicker london-section-kicker--light">
              What you will gain
            </Text>
            <Title
              as="h2"
              align="center"
              className="london-section-title london-section-title--light"
            >
              The signal beneath the noise.
            </Title>
            <Text align="center" className="london-section-heading__lead">
              A practical market conversation designed to increase decision quality,
              not pressure you into a purchase.
            </Text>
          </div>

          <Grid cols={1} className="md:grid-cols-3 london-reason-grid">
            {meetingReasons.map((reason) => {
              const Icon = reason.icon
              return (
                <article key={reason.title} className="london-reason-card">
                  <div className="london-reason-card__topline">
                    <Icon className="london-reason-card__icon" aria-hidden />
                    <Text className="london-reason-card__number">{reason.number}</Text>
                  </div>
                  <Title as="h3" className="london-reason-card__title">
                    {reason.title}
                  </Title>
                  <Text className="london-reason-card__body">{reason.body}</Text>
                </article>
              )
            })}
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--white">
        <Container size="lg">
          <Grid cols={1} className="london-fit-grid">
            <Stack gap="md">
              <Text className="london-section-kicker">A useful conversation if you want to</Text>
              <Title as="h2" className="london-section-title">
                Make a considered move, not a speculative one.
              </Title>
              <Text className="london-prose-text">
                You do not need to be ready to buy. You only need a serious question
                about whether Dubai can support the next chapter of your investment or
                relocation plans.
              </Text>
            </Stack>

            <div className="london-goal-list">
              {investorGoals.map((goal) => (
                <div key={goal} className="london-goal-list__item">
                  <span className="london-goal-list__icon" aria-hidden>
                    <CheckIcon />
                  </span>
                  <Text>{goal}</Text>
                </div>
              ))}
            </div>
          </Grid>
        </Container>
      </section>

      <section className="london-section london-team-section">
        <Container size="lg">
          <div className="london-section-heading">
            <Text align="center" className="london-section-kicker">Meet the team</Text>
            <Title as="h2" align="center" className="london-section-title">
              Ahmed and Ruhaan. One honest conversation.
            </Title>
            <Text
              align="center"
              className="london-section-heading__lead london-section-heading__lead--dark"
            >
              Direct access to the people who assess the market, negotiate with
              developers and guide international investors through real decisions.
            </Text>
          </div>

          <Grid cols={1} className="md:grid-cols-2 london-team-grid">
            <article className="london-team-card">
              <div className="london-team-card__portrait">
                <Image
                  src="/images/team/Ruhaan Chawla .JPG"
                  alt="Ruhaan Chawla"
                  fill
                  sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                  className="london-team-card__image london-team-card__image--ruhaan"
                />
              </div>
              <div className="london-team-card__copy">
                <Text className="london-team-card__role">Property Advisor</Text>
                <Title as="h3" className="london-team-card__name">Ruhaan Chawla</Title>
                <Text className="london-team-card__bio">
                  A Prime Capital advisor focused on helping international investors
                  navigate Dubai property with clear, practical guidance from the first conversation.
                </Text>
              </div>
            </article>

            <article className="london-team-card">
              <div className="london-team-card__portrait">
                <Image
                  src="/images/team/ahmed-ashfaq.jpg"
                  alt="Ahmed Ashfaq"
                  fill
                  sizes="(min-width: 768px) 40vw, calc(100vw - 3rem)"
                  className="london-team-card__image london-team-card__image--ahmed"
                />
              </div>
              <div className="london-team-card__copy">
                <Text className="london-team-card__role">Senior Property Advisor</Text>
                <Title as="h3" className="london-team-card__name">Ahmed Ashfaq</Title>
                <Text className="london-team-card__bio">
                  A Dubai-based advisor with more than 20 years of real estate
                  experience, specialising in data-led investment strategy and luxury property.
                </Text>
              </div>
            </article>
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--paper">
        <Container size="lg">
          <Grid cols={1} className="london-process-grid">
            <Stack gap="md">
              <Text className="london-section-kicker">How it works</Text>
              <Title as="h2" className="london-section-title">
                Your meeting, on your terms.
              </Title>
              <Text className="london-prose-text">
                No seminar. No group presentation. Just a private meeting arranged
                around your diary and a Central London location that suits you.
              </Text>
            </Stack>

            <div className="london-step-list">
              {meetingSteps.map((step) => (
                <div key={step.number} className="london-step">
                  <Text className="london-step__number">{step.number}</Text>
                  <div>
                    <Title as="h3" className="london-step__title">{step.title}</Title>
                    <Text className="london-step__body">{step.body}</Text>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Container>
      </section>

      <section className="london-final-cta">
        <Container size="lg">
          <Grid cols={1} className="london-final-cta__grid">
            <Stack gap="sm">
              <Text className="london-section-kicker london-section-kicker--light">
                1 &amp; 2 August · Central London
              </Text>
              <Title as="h2" className="london-final-cta__title">
                Get the clarity to invest with conviction.
              </Title>
              <Text className="london-final-cta__body">
                Reserve a free, no-obligation meeting with Ahmed and Ruhaan.
              </Text>
            </Stack>
            <div className="london-final-cta__action">
              <Link href="#book" className="london-button">
                Reserve your meeting
                <ArrowRightIcon aria-hidden />
              </Link>
            </div>
          </Grid>
        </Container>
      </section>
    </div>
  )
}
