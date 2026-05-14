/**
 * CATALYST - Tahir Contact Card
 *
 * Compact contact panel used on the hero sidecar and the contact page.
 * Reads brand data from lib/brand so the same component works wherever
 * Tahir's details appear.
 */

import { brands } from "@/lib/brand"

const tahir = brands.tahir

interface TahirContactCardProps {
  heading?: string
  showAddress?: boolean
}

export function TahirContactCard({
  heading = "Speak with Tahir",
  showAddress = true,
}: TahirContactCardProps) {
  return (
    <div className="tahir-contact-card">
      <h3 className="tahir-contact-card__heading">{heading}</h3>

      <div className="tahir-contact-card__row">
        <span className="tahir-contact-card__label">Direct</span>
        <a href={`tel:${tahir.contact.phone}`} className="tahir-contact-card__value">
          {tahir.contact.phoneDisplay}
        </a>
      </div>

      <div className="tahir-contact-card__row">
        <span className="tahir-contact-card__label">Email</span>
        <a href={`mailto:${tahir.contact.email}`} className="tahir-contact-card__value">
          {tahir.contact.email}
        </a>
      </div>

      {showAddress ? (
        <div className="tahir-contact-card__row">
          <span className="tahir-contact-card__label">Office</span>
          <span className="tahir-contact-card__value">{tahir.contact.address}</span>
        </div>
      ) : null}
    </div>
  )
}
