/**
 * CATALYST - Tahir Strategy Kit
 *
 * Lead magnet page: visitor leaves their details, lands on the
 * thank-you page, and gains access to the 2026 Investor Strategy Kit.
 */

import {
  TahirActionHero,
  TahirSection,
  TahirLeadForm,
  TahirShare,
  TahirCtaStrip,
} from "../../_surface"
import { brands, TAHIR_STRATEGY_KIT_PREFILL_KEY } from "@/lib/brand"
import { tahirPageMetadata } from "@/lib/tahir/metadata"

export const metadata = tahirPageMetadata({
  title: "2026 Investor Strategy Kit",
  description:
    "Tahir Majithia's 2026 strategy kit for serious Dubai property investors — markets, payment plans, ROI ranges, residency.",
  path: "/strategy-kit",
})

const insideTheKit = [
  {
    title: "Where Dubai is heading in 2026",
    body: "Tahir's read on supply, prices, and yields, with the developers and districts to watch.",
  },
  {
    title: "Off-plan vs. ready, side by side",
    body: "When each makes sense, what the real total cost is, and how payment plans actually work.",
  },
  {
    title: "Golden Visa, in plain English",
    body: "Thresholds, timelines, and the property choices that qualify.",
  },
  {
    title: "Two ROI worked examples",
    body: "A typical apartment and a luxury villa, modelled with realistic assumptions.",
  },
]

export default function TahirStrategyKitPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="2026 Investor Strategy Kit"
        headline={
          <>
            A <em>blueprint</em> for Dubai property in 2026.
          </>
        }
        lead="A short, practical guide for serious investors — markets, payment plans, ROI ranges, residency. Built from twenty years of advisory work, not marketing."
        imageSrc="/images/hero/contact.jpg"
        imageAlt="Dubai Marina skyline at dusk"
        imagePosition="center 44%"
        imageLabel="2026 guide"
        imageTitle="Markets, ROI, payment plans, residency"
        imageMeta="A practical briefing for serious Dubai property investors"
        form={
          <TahirLeadForm
            mode="download"
            downloadAsset="2026 Investor Strategy Kit"
            heading="Get the kit"
            intro="Your details stay private. Tahir reviews every submission personally."
            redirectUrl="/strategy-kit/thank-you"
            tag="website-tahir-strategy-kit"
            persistKey={TAHIR_STRATEGY_KIT_PREFILL_KEY}
          />
        }
      />

      <TahirSection>
        <div className="tahir-grid tahir-grid--2">
          <div>
            <h2 className="tahir-h2 tahir-section-title">
              What&rsquo;s inside
            </h2>
            <ul className="tahir-editorial-list">
              {insideTheKit.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Inside the kit</p>
            <h2 className="tahir-h3">A focused investor briefing, not a brochure.</h2>
            <ul className="tahir-list">
              {insideTheKit.slice(0, 3).map((item) => (
                <li key={item.title}>{item.title}</li>
              ))}
            </ul>
            <TahirShare
              title="Tahir Majithia 2026 Investor Strategy Kit"
              text="A practical Dubai property strategy kit covering markets, ROI, payment plans, and residency."
              url={`https://${brands.tahir.domain}/strategy-kit`}
              label="Share kit"
            />
          </div>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Prefer to talk it through?"
        body="A 30-minute call covers the same ground — tailored to your goals, your timeline, and your budget."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
      />
    </>
  )
}
