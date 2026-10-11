/**
 * CATALYST - India Roadshow Landing Page
 *
 * Registration page for the three-city India roadshow (30, 31 Oct and 1 Nov
 * 2026). Reuses the London event page styling (london- classes) and the shared
 * event LeadForm, adding an attendance-location choice that flows to AgentCRM
 * as `eventCity`.
 */

import type { Metadata } from "next"
import Image from "next/image"
import {
  ArrowRightIcon,
  BarChart3Icon,
  Building2Icon,
  CalendarDaysIcon,
  CompassIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "lucide-react"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import type { EventCityOption } from "@/components/shared/lead-form/types"
import {
  INDIA_ROADSHOW_DATES,
  INDIA_ROADSHOW_STOPS,
  INDIA_ROADSHOW_TAG,
} from "@/lib/events/india-roadshow"

export const revalidate = 300

const EVENT_CITIES: EventCityOption[] = INDIA_ROADSHOW_STOPS.map((stop) => ({
  // Value is the bare city: AgentCRM looks up reminder date and venue from it
  value: stop.city,
  day: stop.day,
  date: stop.date,
  venue: stop.venue,
  hours: stop.hours,
}))

const roadshowReasons = [
  {
    icon: BarChart3Icon,
    number: "01",
    title: "See the market clearly",
    body: "A candid, data-led view of Dubai pricing, supply, rental fundamentals and risk, from the people working in the market every day.",
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
    title: "Meet the team in person",
    body: "Put your questions directly to Prime Capital Dubai advisors, without a screen or a sales script in between.",
  },
]

const roadshowSteps = [
  {
    number: "01",
    title: "Register",
    body: "Share your name, email and WhatsApp number, and choose the city you will attend.",
  },
  {
    number: "02",
    title: "Get your details",
    body: "We confirm your place and send a reminder with the venue and timing for your city.",
  },
  {
    number: "03",
    title: "Join us",
    body: "Meet the Prime Capital Dubai team and get answers to your Dubai property questions.",
  },
]

export const metadata: Metadata = {
  title: "Dubai Property Roadshow in India — 30 Oct to 1 Nov 2026",
  description:
    "Meet the Prime Capital Dubai team in three Indian cities on 30 and 31 October and 1 November 2026. Register your place for a free, no-obligation Dubai property investment session.",
  alternates: {
    canonical: "/india-roadshow",
  },
  openGraph: {
    title: "Prime Capital Dubai — India roadshow",
    description:
      "Three cities, three days. Register to meet Prime Capital Dubai in India on 30, 31 October and 1 November 2026.",
    url: "/india-roadshow",
    images: [
      {
        url: "/images/hero/prime-capital-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Prime Capital Dubai India roadshow",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prime Capital Dubai — India roadshow",
    description:
      "Three cities, three days. Register to meet Prime Capital Dubai in India on 30, 31 October and 1 November 2026.",
    images: ["/images/hero/prime-capital-hero.jpg"],
  },
}

export default function IndiaRoadshowPage() {
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
                Prime Capital Dubai · India roadshow
              </Text>

              <h1 className="london-display">
                Dubai property,
                <br />
                <em>face to face.</em>
              </h1>

              <Text className="london-hero__lead">
                Three cities in three days. Meet the Prime Capital Dubai team in
                India for a clear, honest view of the opportunities, risks and
                on-the-ground reality shaping Dubai property now.
              </Text>

              <div className="london-event-details" aria-label="Roadshow details">
                <div className="london-event-detail">
                  <CalendarDaysIcon aria-hidden />
                  <div>
                    <Text className="london-event-detail__label">When</Text>
                    <Text className="london-event-detail__value">
                      {INDIA_ROADSHOW_DATES}
                    </Text>
                  </div>
                </div>
                <div className="london-event-detail">
                  <MapPinIcon aria-hidden />
                  <div>
                    <Text className="london-event-detail__label">Where</Text>
                    <Text className="london-event-detail__value">
                      {INDIA_ROADSHOW_STOPS.map((stop) => stop.city).join(" · ")}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="london-hero__assurance">
                <ShieldCheckIcon aria-hidden />
                <Text>Free to attend, private and entirely without obligation.</Text>
              </div>
            </Stack>

            <aside id="register" className="london-booking-card">
              <div className="london-booking-card__header">
                <Text className="london-booking-card__eyebrow">Register your place</Text>
                <Title as="h2" className="london-booking-card__title">
                  Join us in India
                </Title>
                <Text className="london-booking-card__intro">
                  Tell us who you are and which city you will attend. We will
                  confirm your place on WhatsApp.
                </Text>
              </div>
              <div className="london-booking-card__rule" />
              <div className="london-booking-card__form">
                <LeadForm
                  mode="event"
                  theme="light"
                  autoFocus={false}
                  tag={INDIA_ROADSHOW_TAG}
                  downloadAsset="India Roadshow 2026"
                  eventCities={EVENT_CITIES}
                  finalSubmitLabel="Register"
                  successMessage="You're registered. We'll confirm your place by WhatsApp and email."
                />
              </div>
              <Text className="london-booking-card__note">
                Your details stay private.
              </Text>
            </aside>
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--paper">
        <Container size="lg">
          <div className="london-section-heading">
            <Text align="center" className="london-section-kicker">
              Three cities, three days
            </Text>
            <Title as="h2" align="center" className="london-section-title">
              Choose the city that suits you.
            </Title>
          </div>

          <Grid cols={1} className="md:grid-cols-3 roadshow-stop-grid">
            {INDIA_ROADSHOW_STOPS.map((stop, index) => (
              <article key={stop.city} className="roadshow-stop">
                <Text className="roadshow-stop__number">
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text className="roadshow-stop__date">
                  {stop.day} {stop.date}
                </Text>
                <Title as="h3" className="roadshow-stop__city">
                  {stop.city}
                </Title>
                <Text className="roadshow-stop__note">{stop.venue}</Text>
                <Text className="roadshow-stop__note">{stop.hours}</Text>
              </article>
            ))}
          </Grid>
        </Container>
      </section>

      <section className="london-section london-section--dark">
        <Container size="lg">
          <div className="london-section-heading london-section-heading--light">
            <Text align="center" className="london-section-kicker london-section-kicker--light">
              Why attend
            </Text>
            <Title
              as="h2"
              align="center"
              className="london-section-title london-section-title--light"
            >
              The signal beneath the noise.
            </Title>
            <Text align="center" className="london-section-heading__lead">
              A practical market conversation designed to improve decision
              quality, not pressure you into a purchase.
            </Text>
          </div>

          <Grid cols={1} className="md:grid-cols-3 london-reason-grid">
            {roadshowReasons.map((reason) => {
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

      <section className="london-section london-section--paper">
        <Container size="lg">
          <Grid cols={1} className="london-process-grid">
            <Stack gap="md">
              <Text className="london-section-kicker">How it works</Text>
              <Title as="h2" className="london-section-title">
                Register in under a minute.
              </Title>
              <Text className="london-prose-text">
                You do not need to be ready to buy. You only need a serious
                question about whether Dubai belongs in your plans.
              </Text>
            </Stack>

            <div className="london-step-list">
              {roadshowSteps.map((step) => (
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
                {INDIA_ROADSHOW_DATES} · India
              </Text>
              <Title as="h2" className="london-final-cta__title">
                Reserve your place at the roadshow.
              </Title>
              <Text className="london-final-cta__body">
                Free to attend. Choose your city and register today.
              </Text>
            </Stack>
            <div className="london-final-cta__action">
              {/* Plain anchor: next/link hash navigation doesn't scroll to the form */}
              <a href="#register" className="london-button">
                Register now
                <ArrowRightIcon aria-hidden />
              </a>
            </div>
          </Grid>
        </Container>
      </section>
    </div>
  )
}
