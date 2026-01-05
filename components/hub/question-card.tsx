/**
 * CATALYST - Question Card Component
 *
 * Card displaying question summary for the hub.
 * Shows title, status, response count, and last activity.
 */

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Row, Stack, Text } from "@/components/core"
import { MessageCircleIcon, MessageSquareIcon, CalendarIcon } from "lucide-react"
import type { Question, QuestionStatus } from "@/lib/hub/types"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Status Config
// -----------------------------------------------------------------------------

const statusConfig: Record<QuestionStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  pending: { label: "Pending", variant: "outline" },
  answered: { label: "Answered", variant: "secondary" },
  resolved: { label: "Resolved", variant: "default" },
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

interface QuestionCardProps {
  question: Question
  className?: string
}

export function QuestionCard({ question, className }: QuestionCardProps) {
  const status = statusConfig[question.status]
  const responseCount = question.responseCount ?? question.responses?.length ?? 0
  const lastUpdated = new Date(question.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })

  return (
    <Link href={`/hub/questions/${question.id}`}>
      <Card className={cn("hub-question-card hover:border-primary/50 transition-colors cursor-pointer", className)}>
        <CardHeader className="pb-2">
          <Row justify="between" align="start" gap="sm">
            <Row gap="sm" align="center">
              <MessageCircleIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base line-clamp-1">{question.title}</CardTitle>
            </Row>
            <Badge variant={status.variant}>{status.label}</Badge>
          </Row>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {question.description && (
              <Text size="sm" variant="muted" className="line-clamp-2">
                {question.description}
              </Text>
            )}

            <Row justify="between" align="center">
              <Row gap="xs" align="center" className="text-muted-foreground">
                <MessageSquareIcon className="h-3 w-3" />
                <Text size="xs" variant="muted">
                  {responseCount} {responseCount === 1 ? "response" : "responses"}
                </Text>
              </Row>

              {question.project && (
                <Text size="xs" variant="muted">{question.project.name}</Text>
              )}
            </Row>

            <Row gap="xs" align="center" className="text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              <Text size="xs" variant="muted">Updated {lastUpdated}</Text>
            </Row>
          </Stack>
        </CardContent>
      </Card>
    </Link>
  )
}
