/**
 * CATALYST - Tahir About
 *
 * Founder-led "about" page. Pulls Tahir's hero positioning, story
 * paragraphs, statistics, values, and philosophy from
 * data/tahir/profile.json so copy stays in one place.
 */

import type { Metadata } from "next"
import {
  TahirHero,
  TahirSection,
  TahirStats,
  TahirValues,
  TahirCtaStrip,
  TahirHeroPortrait,
} from "../../_surface"
import profile from "@/data/tahir/profile.json"

export const metadata: Metadata = {
  title: "About Tahir",
  description:
    "Twenty years of Dubai property expertise, an exclusive network, and a personal commitment to every client.",
}

export default function TahirAboutPage() {
  return (
    <>
      <TahirHero
        tone="photographic"
        backgroundImage="/images/hero/about.jpg"
        backgroundAlt="Dubai skyline and waterfront"
        backgroundPosition="center 42%"
        eyebrow={profile.hero.eyebrow}
        headline={
          <>
            Work with a <em>trusted</em> property partner.
          </>
        }
        lead={profile.hero.paragraphs[0]}
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Read the strategy kit", href: "/strategy-kit" }}
      />

      <TahirSection>
        <div className="tahir-about-rail">
          <div className="tahir-about-rail__copy">
            <p className="tahir-eyebrow">The approach</p>
            <h2 className="tahir-h2">{profile.story.headline}</h2>
            <p className="tahir-lead">{profile.story.subheadline}</p>
            <div className="tahir-prose">
              {profile.hero.paragraphs.slice(1).map((p) => (
                <p key={p}>{p}</p>
              ))}
              {profile.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <aside className="tahir-about-rail__portrait" aria-label="Tahir Majithia portrait">
            <TahirHeroPortrait
              priority={false}
              caption="Tahir Majithia, Dubai real estate advisor"
            />
          </aside>
        </div>
      </TahirSection>

      <TahirSection tone="elevated" eyebrow="Track record" headline="By the numbers">
        <TahirStats stats={profile.stats} />
      </TahirSection>

      <TahirSection
        tone="dark"
        eyebrow="What you can expect"
        headline={profile.philosophy.headline}
        lead={profile.philosophy.paragraphs[0]}
      >
        <TahirValues values={profile.values} />
      </TahirSection>

      <TahirSection eyebrow="Philosophy">
        <div className="tahir-prose">
          {profile.philosophy.paragraphs.slice(1).map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </TahirSection>

      <TahirCtaStrip
        headline="Ready to talk about your next move?"
        body="Book a 30-minute discovery call. No commitment — just a clear, candid conversation about your goals."
        primaryCta={{ label: "Book a 30-minute call", href: "/consultation" }}
        secondaryCta={{ label: "Send a message", href: "/contact" }}
      />
    </>
  )
}
