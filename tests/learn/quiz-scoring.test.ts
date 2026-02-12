/**
 * CATALYST - Quiz Scoring Tests
 *
 * Tests for quiz scoring logic, pass threshold calculation, and edge cases.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import { config } from "@/lib/config"

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(),
  rpc: vi.fn(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

describe("Quiz Scoring", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // =============================================================================
  // PASS THRESHOLD CONFIGURATION
  // =============================================================================

  describe("Pass Threshold Configuration", () => {
    it("should have default pass threshold of 80%", () => {
      expect(config.learning.quizPassThreshold).toBe(0.8)
    })

    it("should be a decimal between 0 and 1", () => {
      expect(config.learning.quizPassThreshold).toBeGreaterThan(0)
      expect(config.learning.quizPassThreshold).toBeLessThanOrEqual(1)
    })
  })

  // =============================================================================
  // SCORE CALCULATION TESTS
  // =============================================================================

  describe("Score Calculation", () => {
    beforeEach(() => {
      // Mock authenticated user
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
      })
    })

    it("should calculate score correctly with all answers correct", async () => {
      const mockQuestions = [
        { id: "q1", options: [{ text: "A", correct: true }, { text: "B", correct: false }], explanation: "Explanation 1" },
        { id: "q2", options: [{ text: "A", correct: false }, { text: "B", correct: true }], explanation: "Explanation 2" },
        { id: "q3", options: [{ text: "A", correct: true }, { text: "B", correct: false }], explanation: "Explanation 3" },
      ]

      // Mock module ID lookup
      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
          }
        }
        if (table === "quiz_attempts") {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        if (table === "learning_progress") {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      const result = await submitQuizAttempt("module-uuid-123456789012-123456789012", [
        { questionId: "q1", selectedOption: 0 }, // Correct (A)
        { questionId: "q2", selectedOption: 1 }, // Correct (B)
        { questionId: "q3", selectedOption: 0 }, // Correct (A)
      ])

      expect(result.score).toBe(3)
      expect(result.maxScore).toBe(3)
      expect(result.passed).toBe(true)
      expect(result.correctAnswers).toEqual(["q1", "q2", "q3"])
    })

    it("should calculate score correctly with all answers wrong", async () => {
      const mockQuestions = [
        { id: "q1", options: [{ text: "A", correct: true }, { text: "B", correct: false }], explanation: "Explanation 1" },
        { id: "q2", options: [{ text: "A", correct: false }, { text: "B", correct: true }], explanation: "Explanation 2" },
        { id: "q3", options: [{ text: "A", correct: true }, { text: "B", correct: false }], explanation: "Explanation 3" },
      ]

      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
          }
        }
        if (table === "quiz_attempts") {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      const result = await submitQuizAttempt("module-uuid-123456789012-123456789012", [
        { questionId: "q1", selectedOption: 1 }, // Wrong (B)
        { questionId: "q2", selectedOption: 0 }, // Wrong (A)
        { questionId: "q3", selectedOption: 1 }, // Wrong (B)
      ])

      expect(result.score).toBe(0)
      expect(result.maxScore).toBe(3)
      expect(result.passed).toBe(false)
      expect(result.correctAnswers).toEqual([])
    })

    it("should pass at exactly 80% threshold (4/5)", async () => {
      const mockQuestions = [
        { id: "q1", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q2", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q3", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q4", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q5", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
      ]

      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
          }
        }
        if (table === "quiz_attempts") {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        if (table === "learning_progress") {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      const result = await submitQuizAttempt("module-uuid-123456789012-123456789012", [
        { questionId: "q1", selectedOption: 0 }, // Correct
        { questionId: "q2", selectedOption: 0 }, // Correct
        { questionId: "q3", selectedOption: 0 }, // Correct
        { questionId: "q4", selectedOption: 0 }, // Correct
        { questionId: "q5", selectedOption: 1 }, // Wrong
      ])

      expect(result.score).toBe(4)
      expect(result.maxScore).toBe(5)
      // 4/5 = 0.8 which equals the threshold
      expect(result.passed).toBe(true)
    })

    it("should fail just below 80% threshold (3/5)", async () => {
      const mockQuestions = [
        { id: "q1", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q2", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q3", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q4", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
        { id: "q5", options: [{ text: "A", correct: true }, { text: "B", correct: false }] },
      ]

      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
          }
        }
        if (table === "quiz_attempts") {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      const result = await submitQuizAttempt("module-uuid-123456789012-123456789012", [
        { questionId: "q1", selectedOption: 0 }, // Correct
        { questionId: "q2", selectedOption: 0 }, // Correct
        { questionId: "q3", selectedOption: 0 }, // Correct
        { questionId: "q4", selectedOption: 1 }, // Wrong
        { questionId: "q5", selectedOption: 1 }, // Wrong
      ])

      expect(result.score).toBe(3)
      expect(result.maxScore).toBe(5)
      // 3/5 = 0.6 which is below 0.8
      expect(result.passed).toBe(false)
    })
  })

  // =============================================================================
  // AUTHENTICATION TESTS
  // =============================================================================

  describe("Authentication", () => {
    it("should throw error when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      await expect(
        submitQuizAttempt("module-123", [{ questionId: "q1", selectedOption: 0 }])
      ).rejects.toThrow("Not authenticated")
    })
  })

  // =============================================================================
  // QUIZ NOT FOUND TESTS
  // =============================================================================

  describe("Quiz Not Found", () => {
    it("should throw error when quiz has no questions", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
      })

      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      await expect(
        submitQuizAttempt("nonexistent-quiz", [{ questionId: "q1", selectedOption: 0 }])
      ).rejects.toThrow("Quiz not found")
    })
  })

  // =============================================================================
  // EXPLANATION TESTS
  // =============================================================================

  describe("Explanations", () => {
    it("should include explanations in result", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
      })

      const mockQuestions = [
        { id: "q1", options: [{ text: "A", correct: true }], explanation: "This is why A is correct." },
        { id: "q2", options: [{ text: "A", correct: true }], explanation: "This explains the answer." },
      ]

      mockSupabase.from.mockImplementation((table) => {
        if (table === "quiz_questions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockQuestions, error: null }),
          }
        }
        if (table === "quiz_attempts") {
          return {
            insert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        if (table === "learning_progress") {
          return {
            upsert: vi.fn().mockResolvedValue({ error: null }),
          }
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        }
      })

      const { submitQuizAttempt } = await import("@/lib/actions/learning")

      const result = await submitQuizAttempt("module-uuid-123456789012-123456789012", [
        { questionId: "q1", selectedOption: 0 },
        { questionId: "q2", selectedOption: 0 },
      ])

      expect(result.explanations).toEqual({
        q1: "This is why A is correct.",
        q2: "This explains the answer.",
      })
    })
  })
})
