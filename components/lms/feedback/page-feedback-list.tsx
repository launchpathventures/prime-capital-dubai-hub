/**
 * CATALYST - Page Feedback List
 *
 * Shows existing feedback for the current page.
 * Displayed as a collapsible section in the feedback modal.
 */

"use client"

import { useState, useEffect, useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { getPageFeedback, type Feedback } from "@/lib/lms/feedback"
import { formatDistanceToNow } from "date-fns"
import { ChevronDownIcon, MessageSquareIcon } from "lucide-react"

type Props = {
  competencySlug?: string
  moduleSlug?: string
}

export function PageFeedbackList({ competencySlug, moduleSlug }: Props) {
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    
    startTransition(() => {
      getPageFeedback(competencySlug, moduleSlug)
        .then((data) => {
          if (!cancelled) {
            setFeedback(data)
            setHasLoaded(true)
          }
        })
        .catch(console.error)
    })
    
    return () => { cancelled = true }
  }, [competencySlug, moduleSlug])

  if (!hasLoaded || isPending || feedback.length === 0) {
    return null
  }

  return (
    <div className="border-t pt-4 mt-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <MessageSquareIcon className="h-4 w-4" />
          Previous feedback on this page
          <Badge variant="secondary" className="text-xs">
            {feedback.length}
          </Badge>
        </span>
        <ChevronDownIcon 
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      
      {isExpanded && (
        <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
          {feedback.map((item) => (
            <div
              key={item.id}
              className="text-sm p-3 rounded-lg bg-muted/50 border border-transparent hover:border-border transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <StatusBadge status={item.status} />
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(item.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              {item.quoted_text && (
                <p className="text-xs italic text-muted-foreground mb-1.5 pl-2 border-l-2 border-muted-foreground/30">
                  &ldquo;{item.quoted_text.slice(0, 60)}
                  {item.quoted_text.length > 60 ? "..." : ""}&rdquo;
                </p>
              )}
              {item.text_content && (
                <p className="line-clamp-2 text-foreground/80">
                  {item.text_content}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: Feedback["status"] }) {
  const config = {
    new: { variant: "default" as const, label: "New" },
    in_progress: { variant: "secondary" as const, label: "In Progress" },
    complete: { variant: "outline" as const, label: "Complete" },
    archived: { variant: "outline" as const, label: "Archived" },
  }

  const { variant, label } = config[status]

  return (
    <Badge variant={variant} className="text-[10px] px-1.5 py-0">
      {label}
    </Badge>
  )
}
