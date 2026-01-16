/**
 * CATALYST - Coach Context Provider
 *
 * Manages coach state across the learn surface.
 * Handles opening/closing, context, and message state.
 */

"use client"

import * as React from "react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CoachContext {
  level: "course" | "competency" | "module"
  competencySlug?: string
  moduleSlug?: string
  competencyName?: string
  moduleName?: string
  /** Module content for deeper context (truncated for API) */
  moduleContent?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface CoachContextValue {
  // Panel state
  isOpen: boolean
  openCoach: (context?: Partial<CoachContext>) => void
  closeCoach: () => void

  // Context
  context: CoachContext
  setContext: (context: CoachContext) => void

  // Messages (session only)
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void

  // Loading state
  isLoading: boolean
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const CoachCtx = React.createContext<CoachContextValue | null>(null)

export function useCoach() {
  const context = React.useContext(CoachCtx)
  if (!context) {
    throw new Error("useCoach must be used within CoachProvider")
  }
  return context
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

interface CoachProviderProps {
  children: React.ReactNode
  initialContext?: CoachContext
}

export function CoachProvider({ children, initialContext }: CoachProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [context, setContext] = React.useState<CoachContext>(
    initialContext || { level: "course" }
  )
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Update context when initialContext changes (page navigation)
  React.useEffect(() => {
    if (initialContext) {
      setContext(initialContext)
      // Clear messages when navigating to different context
      setMessages([])
    }
  }, [initialContext?.level, initialContext?.competencySlug, initialContext?.moduleSlug])

  const openCoach = React.useCallback((newContext?: Partial<CoachContext>) => {
    if (newContext) {
      setContext((prev) => ({ ...prev, ...newContext }))
    }
    setIsOpen(true)
  }, [])

  const closeCoach = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  const sendMessage = React.useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)

      try {
        const response = await fetch("/api/coach/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            context: {
              level: context.level,
              competencySlug: context.competencySlug,
              moduleSlug: context.moduleSlug,
            },
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to get response")
        }

        // Handle streaming response
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        }

        setMessages((prev) => [...prev, assistantMessage])

        if (reader) {
          let fullResponse = "" // For logging
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            // IMPORTANT: { stream: true } prevents garbled multi-byte UTF-8 characters
            const chunk = decoder.decode(value, { stream: true })
            fullResponse += chunk
            setMessages((prev) => {
              const updated = [...prev]
              const lastIdx = updated.length - 1
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: updated[lastIdx].content + chunk,
              }
              return updated
            })
          }
          console.log("[Coach] AI response complete:", fullResponse)
        }
      } catch (error) {
        console.error("Failed to send message:", error)
        const errorMessage = error instanceof Error ? error.message : "An error occurred"
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [messages, context]
  )

  const value: CoachContextValue = {
    isOpen,
    openCoach,
    closeCoach,
    context,
    setContext,
    messages,
    sendMessage,
    clearMessages,
    isLoading,
  }

  return <CoachCtx.Provider value={value}>{children}</CoachCtx.Provider>
}
