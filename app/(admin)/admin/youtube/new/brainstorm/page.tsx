/**
 * CATALYST - Brainstorm Ideas Page
 *
 * Multi-step workflow that generates 5 format-tagged script ideas from one
 * input. The user reviews the batch, selects which ones to keep, then either
 * saves them to the pipeline or jumps straight into script generation.
 */

import { Container } from "@/components/core"
import { BrainstormWorkflow } from "./brainstorm-workflow"

export const metadata = {
  title: "Brainstorm Ideas | YouTube | Admin",
}

export default function BrainstormPage() {
  return (
    <Container size="lg" className="py-6">
      <BrainstormWorkflow />
    </Container>
  )
}
