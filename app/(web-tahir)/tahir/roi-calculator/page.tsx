/**
 * CATALYST - Tahir ROI Calculator
 *
 * Quick, transparent ROI calculator for Dubai property. The calculator
 * itself lives in a small client component; the page is otherwise
 * static so the rest of the route stays fast and crawlable.
 */

import {
  TahirHero,
  TahirSection,
  TahirCtaStrip,
} from "../../_surface"
import { tahirPageMetadata } from "@/lib/tahir/metadata"
import { RoiCalculatorWidget } from "./roi-calculator-widget"

export const metadata = tahirPageMetadata({
  title: "Dubai property ROI calculator",
  description:
    "Estimate annual rental yield, gross return, and a five-year projection for a Dubai property investment.",
  path: "/roi-calculator",
})

export default function TahirRoiCalculatorPage() {
  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/properties.jpg"
        backgroundAlt="Dubai residential towers near the water"
        backgroundPosition="center 44%"
        eyebrow="ROI calculator"
        headline={
          <>
            Run the <em>numbers</em>, in seconds.
          </>
        }
        lead="A quick way to estimate annual rental yield and a five-year projection. Adjust the inputs to fit your scenario — the maths is transparent and the assumptions are conservative."
        sidecar={
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Built for first-pass screening</p>
            <h2 className="tahir-h3">Yield, costs, growth, and five-year return.</h2>
            <ul className="tahir-list">
              <li>Use it to compare opportunities before asking for a full model.</li>
              <li>Costs are explicit, so the net yield stays visible.</li>
              <li>For live deals, Tahir can model service charges and payment plans in detail.</li>
            </ul>
          </div>
        }
      />

      <TahirSection tone="elevated">
        <RoiCalculatorWidget />
      </TahirSection>

      <TahirSection eyebrow="A note from Tahir" headline="Numbers tell part of the story.">
        <div className="tahir-prose">
          <p>
            This calculator is intentionally simple. Real Dubai deals factor
            in service charges, agency fees on resale, off-plan payment
            schedules, vacancy assumptions, and tax positioning that varies
            by buyer profile.
          </p>
          <p>
            Want a precise model for a specific property? Send the details
            and I&rsquo;ll work through them with you on a 30-minute call —
            with the underlying spreadsheet you can take away.
          </p>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Want a deal modelled properly?"
        body="Share the property and the price point. I'll model it in detail and walk you through the numbers on a 30-minute call."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />
    </>
  )
}
