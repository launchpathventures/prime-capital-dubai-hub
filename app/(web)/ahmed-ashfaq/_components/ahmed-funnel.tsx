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

/**
 * Slug used to route Ahmed's leads to ahmed@primecapitaldubai.com in the CRM.
 * Matches the entry in `KNOWN_AGENT_EMAILS` (app/api/leads/route.ts). Without
 * this slug on the payload, leads from the Ahmed funnel land unassigned.
 */
export const AHMED_TEAM_MEMBER_SLUG = "ahmed-ashfaq"

export const ahmedProfile = {
  name: "Ahmed Ashfaq",
  role: "Dubai-based real estate broker",
  image: "/images/team/ahmed-ashfaq.jpg",
  ogImage: "/images/team/ahmed-ashfaq-og.jpg",
  heroImage: "/images/hero/prime-capital-hero.jpg",
  kitImage: "/images/hero/contact.jpg",
  kitCoverImage: "/images/ahmed/strategy-kit-cover.png",
  bio:
    "Arab American and now Dubai-based, Ahmed Ashfaq has over 20 years of experience helping local and international investors navigate one of the world's fastest-growing property markets.",
}

interface AhmedHeroProps {
  eyebrow?: string
  headline: ReactNode
  lead?: string
  imageSrc?: string
  imagePosition?: string
  /** When provided, renders Ahmed's portrait as the leading column. */
  portrait?: {
    src: string
    alt: string
    position?: string
  }
  children?: ReactNode
  form: ReactNode
}

interface AhmedFormCardProps {
  heading: string
  intro?: string
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
  portrait,
  children,
  form,
}: AhmedHeroProps) {
  if (portrait) {
    return (
      <section className="ahmed-hero ahmed-hero--portrait">
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
          <div className="ahmed-hero__portrait-layout">
            <div className="ahmed-hero__portrait-col">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 1180px) 44vw, (min-width: 768px) 50vw, 100vw"
                className="ahmed-hero__portrait-img"
                style={{ objectPosition: portrait.position ?? "center 22%" }}
              />
              <div className="ahmed-hero__portrait-glow" aria-hidden />
            </div>

            <div className="ahmed-hero__main">
              <div className="ahmed-hero__copy">
                {eyebrow ? <Text className="ahmed-eyebrow">{eyebrow}</Text> : null}
                <h1 className="ahmed-display">{headline}</h1>
                {lead ? <Text className="ahmed-lead">{lead}</Text> : null}
              </div>

              <aside id="enquiry-form" className="ahmed-hero__form">
                {form}
              </aside>

              {children}
            </div>
          </div>
        </Container>
      </section>
    )
  }

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
        {intro ? <Text className="ahmed-form-card__intro">{intro}</Text> : null}
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
    <AhmedFormCard heading="Book a call with Ahmed">
      <LeadForm
        mode="contact"
        theme="light"
        autoFocus={false}
        tag={tag}
        calendlyUrl={config.links.ahmedBooking}
        redirectUrl="/ahmed-ashfaq/thank-you"
        initialData={{ referringTeamMember: AHMED_TEAM_MEMBER_SLUG }}
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
        initialData={{ referringTeamMember: AHMED_TEAM_MEMBER_SLUG }}
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

export function AhmedTrustStrip() {
  return (
    <section className="ahmed-trust-strip" aria-label="Ahmed Ashfaq credentials">
      <Container size="lg">
        <div className="ahmed-trust-strip__row">
          <div className="ahmed-trust-strip__item">
            <ShieldCheckIcon className="ahmed-trust-strip__icon" />
            <div>
              <Text className="ahmed-trust-strip__value">20+ years</Text>
              <Text className="ahmed-trust-strip__label">Real estate experience</Text>
            </div>
          </div>
          <div className="ahmed-trust-strip__divider" aria-hidden />
          <div className="ahmed-trust-strip__item">
            <LanguagesIcon className="ahmed-trust-strip__icon" />
            <div>
              <Text className="ahmed-trust-strip__value">Four languages</Text>
              <Text className="ahmed-trust-strip__label">For investor conversations</Text>
            </div>
          </div>
          <div className="ahmed-trust-strip__divider" aria-hidden />
          <div className="ahmed-trust-strip__item">
            <CheckIcon className="ahmed-trust-strip__icon" />
            <div>
              <Text className="ahmed-trust-strip__value">Prime Capital Dubai</Text>
              <Text className="ahmed-trust-strip__label">Advisory team</Text>
            </div>
          </div>
        </div>
      </Container>
    </section>
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
