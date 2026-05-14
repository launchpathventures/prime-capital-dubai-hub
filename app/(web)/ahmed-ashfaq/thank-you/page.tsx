/**
 * CATALYST - Ahmed Ashfaq Book Call Thank You
 *
 * Confirmation page after a Calendly booking is completed.
 */

import type { Metadata } from "next"
import Link from "next/link"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import {
  AhmedCtaBand,
  AhmedFormCard,
  AhmedHero,
  AhmedSignalList,
} from "../_components/ahmed-funnel"

export const metadata: Metadata = {
  title: "Thank you — Call booked with Ahmed Ashfaq",
  description: "Your call with Ahmed Ashfaq is confirmed.",
  robots: { index: false, follow: false },
}

const nextSteps = [
  "You will receive the calendar invite by email.",
  "Bring your goals, rough budget, and timeline.",
  "If you have properties in mind, keep the links ready.",
]

export default function AhmedBookCallThankYouPage() {
  return (
    <div className="ahmed-page">
      <AhmedHero
        eyebrow="Call Confirmed"
        headline={
          <>
            You&rsquo;re booked with <em>Ahmed</em>.
          </>
        }
        lead="Your call is confirmed. Ahmed will use the details you shared to make the conversation focused, practical, and relevant to your Dubai property goals."
        form={
          <AhmedFormCard
            heading="Before the call"
            intro="A little preparation makes the 30 minutes more useful."
          >
            <AhmedSignalList items={nextSteps} />
            <div className="ahmed-form-card__actions">
              <Link
                href="/ahmed-ashfaq/strategy-kit"
                className="ahmed-btn ahmed-btn--primary"
              >
                Read the strategy kit
              </Link>
            </div>
          </AhmedFormCard>
        }
      >
        <AhmedSignalList
          items={[
            "Check your inbox for the calendar invite",
            "Use the strategy kit if you want to prepare first",
          ]}
        />
      </AhmedHero>

      <section className="ahmed-section ahmed-section--warm">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <Stack gap="md">
              <Text className="ahmed-section-kicker">How To Prepare</Text>
              <Title as="h2" className="ahmed-section-title">
                Make the call specific to your situation.
              </Title>
            </Stack>
            <Stack gap="md" className="ahmed-prose">
              <Text>
                If you are still deciding where to start, read the 2026
                Strategy Kit before the call. It gives you the market framework
                Ahmed will use to compare routes.
              </Text>
              <Text>
                If anything changes, use the reschedule or cancel links in your
                calendar invite. That keeps the booking clean and avoids missed
                follow-up.
              </Text>
            </Stack>
          </Grid>
        </Container>
      </section>

      <AhmedCtaBand
        eyebrow="Useful Resource"
        headline="Read the investor framework before the call."
        body="The strategy kit covers the market, property routes, payment-plan logic, ROI context, and Golden Visa considerations."
        primaryCta={{
          label: "Open strategy kit page",
          href: "/ahmed-ashfaq/strategy-kit",
        }}
        secondaryCta={{ label: "Back to Ahmed", href: "/ahmed-ashfaq" }}
      />
    </div>
  )
}
