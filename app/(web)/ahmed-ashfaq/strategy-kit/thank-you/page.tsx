/**
 * CATALYST - Ahmed Ashfaq Strategy Kit Thank You
 *
 * Post-download access page. Opens the Prime Capital strategy kit and
 * continues the journey into a prefilled booking form.
 */

import type { Metadata } from "next"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import {
  AhmedBookCallForm,
  AhmedCtaBand,
  AhmedHero,
  AhmedSignalList,
  ahmedProfile,
} from "../../_components/ahmed-funnel"
import { config } from "@/lib/config"

export const metadata: Metadata = {
  title: "Thank you — Ahmed Ashfaq Strategy Kit",
  description: "Access the Prime Capital Dubai Investor Strategy Kit.",
  robots: { index: false, follow: false },
}

const accessSignals = [
  "Open the kit now and keep this page for booking",
  "Your contact details carry into the call form",
  "Use the call to apply the framework to your budget and goals",
]

export default function AhmedStrategyKitThankYouPage() {
  return (
    <div className="ahmed-page">
      <AhmedHero
        eyebrow="Your Kit Is Ready"
        headline={
          <>
            Turn the kit into a <em>personal</em> Dubai property plan.
          </>
        }
        lead="Open the investor framework now. If you want Ahmed to apply it to your goals, complete the booking form here without repeating your contact details."
        imageSrc={ahmedProfile.kitImage}
        imagePosition="center 44%"
        form={
          <AhmedBookCallForm
            tag="youtube-ahmed-strategy-kit-booking"
            prefillFromStrategyKit
          />
        }
      >
        <div className="ahmed-action-row">
          <a
            href={config.links.ahmedStrategyKit}
            target="_blank"
            rel="noreferrer"
            className="ahmed-btn ahmed-btn--primary"
          >
            Open the strategy kit
          </a>
        </div>
        <AhmedSignalList items={accessSignals} />
      </AhmedHero>

      <section className="ahmed-section ahmed-section--warm">
        <Container size="lg">
          <Grid cols={1} className="lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
            <Stack gap="md">
              <Text className="ahmed-section-kicker">What Happens Next</Text>
              <Title as="h2" className="ahmed-section-title">
                Read first, then book with better questions.
              </Title>
            </Stack>
            <Stack gap="md" className="ahmed-prose">
              <Text>
                The best next step is to skim the kit for the strategy route
                that sounds closest to your goal: income, growth, lifestyle, or
                long-term portfolio value.
              </Text>
              <Text>
                When you book, Ahmed can focus the conversation around your
                capital, preferred timeline, and whether Dubai should be an
                income play, a capital-growth play, or part of a broader family
                plan.
              </Text>
            </Stack>
          </Grid>
        </Container>
      </section>

      <AhmedCtaBand
        eyebrow="Keep Moving"
        headline="Open the kit and book the follow-up call."
        body="Use the kit as the briefing document. Use the call to pressure-test the route against your actual situation."
        primaryCta={{
          label: "Open the strategy kit",
          href: config.links.ahmedStrategyKit,
          external: true,
        }}
        secondaryCta={{ label: "Back to Ahmed", href: "/ahmed-ashfaq" }}
      />
    </div>
  )
}
