/**
 * CATALYST - Prime Project Second Opinion Intake Page
 */

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckIcon,
  FileCheck2Icon,
  MessageSquareTextIcon,
  SearchCheckIcon,
} from "lucide-react"
import { Container, Grid, Row, Stack, Text, Title } from "@/components/core"
import {
  EducationalDisclaimer,
  SecondOpinionForm,
} from "@/components/shared/lead-magnet"
import { config } from "@/lib/config"

const HERO_IMAGE = "/images/hero/contact.jpg"

export const metadata: Metadata = {
  title: "Prime Project Second Opinion",
  description:
    "Send Prime a Dubai property and the claims or documents you want checked.",
  alternates: { canonical: config.links.leadMagnets.secondOpinion },
  openGraph: {
    title: "Prime Project Second Opinion",
    description:
      "A concise human-reviewed view of what appears supported, what remains unproven and the next decision to make.",
    url: config.links.leadMagnets.secondOpinion,
    images: [{ url: HERO_IMAGE, width: 1200, height: 630 }],
  },
}

const outcomes = [
  {
    icon: SearchCheckIcon,
    title: "What appears supported",
    body: "The parts of the property case that have a relevant source or a clear basis.",
  },
  {
    icon: FileCheck2Icon,
    title: "What remains unproven",
    body: "The claims that still need evidence, context or a better reference.",
  },
  {
    icon: MessageSquareTextIcon,
    title: "The next decision",
    body: "The question Prime would resolve before moving the property forward.",
  },
] as const

export default function ProjectSecondOpinionPage() {
  return (
    <div className="lead-magnet-page lead-magnet-page--second-opinion">
      <section className="lead-magnet-funnel-hero lead-magnet-funnel-hero--second-opinion">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="lead-magnet-funnel-hero__image"
          sizes="100vw"
        />
        <div className="lead-magnet-funnel-hero__veil" />

        <Container size="xl" className="lead-magnet-funnel-hero__container">
          <Grid cols={1} className="lead-magnet-funnel-hero__grid">
            <Stack gap="xl" className="lead-magnet-funnel-hero__copy">
              <Stack gap="lg">
                <Text className="lead-magnet-funnel-hero__eyebrow">
                  Prime Project Second Opinion
                </Text>
                <Title as="h1" className="lead-magnet-funnel-hero__title">
                  Put the property case in front of a person.
                </Title>
                <Text className="lead-magnet-funnel-hero__lead">
                  Send a listing, the documents, or the details you have. Tell us
                  your objective and the claim you want tested. A Prime adviser
                  will review the information with you.
                </Text>
              </Stack>

              <Stack gap="sm" className="lead-magnet-funnel-signals">
                {outcomes.map((outcome) => (
                  <Row key={outcome.title} gap="sm" align="center">
                    <span className="lead-magnet-funnel-signals__check">
                      <CheckIcon aria-hidden="true" />
                    </span>
                    <Text>{outcome.title}</Text>
                  </Row>
                ))}
              </Stack>

              <Text className="lead-magnet-funnel-hero__trust">
                RERA ORN {config.contact.reraOrn} · Human-reviewed · Private
                document handling
              </Text>
              <EducationalDisclaimer />
            </Stack>

            <aside className="lead-magnet-funnel-card lead-magnet-funnel-card--second-opinion">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Text className="lead-magnet-funnel-card__eyebrow">
                    Four short steps
                  </Text>
                  <Title as="h2" className="lead-magnet-funnel-card__title">
                    Request a Project Second Opinion
                  </Title>
                  <Text className="lead-magnet-funnel-card__intro">
                    Identify the property, add your objective, and tell the adviser
                    exactly what you want checked.
                  </Text>
                </Stack>
                <div className="lead-magnet-funnel-card__rule" />
                <SecondOpinionForm
                  consentLabel="I agree that Prime Capital may use my contact details and submitted documents to respond to this request. I understand this is educational guidance, not a valuation or recommendation."
                  submitLabel="Send my Second Opinion request"
                  confirmationUrl={
                    config.links.leadMagnets.secondOpinionConfirmation
                  }
                />
                <Text className="lead-magnet-funnel-card__privacy">
                  Files are used only to respond to this request and are retained
                  privately by Prime for six months. Read our{" "}
                  <Link href="/terms">terms and privacy information</Link>.
                </Text>
              </Stack>
            </aside>
          </Grid>
        </Container>
      </section>

      <section className="second-opinion-proof">
        <Container size="lg">
          <Grid cols={1} className="second-opinion-proof__intro">
            <Stack gap="md">
              <Text className="lead-magnet-section-kicker">
                What the conversation covers
              </Text>
              <Title as="h2" className="lead-magnet-section-heading">
                A decision review—not another sales presentation.
              </Title>
            </Stack>
            <Stack gap="md">
              <Text className="lead-magnet-section-lead">
                The adviser works from what you submit. The review separates the
                supported case from the unresolved claims, then identifies the
                next decision worth making.
              </Text>
              <Text className="lead-magnet-section-copy">
                It does not create a valuation, guarantee an outcome, or replace
                legal, tax or financial advice.
              </Text>
            </Stack>
          </Grid>

          <Grid cols={1} className="second-opinion-proof__outcomes">
            {outcomes.map((outcome, index) => {
              const Icon = outcome.icon
              return (
                <Stack key={outcome.title} gap="lg" className="second-opinion-proof__outcome">
                  <Row align="center" justify="between">
                    <Text>0{index + 1}</Text>
                    <Icon aria-hidden="true" />
                  </Row>
                  <Title as="h3">{outcome.title}</Title>
                  <Text>{outcome.body}</Text>
                </Stack>
              )
            })}
          </Grid>

          <Grid cols={1} className="second-opinion-proof__process">
            <Text>Property identified</Text>
            <Text>Objective stated</Text>
            <Text>Documents reviewed</Text>
            <Text>Adviser makes contact</Text>
          </Grid>
        </Container>
      </section>
    </div>
  )
}
