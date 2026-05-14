/**
 * CATALYST - Tahir Footer
 *
 * Dark footer for the Tahir brand surface. Carries the wordmark, the
 * "Founder, Prime Capital Dubai" attribution, contact details, and social
 * links. Renders only the social profiles present on the brand record.
 */

"use client"

import Link from "next/link"
import Image from "next/image"
import { brands } from "@/lib/brand"
import { useTahirHref } from "./use-tahir-href"
import { TahirSocialLinks } from "./tahir-social-links"

const tahir = brands.tahir

export function TahirFooter() {
  const year = new Date().getFullYear()
  const buildHref = useTahirHref()

  return (
    <footer className="tahir-footer">
      <div className="tahir-container">
        <div className="flex flex-col gap-3">
          <Link
            href={buildHref("/")}
            className="tahir-footer__wordmark"
            aria-label="Tahir Majithia"
          >
            <Image
              src={tahir.assets.logoLight || tahir.assets.logo}
              alt="Tahir Majithia"
              width={189}
              height={72}
              className="tahir-footer__logo"
            />
          </Link>
          <span className="tahir-footer__attribution">{tahir.footerAttribution}</span>
        </div>

        <hr className="tahir-footer__rule" />

        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="tahir-eyebrow">Direct</span>
            <a href={`tel:${tahir.contact.phone}`} className="tahir-footer__meta">
              {tahir.contact.phoneDisplay}
            </a>
            <a href={`mailto:${tahir.contact.email}`} className="tahir-footer__meta">
              {tahir.contact.email}
            </a>
          </div>

          <div className="flex flex-col gap-2">
            <span className="tahir-eyebrow">Office</span>
            <span className="tahir-footer__meta">{tahir.contact.address}</span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="tahir-eyebrow">Elsewhere</span>
            <TahirSocialLinks variant="dark" showLabels />
          </div>
        </div>

        <hr className="tahir-footer__rule" />

        <p className="tahir-footer__meta">
          © {year} Tahir Majithia. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
