/**
 * CATALYST - Review & Rewrite Page (Mode A)
 *
 * Entry point for the existing-script → validate → rewrite flow.
 */

import { Container } from "@/components/core"
import { ReviewScriptWorkflow } from "./review-script-workflow"

export const metadata = {
  title: "Review & Rewrite | YouTube | Admin",
}

export default function ReviewScriptPage() {
  return (
    <Container size="lg" className="py-6">
      <ReviewScriptWorkflow />
    </Container>
  )
}
