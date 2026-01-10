/**
 * CATALYST - Learning Objectives
 */

import { Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2Icon } from "lucide-react"

interface LearningObjectivesProps {
  objectives: string[]
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) return null
  
  return (
    <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-900">
      <CardContent className="p-6">
        <Text size="xs" className="uppercase tracking-wider text-green-600 dark:text-green-400 font-semibold mb-4 flex items-center gap-2">
          🎯 Learning Objectives
        </Text>
        <ul className="space-y-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex gap-3 items-start">
              <CheckCircle2Icon className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
