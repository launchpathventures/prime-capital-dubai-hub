/**
 * CATALYST - Coach Inline Prompt
 *
 * Compact AI Coach prompt - collapsed by default to reduce visual noise.
 * Shows just the input; example prompts appear on focus/interaction.
 * 
 * Used by: Module pages (after title, before content)
 */

"use client"

import * as React from "react"
import { SparklesIcon, ArrowRightIcon, ChevronDownIcon } from "lucide-react"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface CoachInlinePromptProps {
  /** Placeholder text for the input */
  placeholder?: string
  /** Example prompts to show as clickable pills */
  examplePrompts?: string[]
  /** Additional CSS classes */
  className?: string
}

// -----------------------------------------------------------------------------
// Default Example Prompts by Context
// -----------------------------------------------------------------------------

const DEFAULT_EXAMPLES = [
  "Summarize this in simple terms",
  "What's the most important thing here?",
  "How would I explain this to a client?",
]

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CoachInlinePrompt({
  placeholder = "Ask anything about this module...",
  examplePrompts = DEFAULT_EXAMPLES,
  className,
}: CoachInlinePromptProps) {
  const { openCoach, sendMessage } = useCoach()
  const [inputValue, setInputValue] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return
    
    openCoach()
    // Small delay to ensure panel is open before sending
    setTimeout(() => {
      sendMessage(inputValue.trim())
      setInputValue("")
    }, 100)
  }

  const handleExampleClick = (prompt: string) => {
    openCoach()
    setTimeout(() => {
      sendMessage(prompt)
    }, 100)
  }
  
  const handleFocus = () => {
    setIsExpanded(true)
  }
  
  // Collapse when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!inputValue.trim()) {
          setIsExpanded(false)
        }
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [inputValue])

  return (
    <div
      ref={containerRef}
      className={cn(
        "coach-inline-prompt",
        isExpanded && "coach-inline-prompt--expanded",
        className
      )}
    >
      {/* Compact header - always visible */}
      <div className="coach-inline-prompt__compact-header">
        <div className="coach-inline-prompt__brand">
          <span className="coach-inline-prompt__icon">
            <SparklesIcon className="h-4 w-4" />
          </span>
          <span className="coach-inline-prompt__title">AI Coach</span>
          <span className="coach-inline-prompt__badge">Beta</span>
        </div>
      </div>

      {/* Input form - always visible */}
      <form onSubmit={handleSubmit} className="coach-inline-prompt__form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="coach-inline-prompt__input"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="coach-inline-prompt__submit"
          aria-label="Send message"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </form>

      {/* Example prompts - shown when expanded */}
      {isExpanded && examplePrompts.length > 0 && (
        <div className="coach-inline-prompt__examples">
          <span className="coach-inline-prompt__examples-label">Try asking:</span>
          <div className="coach-inline-prompt__examples-list">
            {examplePrompts.map((prompt, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(prompt)}
                className="coach-inline-prompt__example"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
