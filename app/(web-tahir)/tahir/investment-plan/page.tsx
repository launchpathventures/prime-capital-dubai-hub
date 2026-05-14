/**
 * CATALYST - Tahir Investment Plan
 *
 * Lead capture for visitors who want a personalised investment plan.
 */

import {
  TahirActionHero,
  TahirSection,
  TahirLeadForm,
  TahirCtaStrip,
} from "../../_surface"
import { tahirPageMetadata } from "@/lib/tahir/metadata"

export const metadata = tahirPageMetadata({
  title: "Get an investment plan",
  description:
    "Request a personalised Dubai property investment plan — sized to your budget, timeline, and target returns.",
  path: "/investment-plan",
})

const planIncludes = [
  {
    title: "A sized portfolio",
    body: "Two or three property options that fit your budget, timeline, and target return.",
  },
  {
    title: "Honest projections",
    body: "Realistic rental yields, capital growth assumptions, and the costs people forget to count.",
  },
  {
    title: "A buying path",
    body: "Off-plan vs. ready, financing options, residency angles, and how to phase your investment over 12–24 months.",
  },
]

export default function TahirInvestmentPlanPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="Investment plan"
        headline={
          <>
            A <em>tailored</em> plan, not a generic pitch.
          </>
        }
        lead="Share your goals and constraints. Tahir builds a one-page investment plan and walks you through it on a 30-minute call."
        imageSrc="/images/hero/properties.jpg"
        imageAlt="Dubai residential towers and waterfront"
        imagePosition="center 48%"
        imageLabel="Personalised output"
        imageTitle="A plan sized to your capital"
        imageMeta="Budget, timeline, target return, and buying path compared on one set of assumptions."
        form={
          <TahirLeadForm
            mode="contact"
            heading="Request your plan"
            intro="The more context you share, the more useful the plan will be."
            tag="website-tahir-investment-plan"
            successMessage="Thanks — Tahir is preparing your plan and will be in touch within one business day."
          />
        }
      />

      <TahirSection tone="elevated">
        <div className="tahir-grid tahir-grid--2">
          <div>
            <h2 className="tahir-h2 tahir-section-title">
              What you get
            </h2>
            <ul className="tahir-editorial-list">
              {planIncludes.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong>
                  <span>{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">How Tahir builds it</p>
            <h2 className="tahir-h3">The shortlist follows the strategy.</h2>
            <ul className="tahir-list">
              <li>Ready and off-plan options are compared fairly.</li>
              <li>Costs and vacancy assumptions stay visible.</li>
              <li>The plan ends with the next practical decision.</li>
            </ul>
          </div>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Want a preview first?"
        body="The 2026 Investor Strategy Kit explains the building blocks Tahir uses in every plan."
        primaryCta={{ label: "Read the strategy kit", href: "/strategy-kit" }}
        secondaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
      />
    </>
  )
}
