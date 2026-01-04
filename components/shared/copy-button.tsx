/**
 * CATALYST - Copy Button
 *
 * Reusable copy-to-clipboard button with success feedback.
 * Supports icon-only variant for compact use cases.
 */

"use client"

import * as React from "react"
import { useState } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { CopyIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { VariantProps } from "class-variance-authority"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type ButtonVariants = VariantProps<typeof buttonVariants>

export interface CopyButtonProps {
  /** Text content to copy to clipboard */
  text: string
  /** Button variant - "icon" for icon-only, default shows icon + label */
  variant?: "icon"
  /** Button style variant (from Button component) */
  buttonVariant?: ButtonVariants["variant"]
  /** Button size */
  size?: ButtonVariants["size"]
  /** Custom label text (default: "Copy" / "Copied") */
  label?: string
  /** Custom copied label text */
  copiedLabel?: string
  /** Duration to show "Copied" state in ms */
  copiedDuration?: number
  /** Callback when copy succeeds */
  onCopy?: () => void
  /** Callback when copy fails */
  onError?: (error: Error) => void
  /** Additional class name */
  className?: string
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CopyButton({
  text,
  variant,
  buttonVariant = "outline",
  label = "Copy",
  copiedLabel = "Copied",
  copiedDuration = 2000,
  size = "sm",
  onCopy,
  onError,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()
      setTimeout(() => setCopied(false), copiedDuration)
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to copy")
      console.error("Failed to copy:", error)
      onError?.(error)
    }
  }

  const isIconOnly = variant === "icon"

  return (
    <Button
      variant={buttonVariant}
      size={isIconOnly ? "icon-sm" : size}
      onClick={handleCopy}
      className={cn("shared-copy-button", className)}
    >
      {copied ? (
        <>
          <CheckIcon className={cn(
            "text-green-600",
            isIconOnly ? "h-4 w-4" : "h-3.5 w-3.5"
          )} />
          {!isIconOnly && <span className="text-green-600">{copiedLabel}</span>}
        </>
      ) : (
        <>
          <CopyIcon className={isIconOnly ? "h-4 w-4" : "h-3.5 w-3.5"} />
          {!isIconOnly && label}
        </>
      )}
    </Button>
  )
}
