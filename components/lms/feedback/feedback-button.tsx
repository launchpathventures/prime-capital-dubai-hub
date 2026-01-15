/**
 * CATALYST - Feedback Button
 *
 * Fixed banner at the bottom of the page for prominent feedback access.
 * On-brand styling with clear call-to-action.
 */

"use client"

import { MessageSquarePlus } from "lucide-react"
import { useFeedback } from "./feedback-provider"

export function FeedbackButton() {
  const { enabled, open } = useFeedback()

  if (!enabled) return null

  return (
    <div className="feedback-banner">
      <button
        onClick={open}
        className="feedback-banner__button"
        aria-label="Give feedback on this content"
      >
        <MessageSquarePlus className="feedback-banner__icon" />
        <span className="feedback-banner__text">Give Feedback</span>
      </button>
    </div>
  )
}
