/**
 * CATALYST - AI Coach Chat API
 *
 * Handles chat requests with context-aware responses.
 * Uses Claude API with streaming for fast responses.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { getCompetencyWithModules, getModule } from "@/lib/learning"

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

function buildSystemPrompt(
  context: ChatRequest["context"],
  moduleContent?: string,
  competencyInfo?: CompetencyInfo
): string {
  const base = `You are the AI Coach for Prime Capital Dubai's real estate training program.

CRITICAL RULES:
- Give CONCISE answers (30-50 words unless asked for more)
- Focus ONLY on Dubai real estate and this training curriculum
- Always cite which module covers a topic: "See Module X.X: Title"
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

  if (context.level === "module" && moduleContent) {
    return `${base}

CURRENT CONTEXT: Module Level
You are an expert on this specific module. Answer questions using the content below.

MODULE CONTENT:
${moduleContent.slice(0, 12000)}

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- If asked about other topics, briefly answer and suggest the relevant module`
  }

  if (context.level === "competency" && competencyInfo) {
    const moduleList = competencyInfo.modules
      ? competencyInfo.modules
          .map((m) => `  - [Module ${m.order}: ${m.name}](/learn/${competencyInfo.slug}/${m.slug})${m.description ? ` - ${m.description}` : ''}`)
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

  // Course level
  return `${base}

CURRENT CONTEXT: Course Level
You are helping the learner navigate the entire curriculum.

BEHAVIOR:
- Help learners find the right module for their question
- Give brief topic overviews, then point to modules
- Format responses as: "This is covered in Module X.X: Title"
- If unsure which module, suggest the most likely competency`
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
      const module = await getModule(context.competencySlug, context.moduleSlug)
      if (module) {
        moduleContent = module.content
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

    // Stream response from Claude
    const stream = await anthropic.messages.stream({
      model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 512, // Keep responses concise
      temperature: 0.7,
      system: buildSystemPrompt(context, moduleContent, competencyInfo),
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
