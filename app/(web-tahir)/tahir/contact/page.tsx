/**
 * CATALYST - Tahir Contact
 *
 * Direct contact page. Phone / email / address on the left, a short
 * lead form on the right. Lead submissions are tagged "website-tahir"
 * so AgentCRM can attribute the brand.
 */

import type { Metadata } from "next"
import {
  TahirActionHero,
  TahirSection,
  TahirContactCard,
  TahirLeadForm,
  TahirCtaStrip,
  TahirLink,
  TahirSocialLinks,
} from "../../_surface"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach Tahir directly — phone, email, or book a 30-minute discovery call.",
}

export default function TahirContactPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="Get in touch"
        headline={
          <>
            Let&rsquo;s have a <em>conversation</em>.
          </>
        }
        lead="Tell Tahir what you're looking for. He'll be in touch within one business day — or book a 30-minute call below."
        imageSrc="/images/hero/contact.jpg"
        imageAlt="Dubai waterfront skyline at dusk"
        imagePosition="center 48%"
        imageLabel="Direct advisory"
        imageTitle="One-to-one with Tahir"
        imageMeta="Founder, Prime Capital Dubai"
        form={
          <TahirLeadForm
            mode="landing"
            heading="Send a message"
            intro="A few details so Tahir can come prepared to your reply."
            successMessage="Thanks — Tahir will be in touch within one business day."
          />
        }
      />

      <TahirSection tone="elevated">
        <div className="tahir-contact-layout">
          <div className="tahir-contact-layout__primary">
            <div className="tahir-proof-panel">
              <p className="tahir-eyebrow">Response rhythm</p>
              <h2 className="tahir-h3">Clear next steps, no handoff maze.</h2>
              <ul className="tahir-list">
                <li>Tahir reviews every website enquiry personally.</li>
                <li>You can keep the conversation on email, phone, WhatsApp, or a booked call.</li>
                <li>If the brief is specific, expect a sharper shortlist or plan in return.</li>
              </ul>
              <TahirSocialLinks variant="light" />
            </div>
          </div>
          <TahirContactCard heading="Direct to Tahir" />
        </div>
        <div className="tahir-contact-action tahir-contact-action--offset">
          <p className="tahir-small">
            Prefer a real conversation? Book a 30-minute discovery call — clear,
            candid, no commitment.
          </p>
          <TahirLink href="/consultation" className="tahir-btn tahir-btn--secondary">
            Book a 30-minute call
          </TahirLink>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Need answers faster?"
        body="WhatsApp or call Tahir directly during Dubai business hours."
        primaryCta={{ label: "WhatsApp Tahir", href: "https://wa.me/971502967861", external: true }}
        secondaryCta={{ label: "Call now", href: "tel:+971502967861" }}
      />
    </>
  )
}
