/**
 * CATALYST - Tahir Hero
 *
 * Photographic hero for Tahir pages. Renders a dark background image
 * with a copy column on top: eyebrow, display headline, lead, two CTAs,
 * and optional proof content. Headlines can use <em>...</em> for the
 * accent-orange italic emphasis defined in tahir.css.
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import type { ReactNode } from "react"
import { useTahirHref } from "./use-tahir-href"

interface CtaConfig {
  label: string
  href: string
  external?: boolean
}

interface PullQuote {
  body: string
  author: string
  date?: string
}

interface TahirHeroProps {
  eyebrow?: string
  headline: ReactNode
  lead?: string
  primaryCta?: CtaConfig
  secondaryCta?: CtaConfig
  meta?: ReactNode
  /** Optional sidecar slot (used on inner pages for forms or cards). */
  sidecar?: ReactNode
  /** Background image src — only honoured when tone="photographic". */
  backgroundImage?: string
  backgroundAlt?: string
  backgroundPosition?: string
  /** Testimonial pull-quote rendered beneath the CTA row. */
  pullQuote?: PullQuote
  /** "photographic" = dark image hero, centred. "quiet" = cream split layout. */
  tone?: "photographic" | "quiet"
}

export function TahirHero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  secondaryCta,
  meta,
  sidecar,
  backgroundImage,
  backgroundAlt = "",
  backgroundPosition = "center center",
  pullQuote,
  tone = "quiet",
}: TahirHeroProps) {
  const buildHref = useTahirHref()

  const renderCta = (cta: CtaConfig, variant: "primary" | "secondary") => {
    const className = `tahir-btn tahir-btn--${variant}`
    if (cta.external) {
      return (
        <a
          key={cta.href}
          href={cta.href}
          className={className}
          target="_blank"
          rel="noreferrer"
        >
          {cta.label}
        </a>
      )
    }
    return (
      <Link key={cta.href} href={buildHref(cta.href)} className={className}>
        {cta.label}
      </Link>
    )
  }

  if (tone === "photographic") {
    return (
      <section className="tahir-hero tahir-hero--photo" data-tone="photographic">
        {backgroundImage ? (
          <div className="tahir-hero__bg" aria-hidden>
            <Image
              src={backgroundImage}
              alt={backgroundAlt}
              fill
              priority
              sizes="100vw"
              className="tahir-hero__bg-img"
              style={{ objectPosition: backgroundPosition }}
            />
            <div className="tahir-hero__bg-veil" />
          </div>
        ) : null}

        <div
          className={
            sidecar
              ? "tahir-container tahir-hero__photo-layout tahir-hero__photo-layout--split"
              : "tahir-container tahir-hero__photo-layout"
          }
        >
          <div className="tahir-hero__photo-inner">
            {eyebrow ? <p className="tahir-eyebrow tahir-hero__eyebrow">{eyebrow}</p> : null}
            <h1 className="tahir-display tahir-hero__headline">{headline}</h1>
            {lead ? <p className="tahir-lead tahir-hero__lead">{lead}</p> : null}
            {(primaryCta || secondaryCta) && (
              <div className="tahir-hero__actions tahir-hero__actions--center">
                {primaryCta ? renderCta(primaryCta, "primary") : null}
                {secondaryCta ? renderCta(secondaryCta, "secondary") : null}
              </div>
            )}
            {pullQuote ? (
              <figure className="tahir-hero__quote">
                <blockquote>“{pullQuote.body}”</blockquote>
                <figcaption>
                  — {pullQuote.author}
                  {pullQuote.date ? `, ${pullQuote.date}` : ""}
                </figcaption>
              </figure>
            ) : null}
            {meta ? <div className="tahir-small">{meta}</div> : null}
          </div>
          {sidecar ? <aside className="tahir-hero__sidecard">{sidecar}</aside> : null}
        </div>
      </section>
    )
  }

  return (
    <section
      className={sidecar ? "tahir-hero tahir-hero--with-sidecar" : "tahir-hero"}
      data-tone="quiet"
    >
      <div className="tahir-container">
        <div className="tahir-hero__inner">
          <div className="tahir-hero__copy">
            {eyebrow ? <p className="tahir-eyebrow">{eyebrow}</p> : null}
            <h1 className="tahir-display">{headline}</h1>
            {lead ? <p className="tahir-lead">{lead}</p> : null}
            {(primaryCta || secondaryCta) && (
              <div className="tahir-hero__actions">
                {primaryCta ? renderCta(primaryCta, "primary") : null}
                {secondaryCta ? renderCta(secondaryCta, "secondary") : null}
              </div>
            )}
            {meta ? <div className="tahir-small">{meta}</div> : null}
          </div>
          {sidecar ? <aside className="tahir-hero__sidecard">{sidecar}</aside> : null}
        </div>
      </div>
    </section>
  )
}
