/**
 * CATALYST - Competency Progress List
 */

import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface CompetencyProgress {
  slug: string
  name: string
  completed: number
  total: number
}

interface CompetencyProgressListProps {
  competencies: CompetencyProgress[]
}

export function CompetencyProgressList({ competencies }: CompetencyProgressListProps) {
  return (
    <Card className="border">
      <CardContent className="p-4 sm:p-6">
        <Stack gap="md">
          <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
            Competency Progress
          </Text>
          
          <Stack gap="sm">
            {competencies.map((comp) => (
              <Stack key={comp.slug} gap="xs">
                <Row align="center" justify="between">
                  <Text size="sm" weight="medium">
                    {comp.name}
                  </Text>
                  <Text size="xs" className="text-muted-foreground">
                    {comp.completed}/{comp.total} Complete
                  </Text>
                </Row>
                <Progress 
                  value={comp.total > 0 ? (comp.completed / comp.total) * 100 : 0} 
                  className="h-2" 
                />
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
