/**
 * CATALYST - Tahir Meet
 *
 * "Meet Tahir" section. Left column: eyebrow, headline (with accent-orange
 * italic emphasis), short bio paragraphs, and a pair of CTAs. Right column:
 * portrait, set inside a restrained branded frame.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useTahirHref } from "./use-tahir-href"
import { TahirSocialLinks } from "./tahir-social-links"

interface CtaConfig {
  label: string
  href: string
  external?: boolean
}

interface TahirMeetProps {
  eyebrow?: string
  headline: React.ReactNode
  paragraphs: string[]
  primaryCta?: CtaConfig
  secondaryCta?: CtaConfig
  portraitSrc?: string
  portraitAlt?: string
}

export function TahirMeet({
  eyebrow = "Meet Tahir",
  headline,
  paragraphs,
  primaryCta,
  secondaryCta,
  portraitSrc = "/images/team/tahir-majithia.jpg",
  portraitAlt = "Tahir Majithia — founder, Prime Capital Dubai",
}: TahirMeetProps) {
  const buildHref = useTahirHref()

  const renderCta = (cta: CtaConfig, variant: "primary" | "secondary") => {
    const className = `tahir-btn tahir-btn--${variant}`
    if (cta.external) {
      return (
        <a key={cta.href} href={cta.href} className={className} target="_blank" rel="noreferrer">
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

  return (
    <section className="tahir-section tahir-meet">
      <div className="tahir-container">
        <div className="tahir-meet__inner">
          <div className="tahir-meet__copy">
            <p className="tahir-eyebrow">{eyebrow}</p>
            <h2 className="tahir-h1 tahir-meet__headline">{headline}</h2>
            <div className="tahir-prose tahir-meet__prose">
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {(primaryCta || secondaryCta) && (
              <div className="tahir-meet__actions">
                {primaryCta ? renderCta(primaryCta, "primary") : null}
                {secondaryCta ? renderCta(secondaryCta, "secondary") : null}
              </div>
            )}
            <TahirSocialLinks variant="light" />
          </div>

          <figure className="tahir-meet__portrait">
            <div className="tahir-meet__disc" aria-hidden />
            <div className="tahir-meet__portrait-frame">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                sizes="(min-width: 960px) 420px, 70vw"
                className="tahir-meet__portrait-img"
              />
            </div>
            <figcaption className="tahir-meet__caption">
              Founder-led Dubai property advisory since 2004.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
