/**
 * CATALYST - Coach Messages
 *
 * Renders the message list with proper formatting.
 */

"use client"

import * as React from "react"
import { Stack, Text } from "@/components/core"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export function CoachMessages() {
  const { messages, isLoading } = useCoach()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Stack gap="md">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "rounded-lg p-3",
            message.role === "user"
              ? "ml-8 bg-primary text-primary-foreground"
              : "mr-8 bg-muted"
          )}
        >
          {message.role === "assistant" ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <Text size="sm">{message.content}</Text>
          )}
        </div>
      ))}

      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="mr-8 rounded-lg bg-muted p-3">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.1s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]" />
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </Stack>
  )
}
