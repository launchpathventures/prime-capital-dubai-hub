/**
 * CATALYST - Feedback Provider
 *
 * Context provider for the feedback system.
 * Manages modal state, page context, and quoted text.
 * Fetches enabled state from server on mount.
 */

"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { getFeedbackEnabled } from "@/lib/lms/feedback"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

type FeedbackContextType = {
  type: "general" | "module"
  competencySlug?: string
  moduleSlug?: string
  pageUrl: string
}

type FeedbackState = {
  enabled: boolean
  isOpen: boolean
  open: () => void
  close: () => void
  context: FeedbackContextType
  quotedText?: string
  setQuotedText: (text?: string) => void
  refreshEnabled: () => Promise<void>
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const FeedbackContext = createContext<FeedbackState | null>(null)

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) {
    throw new Error("useFeedback must be used inside FeedbackProvider")
  }
  return ctx
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

type FeedbackProviderProps = {
  children: ReactNode
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [quotedText, setQuotedText] = useState<string>()
  const [enabled, setEnabled] = useState(false)

  // Fetch enabled state on mount
  useEffect(() => {
    getFeedbackEnabled()
      .then(setEnabled)
      .catch(() => setEnabled(false))
  }, [])

  // Parse context from pathname
  // Pattern: /learn/[competency]/[module]
  const getContext = useCallback((): FeedbackContextType => {
    const match = pathname.match(/^\/learn\/([^\/]+)\/([^\/]+)/)

    if (match) {
      return {
        type: "module",
        competencySlug: match[1],
        moduleSlug: match[2],
        pageUrl: pathname,
      }
    }

    return {
      type: "general",
      pageUrl: pathname,
    }
  }, [pathname])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setQuotedText(undefined)
  }, [])

  const refreshEnabled = useCallback(async () => {
    try {
      const value = await getFeedbackEnabled()
      setEnabled(value)
    } catch {
      setEnabled(false)
    }
  }, [])

  return (
    <FeedbackContext.Provider
      value={{
        enabled,
        isOpen,
        open,
        close,
        context: getContext(),
        quotedText,
        setQuotedText,
        refreshEnabled,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}
