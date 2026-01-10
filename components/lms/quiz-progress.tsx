/**
 * CATALYST - Quiz Progress Indicator
 */

import { Row, Text } from "@/components/core"
import { Progress } from "@/components/ui/progress"

interface QuizProgressProps {
  current: number
  total: number
}

export function QuizProgress({ current, total }: QuizProgressProps) {
  // Guard against invalid values
  const safeCurrent = Math.max(0, Math.min(current, total))
  const percentage = total > 0 ? Math.round((safeCurrent / total) * 100) : 0
  
  return (
    <Row align="center" gap="md" className="w-full">
      <Text size="sm" className="text-muted-foreground whitespace-nowrap">
        Question {current} of {total}
      </Text>
      <Progress value={percentage} className="flex-1" />
      <Text size="sm" className="text-muted-foreground whitespace-nowrap">
        {percentage}%
      </Text>
    </Row>
  )
}
