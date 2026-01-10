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
  const percentage = Math.round((current / total) * 100)
  
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
