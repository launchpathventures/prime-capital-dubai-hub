/**
 * CATALYST - Page Feedback List
 *
 * Shows existing feedback for the current page to avoid duplicates.
 * Displayed in the feedback modal.
 */

"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { getPageFeedback, type Feedback } from "@/lib/lms/feedback"
import { formatDistanceToNow } from "date-fns"

type Props = {
  competencySlug?: string
  moduleSlug?: string
}

export function PageFeedbackList({ competencySlug, moduleSlug }: Props) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPageFeedback(competencySlug, moduleSlug)
      .then(setFeedback)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [competencySlug, moduleSlug])

  if (loading) {
    return null
  }

  if (feedback.length === 0) {
    return null
  }

  return (
    <div className="mt-4 border-t pt-4">
      <p className="text-sm font-medium mb-2">
        Previous feedback ({feedback.length})
      </p>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {feedback.map((item) => (
          <div key={item.id} className="text-sm p-2 rounded bg-muted">
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status={item.status} />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            {item.quoted_text && (
              <p className="text-xs italic text-muted-foreground mb-1">
                &ldquo;{item.quoted_text.slice(0, 50)}
                {item.quoted_text.length > 50 ? "..." : ""}&rdquo;
              </p>
            )}
            <p className="line-clamp-2">{item.text_content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Feedback["status"] }) {
  const variants = {
    new: "default",
    in_progress: "secondary",
    complete: "outline",
  } as const

  const labels = {
    new: "New",
    in_progress: "In Progress",
    complete: "Complete",
  }

  return (
    <Badge variant={variants[status]} className="text-xs">
      {labels[status]}
    </Badge>
  )
}
