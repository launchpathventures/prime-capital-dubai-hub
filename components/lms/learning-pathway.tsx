/**
 * CATALYST - Learning Pathway
 *
 * Displays all competencies in a timeline view with progress tracking.
 */

import Link from "next/link"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon, CheckCircle2Icon, CircleIcon } from "lucide-react"
import type { CompetencyWithProgress } from "@/lib/learning-types"

interface LearningPathwayProps {
  competencies: CompetencyWithProgress[]
}

export function LearningPathway({ competencies }: LearningPathwayProps) {
  const firstIncomplete = competencies.find((c) => c.completedCount < c.totalCount)
  
  return (
    <Stack gap="lg" className="py-12 px-4">
      <Title size="h2" align="center">
        Your Learning Pathway
      </Title>
      
      <Stack gap="sm" className="max-w-3xl mx-auto">
        {competencies.map((competency) => {
          const isComplete = competency.completedCount >= competency.totalCount
          
          return (
            <Link key={competency.slug} href={`/learn/${competency.slug}`}>
              <Card className="border hover:border-foreground/20 transition-colors">
                <CardContent className="p-4">
                  <Row align="center" gap="md">
                    {/* Order Number */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-muted-foreground font-mono text-sm font-bold flex-shrink-0">
                      {competency.displayOrder}
                    </div>
                    
                    {/* Content */}
                    <Stack gap="none" className="flex-1 min-w-0">
                      <Row align="center" gap="sm">
                        <Text weight="semibold" className="uppercase tracking-wider">
                          {competency.name}
                        </Text>
                      </Row>
                      <Text size="sm" className="text-muted-foreground truncate">
                        {competency.description}
                      </Text>
                    </Stack>
                    
                    {/* Progress */}
                    <Row align="center" gap="sm" className="flex-shrink-0">
                      <Text size="sm" className="text-muted-foreground">
                        {competency.completedCount}/{competency.totalCount}
                      </Text>
                      {isComplete ? (
                        <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                      ) : (
                        <CircleIcon className="h-5 w-5 text-muted-foreground/30" />
                      )}
                    </Row>
                  </Row>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </Stack>
      
      {/* CTA */}
      <Button 
        size="lg" 
        className="mx-auto gap-2"
        nativeButton={false}
        render={<Link href={firstIncomplete ? `/learn/${firstIncomplete.slug}` : "/learn"} />}
      >
        Begin Your Journey
        <ArrowRightIcon className="h-4 w-4" />
      </Button>
    </Stack>
  )
}
