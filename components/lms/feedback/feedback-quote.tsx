/**
 * CATALYST - Feedback Quote Button
 *
 * Floating button that appears when text is selected on module pages.
 * Allows users to quote selected text in their feedback.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import { Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFeedback } from "./feedback-provider"

type Props = {
  containerSelector: string
}

type SelectionInfo = {
  text: string
  rect: DOMRect
} | null

export function FeedbackQuote({ containerSelector }: Props) {
  const [selection, setSelection] = useState<SelectionInfo>(null)
  const { enabled, open, setQuotedText } = useFeedback()

  const handleSelectionChange = useCallback(() => {
    // Skip if disabled
    if (!enabled) return

    const sel = window.getSelection()

    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setSelection(null)
      return
    }

    // Check if selection is within the container
    const container = document.querySelector(containerSelector)
    if (!container) return

    const range = sel.getRangeAt(0)
    const isInContainer = container.contains(range.commonAncestorContainer)

    if (!isInContainer) {
      setSelection(null)
      return
    }

    const rect = range.getBoundingClientRect()
    setSelection({
      text: sel.toString().trim(),
      rect,
    })
  }, [containerSelector, enabled])

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges()
    setSelection(null)
  }, [])

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [handleSelectionChange])

  // Don't render if feedback is disabled or no selection
  if (!enabled || !selection) return null

  const handleQuote = () => {
    setQuotedText(selection.text)
    clearSelection()
    open()
  }

  // Position button above selection
  const style: React.CSSProperties = {
    position: "fixed",
    top: Math.max(10, selection.rect.top - 44),
    left: Math.min(
      window.innerWidth - 140,
      Math.max(10, selection.rect.left + selection.rect.width / 2 - 70)
    ),
    zIndex: 100,
  }

  return (
    <div style={style}>
      <Button size="sm" onClick={handleQuote} className="shadow-lg">
        <Quote className="h-3 w-3 mr-1" />
        Quote in feedback
      </Button>
    </div>
  )
}
