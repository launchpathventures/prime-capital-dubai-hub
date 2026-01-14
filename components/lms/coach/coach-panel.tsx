/**
 * CATALYST - Coach Panel
 *
 * Slide-out sidebar for AI coach chat.
 * Displays context, messages, and input.
 */

"use client"

import * as React from "react"
import { XIcon, SendIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text } from "@/components/core"
import { useCoach } from "./coach-provider"
import { CoachMessages } from "./coach-messages"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CoachPanel() {
  const { isOpen, closeCoach, context, sendMessage, isLoading, messages } =
    useCoach()
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Focus input when opening
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeCoach()
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, closeCoach])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Quick actions based on context
  const quickActions = React.useMemo(() => {
    if (context.level === "module") {
      return [
        {
          label: "Summarize Key Points",
          prompt:
            "Give me a quick summary of the key points in this module in bullet points.",
        },
      ]
    }
    if (context.level === "competency") {
      return [
        {
          label: "Summarize This Competency",
          prompt:
            "What are the key things I'll learn in this competency? Give me a brief overview.",
        },
        {
          label: "Where Should I Start?",
          prompt:
            "Which module should I start with in this competency? Consider the most foundational concepts first.",
        },
      ]
    }
    return []
  }, [context.level])

  const contextLabel = React.useMemo(() => {
    if (context.level === "module" && context.moduleName) {
      return `Module: ${context.moduleName}`
    }
    if (context.level === "competency" && context.competencyName) {
      return `Competency: ${context.competencyName}`
    }
    return "Course Overview"
  }, [context])

  const placeholder = React.useMemo(() => {
    if (context.level === "module") {
      return "Ask about this module..."
    }
    if (context.level === "competency") {
      return "Ask about this competency..."
    }
    return "What do you want to learn about?"
  }, [context.level])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCoach}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md",
          "bg-background border-l shadow-xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-label="AI Coach"
        aria-modal="true"
      >
        <Stack className="h-full">
          {/* Header */}
          <div className="border-b p-4">
            <Row align="center" justify="between">
              <Row align="center" gap="sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                </div>
                <Stack gap="none">
                  <Text weight="medium">AI Coach</Text>
                  <Text size="xs" variant="muted">
                    {contextLabel}
                  </Text>
                </Stack>
              </Row>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCoach}
                aria-label="Close coach"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            </Row>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <Stack gap="md">
                <Text variant="muted" className="text-center">
                  Ask me anything about{" "}
                  {context.level === "module"
                    ? "this module"
                    : context.level === "competency"
                      ? "this competency"
                      : "the curriculum"}
                  .
                </Text>

                {/* Quick Actions */}
                {quickActions.length > 0 && (
                  <Stack gap="sm">
                    <Text
                      size="xs"
                      variant="muted"
                      className="uppercase tracking-wide"
                    >
                      Quick Actions
                    </Text>
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        className="h-auto justify-start whitespace-normal py-3 text-left"
                        onClick={() => sendMessage(action.prompt)}
                        disabled={isLoading}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Stack>
            ) : (
              <CoachMessages />
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    rows={2}
                    className={cn(
                      "w-full resize-none rounded-lg border bg-background p-3 pr-12",
                      "text-sm placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    disabled={!input.trim() || isLoading}
                    aria-label="Send message"
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Text size="xs" variant="muted" className="text-center">
                  ⚠️ For training purposes only. Verify critical details.
                </Text>
              </Stack>
            </form>
          </div>
        </Stack>
      </aside>
    </>
  )
}
