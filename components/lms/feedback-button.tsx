/**
 * CATALYST - Feedback Button
 *
 * Floating button to trigger the feedback modal.
 * Fixed position in bottom-right corner.
 */

"use client"

import { MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeedback } from "./feedback-provider"

export function FeedbackButton() {
  const { open } = useFeedback()

  return (
    <Button
      onClick={open}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
      aria-label="Give feedback"
    >
      <MessageSquarePlus className="h-5 w-5" />
    </Button>
  )
}
