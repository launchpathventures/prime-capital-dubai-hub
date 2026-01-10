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
    <>
      {/* Screen reader announcement */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        Question {current} of {total}. {percentage}% complete.
      </div>
      
      {/* Visual progress indicator */}
      <Row align="center" gap="md" className="w-full" aria-hidden="true">
        <Text size="sm" className="text-muted-foreground whitespace-nowrap">
          Question {current} of {total}
        </Text>
        <Progress value={percentage} className="flex-1" />
        <Text size="sm" className="text-muted-foreground whitespace-nowrap">
          {percentage}%
        </Text>
      </Row>
    </>
  )
}
