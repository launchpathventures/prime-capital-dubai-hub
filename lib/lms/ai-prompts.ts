/**
 * CATALYST - AI Prompt Loader
 *
 * Loads AI prompts from database with caching and fallbacks.
 */

import "server-only"
import { createClient } from "@/lib/supabase/server"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type PromptType =
  | "coach_base"
  | "coach_course"
  | "coach_competency"
  | "coach_module"
  | "roleplay_character"
  | "roleplay_evaluation"

interface CachedPrompt {
  content: string
  loadedAt: number
}

// -----------------------------------------------------------------------------
// Cache
// -----------------------------------------------------------------------------

const promptCache = new Map<PromptType, CachedPrompt>()
const CACHE_TTL = 1 * 60 * 1000 // 1 minute (shorter for faster updates)

// -----------------------------------------------------------------------------
// Default Prompts (Fallback)
// -----------------------------------------------------------------------------

const DEFAULT_PROMPTS: Record<PromptType, string> = {
  coach_base: `You are the AI Coach for Prime Capital Dubai's real estate training program.

CRITICAL RULES:
- Give CONCISE answers (30-50 words unless asked for more)
- Focus ONLY on Dubai real estate and this training curriculum
- Always cite which module covers a topic: "See Module X.X: Title"
- If asked about something outside Dubai RE or the curriculum, politely decline

TONE:
- Professional but approachable
- Direct, not conversational
- Confident but not pushy`,

  coach_course: `CURRENT CONTEXT: Course Level
You are helping the learner navigate the entire curriculum.

BEHAVIOR:
- Help learners find the right module for their question
- Give brief topic overviews, then point to modules
- Format responses as: "This is covered in Module X.X: Title"`,

  coach_competency: `CURRENT CONTEXT: Competency Level

BEHAVIOR:
- Help learners understand what this competency covers
- Recommend which module to start with based on their question
- Use clickable module links so learners can navigate directly`,

  coach_module: `CURRENT CONTEXT: Module Level
You are an expert on this specific module.

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- If asked about other topics, briefly answer and suggest the relevant module`,

  roleplay_character: `You are playing a client in a real estate roleplay training exercise.

ABSOLUTE RULES - NEVER BREAK THESE:
1. NO asterisks, NO stage directions, NO actions like *leans forward*
2. NO phonetic accents or misspellings - write clear, grammatically correct English
3. MAXIMUM 2 sentences per response
4. Speak naturally like a real professional would in a business meeting

YOUR ROLE:
- You are the CLIENT described in the scenario
- Express your needs and concerns clearly
- React appropriately to the consultant's responses`,

  roleplay_evaluation: `You are an expert evaluator for real estate sales training. Respond only with valid JSON.`,
}

// -----------------------------------------------------------------------------
// Loader
// -----------------------------------------------------------------------------

/**
 * Get a prompt by type, with caching and fallback.
 */
export async function getPrompt(type: PromptType): Promise<string> {
  // Check cache first
  const cached = promptCache.get(type)
  if (cached && Date.now() - cached.loadedAt < CACHE_TTL) {
    return cached.content
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("ai_prompts")
      .select("content")
      .eq("prompt_type", type)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      console.warn(
        `Failed to load prompt ${type}, using default:`,
        error?.message
      )
      return DEFAULT_PROMPTS[type]
    }

    // Cache it
    promptCache.set(type, {
      content: data.content,
      loadedAt: Date.now(),
    })

    return data.content
  } catch (error) {
    console.error(`Error loading prompt ${type}:`, error)
    return DEFAULT_PROMPTS[type]
  }
}

/**
 * Get multiple prompts at once (more efficient).
 */
export async function getPrompts(
  types: PromptType[]
): Promise<Record<PromptType, string>> {
  const result: Partial<Record<PromptType, string>> = {}
  const uncached: PromptType[] = []

  // Check cache first
  for (const type of types) {
    const cached = promptCache.get(type)
    if (cached && Date.now() - cached.loadedAt < CACHE_TTL) {
      result[type] = cached.content
    } else {
      uncached.push(type)
    }
  }

  // Fetch uncached from database
  if (uncached.length > 0) {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from("ai_prompts")
        .select("prompt_type, content")
        .in("prompt_type", uncached)
        .eq("is_active", true)

      if (error) {
        console.warn("Failed to load prompts:", error.message)
      }

      // Process results
      const dataMap = new Map(
        data?.map((d) => [d.prompt_type as PromptType, d.content]) || []
      )

      for (const type of uncached) {
        const content = dataMap.get(type) || DEFAULT_PROMPTS[type]
        result[type] = content
        promptCache.set(type, { content, loadedAt: Date.now() })
      }
    } catch (error) {
      console.error("Error loading prompts:", error)
      // Fall back to defaults
      for (const type of uncached) {
        result[type] = DEFAULT_PROMPTS[type]
      }
    }
  }

  return result as Record<PromptType, string>
}

/**
 * Clear the prompt cache (call after admin updates).
 */
export function clearPromptCache(): void {
  promptCache.clear()
}
