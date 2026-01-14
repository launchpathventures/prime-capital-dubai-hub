/**
 * CATALYST - Coach Messages
 *
 * Renders the message list with proper formatting.
 * Features: markdown rendering, module links, visual hierarchy.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { SparklesIcon, UserIcon, ArrowRightIcon } from "lucide-react"
import { Stack, Text } from "@/components/core"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export function CoachMessages() {
  const { messages, isLoading, closeCoach } = useCoach()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Stack gap="lg" className="coach-messages">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "coach-message",
            message.role === "user" ? "coach-message--user" : "coach-message--assistant"
          )}
        >
          {/* Avatar */}
          <div className="coach-message__avatar">
            {message.role === "user" ? (
              <UserIcon className="h-3.5 w-3.5" />
            ) : (
              <SparklesIcon className="h-3.5 w-3.5" />
            )}
          </div>

          {/* Content */}
          <div className="coach-message__content">
            {message.role === "assistant" ? (
              <div className="coach-prose">
                <ReactMarkdown
                  components={{
                    // Render internal links as Next.js Links
                    a: ({ href, children }) => {
                      // Check if it's an internal /learn link
                      if (href?.startsWith("/learn")) {
                        return (
                          <Link 
                            href={href} 
                            className="coach-prose__module-link"
                            onClick={closeCoach}
                          >
                            {children}
                            <ArrowRightIcon className="coach-prose__module-link-icon" />
                          </Link>
                        )
                      }
                      // External links
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      )
                    },
                    // Style strong text (module names) as inline highlights
                    strong: ({ children }) => (
                      <strong className="coach-prose__highlight">{children}</strong>
                    ),
                    // Better paragraph spacing
                    p: ({ children }) => (
                      <p className="coach-prose__paragraph">{children}</p>
                    ),
                    // Style lists nicely
                    ul: ({ children }) => (
                      <ul className="coach-prose__list">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="coach-prose__list coach-prose__list--ordered">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="coach-prose__list-item">{children}</li>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <Text size="sm" className="coach-message__user-text">{message.content}</Text>
            )}
          </div>
        </div>
      ))}

      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="coach-message coach-message--assistant">
          <div className="coach-message__avatar">
            <SparklesIcon className="h-3.5 w-3.5" />
          </div>
          <div className="coach-message__content">
            <div className="coach-message__typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </Stack>
  )
}
