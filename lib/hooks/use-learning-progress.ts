/**
 * CATALYST - Learning Progress Hook
 *
 * Client-side hook for managing learning progress state and actions.
 * Provides real-time progress stats and mutation functions.
 */

"use client"

import { useState, useEffect, useCallback } from "react"
import {
  markModuleStarted,
  markModuleComplete,
  getProgressStats,
} from "@/lib/actions/learning"
import type { ProgressStats } from "@/lib/learning-types"

interface UseLearningProgressReturn {
  stats: ProgressStats
  isLoading: boolean
  error: Error | null
  markStarted: (moduleId: string) => Promise<{ success: boolean }>
  markCompleted: (moduleId: string) => Promise<{ success: boolean }>
  refreshStats: () => Promise<void>
}

/**
 * Hook for managing learning progress on the client side.
 * Automatically fetches initial stats and provides mutation functions.
 */
export function useLearningProgress(): UseLearningProgressReturn {
  const [stats, setStats] = useState<ProgressStats>({
    totalModules: 0,
    completedModules: 0,
    inProgressModules: 0,
    totalQuizzes: 0,
    passedQuizzes: 0,
    currentStreak: 0,
    overallProgressPercent: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Fetch initial stats
  const refreshStats = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getProgressStats()
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err)
      setError(new Error(`Failed to fetch progress: ${errorMessage}`))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshStats()
  }, [refreshStats])

  // Mark module as started
  const markStarted = useCallback(
    async (moduleId: string) => {
      try {
        const result = await markModuleStarted(moduleId)
        // Refresh stats after successful mutation
        if (result.success) {
          await refreshStats()
        }
        return result
      } catch (err) {
        console.error("Failed to mark module as started:", err)
        return { success: false }
      }
    },
    [refreshStats]
  )

  // Mark module as completed
  const markCompleted = useCallback(
    async (moduleId: string) => {
      try {
        const result = await markModuleComplete(moduleId)
        // Refresh stats after successful mutation
        if (result.success) {
          await refreshStats()
        }
        return result
      } catch (err) {
        console.error("Failed to mark module as completed:", err)
        return { success: false }
      }
    },
    [refreshStats]
  )

  return {
    stats,
    isLoading,
    error,
    markStarted,
    markCompleted,
    refreshStats,
  }
}
