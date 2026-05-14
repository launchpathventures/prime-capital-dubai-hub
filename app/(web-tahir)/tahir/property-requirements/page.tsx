/**
 * CATALYST - Tahir Property Requirements
 *
 * Buyer-side intake form. Captures the visitor's preferences and pushes
 * them into AgentCRM with a tag so Tahir can match them against current
 * inventory and off-market opportunities.
 */

import {
  TahirActionHero,
  TahirSection,
  TahirLeadForm,
  TahirCtaStrip,
} from "../../_surface"
import { tahirPageMetadata } from "@/lib/tahir/metadata"
import services from "@/data/tahir/services.json"

export const metadata = tahirPageMetadata({
  title: "Share property requirements",
  description:
    "Tell Tahir what you're looking for in Dubai — location, type, budget — and get matched with the right opportunities.",
  path: "/property-requirements",
})

export default function TahirPropertyRequirementsPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="Property requirements"
        headline={
          <>
            Tell Tahir what you&rsquo;re <em>looking</em> for.
          </>
        }
        lead="Share your brief and Tahir will match it against current inventory — including private off-market listings — and come back with a shortlist."
        imageSrc="/images/hero/services.jpg"
        imageAlt="Dubai property terrace and skyline"
        imagePosition="center 50%"
        imageLabel="Better briefs, better matches"
        imageTitle="Give Tahir the constraints that matter"
        imageMeta="Location, budget, type, timeline, priorities, and deal-breakers."
        form={
          <TahirLeadForm
            mode="contact"
            heading="Share your brief"
            intro="The more specific you can be on location, type, and budget, the faster Tahir can come back with a useful shortlist."
            tag="website-tahir-property-requirements"
            successMessage="Thanks — Tahir is checking inventory and will be in touch within one business day."
          />
        }
      />

      <TahirSection tone="elevated">
        <div className="tahir-grid tahir-grid--2">
          <div>
            <h2 className="tahir-h2 tahir-section-title">
              The kinds of property Tahir works on
            </h2>
            <ul className="tahir-editorial-list">
              {services.propertyTypes.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="tahir-small tahir-section-note">
              No match yet? Off-market opportunities arrive every week.
              Submit your brief and Tahir will notify you as listings appear.
            </p>
          </div>
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">What improves the shortlist</p>
            <h2 className="tahir-h3">Specificity saves time.</h2>
            <ul className="tahir-list">
              <li>Share your must-haves separately from nice-to-haves.</li>
              <li>Mention any buildings, developers, or areas already under review.</li>
              <li>Tell Tahir if yield, lifestyle, resale, or residency is the priority.</li>
            </ul>
          </div>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Prefer to talk through your options?"
        body="A 30-minute call is the fastest way to sharpen the brief and shortlist properties on the spot."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />
    </>
  )
}
