/**
 * CATALYST - Tahir Strategy Kit Thank You
 *
 * Post-submission page for the strategy kit lead magnet. Continues the
 * lead journey into a prefilled booking form so the visitor can move
 * from the guide into a call without repeating their contact details.
 */

import {
  TahirActionHero,
  TahirSection,
  TahirCtaStrip,
  TahirHeroPortrait,
  TahirLeadForm,
} from "../../../_surface"
import { brands, TAHIR_STRATEGY_KIT_PREFILL_KEY } from "@/lib/brand"
import { tahirPageMetadata } from "@/lib/tahir/metadata"

export const metadata = tahirPageMetadata({
  title: "Thank you — Strategy Kit",
  description: "Access the 2026 Investor Strategy Kit.",
  path: "/strategy-kit/thank-you",
  noIndex: true,
})

export default function TahirStrategyKitThankYouPage() {
  return (
    <>
      <TahirActionHero
        eyebrow="Your kit is ready"
        headline={
          <>
            Turn the kit into a <em>personal</em> plan.
          </>
        }
        lead="The guide is ready. If you want Tahir to apply it to your budget, goals, and timeline, complete the short booking form here. Your contact details carry through automatically."
        primaryCta={{
          label: "Open the strategy kit",
          href: brands.tahir.links.strategyKit,
          external: true,
        }}
        imageSrc="/images/hero/contact.jpg"
        imageAlt="Dubai skyline at dusk"
        imagePosition="center 44%"
        imageLabel="Faster follow-up"
        imageTitle="Your contact details are already attached"
        imageMeta="Add the investment context Tahir needs, then choose a time."
        form={
          <TahirLeadForm
            mode="contact"
            downloadAsset="2026 Investor Strategy Kit"
            heading="Book the follow-up call"
            intro="Your name, email, and WhatsApp are already carried through. Add the extra context Tahir needs for the call."
            calendlyUrl={brands.tahir.calendly.consultation}
            tag="website-tahir-strategy-kit-booking"
            prefillKey={TAHIR_STRATEGY_KIT_PREFILL_KEY}
            skipPrefilledContact
          />
        }
      />

      <TahirSection
        eyebrow="What happens next"
        headline="A direct follow-up, on your terms"
      >
        <div className="tahir-next-rail">
          <div className="tahir-prose">
            <p>
              Tahir reads every submission personally. Over the next business
              day you&rsquo;ll get a short, focused reply — not an autoresponder
              sequence.
            </p>
            <p>
              Want to move faster? Use the booking form above. It keeps the
              contact details from your kit request and only asks for the
              extra context needed to make the call useful.
            </p>
            <p>
              Keep the kit open while you answer the questions — it gives you
              the market, ROI, payment-plan, and residency prompts Tahir will
              use to guide the conversation.
            </p>
          </div>
          <aside className="tahir-next-rail__portrait" aria-label="Tahir Majithia portrait">
            <TahirHeroPortrait
              priority={false}
              caption="Tahir Majithia reviews each strategy-kit request personally."
            />
          </aside>
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Want to read first?"
        body="Open the kit, make notes, then come back to this page to book the follow-up call."
        primaryCta={{
          label: "Open the strategy kit",
          href: brands.tahir.links.strategyKit,
          external: true,
        }}
      />
    </>
  )
}
