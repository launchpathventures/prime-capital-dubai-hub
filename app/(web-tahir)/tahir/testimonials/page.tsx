/**
 * CATALYST - Tahir Testimonials
 *
 * Full client testimonial wall.
 */

import type { Metadata } from "next"
import {
  TahirHero,
  TahirSection,
  TahirShare,
  TahirTestimonialGrid,
  TahirCtaStrip,
} from "../../_surface"
import { brands } from "@/lib/brand"
import testimonials from "@/data/tahir/testimonials.json"

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Two decades of trusted relationships — in our clients' own words.",
}

export default function TahirTestimonialsPage() {
  const featured = testimonials.testimonials[0]

  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/private.jpg"
        backgroundAlt="Luxury Dubai interior with city view"
        backgroundPosition="center 48%"
        eyebrow="Client voices"
        headline={
          <>
            Trusted by <em>investors</em> and homeowners.
          </>
        }
        lead={testimonials.hero.intro}
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Read the strategy kit", href: "/strategy-kit" }}
        sidecar={
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Client proof</p>
            {featured ? (
              <figure className="tahir-proof-panel__quote">
                <blockquote>“{featured.quote}”</blockquote>
                <figcaption>{featured.author}</figcaption>
              </figure>
            ) : null}
            <TahirShare
              title="Tahir Majithia testimonials"
              text="Client stories from Tahir Majithia's Dubai property advisory work."
              url={`https://${brands.tahir.domain}/testimonials`}
              label="Share stories"
            />
          </div>
        }
      />

      <TahirSection>
        <TahirTestimonialGrid testimonials={testimonials.testimonials} columns={3} />
      </TahirSection>

      <TahirCtaStrip
        headline="Want to be the next success story?"
        body="A 30-minute call is all it takes to find out whether Tahir's approach fits your goals."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />
    </>
  )
}
