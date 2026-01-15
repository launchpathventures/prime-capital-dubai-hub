/**
 * CATALYST - Feedback Toggle
 *
 * Toggle switch to enable/disable the feedback system.
 * Shows current status and allows admins to change it.
 */

"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { setFeedbackEnabled } from "@/lib/lms/feedback"
import { useFeedback } from "@/components/lms/feedback"
import { MessageSquarePlusIcon, Loader2Icon } from "lucide-react"

type Props = {
  initialEnabled: boolean
}

export function FeedbackToggle({ initialEnabled }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isPending, startTransition] = useTransition()
  const { refreshEnabled } = useFeedback()

  const handleChange = (checked: boolean) => {
    setEnabled(checked)
    startTransition(async () => {
      try {
        await setFeedbackEnabled(checked)
        // Refresh the feedback provider state so banner appears/disappears immediately
        await refreshEnabled()
      } catch (error) {
        console.error("Failed to update feedback setting:", error)
        // Revert on error
        setEnabled(!checked)
      }
    })
  }

  return (
    <div className="feedback-toggle">
      <div className="feedback-toggle__content">
        <div className="feedback-toggle__icon">
          {isPending ? (
            <Loader2Icon className="h-4 w-4 animate-spin" />
          ) : (
            <MessageSquarePlusIcon className="h-4 w-4" />
          )}
        </div>
        <div className="feedback-toggle__text">
          <Label 
            htmlFor="feedback-enabled" 
            className="feedback-toggle__label"
          >
            Feedback Collection
          </Label>
          <p className="feedback-toggle__status">
            {enabled ? (
              <span className="text-green-600 dark:text-green-400">
                Active — learners can submit feedback
              </span>
            ) : (
              <span className="text-muted-foreground">
                Disabled — feedback button is hidden
              </span>
            )}
          </p>
        </div>
      </div>
      <Switch
        id="feedback-enabled"
        checked={enabled}
        onCheckedChange={handleChange}
        disabled={isPending}
      />
    </div>
  )
}
