/**
 * CATALYST - Tahir Consultation Thank You
 *
 * Post-booking confirmation page.
 */

import type { Metadata } from "next"
import {
  TahirHero,
  TahirSection,
  TahirCtaStrip,
} from "../../../_surface"

export const metadata: Metadata = {
  title: "Thank you — Consultation booked",
  description: "Your call with Tahir Majithia is confirmed.",
  robots: { index: false, follow: false },
}

export default function TahirConsultationThankYouPage() {
  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/contact.jpg"
        backgroundAlt="Dubai skyline at dusk"
        backgroundPosition="center 44%"
        eyebrow="Confirmed"
        headline={
          <>
            We&rsquo;re <em>on</em>.
          </>
        }
        lead="Your call with Tahir is booked. You'll get a calendar invite by email, with the join link and a short prep note."
        primaryCta={{ label: "Read the strategy kit", href: "/strategy-kit" }}
        secondaryCta={{ label: "Back to home", href: "/" }}
      />

      <TahirSection
        eyebrow="In the meantime"
        headline="A few ways to get ahead"
      >
        <div className="tahir-prose">
          <p>
            If you want to come to the call prepared, the 2026 Investor
            Strategy Kit is a useful primer — it covers markets, payment
            plans, ROI ranges, and the Golden Visa thresholds.
          </p>
          <p>
            If anything changes, you can reschedule or cancel via the
            calendar invite you just received.
          </p>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Need to reach Tahir sooner?"
        body="WhatsApp is the fastest channel during Dubai business hours."
        primaryCta={{ label: "WhatsApp Tahir", href: "https://wa.me/971502967861", external: true }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />
    </>
  )
}
