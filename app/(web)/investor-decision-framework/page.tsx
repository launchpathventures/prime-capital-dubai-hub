/**
 * CATALYST - Dubai Investor Decision Framework Landing Page
 */

import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  CheckIcon,
  FileCheck2Icon,
  ListChecksIcon,
  PlayCircleIcon,
} from "lucide-react"
import { Container, Grid, Row, Stack, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { EducationalDisclaimer } from "@/components/shared/lead-magnet"
import { FRAMEWORK_CHECKS } from "@/lib/lead-magnets/content"
import {
  FRAMEWORK_LEAD_MAGNET_ID,
  FRAMEWORK_SECOND_OPINION_PREFILL_KEY,
} from "@/lib/lead-magnets/constants"
import { config } from "@/lib/config"

const HERO_IMAGE = "/images/hero/prime-capital-hero.jpg"

export const metadata: Metadata = {
  title: "Dubai Investor Decision Framework",
  description:
    "Use five checks to test a Dubai property against your objective, full commitment, evidence, competition and exit.",
  alternates: { canonical: config.links.leadMagnets.frameworkLanding },
  openGraph: {
    title: "Dubai Investor Decision Framework",
    description:
      "A working reference for testing a Dubai property before you reserve.",
    url: config.links.leadMagnets.frameworkLanding,
    images: [{ url: HERO_IMAGE, width: 1200, height: 630 }],
  },
}

interface PageProps {
  searchParams: Promise<{ source_script?: string | string[] }>
}

const deliverables = [
  {
    icon: ListChecksIcon,
    label: "The decision file",
    detail: "Five checks arranged in the order Prime uses to test a property case.",
  },
  {
    icon: FileCheck2Icon,
    label: "The evidence prompts",
    detail: "What to establish, what to request, and what an unanswered point means.",
  },
  {
    icon: PlayCircleIcon,
    label: "The walkthrough",
    detail: "A captioned screen guide showing how to apply the sequence to one property.",
  },
] as const

export default async function InvestorDecisionFrameworkLanding({
  searchParams,
}: PageProps) {
  const params = await searchParams
  const rawSource = Array.isArray(params.source_script)
    ? params.source_script[0]
    : params.source_script
  const sourceScript = rawSource?.slice(0, 100)

  return (
    <div className="lead-magnet-page lead-magnet-page--framework-landing">
      <section className="lead-magnet-funnel-hero">
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
                  Free investor working reference
                </Text>
                <Title as="h1" className="lead-magnet-funnel-hero__title">
                  Test the property before you accept the claim.
                </Title>
                <Text className="lead-magnet-funnel-hero__lead">
                  Prime&rsquo;s Dubai Investor Decision Framework turns a property
                  pitch into five decisions: objective, commitment, evidence,
                  competition and exit.
                </Text>
              </Stack>

              <Stack gap="sm" className="lead-magnet-funnel-signals">
                {FRAMEWORK_CHECKS.map((check) => (
                  <Row key={check.number} gap="sm" align="center">
                    <span className="lead-magnet-funnel-signals__check">
                      <CheckIcon aria-hidden="true" />
                    </span>
                    <Text>{check.title}</Text>
                  </Row>
                ))}
              </Stack>

              <Text className="lead-magnet-funnel-hero__trust">
                RERA ORN {config.contact.reraOrn} · Direct browser access ·
                Clean print version
              </Text>
              <EducationalDisclaimer />
            </Stack>

            <aside id="access" className="lead-magnet-funnel-card">
              <Stack gap="lg">
                <Stack gap="xs">
                  <Title as="h2" className="lead-magnet-funnel-card__title">
                    Open the decision file
                  </Title>
                  <Text className="lead-magnet-funnel-card__intro">
                    Enter your details once. The framework opens directly in this
                    browser with the walkthrough and print controls included.
                  </Text>
                </Stack>
                <div className="lead-magnet-funnel-card__rule" />
                <LeadForm
                  mode="download"
                  theme="light"
                  autoFocus={false}
                  downloadAsset="Dubai Investor Decision Framework"
                  leadMagnetId={FRAMEWORK_LEAD_MAGNET_ID}
                  leadMagnetFields={
                    sourceScript ? { source_script: sourceScript } : undefined
                  }
                  consentLabel="I agree that Prime Capital may use my contact details to provide this framework and contact me about this resource or a related property enquiry. I can ask Prime Capital to stop at any time."
                  contactSubmitLabel="Open the framework"
                  successMessage="Your framework is ready. Opening it now."
                  persistKey={FRAMEWORK_SECOND_OPINION_PREFILL_KEY}
                  redirectUrl={config.links.leadMagnets.frameworkAccess}
                  redirectDelay={700}
                  redirectLabel="Open the framework now"
                  redirectNote="Access remains available in this browser after you close the page."
                />
                <Text className="lead-magnet-funnel-card__privacy">
                  Your email provides access and allows follow-up on this resource.
                  This does not subscribe you to a newsletter. Read our{" "}
                  <Link href="/terms">terms and privacy information</Link>.
                </Text>
              </Stack>
            </aside>
          </Grid>
        </Container>
      </section>

      <section className="lead-magnet-proof" id="inside">
        <Container size="lg">
          <Grid cols={1} className="lead-magnet-proof__intro">
            <Stack gap="md">
              <Text className="lead-magnet-section-kicker">
                What opens after the form
              </Text>
              <Title as="h2" className="lead-magnet-section-heading">
                A property review process you can actually use.
              </Title>
            </Stack>
            <Stack gap="md">
              <Text className="lead-magnet-section-lead">
                This is not a brochure about good decision-making. It is the
                working structure: one property, one objective, five checks, and a
                final record of what is supported and what is still unresolved.
              </Text>
              <Text className="lead-magnet-section-copy">
                Keep your answers in your own notes or print the page. No account,
                saved progress or second download is required.
              </Text>
            </Stack>
          </Grid>

          <Grid cols={1} className="lead-magnet-deliverables">
            {deliverables.map((item, index) => {
              const Icon = item.icon
              return (
                <Stack key={item.label} gap="md" className="lead-magnet-deliverable">
                  <Row align="center" justify="between">
                    <Text className="lead-magnet-deliverable__number">
                      0{index + 1}
                    </Text>
                    <Icon aria-hidden="true" />
                  </Row>
                  <Title as="h3">{item.label}</Title>
                  <Text>{item.detail}</Text>
                </Stack>
              )
            })}
          </Grid>

          <div className="lead-magnet-check-index">
            {FRAMEWORK_CHECKS.map((check) => (
              <div key={check.number} className="lead-magnet-check-index__row">
                <Text>{check.number}</Text>
                <Title as="h3">{check.title}</Title>
                <Text>{check.shortLabel}</Text>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
