/**
 * CATALYST - Prime Project Second Opinion Form
 *
 * Thin composition wrapper for the shared LeadForm's specialist journey.
 */

import { LeadForm } from "@/components/shared/lead-form"
import { SECOND_OPINION_LEAD_MAGNET_ID } from "@/lib/lead-magnets/constants"

interface SecondOpinionFormProps {
  consentLabel: string
  submitLabel: string
  confirmationUrl: string
  prefillKey?: string
  skipPrefilledContact?: boolean
}

export function SecondOpinionForm({
  consentLabel,
  submitLabel,
  confirmationUrl,
  prefillKey,
  skipPrefilledContact,
}: SecondOpinionFormProps) {
  return (
    <LeadForm
      mode="contact"
      journey="second-opinion"
      theme="light"
      autoFocus={false}
      prefillKey={prefillKey}
      skipPrefilledContact={skipPrefilledContact}
      leadMagnetId={SECOND_OPINION_LEAD_MAGNET_ID}
      initialData={{ leadMagnet: "Prime Project Second Opinion" }}
      consentLabel={consentLabel}
      finalSubmitLabel={submitLabel}
      successMessage="Your request has been recorded. Opening the confirmation now."
      redirectUrl={confirmationUrl}
      redirectDelay={900}
      redirectLabel="View what happens next"
      redirectNote="Your property details and documents have been attached to this request."
    />
  )
}
