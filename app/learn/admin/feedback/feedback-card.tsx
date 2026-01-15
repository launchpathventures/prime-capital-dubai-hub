/**
 * CATALYST - Feedback Card
 *
 * Individual feedback item display with status management.
 */

"use client"

import { useState, useTransition } from "react"
import { Row, Stack, Text } from "@/components/core"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateFeedbackStatus, type Feedback } from "@/lib/lms/feedback"
import { formatDistanceToNow } from "date-fns"

type Props = {
  feedback: Feedback
}

export function FeedbackCard({ feedback }: Props) {
  const [status, setStatus] = useState(feedback.status)
  const [isPending, startTransition] = useTransition()

  const handleStatusChange = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateFeedbackStatus(
          feedback.id,
          newStatus as "new" | "in_progress" | "complete"
        )
        setStatus(newStatus as Feedback["status"])
      } catch (error) {
        console.error("Failed to update status:", error)
      }
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <Row justify="between" align="center" className="flex-wrap gap-2">
          <Row gap="sm" align="center">
            <Badge
              variant={
                feedback.feedback_type === "module" ? "default" : "secondary"
              }
            >
              {feedback.feedback_type}
            </Badge>
            {feedback.competency_slug && (
              <Text size="sm" variant="muted">
                {feedback.competency_slug}/{feedback.module_slug}
              </Text>
            )}
          </Row>

          <Row gap="sm" align="center">
            <Text size="sm" variant="muted">
              {formatDistanceToNow(new Date(feedback.created_at), {
                addSuffix: true,
              })}
            </Text>
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isPending}
            >
              <SelectTrigger className="w-[130px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </Row>
        </Row>
      </CardHeader>

      <CardContent>
        <Stack gap="sm">
          {feedback.quoted_text && (
            <div className="bg-muted p-2 rounded text-sm italic">
              &ldquo;{feedback.quoted_text}&rdquo;
            </div>
          )}

          {feedback.text_content && <Text>{feedback.text_content}</Text>}

          {feedback.voice_transcription && (
            <div className="text-sm">
              <Text size="sm" variant="muted">
                Voice transcription:
              </Text>
              <Text>{feedback.voice_transcription}</Text>
            </div>
          )}

          {feedback.attachments && feedback.attachments.length > 0 && (
            <div className="text-sm">
              <Text size="sm" variant="muted">
                Attachments: {feedback.attachments.length} file(s)
              </Text>
            </div>
          )}

          {feedback.page_url && (
            <Text size="sm" variant="muted">
              Page: {feedback.page_url}
            </Text>
          )}

          <Text size="xs" variant="muted" className="font-mono">
            ID: {feedback.id}
          </Text>
        </Stack>
      </CardContent>
    </Card>
  )
}
