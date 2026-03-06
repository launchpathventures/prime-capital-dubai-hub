/**
 * CATALYST - Contact Form Section
 *
 * Client component that renders the lead form on the contact page.
 * Handles bid recovery from sessionStorage as a fallback when the
 * URL param is missing (visitor navigated away and back).
 */

"use client"

import { useState } from "react"
import { Container } from "@/components/core"
import { LeadForm } from "@/components/shared/lead-form"
import type { PropertyContext } from "@/components/shared/lead-form/types"
import { getStoredBid } from "../_surface/bid-persistence"

interface ContactFormSectionProps {
  propertyContext?: PropertyContext
  bidFromUrl?: string
}

export function ContactFormSection({ propertyContext, bidFromUrl }: ContactFormSectionProps) {
  // Resolve bid synchronously: URL param first, then sessionStorage fallback
  const [bid] = useState(() => bidFromUrl || getStoredBid() || undefined)

  const isPropertyEnquiry = !!propertyContext
  const isReturningLead = !!bid

  return (
    <section className="bg-[var(--web-off-white)] pt-8 md:pt-[var(--web-section-gap)] pb-[var(--web-section-gap)]">
      <Container size="sm">
        <LeadForm
          mode={isPropertyEnquiry ? "property-enquiry" : "contact"}
          theme="light"
          autoFocus={false}
          propertyContext={propertyContext}
          bitrixLeadId={bid}
          tag={propertyContext?.slug}
          successMessage={
            isReturningLead && isPropertyEnquiry
              ? "Your agent has been notified. They'll follow up with the details you requested."
              : isReturningLead
                ? "Thank you — we've linked your enquiry to your previous conversation."
                : undefined
          }
        />
      </Container>
    </section>
  )
}
