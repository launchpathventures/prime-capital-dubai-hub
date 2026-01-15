/**
 * CATALYST - Curriculum Index for AI Coach
 *
 * Generates a structured summary of the entire curriculum
 * for use in AI Coach system prompts. Includes caching to
 * avoid repeated database queries.
 */

import "server-only"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ModuleSummary {
  number: string // e.g., "0.1"
  title: string
  slug: string
  competencySlug: string
  keyTopics: string[] // Extracted from learning objectives or essentials
  estimatedDuration: number
}

interface CompetencySummary {
  number: number
  name: string
  slug: string
  description: string
  modules: ModuleSummary[]
}

export interface CurriculumIndex {
  totalModules: number
  totalCompetencies: number
  estimatedTotalHours: number
  competencies: CompetencySummary[]
  /** Pre-formatted string for AI prompt */
  promptText: string
}

// -----------------------------------------------------------------------------
// Cache
// -----------------------------------------------------------------------------

let cachedIndex: CurriculumIndex | null = null
let cacheTime: number = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

// -----------------------------------------------------------------------------
// Main Function
// -----------------------------------------------------------------------------

/**
 * Generate a curriculum index for the AI Coach.
 * Caches the result for 1 hour since curriculum doesn't change often.
 */
export async function getCurriculumIndex(): Promise<CurriculumIndex> {
  // Return cached if fresh
  if (cachedIndex && Date.now() - cacheTime < CACHE_TTL) {
    return cachedIndex
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("competencies")
    .select(
      `
      id,
      slug,
      name,
      description,
      display_order,
      learning_modules (
        id,
        slug,
        title,
        display_order,
        duration_minutes,
        essentials
      )
    `
    )
    .order("display_order", { ascending: true })

  if (error) {
    console.error("Failed to fetch curriculum for index:", error)
    throw error
  }

  const competencies: CompetencySummary[] = (data || []).map((comp) => {
    // Type assertion for learning_modules from Supabase
    type ModuleRow = {
      slug: string
      title: string
      display_order: number
      duration_minutes: number | null
      essentials: unknown
    }

    const rawModules = (comp.learning_modules || []) as ModuleRow[]
    const modules = rawModules
      .sort((a, b) => a.display_order - b.display_order)
      .map((mod, idx) => ({
        number: `${comp.display_order}.${idx + 1}`,
        title: mod.title,
        slug: mod.slug,
        competencySlug: comp.slug,
        keyTopics: extractKeyTopics(mod.essentials),
        estimatedDuration: mod.duration_minutes || 25,
      }))

    return {
      number: comp.display_order,
      name: comp.name,
      slug: comp.slug,
      description: comp.description || "",
      modules,
    }
  })

  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const totalMinutes = competencies.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m.estimatedDuration, 0),
    0
  )

  const index: CurriculumIndex = {
    totalModules,
    totalCompetencies: competencies.length,
    estimatedTotalHours: Math.round(totalMinutes / 60),
    competencies,
    promptText: formatForPrompt(competencies),
  }

  // Cache it
  cachedIndex = index
  cacheTime = Date.now()

  return index
}

// -----------------------------------------------------------------------------
// Helper Functions
// -----------------------------------------------------------------------------

/**
 * Extract key topics from module essentials.
 */
function extractKeyTopics(essentials: unknown): string[] {
  if (!essentials || typeof essentials !== "object") return []

  const e = essentials as Record<string, unknown>
  const topics: string[] = []

  // Extract from key facts
  if (Array.isArray(e.keyFacts)) {
    for (const f of e.keyFacts.slice(0, 3)) {
      const fact = f as { title?: string }
      if (fact.title) topics.push(fact.title)
    }
  }

  // Extract from scripts
  if (Array.isArray(e.scripts)) {
    for (const s of e.scripts.slice(0, 2)) {
      const script = s as { title?: string }
      if (script.title) topics.push(script.title)
    }
  }

  return topics.slice(0, 5) // Max 5 topics per module
}

/**
 * Format the curriculum index for use in AI prompt.
 */
function formatForPrompt(competencies: CompetencySummary[]): string {
  const lines: string[] = ["CURRICULUM STRUCTURE:", ""]

  for (const comp of competencies) {
    lines.push(`## Competency ${comp.number}: ${comp.name}`)
    if (comp.description) {
      lines.push(comp.description)
    }
    lines.push("")

    for (const mod of comp.modules) {
      const topicsStr =
        mod.keyTopics.length > 0 ? ` — Topics: ${mod.keyTopics.join(", ")}` : ""
      lines.push(
        `  - [Module ${mod.number}: ${mod.title}](/learn/${mod.competencySlug}/${mod.slug})${topicsStr}`
      )
    }
    lines.push("")
  }

  return lines.join("\n")
}

// -----------------------------------------------------------------------------
// Relevance Search
// -----------------------------------------------------------------------------

/**
 * Find modules relevant to a user's question.
 * Simple keyword matching for now; upgrade to embeddings later.
 */
export function findRelevantModules(
  question: string,
  index: CurriculumIndex,
  limit: number = 5
): ModuleSummary[] {
  const lowerQ = question.toLowerCase()

  // Extract meaningful keywords (skip common words)
  const stopWords = new Set([
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "must", "can", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "about",
    "what", "how", "when", "where", "why", "which", "who", "whom",
    "this", "that", "these", "those", "it", "its", "and", "or", "but",
    "if", "then", "so", "than", "too", "very", "just", "only", "also",
    "more", "most", "some", "any", "all", "each", "every", "both",
    "few", "many", "much", "other", "another", "such", "no", "not",
    "me", "my", "i", "you", "your", "we", "our", "they", "their",
    "tell", "know", "learn", "understand", "explain", "help",
  ])

  const keywords = lowerQ
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  if (keywords.length === 0) {
    // Return first few modules if no keywords found
    return index.competencies
      .flatMap((c) => c.modules)
      .slice(0, limit)
  }

  const scored: Array<{ module: ModuleSummary; score: number }> = []

  for (const comp of index.competencies) {
    for (const mod of comp.modules) {
      let score = 0

      // Check title (highest weight)
      const lowerTitle = mod.title.toLowerCase()
      for (const kw of keywords) {
        if (lowerTitle.includes(kw)) score += 5
      }

      // Check topics (medium weight)
      for (const topic of mod.keyTopics) {
        const lowerTopic = topic.toLowerCase()
        for (const kw of keywords) {
          if (lowerTopic.includes(kw)) score += 3
        }
      }

      // Check competency name (lower weight)
      const lowerComp = comp.name.toLowerCase()
      for (const kw of keywords) {
        if (lowerComp.includes(kw)) score += 2
      }

      // Check competency description
      const lowerDesc = comp.description.toLowerCase()
      for (const kw of keywords) {
        if (lowerDesc.includes(kw)) score += 1
      }

      if (score > 0) {
        scored.push({ module: mod, score })
      }
    }
  }

  // Sort by score and return top matches
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.module)
}

/**
 * Clear the curriculum cache (useful after content updates).
 */
export function clearCurriculumCache(): void {
  cachedIndex = null
  cacheTime = 0
}
