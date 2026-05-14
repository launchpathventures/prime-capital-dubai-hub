/**
 * CATALYST - Tahir Lead Form Wrapper
 *
 * Wraps the shared LeadForm with Tahir-side styling and tags every
 * submission so CRM can attribute the lead to the Tahir surface.
 * `tag="website-tahir"` flows into AgentCRM as a categorisation tag.
 */

"use client"

import { LeadForm } from "@/components/shared"
import type { ComponentProps } from "react"
import { useTahirHref } from "./use-tahir-href"

type LeadFormProps = ComponentProps<typeof LeadForm>

interface TahirLeadFormProps extends Omit<LeadFormProps, "theme" | "tag"> {
  heading?: string
  intro?: string
  tag?: string
}

export function TahirLeadForm({
  heading,
  intro,
  tag = "website-tahir",
  autoFocus = false,
  redirectUrl,
  ...formProps
}: TahirLeadFormProps) {
  const buildHref = useTahirHref()
  const resolvedRedirectUrl =
    redirectUrl && redirectUrl.startsWith("/") ? buildHref(redirectUrl) : redirectUrl

  return (
    <div className="tahir-form-wrap">
      {heading ? <h2 className="tahir-form-wrap__heading">{heading}</h2> : null}
      {intro ? <p className="tahir-form-wrap__intro">{intro}</p> : null}
      <LeadForm
        theme="light"
        tag={tag}
        autoFocus={autoFocus}
        redirectUrl={resolvedRedirectUrl}
        {...formProps}
      />
    </div>
  )
}
