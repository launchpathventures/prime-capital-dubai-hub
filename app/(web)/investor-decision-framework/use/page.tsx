/**
 * CATALYST - Dubai Investor Decision Framework Working Page
 */

import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { CheckIcon } from "lucide-react"
import { Container, Grid, Row, Stack, Text, Title } from "@/components/core"
import {
  FRAMEWORK_SECOND_OPINION_PREFILL_KEY,
} from "@/lib/lead-magnets/constants"
import {
  EducationalDisclaimer,
  FrameworkPrintButton,
  SecondOpinionForm,
} from "@/components/shared/lead-magnet"
import { FRAMEWORK_CHECKS } from "@/lib/lead-magnets/content"
import { config } from "@/lib/config"

const HERO_IMAGE = "/images/hero/properties.jpg"

export const metadata: Metadata = {
  title: "Use the Dubai Investor Decision Framework",
  description:
    "Work through five checks against a specific Dubai property and record what is supported, unproven and still to decide.",
  robots: { index: false, follow: false },
}

interface InvestorDecisionFrameworkPageProps {
  searchParams: Promise<{ review?: string }>
}

export default async function InvestorDecisionFrameworkPage({
  searchParams,
}: InvestorDecisionFrameworkPageProps) {
  const cookieStore = await cookies()
  const { review } = await searchParams
  const hasReviewAccess =
    process.env.NODE_ENV !== "production" && review === "1"

  if (
    cookieStore.get("pc_framework_access")?.value !== "granted" &&
    !hasReviewAccess
  ) {
    redirect(config.links.leadMagnets.frameworkLanding)
  }

  return (
    <div className="lead-magnet-page lead-magnet-page--framework-use">
      <header className="framework-document-hero">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          priority
          className="framework-document-hero__image"
          sizes="100vw"
        />
        <div className="framework-document-hero__veil" />
        <Container size="xl" className="framework-document-hero__container">
          <Stack gap="xl" className="framework-document-hero__copy">
            <Text className="lead-magnet-funnel-hero__eyebrow">
              Prime Capital · Investor working reference
            </Text>
            <Title as="h1" className="framework-document-hero__title">
              Five checks before a reservation becomes a decision.
            </Title>
            <Text className="framework-document-hero__lead">
              Put one property in front of you. State the outcome you require.
              Then work through the checks in order and keep the answers in your
              own notes.
            </Text>
            <Row gap="lg" wrap className="framework-document-hero__meta">
              <Text>05 decision checks</Text>
              <Text>71-second walkthrough</Text>
              <Text>Print-ready reference</Text>
            </Row>
          </Stack>
        </Container>
      </header>

      <main>
        <section className="framework-briefing">
          <Container size="xl">
            <Grid cols={1} className="framework-briefing__grid">
              <Stack gap="sm">
                <Text className="lead-magnet-section-kicker">Before you begin</Text>
                <Title as="h2" className="framework-briefing__title">
                  Fix the objective before you test the property.
                </Title>
              </Stack>
              <Grid cols={1} className="framework-briefing__prompts">
                <Stack gap="xs">
                  <Text>01 · Property</Text>
                  <Title as="h3">Name the specific property.</Title>
                </Stack>
                <Stack gap="xs">
                  <Text>02 · Objective</Text>
                  <Title as="h3">State what it must achieve.</Title>
                </Stack>
                <Stack gap="xs">
                  <Text>03 · Discipline</Text>
                  <Title as="h3">Do not change the objective to fit the property.</Title>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </section>

        <section className="framework-walkthrough-refined print-hidden">
          <Container size="xl">
            <Grid cols={1} className="framework-walkthrough-refined__grid">
              <Stack gap="lg">
                <Text className="lead-magnet-section-kicker">How to use it</Text>
                <Title as="h2" className="lead-magnet-section-heading">
                  See the complete decision sequence before you start.
                </Title>
                <Text className="lead-magnet-section-copy">
                  Objective first. Exit last. The middle checks establish the
                  financial commitment, the evidence and the genuine alternatives
                  between them.
                </Text>
                <Stack gap="sm" className="framework-walkthrough-refined__sequence">
                  {FRAMEWORK_CHECKS.map((check) => (
                    <Row key={check.number} gap="sm" align="center">
                      <Text>{check.number}</Text>
                      <Text>{check.shortLabel}</Text>
                    </Row>
                  ))}
                </Stack>
              </Stack>
              <div className="framework-video framework-video--refined">
                <video
                  controls
                  preload="metadata"
                  playsInline
                  poster="/videos/investor-decision-framework-walkthrough-poster.png"
                >
                  <source
                    src={config.links.leadMagnets.frameworkWalkthrough}
                    type="video/webm"
                  />
                  <track
                    kind="captions"
                    src="/videos/investor-decision-framework-walkthrough.vtt"
                    srcLang="en"
                    label="English"
                    default
                  />
                  Your browser does not support this video.
                </video>
              </div>
            </Grid>
          </Container>
        </section>

        <section className="framework-workspace">
          <Container size="xl">
            <Grid cols={1} className="framework-workspace__grid">
              <aside className="framework-rail print-hidden">
                <Stack gap="xl" className="framework-rail__inner">
                  <Stack gap="sm">
                    <Text className="lead-magnet-section-kicker">Decision file</Text>
                    <Title as="h2">Work in order.</Title>
                    <Text>
                      Each check ends with one line to record before you move on.
                    </Text>
                  </Stack>
                  <nav aria-label="Framework checks">
                    {FRAMEWORK_CHECKS.map((check) => (
                      <Link key={check.number} href={`#check-${check.number}`}>
                        <span>{check.number}</span>
                        {check.shortLabel}
                      </Link>
                    ))}
                  </nav>
                  <Stack gap="sm" className="framework-rail__rule">
                    <Text>Decision rule</Text>
                    <Text>
                      A missing answer stays visible. It does not become evidence
                      because the reservation date is close.
                    </Text>
                  </Stack>
                  <FrameworkPrintButton />
                </Stack>
              </aside>

              <Stack gap="none" className="framework-file">
                {FRAMEWORK_CHECKS.map((check) => (
                  <article
                    key={check.number}
                    id={`check-${check.number}`}
                    className="framework-file-check print-avoid-break"
                  >
                    <Row align="start" justify="between" className="framework-file-check__header">
                      <Stack gap="sm">
                        <Text className="framework-file-check__label">
                          Check {check.number} · {check.shortLabel}
                        </Text>
                        <Title as="h2">{check.title}</Title>
                      </Stack>
                      <Text className="framework-file-check__number">
                        {check.number}
                      </Text>
                    </Row>

                    <Text className="framework-file-check__establish">
                      {check.establish}
                    </Text>

                    <Grid cols={1} className="framework-file-check__evidence-grid">
                      <Stack gap="lg" className="framework-file-panel">
                        <Text className="framework-file-panel__label">
                          Evidence to place beside this check
                        </Text>
                        <Stack gap="none">
                          {check.evidence.map((item, index) => (
                            <Row key={item} gap="md" align="start" className="framework-file-row">
                              <Text>0{index + 1}</Text>
                              <Text>{item}</Text>
                            </Row>
                          ))}
                        </Stack>
                      </Stack>

                      <Stack gap="lg" className="framework-file-panel">
                        <Text className="framework-file-panel__label">
                          Questions that change the decision
                        </Text>
                        <Stack gap="none">
                          {check.questions.map((question, index) => (
                            <Row key={question} gap="md" align="start" className="framework-file-row">
                              <Text>0{index + 1}</Text>
                              <Text>{question}</Text>
                            </Row>
                          ))}
                        </Stack>
                      </Stack>
                    </Grid>

                    <Grid cols={1} className="framework-file-check__decision">
                      <Stack gap="xs">
                        <Text>If the answer is missing</Text>
                        <Text>{check.missing}</Text>
                      </Stack>
                      <Stack gap="xs">
                        <Text>Record before moving on</Text>
                        <Text>{check.record}</Text>
                      </Stack>
                    </Grid>
                  </article>
                ))}

                <section className="framework-decision-record print-avoid-break">
                  <Stack gap="lg">
                    <Text className="lead-magnet-section-kicker">
                      Final decision record
                    </Text>
                    <Title as="h2">
                      Finish without repeating the sales case.
                    </Title>
                    <Text>
                      The framework is complete when you can state the position in
                      three short lines.
                    </Text>
                  </Stack>
                  <Stack gap="none" className="framework-decision-record__lines">
                    {[
                      "What appears supported",
                      "What remains unproven",
                      "The next decision to make",
                    ].map((line, index) => (
                      <Row key={line} gap="lg" align="center">
                        <Text>0{index + 1}</Text>
                        <Title as="h3">{line}</Title>
                      </Row>
                    ))}
                  </Stack>
                </section>
              </Stack>
            </Grid>
          </Container>
        </section>

        <section className="framework-onward-refined print-hidden">
          <Container size="xl">
            <Grid cols={1} className="framework-onward-refined__grid">
              <Stack gap="xl" className="framework-onward-refined__copy">
                <Text className="lead-magnet-section-kicker">
                  A specific property, reviewed by a person
                </Text>
                <Title as="h2" className="lead-magnet-section-heading">
                  Want a second opinion on what the framework exposed?
                </Title>
                <Text className="lead-magnet-section-lead">
                  Send Prime the property, your objective, and the claims or
                  documents you want tested. An adviser will cover what appears
                  supported, what remains unproven, and the next decision they
                  would make.
                </Text>

                <Stack gap="none" className="framework-onward-refined__signals">
                  <Row gap="sm" align="start" className="framework-onward-refined__note">
                    <CheckIcon aria-hidden="true" />
                    <Text>
                      Human-reviewed by a Prime adviser—not an automated score or
                      another sales presentation.
                    </Text>
                  </Row>
                  <Row gap="sm" align="start" className="framework-onward-refined__note">
                    <CheckIcon aria-hidden="true" />
                    <Text>
                      RERA ORN {config.contact.reraOrn} · Private document handling
                      · Contact details carried forward.
                    </Text>
                  </Row>
                </Stack>
                <EducationalDisclaimer />
              </Stack>

              <aside className="lead-magnet-funnel-card framework-onward-refined__form">
                <Stack gap="lg">
                  <Stack gap="xs">
                    <Text className="lead-magnet-funnel-card__eyebrow">
                      Start your review
                    </Text>
                    <Title as="h3" className="lead-magnet-funnel-card__title">
                      Put the property case in front of an adviser.
                    </Title>
                    <Text className="lead-magnet-funnel-card__intro">
                      Your contact details are already attached. Identify the
                      property, state your objective, and add the claims or
                      documents you want checked.
                    </Text>
                  </Stack>
                  <div className="lead-magnet-funnel-card__rule" />
                  <SecondOpinionForm
                    consentLabel="I agree that Prime Capital may use my contact details and submitted documents to respond to this request. I understand this is educational guidance, not a valuation or recommendation."
                    submitLabel="Send my Second Opinion request"
                    confirmationUrl={
                      config.links.leadMagnets.secondOpinionConfirmation
                    }
                    prefillKey={FRAMEWORK_SECOND_OPINION_PREFILL_KEY}
                    skipPrefilledContact
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
      </main>
    </div>
  )
}
