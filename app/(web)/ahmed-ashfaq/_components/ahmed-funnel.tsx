/**
 * CATALYST - Ahmed Ashfaq Funnel Components
 *
 * Shared building blocks for Ahmed's YouTube lead-capture pages on the
 * Prime Capital web surface.
 */

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { Container, Grid, Stack, Text, Title } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import { config } from "@/lib/config"
import { CheckIcon, LanguagesIcon, ShieldCheckIcon } from "lucide-react"

export const AHMED_STRATEGY_KIT_PREFILL_KEY = "ahmed:strategy-kit:lead-prefill"

export const ahmedProfile = {
  name: "Ahmed Ashfaq",
  role: "Dubai-based real estate broker",
  image: "/images/team/ahmed-ashfaq.jpg",
  ogImage: "/images/team/ahmed-ashfaq-og.jpg",
  heroImage: "/images/hero/prime-capital-hero.jpg",
  kitImage: "/images/hero/contact.jpg",
  bio:
    "Arab American and now Dubai-based, Ahmed Ashfaq has over 20 years of experience helping local and international investors navigate one of the world's fastest-growing property markets.",
}

interface AhmedHeroProps {
  eyebrow: string
  headline: ReactNode
  lead: string
  imageSrc?: string
  imagePosition?: string
  children?: ReactNode
  form: ReactNode
}

interface AhmedFormCardProps {
  heading: string
  intro: string
  children: ReactNode
}

interface AhmedCtaBandProps {
  eyebrow?: string
  headline: string
  body: string
  primaryCta: {
    label: string
    href: string
    external?: boolean
  }
  secondaryCta?: {
    label: string
    href: string
    external?: boolean
  }
}

export function AhmedHero({
  eyebrow,
  headline,
  lead,
  imageSrc = ahmedProfile.heroImage,
  imagePosition = "center 62%",
  children,
  form,
}: AhmedHeroProps) {
  return (
    <section className="ahmed-hero">
      <div className="ahmed-hero__bg" aria-hidden>
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="ahmed-hero__image"
          style={{ objectPosition: imagePosition }}
        />
        <div className="ahmed-hero__veil" />
      </div>

      <Container size="xl" className="relative z-10 w-full">
        <Grid cols={1} className="ahmed-hero__grid">
          <Stack gap="lg" className="ahmed-hero__copy">
            <div>
              <Text className="ahmed-eyebrow">{eyebrow}</Text>
              <h1 className="ahmed-display">{headline}</h1>
              <Text className="ahmed-lead">{lead}</Text>
            </div>

            {children}

            <div className="ahmed-hero__profile">
              <div className="ahmed-hero__avatar">
                <Image
                  src={ahmedProfile.image}
                  alt={ahmedProfile.name}
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </div>
              <div>
                <Text className="ahmed-hero__name">{ahmedProfile.name}</Text>
                <Text className="ahmed-hero__role">{ahmedProfile.role}</Text>
              </div>
            </div>
          </Stack>

          <aside id="enquiry-form" className="ahmed-hero__form">
            {form}
          </aside>
        </Grid>
      </Container>
    </section>
  )
}

export function AhmedFormCard({ heading, intro, children }: AhmedFormCardProps) {
  return (
    <div className="ahmed-form-card">
      <div className="ahmed-form-card__header">
        <Title as="h2" className="ahmed-form-card__title">
          {heading}
        </Title>
        <Text className="ahmed-form-card__intro">{intro}</Text>
        <div className="ahmed-form-card__rule" />
      </div>
      <div className="ahmed-form-card__body">{children}</div>
    </div>
  )
}

export function AhmedBookCallForm({
  tag = "youtube-ahmed-book-call",
  prefillFromStrategyKit = false,
}: {
  tag?: string
  prefillFromStrategyKit?: boolean
}) {
  return (
    <AhmedFormCard
      heading="Book a call with Ahmed"
      intro="Share a little context, then choose a time. Ahmed will use it to make the call practical."
    >
      <LeadForm
        mode="contact"
        theme="light"
        autoFocus={false}
        tag={tag}
        calendlyUrl={config.links.ahmedCalendly}
        redirectUrl="/ahmed-ashfaq/thank-you"
        prefillKey={
          prefillFromStrategyKit ? AHMED_STRATEGY_KIT_PREFILL_KEY : undefined
        }
        skipPrefilledContact={prefillFromStrategyKit}
        successMessage="Pick a time that works — Ahmed will prepare around your goals."
      />
    </AhmedFormCard>
  )
}

export function AhmedStrategyKitForm() {
  return (
    <AhmedFormCard
      heading="Get the strategy kit"
      intro="Instant access to the investor briefing. Your details stay private."
    >
      <LeadForm
        mode="download"
        theme="light"
        autoFocus={false}
        downloadAsset="Prime Capital 2026 Investor Strategy Kit"
        redirectUrl="/ahmed-ashfaq/strategy-kit/thank-you"
        redirectDelay={1000}
        tag="youtube-ahmed-strategy-kit"
        persistKey={AHMED_STRATEGY_KIT_PREFILL_KEY}
        successMessage="Thank you — opening your access page now."
      />
    </AhmedFormCard>
  )
}

export function AhmedSignalList({ items }: { items: string[] }) {
  return (
    <div className="ahmed-signal-list">
      {items.map((item) => (
        <div key={item} className="ahmed-signal-list__item">
          <span className="ahmed-signal-list__icon" aria-hidden>
            <CheckIcon className="h-3 w-3" />
          </span>
          <Text className="ahmed-signal-list__text">{item}</Text>
        </div>
      ))}
    </div>
  )
}

export function AhmedCredentialStrip() {
  return (
    <div className="ahmed-credentials" aria-label="Ahmed Ashfaq credentials">
      <div className="ahmed-credentials__item">
        <ShieldCheckIcon className="h-4 w-4" />
        <span>20+ years real estate experience</span>
      </div>
      <div className="ahmed-credentials__item">
        <LanguagesIcon className="h-4 w-4" />
        <span>Fluent in four languages</span>
      </div>
      <div className="ahmed-credentials__item">
        <CheckIcon className="h-4 w-4" />
        <span>Prime Capital Dubai advisory team</span>
      </div>
    </div>
  )
}

export function AhmedSectionHeader({
  eyebrow,
  headline,
  lead,
}: {
  eyebrow: string
  headline: string
  lead?: string
}) {
  return (
    <Stack gap="md" align="center" className="ahmed-section-header">
      <Text className="ahmed-section-header__eyebrow">{eyebrow}</Text>
      <Title as="h2" align="center" className="ahmed-section-header__title">
        {headline}
      </Title>
      {lead ? <Text className="ahmed-section-header__lead">{lead}</Text> : null}
    </Stack>
  )
}

export function AhmedCtaBand({
  eyebrow,
  headline,
  body,
  primaryCta,
  secondaryCta,
}: AhmedCtaBandProps) {
  return (
    <section className="ahmed-cta-band">
      <Container size="lg">
        <Grid cols={1} className="ahmed-cta-band__grid">
          <div>
            {eyebrow ? <Text className="ahmed-eyebrow">{eyebrow}</Text> : null}
            <Title as="h2" className="ahmed-cta-band__title">
              {headline}
            </Title>
            <Text className="ahmed-cta-band__body">{body}</Text>
          </div>
          <div className="ahmed-cta-band__actions">
            <AhmedCtaLink cta={primaryCta} variant="primary" />
            {secondaryCta ? (
              <AhmedCtaLink cta={secondaryCta} variant="secondary" />
            ) : null}
          </div>
        </Grid>
      </Container>
    </section>
  )
}

function AhmedCtaLink({
  cta,
  variant,
}: {
  cta: AhmedCtaBandProps["primaryCta"]
  variant: "primary" | "secondary"
}) {
  const className = `ahmed-btn ahmed-btn--${variant}`

  if (cta.external) {
    return (
      <a href={cta.href} target="_blank" rel="noreferrer" className={className}>
        {cta.label}
      </a>
    )
  }

  return (
    <Link href={cta.href} className={className}>
      {cta.label}
    </Link>
  )
}
