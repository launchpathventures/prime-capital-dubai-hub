/**
 * CATALYST - AI Coach Chat API
 *
 * Handles chat requests with context-aware responses.
 * Uses Claude API with streaming for fast responses.
 * 
 * Context levels:
 * - Course: Full curriculum index for navigation
 * - Competency: Module list for that competency
 * - Module: Full module content for deep answers
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { getCompetencyWithModules, getModule } from "@/lib/learning"
import { getCurriculumIndex, findRelevantModules } from "@/lib/lms/curriculum-index"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ChatRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  context: {
    level: "course" | "competency" | "module"
    competencySlug?: string
    moduleSlug?: string
  }
}

// -----------------------------------------------------------------------------
// Claude Client
// -----------------------------------------------------------------------------

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// -----------------------------------------------------------------------------
// System Prompt Builder
// -----------------------------------------------------------------------------

interface ModuleInfo {
  order: string
  name: string
  slug: string
  description: string
}

interface CompetencyInfo {
  name: string
  slug: string
  description: string
  moduleCount: number
  modules?: ModuleInfo[]
}

async function buildSystemPrompt(
  context: ChatRequest["context"],
  moduleContent?: string,
  competencyInfo?: CompetencyInfo,
  userQuestion?: string
): Promise<string> {
  const base = `You are the AI Coach for Prime Capital Dubai's real estate training program.

CRITICAL RULES:
- Give CONCISE answers (30-50 words unless asked for more)
- Focus ONLY on Dubai real estate and this training curriculum
- Always cite which module covers a topic using markdown links: [Module X.X: Title](/learn/competency/module)
- If asked about something outside Dubai RE or the curriculum, politely decline
- Add this disclaimer when giving specific regulatory or legal advice: "⚠️ Verify critical details with current regulations."

SCOPE LIMITATIONS:
- You can ONLY help with learning about Dubai real estate
- Decline requests for: code, general knowledge, jokes, personal advice, anything unrelated to Dubai RE
- If the question is off-topic, say: "I'm focused on helping you learn about Dubai real estate. Is there something about the curriculum I can help with?"

TONE:
- Professional but approachable
- Direct, not conversational
- Confident but not pushy (matches Prime Capital brand)`

  // MODULE LEVEL - Deepest context with full content
  if (context.level === "module" && moduleContent) {
    return `${base}

CURRENT CONTEXT: Module Level
You are an expert on this specific module. Answer questions using the content below.

MODULE CONTENT:
${moduleContent.slice(0, 15000)}

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- Use markdown links when referencing modules: [Module Title](/learn/competency/module)
- If asked about other topics, briefly answer and suggest the relevant module`
  }

  // COMPETENCY LEVEL - Module list for navigation
  if (context.level === "competency" && competencyInfo) {
    const moduleList = competencyInfo.modules
      ? competencyInfo.modules
          .map((m) => `  - [Module ${m.order}: ${m.name}](/learn/${competencyInfo.slug}/${m.slug})${m.description ? ` — ${m.description}` : ''}`)
          .join('\n')
      : 'No modules available'

    return `${base}

CURRENT CONTEXT: Competency Level
You are helping the learner navigate ${competencyInfo.name} (${competencyInfo.moduleCount} modules).

COMPETENCY: ${competencyInfo.name}
DESCRIPTION: ${competencyInfo.description}

MODULES IN THIS COMPETENCY (with links):
${moduleList}

LINKING RULES:
- When referencing a module, ALWAYS use the EXACT markdown link format from the list above
- Copy the link exactly as shown, e.g.: [Module 0.1: Prime Capital Orientation](/learn/foundations/prime-capital-orientation)
- This creates clickable links for learners

BEHAVIOR:
- Help learners understand what this competency covers
- Recommend which module to start with based on their question
- Use clickable module links so learners can navigate directly
- Summarize key themes across the competency`
  }

  // COURSE LEVEL - Full curriculum index with relevance search
  try {
    const curriculumIndex = await getCurriculumIndex()

    // Find potentially relevant modules based on user's question
    let relevantModulesText = ""
    if (userQuestion) {
      const relevant = findRelevantModules(userQuestion, curriculumIndex, 5)
      if (relevant.length > 0) {
        relevantModulesText = `

MOST RELEVANT MODULES FOR THIS QUESTION:
${relevant.map(m => `- [Module ${m.number}: ${m.title}](/learn/${m.competencySlug}/${m.slug})${m.keyTopics.length > 0 ? ` — Topics: ${m.keyTopics.join(", ")}` : ""}`).join("\n")}

Use these modules to guide your answer. Link to them using the exact format shown.`
      }
    }

    return `${base}

CURRENT CONTEXT: Course Level
You are helping the learner navigate the entire curriculum (${curriculumIndex.totalCompetencies} competencies, ${curriculumIndex.totalModules} modules, ~${curriculumIndex.estimatedTotalHours} hours total).

${curriculumIndex.promptText}
${relevantModulesText}

LINKING RULES:
- When referencing a module, ALWAYS use markdown links: [Module X.X: Title](/learn/competency/module)
- Copy the link format from the curriculum structure above
- This creates clickable links for learners

BEHAVIOR:
- Help learners find the right module for their question
- Use the MOST RELEVANT MODULES section to guide your answer when available
- Give brief topic overviews, then point to specific modules with links
- If a question spans multiple modules, list all relevant ones`
  } catch (error) {
    console.error("Failed to load curriculum index:", error)
    // Fallback if curriculum index fails
    return `${base}

CURRENT CONTEXT: Course Level
You are helping the learner navigate the curriculum.

BEHAVIOR:
- Help learners find the right module for their question
- Give brief topic overviews, then point to modules
- Format responses as: "This is covered in Module X.X: Title"
- If unsure which module, suggest the most likely competency`
  }
}

// -----------------------------------------------------------------------------
// Rate Limiting
// -----------------------------------------------------------------------------

async function checkRateLimit(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc("check_coach_rate_limit", {
    p_user_id: userId,
  })
  if (error) {
    console.error("Rate limit check failed:", error)
    return true // Allow on error, log for monitoring
  }
  return data as boolean
}

async function logUsage(
  userId: string,
  context: ChatRequest["context"]
): Promise<void> {
  const supabase = await createClient()
  await supabase.from("coach_usage").insert({
    user_id: userId,
    context_level: context.level,
    competency_slug: context.competencySlug,
    module_slug: context.moduleSlug,
  })
}

/**
 * Format essentials data into a structured prompt section.
 */
function formatEssentialsForPrompt(essentials: Record<string, unknown>): string {
  const lines: string[] = ["--- MODULE ESSENTIALS (KEY FACTS) ---", ""]

  // Key facts
  if (Array.isArray(essentials.keyFacts)) {
    lines.push("KEY FACTS:")
    for (const fact of essentials.keyFacts) {
      if (fact && typeof fact === "object") {
        const f = fact as { title?: string; content?: string }
        lines.push(`• ${f.title || "Fact"}: ${f.content || ""}`)
      }
    }
    lines.push("")
  }

  // Scripts (verbal responses)
  if (Array.isArray(essentials.scripts)) {
    lines.push("SCRIPTS (What to say):")
    for (const script of essentials.scripts) {
      if (script && typeof script === "object") {
        const s = script as { title?: string; script?: string; context?: string }
        lines.push(`• ${s.title || "Script"}:`)
        if (s.context) lines.push(`  Context: ${s.context}`)
        if (s.script) lines.push(`  Say: "${s.script}"`)
      }
    }
    lines.push("")
  }

  // Practice scenarios
  if (Array.isArray(essentials.practiceScenarios)) {
    lines.push("PRACTICE SCENARIOS:")
    for (const scenario of essentials.practiceScenarios) {
      if (scenario && typeof scenario === "object") {
        const s = scenario as { title?: string; situation?: string }
        lines.push(`• ${s.title || "Scenario"}: ${s.situation || ""}`)
      }
    }
    lines.push("")
  }

  return lines.join("\n")
}

// -----------------------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit check
    const withinLimit = await checkRateLimit(user.id)
    if (!withinLimit) {
      return Response.json(
        { error: "Rate limit exceeded. Try again in an hour." },
        { status: 429 }
      )
    }

    // Parse request
    const body: ChatRequest = await request.json()
    const { messages, context } = body

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 })
    }

    // Build context
    let moduleContent: string | undefined
    let competencyInfo: CompetencyInfo | undefined

    if (
      context.level === "module" &&
      context.competencySlug &&
      context.moduleSlug
    ) {
      const currentModule = await getModule(context.competencySlug, context.moduleSlug)
      if (currentModule) {
        // Prefer essentials summary if available, fall back to raw content
        if (currentModule.essentials) {
          const essentials = currentModule.essentials as Record<string, unknown>
          const essentialsSummary = formatEssentialsForPrompt(essentials)
          moduleContent = essentialsSummary + "\n\n--- FULL MODULE CONTENT ---\n\n" + (currentModule.content || "")
        } else {
          moduleContent = currentModule.content
        }
      }
    }

    if (context.level === "competency" && context.competencySlug) {
      const compWithModules = await getCompetencyWithModules(context.competencySlug)
      if (compWithModules) {
        competencyInfo = {
          name: compWithModules.name,
          slug: compWithModules.slug,
          description: compWithModules.description || "",
          moduleCount: compWithModules.moduleCount,
          modules: compWithModules.modules.map((m) => ({
            order: m.moduleNumber || m.displayOrder.toString(),
            name: m.title,
            slug: m.slug,
            description: m.description || "",
          })),
        }
      }
    }

    // Log usage
    await logUsage(user.id, context)

    // Get the user's latest question for relevance search
    const lastUserMessage = messages.filter(m => m.role === "user").pop()
    const userQuestion = lastUserMessage?.content

    // Build system prompt (async for curriculum index loading)
    const systemPrompt = await buildSystemPrompt(context, moduleContent, competencyInfo, userQuestion)

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 512, // Keep responses concise
      temperature: 0.7,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    // Return streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Coach chat error:", error)
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
