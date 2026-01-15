/**
 * CATALYST - Feedback Provider
 *
 * Context provider for the feedback system.
 * Manages modal state, page context, and quoted text.
 */

"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { usePathname } from "next/navigation"

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
  isOpen: boolean
  open: () => void
  close: () => void
  context: FeedbackContextType
  quotedText?: string
  setQuotedText: (text?: string) => void
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
  enabled: boolean
}

export function FeedbackProvider({ children, enabled }: FeedbackProviderProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [quotedText, setQuotedText] = useState<string>()

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

  // Don't render provider if disabled
  if (!enabled) {
    return <>{children}</>
  }

  return (
    <FeedbackContext.Provider
      value={{
        isOpen,
        open,
        close,
        context: getContext(),
        quotedText,
        setQuotedText,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}
