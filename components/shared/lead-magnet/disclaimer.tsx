/**
 * CATALYST - Educational Content Disclaimer
 */

import { ShieldCheckIcon } from "lucide-react"
import { Row, Text } from "@/components/core"
import { EDUCATIONAL_DISCLAIMER } from "@/lib/lead-magnets/content"

export function EducationalDisclaimer() {
  return (
    <aside className="lead-magnet-disclaimer" aria-label="Important information">
      <Row gap="sm" align="start">
        <ShieldCheckIcon aria-hidden="true" />
        <Text size="sm" leading="relaxed">
          {EDUCATIONAL_DISCLAIMER}
        </Text>
      </Row>
    </aside>
  )
}

