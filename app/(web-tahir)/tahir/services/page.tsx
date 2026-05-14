/**
 * CATALYST - Tahir Services
 *
 * Five advisory services plus three property-offering routes
 * (off-plan / move-in-ready / design & build), followed by the six-step
 * "how we work" process.
 */

import {
  TahirHero,
  TahirSection,
  TahirServicesGrid,
  TahirSteps,
  TahirCtaStrip,
} from "../../_surface"
import { tahirPageMetadata } from "@/lib/tahir/metadata"
import services from "@/data/tahir/services.json"

export const metadata = tahirPageMetadata({
  title: "Services",
  description:
    "Concierge-level real estate advisory: consultation, curated selection, negotiation, end-to-end support, and post-sale advisory.",
  path: "/services",
})

export default function TahirServicesPage() {
  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/services.jpg"
        backgroundAlt="Dubai waterfront property and skyline"
        backgroundPosition="center 45%"
        eyebrow="Services"
        headline={
          <>
            Real estate, <em>handled</em>.
          </>
        }
        lead={services.hero.intro}
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Share property requirements", href: "/property-requirements" }}
        sidecar={
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Concierge advisory</p>
            <h2 className="tahir-h3">One direct line from brief to handover.</h2>
            <ul className="tahir-list">
              <li>Investment strategy, shortlist, and negotiation handled together.</li>
              <li>Off-plan, ready homes, and bespoke routes compared side by side.</li>
              <li>Post-sale guidance for leasing, resale timing, and portfolio moves.</li>
            </ul>
          </div>
        }
      />

      <TahirSection
        eyebrow="Advisory"
        headline="Five services. One direct line."
        lead="Each engagement begins with a conversation. From there, you choose how deep we go — strategy alone, full acquisition, or ongoing portfolio management."
      >
        <TahirServicesGrid services={services.advisory} columns={3} />
      </TahirSection>

      <TahirSection
        tone="elevated"
        eyebrow="Property routes"
        headline="Off-plan, move-in-ready, or bespoke."
        lead="Expert guidance across the three ways most clients enter the Dubai market."
      >
        <TahirServicesGrid services={services.propertyOfferings} columns={3} />
      </TahirSection>

      <TahirSection
        eyebrow={services.process.headline ? "How we work" : undefined}
        headline={services.process.headline}
        lead={services.process.intro}
      >
        <TahirSteps steps={services.process.steps} />
      </TahirSection>

      <TahirCtaStrip
        headline="Want to talk through your options?"
        body="A 30-minute call is the fastest way to scope your investment, set a budget range, and shortlist the right opportunities."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Get an investment plan", href: "/investment-plan" }}
      />
    </>
  )
}
