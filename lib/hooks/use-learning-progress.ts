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
  type ProgressStats,
} from "@/lib/actions/learning"

interface UseLearningProgressReturn {
  stats: ProgressStats | null
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
  const [stats, setStats] = useState<ProgressStats | null>(null)
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
      setError(err instanceof Error ? err : new Error("Failed to fetch progress"))
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
