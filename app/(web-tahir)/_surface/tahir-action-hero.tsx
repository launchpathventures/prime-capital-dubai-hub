/**
 * CATALYST - Tahir Action Hero
 *
 * Full-bleed conversion hero: background image, immediate form, and
 * concise trust cues in the first viewport.
 */

import Image from "next/image"
import type { ReactNode } from "react"

interface CtaConfig {
  label: string
  href: string
  external?: boolean
}

interface TahirActionHeroProps {
  eyebrow?: string
  headline: ReactNode
  lead: string
  primaryCta?: CtaConfig
  secondaryCta?: CtaConfig
  imageSrc: string
  imageAlt: string
  imagePosition?: string
  imageLabel?: string
  imageTitle?: string
  imageMeta?: string
  form: ReactNode
}

export function TahirActionHero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imagePosition = "center center",
  imageLabel,
  imageTitle,
  imageMeta,
  form,
}: TahirActionHeroProps) {
  const renderCta = (cta: CtaConfig, variant: "primary" | "secondary") => {
    const className = `tahir-btn tahir-btn--${variant}`
    return (
      <a
        key={cta.href}
        href={cta.href}
        className={className}
        target={cta.external ? "_blank" : undefined}
        rel={cta.external ? "noreferrer" : undefined}
      >
        {cta.label}
      </a>
    )
  }

  return (
    <section className="tahir-action-hero">
      <div className="tahir-action-hero__bg" aria-hidden>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="tahir-action-hero__image"
          style={{ objectPosition: imagePosition }}
        />
      </div>
      <div className="tahir-container">
        <div className="tahir-action-hero__inner">
          <div className="tahir-action-hero__copy">
            {eyebrow ? <p className="tahir-eyebrow">{eyebrow}</p> : null}
            <h1 className="tahir-h1 tahir-action-hero__headline">{headline}</h1>
            <p className="tahir-lead tahir-action-hero__lead">{lead}</p>
            {(primaryCta || secondaryCta) ? (
              <div className="tahir-action-hero__actions">
                {primaryCta ? renderCta(primaryCta, "primary") : null}
                {secondaryCta ? renderCta(secondaryCta, "secondary") : null}
              </div>
            ) : null}
            {imageLabel || imageTitle || imageMeta ? (
              <div className="tahir-action-hero__signal">
                {imageLabel ? <span>{imageLabel}</span> : null}
                {imageTitle ? <strong>{imageTitle}</strong> : null}
                {imageMeta ? <small>{imageMeta}</small> : null}
              </div>
            ) : null}
          </div>

          <aside className="tahir-action-hero__form">{form}</aside>
        </div>
      </div>
    </section>
  )
}
