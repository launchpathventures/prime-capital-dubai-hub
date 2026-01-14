/**
 * CATALYST - Coach Bottom Prompt
 *
 * CTA card at bottom of content to encourage questions.
 */

"use client"

import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stack, Text } from "@/components/core"
import { useCoach } from "./coach-provider"

interface CoachBottomPromptProps {
  title?: string
  description?: string
}

export function CoachBottomPrompt({
  title = "Questions about this module?",
  description = "Ask the AI Coach for a quick explanation or to clarify anything before you continue.",
}: CoachBottomPromptProps) {
  const { openCoach } = useCoach()

  return (
    <div className="rounded-xl border bg-muted/30 p-6">
      <Stack gap="md" align="center" className="text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <SparklesIcon className="h-6 w-6 text-primary" />
        </div>
        <Stack gap="xs">
          <Text weight="medium">{title}</Text>
          <Text size="sm" variant="muted" className="max-w-md">
            {description}
          </Text>
        </Stack>
        <Button onClick={() => openCoach()} className="gap-2">
          <SparklesIcon className="h-4 w-4" />
          Ask the Coach
        </Button>
      </Stack>
    </div>
  )
}
