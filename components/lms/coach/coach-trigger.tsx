/**
 * CATALYST - Coach Trigger
 *
 * Floating action button to open the coach panel.
 */

"use client"

import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

export function CoachTrigger() {
  const { openCoach, isOpen } = useCoach()

  return (
    <Button
      onClick={() => openCoach()}
      size="lg"
      data-coach-trigger
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "h-14 w-14 rounded-full shadow-lg",
        "transition-all duration-200",
        "hover:scale-105 hover:shadow-xl",
        "active:scale-95",
        isOpen && "pointer-events-none opacity-0"
      )}
      aria-label="Open AI Coach"
    >
      <SparklesIcon className="h-6 w-6" />
    </Button>
  )
}
