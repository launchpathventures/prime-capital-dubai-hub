/**
 * CATALYST - Scenario Progress Server Actions
 */

"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ScenarioReflection {
  learned: string
  improve: string
}

export interface ScenarioProgress {
  scenarioCategory: string
  scenarioId: string
  reflectionLearned: string
  reflectionImprove: string
  completedAt: string
}

// -----------------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------------

/**
 * Complete a scenario by submitting a reflection
 */
export async function completeScenario(
  category: string,
  scenarioId: string,
  reflection: ScenarioReflection
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // Validate reflection content
  if (!reflection.learned?.trim() || reflection.learned.trim().length < 20) {
    return { success: false, error: "Please provide a meaningful reflection on what you learned (at least 20 characters)" }
  }
  
  if (!reflection.improve?.trim() || reflection.improve.trim().length < 20) {
    return { success: false, error: "Please describe what you would do differently next time (at least 20 characters)" }
  }
  
  // Upsert progress record
  const { error } = await supabase
    .from("scenario_progress")
    .upsert({
      user_id: user.id,
      scenario_category: category,
      scenario_id: scenarioId,
      reflection_learned: reflection.learned.trim(),
      reflection_improve: reflection.improve.trim(),
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,scenario_category,scenario_id",
    })
  
  if (error) {
    console.error("Failed to save scenario progress:", error)
    return { success: false, error: "Failed to save reflection" }
  }
  
  // Revalidate affected pages
  revalidatePath("/learn/scenarios")
  revalidatePath(`/learn/scenarios/${category}`)
  revalidatePath("/learn/progress")
  
  return { success: true }
}

/**
 * Get user's scenario progress for a category
 */
export async function getScenarioProgress(
  category?: string
): Promise<ScenarioProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  let query = supabase
    .from("scenario_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
  
  if (category) {
    query = query.eq("scenario_category", category)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error("Failed to fetch scenario progress:", error)
    return []
  }
  
  return (data || []).map(p => ({
    scenarioCategory: p.scenario_category,
    scenarioId: p.scenario_id,
    reflectionLearned: p.reflection_learned,
    reflectionImprove: p.reflection_improve,
    completedAt: p.completed_at,
  }))
}

/**
 * Get count of completed scenarios for progress display
 */
export async function getScenarioCompletionStats(): Promise<{
  completedScenarios: number
  byCategory: Array<{ category: string; completed: number }>
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { completedScenarios: 0, byCategory: [] }
  }
  
  const { data, error } = await supabase
    .from("scenario_progress")
    .select("scenario_category")
    .eq("user_id", user.id)
  
  if (error) {
    console.error("Failed to fetch scenario stats:", error)
    return { completedScenarios: 0, byCategory: [] }
  }
  
  const byCategoryMap: Record<string, number> = {}
  for (const row of data || []) {
    byCategoryMap[row.scenario_category] = (byCategoryMap[row.scenario_category] || 0) + 1
  }
  
  return {
    completedScenarios: data?.length || 0,
    byCategory: Object.entries(byCategoryMap).map(([category, completed]) => ({
      category,
      completed,
    })),
  }
}
