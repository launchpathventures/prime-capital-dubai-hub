/**
 * CATALYST - Learning Objectives
 * Uses Prime Capital brand design tokens.
 */

import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { TargetIcon, CheckIcon } from "lucide-react"

interface LearningObjectivesProps {
  objectives: string[]
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) return null
  
  return (
    <Card className="border-success/20 bg-success/5">
      <CardContent className="p-6">
        <Stack gap="md">
          <Row gap="sm" align="center">
            <TargetIcon className="h-5 w-5 text-success" />
            <Text weight="semibold" className="text-foreground">
              Learning Objectives
            </Text>
          </Row>
          <ul className="space-y-3">
            {objectives.map((obj, i) => (
              <li key={i} className="flex gap-3 items-start">
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckIcon className="h-3 w-3 text-success" />
                </div>
                <Text className="text-foreground/90">{obj}</Text>
              </li>
            ))}
          </ul>
        </Stack>
      </CardContent>
    </Card>
  )
}
