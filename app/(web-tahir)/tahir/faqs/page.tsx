/**
 * CATALYST - Tahir FAQs
 *
 * Grouped FAQs covering general questions, investment & financials,
 * selling, and residency. The accordion is a small client component;
 * everything else stays on the server.
 */

import type { Metadata } from "next"
import {
  TahirHero,
  TahirSection,
  TahirFaqAccordion,
  TahirShare,
  TahirCtaStrip,
} from "../../_surface"
import { brands } from "@/lib/brand"
import faqs from "@/data/tahir/faqs.json"

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Common questions about investing in Dubai real estate — buying process, ROI, residency, taxes, and more.",
}

export default function TahirFaqsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/about.jpg"
        backgroundAlt="Dubai skyline at golden hour"
        backgroundPosition="center 40%"
        eyebrow="Frequently asked"
        headline={
          <>
            Twenty years of <em>experience</em>, distilled.
          </>
        }
        lead={faqs.hero.intro}
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
        sidecar={
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Covered here</p>
            <h2 className="tahir-h3">Buying, returns, exits, and residency.</h2>
            <ul className="tahir-list">
              {faqs.groups.map((group) => (
                <li key={group.id}>{group.title}</li>
              ))}
            </ul>
            <TahirShare
              title="Dubai property FAQs by Tahir Majithia"
              text="Clear answers on Dubai property investment, buying, returns, selling, and residency."
              url={`https://${brands.tahir.domain}/faqs`}
              label="Share FAQs"
            />
          </div>
        }
      />

      <TahirSection>
        <TahirFaqAccordion groups={faqs.groups} />
      </TahirSection>

      <TahirCtaStrip
        headline="Still have a question?"
        body="If your question isn't covered above, just ask. Tahir replies personally within one business day."
        primaryCta={{ label: "Send a message", href: "/contact" }}
        secondaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
      />
    </>
  )
}
