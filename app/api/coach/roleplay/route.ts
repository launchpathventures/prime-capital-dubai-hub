/**
 * CATALYST - Scenario Roleplay API
 *
 * Handles roleplay practice and evaluation for scenarios.
 * Uses Claude API with streaming for roleplay, non-streaming for evaluation.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { getPrompts } from "@/lib/lms/ai-prompts"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

interface ScenarioContext {
  id: string
  category: string
  title: string
  situation: string
  persona: string
  objective: string
  challenges: string
  approach: string
}

interface RoleplayRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  scenario: ScenarioContext
  mode: "roleplay" | "evaluate"
}

// -----------------------------------------------------------------------------
// Claude Client
// -----------------------------------------------------------------------------

// Check API key at module load
if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("⚠️ ANTHROPIC_API_KEY is not configured - roleplay will not work")
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
})

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validateScenario(scenario: unknown): scenario is ScenarioContext {
  if (!scenario || typeof scenario !== "object") return false

  const s = scenario as Record<string, unknown>

  return (
    typeof s.id === "string" &&
    typeof s.category === "string" &&
    typeof s.title === "string" &&
    typeof s.situation === "string" && s.situation.length > 0 &&
    typeof s.persona === "string" && s.persona.length > 0 &&
    typeof s.objective === "string" &&
    typeof s.challenges === "string" &&
    typeof s.approach === "string"
  )
}

// -----------------------------------------------------------------------------
// System Prompts
// -----------------------------------------------------------------------------

async function buildRoleplayPrompt(scenario: ScenarioContext, characterPrompt: string): Promise<string> {
  return `${characterPrompt}

SCENARIO: ${scenario.title}

SITUATION:
${scenario.situation}

YOUR CHARACTER (the client):
${scenario.persona}

Start the conversation as the client, based on the scenario situation. The consultant (user) has just engaged with you.`
}

function buildEvaluationPrompt(
  scenario: ScenarioContext,
  messages: Array<{ role: string; content: string }>
): string {
  const conversationText = messages
    .map((m) => `${m.role === "user" ? "CONSULTANT" : "CLIENT"}: ${m.content}`)
    .join("\n\n")

  return `You are evaluating a roleplay practice session for a real estate consultant trainee.

SCENARIO: ${scenario.title}

CONSULTANT'S OBJECTIVE:
${scenario.objective}

KEY CHALLENGES THEY NEEDED TO ADDRESS:
${scenario.challenges}

MODEL APPROACH (what good looks like):
${scenario.approach}

---

CONVERSATION:
${conversationText}

---

Evaluate this practice session and respond with ONLY valid JSON in this exact format:
{
  "passed": true/false,
  "objectivesMet": ["objective 1 they achieved", "objective 2"],
  "objectivesMissed": ["objective they missed"],
  "overallFeedback": "2-3 sentences on overall performance",
  "strengths": ["specific thing they did well", "another strength"],
  "improvements": ["specific suggestion", "another suggestion"]
}

EVALUATION CRITERIA:
- passed = true if they addressed the core client concern effectively
- Consider: Did they acknowledge the concern? Provide substance? Maintain trust?
- Be encouraging but honest — this is for learning`
}

// -----------------------------------------------------------------------------
// Route Handler
// -----------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    // Check API key first
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error("ANTHROPIC_API_KEY is not configured")
      return new Response("AI service not configured", { status: 503 })
    }

    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // Parse request body
    let body: RoleplayRequest
    try {
      body = await request.json()
    } catch {
      return new Response("Invalid JSON body", { status: 400 })
    }

    const { messages, scenario, mode } = body

    // Validate scenario with detailed error
    if (!validateScenario(scenario)) {
      console.error("Invalid scenario data:", JSON.stringify(scenario, null, 2))
      return new Response("Invalid or incomplete scenario data. Required: id, category, title, situation, persona, objective, challenges, approach", { status: 400 })
    }

    // Load prompts from database
    const prompts = await getPrompts(["roleplay_character", "roleplay_evaluation"])

    // Evaluation mode: non-streaming, returns JSON
    if (mode === "evaluate") {
      if (messages.length < 2) {
        return Response.json({
          passed: false,
          objectivesMet: [],
          objectivesMissed: ["Conversation too short to evaluate"],
          overallFeedback:
            "Please have a longer conversation (at least 2-3 exchanges) before ending the practice session.",
          strengths: [],
          improvements: ["Continue the conversation to demonstrate your approach"],
        })
      }

      try {
        const response = await anthropic.messages.create({
          model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
          max_tokens: 1024,
          temperature: 0.3,
          system: prompts.roleplay_evaluation,
          messages: [
            {
              role: "user",
              content: buildEvaluationPrompt(scenario, messages),
            },
          ],
        })

        const content = response.content[0]
        if (content.type === "text") {
          try {
            const evaluation = JSON.parse(content.text)
            return Response.json(evaluation)
          } catch {
            console.error("Failed to parse evaluation JSON:", content.text)
            return Response.json({
              passed: false,
              objectivesMet: [],
              objectivesMissed: ["Evaluation parsing failed"],
              overallFeedback:
                "We encountered an issue evaluating your session. Please try again.",
              strengths: [],
              improvements: [],
            })
          }
        }
      } catch (error) {
        console.error("Evaluation API error:", error)
        return Response.json({
          passed: false,
          objectivesMet: [],
          objectivesMissed: ["Evaluation failed"],
          overallFeedback:
            "We couldn't evaluate your session due to a technical issue. Please try again.",
          strengths: [],
          improvements: [],
        })
      }
    }

    // Roleplay mode: streaming response
    try {
      // For initial conversation start (no messages), we need to prompt Claude to begin
      const apiMessages = messages.length > 0
        ? messages.map((m) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          }))
        : [{ role: "user" as const, content: "Begin the roleplay. Start as the client and open the conversation based on the scenario." }]

      // Build the roleplay prompt with character from database
      const roleplaySystemPrompt = await buildRoleplayPrompt(scenario, prompts.roleplay_character)

      const stream = await anthropic.messages.stream({
        model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 384,
        temperature: 0.8,
        system: roleplaySystemPrompt,
        messages: apiMessages,
      })

      // Return streaming response
      const encoder = new TextEncoder()
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                controller.enqueue(encoder.encode(event.delta.text))
              }
            }
            controller.close()
          } catch (streamError) {
            console.error("Stream error:", streamError)
            controller.error(streamError)
          }
        },
      })

      return new Response(readable, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      })
    } catch (error) {
      console.error("Claude API error:", error)

      // Check for specific error types
      if (error instanceof Anthropic.APIError) {
        if (error.status === 429) {
          return new Response("Rate limit exceeded. Please try again later.", { status: 429 })
        }
        if (error.status === 401) {
          return new Response("AI service authentication failed", { status: 503 })
        }
      }

      return new Response("Failed to start roleplay", { status: 500 })
    }
  } catch (error) {
    console.error("Roleplay API error:", error)
    return new Response("Internal error", { status: 500 })
  }
}
