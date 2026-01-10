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
  
  return (
    <Stack gap="lg">
      {/* Question Text */}
      <Text size="lg" weight="medium">
        {question.questionText}
      </Text>
      
      {/* Answer Options */}
      <Stack gap="sm">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "w-full p-4 text-left border rounded-lg transition-all",
              "hover:border-foreground/30",
              selectedIndex === index
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border"
            )}
            disabled={isSubmitting}
          >
            <Row align="center" gap="sm">
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  selectedIndex === index
                    ? "border-primary"
                    : "border-muted-foreground/30"
                )}
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
      >
        {isSubmitting ? "Submitting..." : "Submit Answer"}
      </Button>
    </Stack>
  )
}
