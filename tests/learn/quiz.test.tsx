/**
 * CATALYST - Quiz Flow Tests
 *
 * Tests for quiz question display, answer selection, and submission.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { QuizQuestion } from "@/components/lms/quiz-question"

describe("QuizQuestion Component", () => {
  const mockQuestion = {
    id: "q1",
    quizId: "test-quiz",
    competencySlug: "foundations",
    relatedModule: "market-basics",
    questionNumber: 1,
    questionText: "What is the capital of UAE?",
    options: [
      { text: "Abu Dhabi", correct: true },
      { text: "Dubai", correct: false },
      { text: "Sharjah", correct: false },
      { text: "Ajman", correct: false },
    ],
    explanation: "Abu Dhabi is the capital of the United Arab Emirates.",
    displayOrder: 1,
  }

  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render question text", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    expect(screen.getByText("What is the capital of UAE?")).toBeInTheDocument()
  })

  it("should render all answer options", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    expect(screen.getByText("Abu Dhabi")).toBeInTheDocument()
    expect(screen.getByText("Dubai")).toBeInTheDocument()
    expect(screen.getByText("Sharjah")).toBeInTheDocument()
    expect(screen.getByText("Ajman")).toBeInTheDocument()
  })

  it("should have submit button disabled when no option selected", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  it("should enable submit button when option is selected", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    const option = screen.getByRole("radio", { name: /Option 1: Abu Dhabi/i })
    fireEvent.click(option)

    const submitButton = screen.getByRole("button", { name: /submit/i })
    expect(submitButton).not.toBeDisabled()
  })

  it("should call onSubmit with selected option index", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    // Select second option (Dubai)
    const option = screen.getByRole("radio", { name: /Option 2: Dubai/i })
    fireEvent.click(option)

    // Submit
    const submitButton = screen.getByRole("button", { name: /submit/i })
    fireEvent.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith(1)
  })

  it("should support keyboard navigation with arrow keys", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    const firstOption = screen.getByRole("radio", { name: /Option 1: Abu Dhabi/i })
    firstOption.focus()

    // Press arrow down
    fireEvent.keyDown(firstOption, { key: "ArrowDown" })

    // Second option should be focused
    const secondOption = screen.getByRole("radio", { name: /Option 2: Dubai/i })
    expect(document.activeElement).toBe(secondOption)
  })

  it("should select option on Enter key", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    const option = screen.getByRole("radio", { name: /Option 1: Abu Dhabi/i })
    fireEvent.keyDown(option, { key: "Enter" })

    expect(option).toHaveAttribute("aria-checked", "true")
  })

  it("should show loading state when submitting", () => {
    render(
      <QuizQuestion
        question={mockQuestion}
        onSubmit={mockOnSubmit}
        isSubmitting={true}
      />
    )

    expect(screen.getByText("Submitting...")).toBeInTheDocument()
  })

  it("should have proper ARIA roles for accessibility", () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)

    // Should have radiogroup
    expect(screen.getByRole("radiogroup")).toBeInTheDocument()

    // Should have radio buttons
    const radios = screen.getAllByRole("radio")
    expect(radios).toHaveLength(4)
  })
})
