/**
 * CATALYST - Example Prompt Component
 *
 * Collapsible component that displays the AI prompt used to generate an example.
 * Shows a summary when collapsed, full prompt details when expanded.
 * Includes a copy button to copy the prompt to clipboard.
 *
 * Used by: All example pages in (examples) surface
 */

"use client"

import * as React from "react"
import { useState } from "react"
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible"
import { CopyButton } from "@/components/shared"
import { Row, Stack, Text } from "@/components/core"
import { SparklesIcon, ChevronUpIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ExamplePromptProps {
  /** Short summary of the prompt (shown in header) */
  summary: string
  /** Full prompt details (shown when expanded) */
  children: React.ReactNode
  /** Additional class name */
  className?: string
  /** Default open state */
  defaultOpen?: boolean
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ExamplePrompt({
  summary,
  children,
  className,
  defaultOpen = false,
}: ExamplePromptProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Build full prompt text for copying
  // Uses innerText to preserve line breaks from block elements
  const getPromptText = () => {
    const textContent = contentRef.current?.innerText || ""
    return `${summary}\n\n${textContent}`
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "rounded-xl border bg-card",
        className
      )}
    >
      {/* Hidden copy source - positioned off-screen so innerText works even when collapsed */}
      <div 
        ref={contentRef} 
        className="absolute -left-[9999px] w-[600px]" 
        aria-hidden="true"
      >
        {children}
      </div>

      <CollapsibleTrigger
        render={<div role="button" tabIndex={0} />}
        className={cn(
          "flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer",
          "hover:bg-muted/30 transition-colors",
          "rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
      >
        {/* Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <SparklesIcon className="h-5 w-5" />
        </div>

        {/* Text content */}
        <Stack gap="none" className="flex-1 min-w-0">
          <Text size="sm" weight="semibold">The Prompt</Text>
          <Text size="sm" variant="muted">{summary}</Text>
        </Stack>

        {/* Actions */}
        <Row gap="sm" align="center" className="shrink-0">
          <CopyButton text={getPromptText()} />
          <ChevronUpIcon
            className={cn(
              "h-5 w-5 text-muted-foreground transition-transform duration-200",
              !isOpen && "rotate-180"
            )}
          />
        </Row>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-4 text-sm text-muted-foreground">
          {/* Align with header text by matching the icon width (w-9 = 36px) + gap (gap-3 = 12px) = 48px = pl-12 */}
          <div className="pl-12">
            {children}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}


