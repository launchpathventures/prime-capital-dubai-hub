/**
 * CATALYST - Coach Header Bar
 *
 * Inline "Ask about..." prompt for top of module/competency pages.
 */

"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

interface CoachHeaderBarProps {
  placeholder?: string
  className?: string
}

export function CoachHeaderBar({
  placeholder = "Ask a question about this module...",
  className,
}: CoachHeaderBarProps) {
  const { openCoach } = useCoach()

  return (
    <button
      onClick={() => openCoach()}
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg",
        "border bg-muted/30 px-4 py-3",
        "text-left text-sm text-muted-foreground",
        "transition-colors hover:border-primary/20 hover:bg-muted/50",
        className
      )}
    >
      <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground/70 group-hover:text-primary" />
      <span>{placeholder}</span>
    </button>
  )
}
