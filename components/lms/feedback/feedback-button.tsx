/**
 * CATALYST - Feedback Button
 *
 * Floating button to trigger the feedback modal.
 * Fixed position in bottom-right corner with elegant animation.
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
      size="icon-lg"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      aria-label="Give feedback on this content"
    >
      <MessageSquarePlus className="h-5 w-5" />
    </Button>
  )
}
