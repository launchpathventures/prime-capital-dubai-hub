/**
 * CATALYST - Prime Project Second Opinion Confirmation
 */

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Center, Container, Grid, Stack, Text, Title } from "@/components/core"
import { EducationalDisclaimer } from "@/components/shared/lead-magnet"

const HERO_IMAGE = "/images/hero/private.jpg"

export const metadata: Metadata = {
  title: "Second Opinion Request Received",
  robots: { index: false, follow: false },
}

const nextSteps = [
  {
    number: "01",
    title: "Prime reviews the request",
    body: "The assigned adviser starts with the property, objective and specific points you asked them to test.",
  },
  {
    number: "02",
    title: "The adviser makes contact",
    body: "They will confirm the review timing and ask for anything material that is still missing.",
  },
  {
    number: "03",
    title: "You discuss the decision",
    body: "The conversation covers what appears supported, what remains unproven and the next decision to make.",
  },
] as const

export default function SecondOpinionConfirmationPage() {
  return (
    <div className="second-opinion-confirmation">
      <section className="second-opinion-confirmation__hero">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="second-opinion-confirmation__image"
          sizes="100vw"
        />
        <div className="second-opinion-confirmation__veil" />
        <Container size="lg" className="second-opinion-confirmation__container">
          <Stack gap="2xl" className="second-opinion-confirmation__content">
            <Center className="second-opinion-confirmation__mark">
              <CheckIcon aria-hidden="true" />
            </Center>
            <Stack gap="lg">
              <Text className="lead-magnet-funnel-hero__eyebrow">
                Request received
              </Text>
              <Title as="h1" className="second-opinion-confirmation__title">
                Your property is now with Prime.
              </Title>
              <Text className="second-opinion-confirmation__lead">
                Your property information, objective and review request have been
                recorded. A Prime adviser will contact you to take the decision
                forward.
              </Text>
            </Stack>
          </Stack>
        </Container>
      </section>

      <section className="second-opinion-confirmation__next">
        <Container size="lg">
          <Grid cols={1} className="second-opinion-confirmation__intro">
            <Stack gap="md">
              <Text className="lead-magnet-section-kicker">What happens now</Text>
              <Title as="h2" className="lead-magnet-section-heading">
                The review stays focused on the decision you submitted.
              </Title>
            </Stack>
            <Stack gap="md">
              <Text className="lead-magnet-section-lead">
                No automatic deadline has been attached to the request. The
                adviser will confirm timing when they first contact you.
              </Text>
              <EducationalDisclaimer />
            </Stack>
          </Grid>

          <Grid cols={1} className="second-opinion-confirmation__steps">
            {nextSteps.map((step) => (
              <Stack key={step.number} gap="lg">
                <Text>{step.number}</Text>
                <Title as="h3">{step.title}</Title>
                <Text>{step.body}</Text>
              </Stack>
            ))}
          </Grid>

          <Button size="lg" render={<Link href="/" />}>
            Return to Prime Capital
            <ArrowRightIcon aria-hidden="true" />
          </Button>
        </Container>
      </section>
    </div>
  )
}
