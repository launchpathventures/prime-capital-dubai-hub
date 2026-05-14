/**
 * CATALYST - Ahmed Ashfaq Strategy Kit Page
 *
 * Lead magnet page for YouTube viewers who want the Prime Capital Dubai
 * investor framework before booking a call with Ahmed.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import {
  AhmedCtaBand,
  AhmedHero,
  AhmedSectionHeader,
  AhmedSignalList,
  AhmedStrategyKitForm,
  ahmedProfile,
} from "../_components/ahmed-funnel"
import {
  BadgeDollarSignIcon,
  Building2Icon,
  FileTextIcon,
  Globe2Icon,
  MapPinnedIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from "lucide-react"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Ahmed Ashfaq Dubai Investor Strategy Kit",
  description:
    "Get Ahmed Ashfaq's Prime Capital Dubai investor strategy kit covering Dubai market strategy, payment plans, ROI context, and Golden Visa considerations.",
  alternates: {
    canonical: "/ahmed-ashfaq/strategy-kit",
  },
  openGraph: {
    title: "Ahmed Ashfaq Dubai Investor Strategy Kit",
    description:
      "A practical investor briefing for Dubai property strategy, ROI context, and Golden Visa considerations.",
    url: "/ahmed-ashfaq/strategy-kit",
    images: [
      {
        url: ahmedProfile.kitImage,
        width: 1200,
        height: 630,
        alt: "Dubai Investor Strategy Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Ashfaq Dubai Investor Strategy Kit",
    description:
      "A practical investor briefing for Dubai property strategy, ROI context, and Golden Visa considerations.",
    images: [ahmedProfile.kitImage],
  },
}

const heroSignals = [
  "Income, growth, and legacy strategies compared",
  "Market zones and area selection logic",
  "Payment plans, costs, and Golden Visa considerations",
]

const kitTopics = [
  {
    icon: MapPinnedIcon,
    title: "Where Dubai is moving",
    body: "A practical read on districts, supply, rental demand, and the market signals worth watching.",
  },
  {
    icon: BadgeDollarSignIcon,
    title: "ROI and total cost",
    body: "Yield context, acquisition costs, service charges, and the assumptions that change the numbers.",
  },
  {
    icon: Building2Icon,
    title: "Off-plan vs. ready property",
    body: "How to compare payment-plan leverage, handover risk, rental timing, and resale depth.",
  },
  {
    icon: Globe2Icon,
    title: "Remote buyer process",
    body: "What international buyers need to know before reserving, transferring funds, and completing.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Golden Visa pathways",
    body: "The broad property-investment considerations that affect residency planning and timing.",
  },
  {
    icon: FileTextIcon,
    title: "Decision framework",
    body: "A simple way to decide whether income, growth, lifestyle, or legacy should lead the brief.",
  },
]

const strategyTracks = [
  {
    title: "Income-led",
    body: "Built around ready property, rental demand, and cash-flow discipline.",
  },
  {
    title: "Growth-led",
    body: "Focused on off-plan entry points, community expansion, and developer execution.",
  },
  {
    title: "Legacy-led",
    body: "Designed for families thinking about lifestyle, preservation, and long-term ownership.",
  },
]

export default function AhmedStrategyKitPage() {
  return (
    <div className="ahmed-page">
      <AhmedHero
        eyebrow="Free Investor Resource"
        headline={
          <>
            The Dubai property <em>strategy kit</em> for serious investors.
          </>
        }
        lead="Get the practical framework behind Ahmed's YouTube market conversations: strategy, areas, ROI context, payment plans, and next steps."
        imageSrc={ahmedProfile.kitImage}
        imagePosition="center 44%"
        form={<AhmedStrategyKitForm />}
      >
        <AhmedSignalList items={heroSignals} />
      </AhmedHero>

      <section className="ahmed-section ahmed-section--warm">
        <Container size="lg">
          <AhmedSectionHeader
            eyebrow="Inside The Kit"
            headline="A focused briefing, not a brochure."
            lead="Use it to understand the trade-offs before you book a call, shortlist property, or compare Dubai with another market."
          />
          <Grid cols={3} className="ahmed-card-grid">
            {kitTopics.map((topic) => {
              const Icon = topic.icon
              return (
                <article key={topic.title} className="ahmed-advisory-card">
                  <div className="ahmed-advisory-card__icon">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Title as="h3" className="ahmed-card-title">
                    {topic.title}
                  </Title>
                  <Text className="ahmed-card-body">{topic.body}</Text>
                </article>
              )
            })}
          </Grid>
        </Container>
      </section>

      <section className="ahmed-section bg-white">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <Stack gap="md">
              <Text className="ahmed-section-kicker">Choose The Right Route</Text>
              <Title as="h2" className="ahmed-section-title">
                Three investment tracks to compare before you move.
              </Title>
              <Text className="ahmed-prose-text">
                The goal is not to push one route. It is to understand which
                route fits your capital, time horizon, and appetite for
                involvement.
              </Text>
              <Link href="#enquiry-form" className="ahmed-text-link">
                Get the strategy kit
              </Link>
            </Stack>
            <div className="ahmed-track-list">
              {strategyTracks.map((track, index) => (
                <article key={track.title} className="ahmed-track">
                  <div className="ahmed-track__number">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <Title as="h3" className="ahmed-track__title">
                      {track.title}
                    </Title>
                    <Text className="ahmed-track__body">{track.body}</Text>
                  </div>
                </article>
              ))}
            </div>
          </Grid>
        </Container>
      </section>

      <section className="ahmed-section ahmed-section--dark">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
            <Stack gap="md">
              <Text className="ahmed-section-kicker ahmed-section-kicker--light">
                After You Read
              </Text>
              <Title as="h2" className="ahmed-section-title ahmed-section-title--light">
                Turn the framework into a personal investment plan.
              </Title>
              <Text className="ahmed-dark-copy">
                The best use of the kit is to mark up your questions: target
                budget, income needs, preferred hold period, residency goals,
                and communities you are already considering.
              </Text>
            </Stack>
            <div className="ahmed-proof-panel">
              <TrendingUpIcon className="h-6 w-6" />
              <Title as="h3" className="ahmed-proof-panel__title">
                Bring your notes to the call.
              </Title>
              <Text className="ahmed-proof-panel__body">
                Ahmed can then apply the same framework to your situation and
                identify the next document, model, or shortlist worth preparing.
              </Text>
            </div>
          </Grid>
        </Container>
      </section>

      <AhmedCtaBand
        eyebrow="Prefer To Talk?"
        headline="Book a call with Ahmed instead."
        body="If you already know your goals, skip the reading and use the call to compare routes directly."
        primaryCta={{ label: "Book a call", href: "/ahmed-ashfaq#enquiry-form" }}
        secondaryCta={{ label: "Back to Ahmed", href: "/ahmed-ashfaq" }}
      />
    </div>
  )
}
