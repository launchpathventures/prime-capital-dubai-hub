/**
 * CATALYST - Quiz Next Steps
 */

import Link from "next/link"
import { Stack, Row, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRightIcon, BookOpenIcon, LayoutDashboardIcon, RotateCcwIcon } from "lucide-react"

interface NextStep {
  title: string
  description: string
  href: string
  icon: "continue" | "review" | "dashboard"
}

interface QuizNextStepsProps {
  steps: NextStep[]
}

export function QuizNextSteps({ steps }: QuizNextStepsProps) {
  return (
    <Stack gap="md">
      <Text size="xs" className="uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        🎯 Next Steps
      </Text>
      
      <Stack gap="sm">
        {steps.map((step) => (
          <Link key={step.title} href={step.href}>
            <Card className="border hover:border-foreground/20 transition-colors cursor-pointer">
              <CardContent className="p-4">
                <Row align="center" justify="between">
                  <Row gap="md" align="center">
                    <StepIcon type={step.icon} />
                    <Stack gap="none">
                      <Text weight="medium">{step.title}</Text>
                      <Text size="sm" className="text-muted-foreground">
                        {step.description}
                      </Text>
                    </Stack>
                  </Row>
                  <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
                </Row>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Stack>
    </Stack>
  )
}

function StepIcon({ type }: { type: string }) {
  switch (type) {
    case "continue":
      return <BookOpenIcon className="h-5 w-5 text-primary" />
    case "review":
      return <RotateCcwIcon className="h-5 w-5 text-muted-foreground" />
    case "dashboard":
      return <LayoutDashboardIcon className="h-5 w-5 text-muted-foreground" />
    default:
      return null
  }
}
