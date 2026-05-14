/**
 * CATALYST - Tahir CTA Strip
 *
 * Dark closing band used at the foot of marketing pages. Headline +
 * supporting line on the left, two CTAs on the right.
 */

"use client"

import Link from "next/link"
import { useTahirHref } from "./use-tahir-href"

interface CtaConfig {
  label: string
  href: string
  external?: boolean
}

interface TahirCtaStripProps {
  headline: string
  body?: string
  primaryCta: CtaConfig
  secondaryCta?: CtaConfig
}

export function TahirCtaStrip({
  headline,
  body,
  primaryCta,
  secondaryCta,
}: TahirCtaStripProps) {
  const buildHref = useTahirHref()

  const renderCta = (cta: CtaConfig, variant: "primary" | "secondary") => {
    const className = `tahir-btn tahir-btn--${variant}`
    if (cta.external) {
      return (
        <a href={cta.href} className={className} target="_blank" rel="noreferrer">
          {cta.label}
        </a>
      )
    }
    return (
      <Link href={buildHref(cta.href)} className={className}>
        {cta.label}
      </Link>
    )
  }

  return (
    <section className="tahir-cta-band">
      <div className="tahir-container">
        <div className="tahir-cta-strip">
          <div className="tahir-cta-strip__copy">
            <h2 className="tahir-h2">{headline}</h2>
            {body ? <p>{body}</p> : null}
          </div>
          <div className="tahir-cta-strip__actions">
            {renderCta(primaryCta, "primary")}
            {secondaryCta ? renderCta(secondaryCta, "secondary") : null}
          </div>
        </div>
      </div>
    </section>
  )
}
