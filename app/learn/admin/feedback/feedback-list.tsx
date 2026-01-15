/**
 * CATALYST - Feedback List
 *
 * Server component that fetches and displays feedback items.
 */

import { Stack } from "@/components/core"
import { createClient } from "@/lib/supabase/server"
import { FeedbackCard } from "./feedback-card"
import { type Feedback } from "@/lib/lms/feedback"

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
      <div className="text-center py-12 text-muted-foreground">
        No feedback found
      </div>
    )
  }

  return (
    <Stack gap="md">
      {feedback.map((item) => (
        <FeedbackCard key={item.id} feedback={item as Feedback} />
      ))}
    </Stack>
  )
}
