/**
 * CATALYST - New YouTube Script Page
 *
 * Full-page multi-step workflow for generating script ideas.
 */

import { Container } from "@/components/core"
import { NewScriptWorkflow } from "./new-script-workflow"

export const metadata = {
  title: "New Script | YouTube | Admin",
}

export default function NewScriptPage() {
  return (
    <Container size="lg" className="py-6">
      <NewScriptWorkflow />
    </Container>
  )
}
