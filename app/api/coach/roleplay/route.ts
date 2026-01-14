/**
 * CATALYST - Scenario Roleplay API
 *
 * Handles roleplay practice and evaluation for scenarios.
 * Uses Claude API with streaming for roleplay, non-streaming for evaluation.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// -----------------------------------------------------------------------------
// System Prompts
// -----------------------------------------------------------------------------

function buildRoleplayPrompt(scenario: ScenarioContext): string {
  return `You are roleplaying as a client in a real estate consultation scenario.

SCENARIO: ${scenario.title}

SITUATION:
${scenario.situation}

YOUR CHARACTER (the client):
${scenario.persona}

BEHAVIOR RULES:
- Stay 100% in character as this client
- Express concerns naturally based on your persona
- React realistically to the consultant's responses
- If they address your concerns well, show gradual openness
- If they dismiss, deflect, or use pushy tactics, show skepticism or resistance
- Keep responses conversational (2-4 sentences typical)
- Never break character unless user explicitly asks for coaching help

COACHING MODE (only if user asks "How am I doing?", "Can I get feedback?", or similar):
- Briefly step out of character: "Stepping out of character for a moment..."
- Provide constructive feedback on their approach so far
- Reference what the scenario is testing
- Then return: "Back in character as the client..."

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
    // Auth check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body: RoleplayRequest = await request.json()
    const { messages, scenario, mode } = body

    if (!scenario) {
      return new Response("Scenario context required", { status: 400 })
    }

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

      const response = await anthropic.messages.create({
        model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1024,
        temperature: 0.3,
        system:
          "You are an expert evaluator for real estate sales training. Respond only with valid JSON.",
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
          // If JSON parsing fails, return a default response
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
    }

    // Roleplay mode: streaming response
    const stream = await anthropic.messages.stream({
      model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 384,
      temperature: 0.8,
      system: buildRoleplayPrompt(scenario),
      messages: messages.map((m) => ({
        role: m.role as "user" | "assistant",
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
    console.error("Roleplay API error:", error)
    return new Response("Internal error", { status: 500 })
  }
}
