/**
 * CATALYST - Tahir Consultation
 *
 * Booking flow. The shared LeadForm collects the visitor's context and
 * then embeds Calendly inline so the meeting is booked in one place.
 */

import type { Metadata } from "next"
import {
  TahirActionHero,
  TahirSection,
  TahirContactCard,
  TahirLeadForm,
} from "../../_surface"
import { brands } from "@/lib/brand"

export const metadata: Metadata = {
  title: "Book a consultation",
  description:
    "Book a 30-minute discovery call with Tahir Majithia — clear, candid, and tailored to your goals.",
}

export default function TahirConsultationPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="Book a consultation"
        headline={
          <>
            Thirty minutes, <em>tailored</em> to you.
          </>
        }
        lead="Share a little context and pick a time. The call is candid, no-commitment, and structured around the questions you actually need answered."
        imageSrc="/images/hero/private.jpg"
        imageAlt="Luxury Dubai property interior"
        imagePosition="center 44%"
        imageLabel="What to expect"
        imageTitle="A focused advisory call with Tahir"
        imageMeta="Clarify goals, compare routes, and leave with a useful next step."
        form={
          <TahirLeadForm
            mode="contact"
            heading="Tell Tahir a bit about you"
            intro="A few questions to make the call useful. Pick a time on the next step."
            calendlyUrl={brands.tahir.calendly.consultation}
            redirectUrl="/consultation/thank-you"
            tag="website-tahir-consultation"
          />
        }
      />

      <TahirSection tone="elevated" eyebrow="Before the call" headline="What to bring">
        <div className="tahir-grid tahir-grid--2">
          <div className="flex flex-col gap-6">
            <TahirContactCard heading="Speak with Tahir" />
            <ul className="tahir-list">
              <li>30 minutes, free, no commitment.</li>
              <li>One-to-one with Tahir — not a junior account manager.</li>
              <li>Bring goals, a budget range, and any properties you&rsquo;re weighing up.</li>
            </ul>
          </div>
          <div className="tahir-proof-panel">
            <p className="tahir-eyebrow">Useful outcomes</p>
            <h2 className="tahir-h3">You leave with direction.</h2>
            <ul className="tahir-list">
              <li>Which route fits your budget and timeline.</li>
              <li>Where to be cautious about yields, supply, or payment terms.</li>
              <li>The next document, shortlist, or model Tahir should prepare.</li>
            </ul>
          </div>
        </div>
      </TahirSection>
    </>
  )
}
