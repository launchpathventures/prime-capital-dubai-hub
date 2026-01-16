/**
 * CATALYST - Scenario Roleplay API
 *
 * Handles roleplay practice and evaluation for scenarios.
 * Uses Claude API with streaming for natural conversation flow.
 *
 * IMPORTANT: Claude requires:
 * 1. First message must be from "user" role
 * 2. Messages must alternate between user and assistant
 *
 * Since the AI opens the conversation (as the client persona), we use a
 * synthetic "begin roleplay" user message that's invisible to the UI.
 * For follow-ups, we prepend this same synthetic message to maintain
 * proper alternation.
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
  aiPrompt?: string  // The detailed AI simulation prompt from the scenario
}

interface RoleplayRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  scenario: ScenarioContext
  mode: "roleplay" | "evaluate"
}

type ClaudeMessage = { role: "user" | "assistant"; content: string }

// Synthetic message to start the roleplay (invisible to UI)
const ROLEPLAY_START_MESSAGE: ClaudeMessage = {
  role: "user",
  content: "Begin the roleplay. Start as the client based on the scenario.",
}

// -----------------------------------------------------------------------------
// Claude Client
// -----------------------------------------------------------------------------

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
// Message Formatting
// -----------------------------------------------------------------------------

/**
 * Prepares messages for Claude API, ensuring proper alternation.
 *
 * Claude requires:
 * - First message must be "user"
 * - Messages must alternate user/assistant
 *
 * The client sends the visible conversation (starting with assistant's opening).
 * We prepend a synthetic user message to satisfy Claude's requirements.
 */
function prepareMessagesForClaude(messages: ClaudeMessage[]): ClaudeMessage[] {
  // Empty messages = start of conversation
  if (messages.length === 0) {
    return [ROLEPLAY_START_MESSAGE]
  }

  // If first message is from assistant (AI's opening), prepend synthetic start
  if (messages[0].role === "assistant") {
    return [ROLEPLAY_START_MESSAGE, ...messages]
  }

  // Messages already start with user (shouldn't happen, but handle gracefully)
  return messages
}

/**
 * Validates message alternation for debugging
 */
function validateMessageAlternation(messages: ClaudeMessage[]): boolean {
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === messages[i - 1].role) {
      console.error(`Message alternation error at index ${i}:`, {
        prev: messages[i - 1].role,
        curr: messages[i].role,
      })
      return false
    }
  }
  return true
}

// -----------------------------------------------------------------------------
// System Prompts
// -----------------------------------------------------------------------------

function buildRoleplayPrompt(scenario: ScenarioContext, characterPrompt: string): string {
  // Use the detailed AI prompt from the scenario if available, otherwise fall back to persona
  const characterContext = scenario.aiPrompt || scenario.persona
  
  return `${characterPrompt}

---

${characterContext}

---

Remember: Stay in character. Respond naturally as this client would.`
}

function buildEvaluationPrompt(
  scenario: ScenarioContext,
  messages: Array<{ role: string; content: string }>
): string {
  // Filter out the synthetic start message for evaluation
  const visibleMessages = messages.filter(
    (m) => m.content !== ROLEPLAY_START_MESSAGE.content
  )

  const conversationText = visibleMessages
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

    // Validate scenario
    if (!validateScenario(scenario)) {
      console.error("Invalid scenario data:", JSON.stringify(scenario, null, 2))
      return new Response(
        "Invalid or incomplete scenario data. Required: id, category, title, situation, persona, objective, challenges, approach",
        { status: 400 }
      )
    }

    // Load prompts from database
    const prompts = await getPrompts(["roleplay_character", "roleplay_evaluation"])

    // -------------------------------------------------------------------------
    // Evaluation Mode: Non-streaming JSON response
    // -------------------------------------------------------------------------
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

        return Response.json({
          passed: false,
          objectivesMet: [],
          objectivesMissed: ["No evaluation content"],
          overallFeedback: "We couldn't generate an evaluation. Please try again.",
          strengths: [],
          improvements: [],
        })
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

    // -------------------------------------------------------------------------
    // Roleplay Mode: Streaming response for natural conversation
    // -------------------------------------------------------------------------
    try {
      // Prepare messages with proper alternation
      const apiMessages = prepareMessagesForClaude(
        messages.map((m) => ({ role: m.role, content: m.content }))
      )

      // Debug logging
      console.log("Roleplay request:", {
        scenario: scenario.title,
        inputMessageCount: messages.length,
        apiMessageCount: apiMessages.length,
        firstRole: apiMessages[0]?.role,
        lastRole: apiMessages[apiMessages.length - 1]?.role,
      })

      // Validate alternation
      if (!validateMessageAlternation(apiMessages)) {
        console.error("Message validation failed:", apiMessages)
        return new Response("Invalid message sequence", { status: 400 })
      }

      // Build system prompt
      const roleplaySystemPrompt = buildRoleplayPrompt(scenario, prompts.roleplay_character)

      // Stream response for natural feel
      const stream = await anthropic.messages.stream({
        model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 256,
        temperature: 0.7,
        system: roleplaySystemPrompt,
        messages: apiMessages,
      })

      // Convert to streaming response with logging
      const encoder = new TextEncoder()
      let fullResponse = "" // Accumulate for logging
      
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                const text = event.delta.text
                fullResponse += text
                controller.enqueue(encoder.encode(text))
              }
            }
            // Log the complete response from Claude
            console.log("[Roleplay API] Complete AI response:", fullResponse)
            controller.close()
          } catch (streamError) {
            console.error("Stream error:", streamError)
            console.log("[Roleplay API] Partial response before error:", fullResponse)
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

      // Detailed error handling
      if (error instanceof Anthropic.APIError) {
        console.error("Anthropic API Error:", {
          status: error.status,
          message: error.message,
        })

        if (error.status === 429) {
          return new Response("Rate limit exceeded. Please try again later.", {
            status: 429,
          })
        }
        if (error.status === 401) {
          return new Response("AI service authentication failed", { status: 503 })
        }
        if (error.status === 400) {
          return new Response(`AI request error: ${error.message}`, { status: 400 })
        }
      }

      return new Response("Failed to get AI response", { status: 500 })
    }
  } catch (error) {
    console.error("Roleplay API error:", error)
    return new Response("Internal error", { status: 500 })
  }
}
