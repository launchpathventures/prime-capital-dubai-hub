/**
 * CATALYST - Write One Script Page (Mode B)
 *
 * Entry point for the context → single script flow. Hosts the
 * SingleScriptWorkflow component which handles distillation and confirmation.
 */

import { Container } from "@/components/core"
import { SingleScriptWorkflow } from "./single-script-workflow"

export const metadata = {
  title: "Write One Script | YouTube | Admin",
}

export default function WriteOneScriptPage() {
  return (
    <Container size="lg" className="py-6">
      <SingleScriptWorkflow />
    </Container>
  )
}
