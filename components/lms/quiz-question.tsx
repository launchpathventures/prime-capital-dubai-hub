/**
 * CATALYST - Quiz Question
 */

"use client"

import { useState } from "react"
import { Stack, Row, Text } from "@/components/core"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { QuizQuestion as QuizQuestionType } from "@/lib/learning-types"

interface QuizQuestionProps {
  question: QuizQuestionType
  onSubmit: (optionIndex: number) => void
  isSubmitting?: boolean
}

export function QuizQuestion({ question, onSubmit, isSubmitting }: QuizQuestionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  
  const handleSubmit = () => {
    if (selectedIndex !== null) {
      onSubmit(selectedIndex)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Arrow key navigation
    if (e.key === "ArrowDown" && index < question.options.length - 1) {
      e.preventDefault()
      const nextButton = document.querySelector(`[data-option-index="${index + 1}"]`) as HTMLButtonElement
      nextButton?.focus()
    }
    if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault()
      const prevButton = document.querySelector(`[data-option-index="${index - 1}"]`) as HTMLButtonElement
      prevButton?.focus()
    }
    // Space or Enter to select
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      setSelectedIndex(index)
    }
  }
  
  return (
    <Stack gap="lg" role="group" aria-labelledby="question-text">
      {/* Question Text */}
      <Text id="question-text" size="lg" weight="medium">
        {question.questionText}
      </Text>
      
      {/* Answer Options */}
      <Stack gap="sm" role="radiogroup" aria-labelledby="question-text">
        {question.options.map((option, index) => (
          <button
            key={index}
            data-option-index={index}
            onClick={() => setSelectedIndex(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              "quiz-option w-full p-4 text-left border rounded-lg transition-all",
              "hover:border-foreground/30",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              selectedIndex === index
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border"
            )}
            disabled={isSubmitting}
            role="radio"
            aria-checked={selectedIndex === index}
            aria-label={`Option ${index + 1}: ${option.text}`}
          >
            <Row align="center" gap="sm">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedIndex === index
                    ? "border-primary"
                    : "border-muted-foreground/30"
                )}
                aria-hidden="true"
              >
                {selectedIndex === index && (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                )}
              </div>
              <Text>{option.text}</Text>
            </Row>
          </button>
        ))}
      </Stack>
      
      {/* Submit Button */}
      <Button 
        size="lg" 
        className="w-full" 
        onClick={handleSubmit}
        disabled={selectedIndex === null || isSubmitting}
        aria-label={selectedIndex !== null ? `Submit answer: ${question.options[selectedIndex].text}` : "Select an answer to submit"}
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </Stack>
  )
}
