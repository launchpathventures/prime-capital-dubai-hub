/**
 * CATALYST - Learning Pathway
 *
 * Displays all competencies in a timeline view with progress tracking.
 * Uses Prime Capital brand design system.
 */

import Link from "next/link"
import { Container, Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowRightIcon, CheckCircleIcon, CircleIcon, ChevronRightIcon } from "lucide-react"
import type { CompetencyWithProgress } from "@/lib/learning-types"

interface LearningPathwayProps {
  competencies: CompetencyWithProgress[]
}

export function LearningPathway({ competencies }: LearningPathwayProps) {
  const firstIncomplete = competencies.find((c) => c.completedCount < c.totalCount)
  
  return (
    <div className="py-16 sm:py-20 bg-background">
      <Container size="md">
        <Stack gap="xl">
          {/* Section Header */}
          <Stack gap="sm" className="text-center">
            <Title size="h2" className="font-serif font-normal text-3xl sm:text-4xl">
              Your Learning Pathway
            </Title>
            <Text className="text-muted-foreground max-w-lg mx-auto">
              7 competencies, 35 key behaviours. Complete them in order to unlock your certification.
            </Text>
          </Stack>
          
          {/* Competency List */}
          <Stack gap="sm" className="max-w-3xl mx-auto w-full">
            {competencies.map((competency, index) => {
              const isComplete = competency.completedCount >= competency.totalCount
              const progressPercent = competency.totalCount > 0 
                ? Math.round((competency.completedCount / competency.totalCount) * 100)
                : 0
              const isNext = firstIncomplete?.slug === competency.slug
              
              return (
                <Link key={competency.slug} href={`/learn/${competency.slug}`} className="group">
                  <Card className={`
                    border transition-all duration-200
                    ${isNext ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}
                    ${isComplete ? "border-success/30 bg-success/5" : ""}
                  `}>
                    <CardContent className="p-4 sm:p-5">
                      <Row align="center" gap="md">
                        {/* Order Number Badge */}
                        <div className={`
                          flex items-center justify-center w-10 h-10 rounded-lg 
                          font-mono text-sm font-bold flex-shrink-0 transition-colors
                          ${isComplete 
                            ? "bg-success text-success-foreground" 
                            : isNext 
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }
                        `}>
                          {isComplete ? (
                            <CheckCircleIcon className="h-5 w-5" />
                          ) : (
                            competency.displayOrder
                          )}
                        </div>
                        
                        {/* Content */}
                        <Stack gap="xs" className="flex-1 min-w-0">
                          <Row align="center" gap="sm">
                            <Text weight="semibold" className="text-foreground">
                              {competency.name}
                            </Text>
                            {isNext && (
                              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary px-2 py-0.5 bg-primary/10 rounded">
                                Next
                              </span>
                            )}
                          </Row>
                          <Text size="sm" className="text-muted-foreground line-clamp-1">
                            {competency.description}
                          </Text>
                          
                          {/* Progress bar (only if started but not complete) */}
                          {progressPercent > 0 && !isComplete && (
                            <div className="pt-1">
                              <Progress value={progressPercent} className="h-1" />
                            </div>
                          )}
                        </Stack>
                        
                        {/* Progress / Status */}
                        <Row align="center" gap="sm" className="flex-shrink-0">
                          <Text size="sm" className="text-muted-foreground hidden sm:block">
                            {competency.completedCount}/{competency.totalCount}
                          </Text>
                          <ChevronRightIcon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Row>
                      </Row>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </Stack>
          
          {/* CTA */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              className="gap-2"
              nativeButton={false}
              render={<Link href={firstIncomplete ? `/learn/${firstIncomplete.slug}` : "/learn"} />}
            >
              {firstIncomplete ? "Continue Learning" : "Review Your Progress"}
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </Stack>
      </Container>
    </div>
  )
}
