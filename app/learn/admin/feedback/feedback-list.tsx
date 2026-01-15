/**
 * CATALYST - Feedback List
 *
 * Server component that fetches and displays feedback items.
 * Uses elegant empty state and card layouts.
 */

import { createClient } from "@/lib/supabase/server"
import { FeedbackCard } from "./feedback-card"
import { type Feedback } from "@/lib/lms/feedback"
import { MessageSquareIcon } from "lucide-react"

type Props = {
  status?: string
  type?: string
}

export async function FeedbackList({ status, type }: Props) {
  const supabase = await createClient()

  let query = supabase
    .from("lms_feedback")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (type && type !== "all") {
    query = query.eq("feedback_type", type)
  }

  const { data: feedback } = await query

  if (!feedback?.length) {
    return (
      <div className="feedback-empty">
        <div className="feedback-empty__icon">
          <MessageSquareIcon className="h-6 w-6" />
        </div>
        <h3 className="feedback-empty__title">No feedback found</h3>
        <p className="feedback-empty__description">
          {status || type
            ? "Try adjusting your filters to see more results."
            : "When learners submit feedback, it will appear here."}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item as Feedback} />
      ))}
    </div>
  )
}
