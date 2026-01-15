# LMS-030: Scenario Roleplay Fix

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2-3 hours  
**Dependencies:** LMS-021 (Scenario Roleplay)  
**Agent-Safe:** ✅ Yes — debugging and fixes

---

## Objective

Diagnose and fix errors in the Scenario AI Roleplay feature. Users report errors when initiating roleplay practice within scenarios.

---

## Background

### Current State

- Scenario roleplay was implemented in LMS-021
- API endpoint exists at `POST /api/coach/roleplay`
- Component exists at `app/learn/scenarios/[category]/_components/scenario-practice.tsx`
- Uses Claude API for roleplay and evaluation

### Reported Issues

1. **Error on roleplay initiation:** User gets error when clicking "Practice with AI"
2. **Unknown specific error:** Need to investigate logs and test locally

---

## Diagnostic Steps

### Step 1: Check Environment Variables

Verify `ANTHROPIC_API_KEY` is configured:

```bash
# Check if key is set (don't print the actual key)
echo $ANTHROPIC_API_KEY | head -c 10
```

### Step 2: Test API Endpoint Locally

Create a test script or use curl:

```bash
# Start dev server
pnpm dev

# In another terminal, test the endpoint (requires auth cookie)
curl -X POST http://localhost:3000/api/coach/roleplay \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [],
    "scenario": {
      "id": "test-1",
      "category": "objections",
      "title": "Test Scenario",
      "situation": "A client is concerned about market timing.",
      "persona": "Sarah, a cautious first-time investor from the UK.",
      "objective": "Address timing concerns with market data.",
      "challenges": "Client has read negative press about Dubai property.",
      "approach": "Acknowledge concerns, provide context, share data."
    },
    "mode": "roleplay"
  }'
```

### Step 3: Check Server Logs

Look for errors in the terminal running `pnpm dev`:
- API errors from Claude
- Missing scenario fields
- Authentication issues

---

## Potential Issues & Fixes

### Issue 1: Missing or Invalid Scenario Fields

**Problem:** The `ParsedScenario` type may not match what the API expects.

**Check:** Compare types in:
- `app/learn/scenarios/[category]/page.tsx` (ParsedScenario)
- `app/api/coach/roleplay/route.ts` (ScenarioContext)

**Current ParsedScenario:**
```typescript
interface ParsedScenario {
  id: string
  title: string
  difficulty: number
  situation: string
  persona: string
  objective: string
  challenges: string
  mistakes: string
  approach: string
  aiPrompt: string
}
```

**Current ScenarioContext:**
```typescript
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
```

**Fix:** Ensure `scenario-practice.tsx` passes all required fields:

```typescript
// In buildScenarioContext()
const buildScenarioContext = useCallback(() => {
  return {
    id: scenario.id,
    category,
    title: scenario.title,
    situation: scenario.situation,
    persona: scenario.persona,
    objective: scenario.objective,
    challenges: scenario.challenges,
    approach: scenario.approach,
  }
}, [scenario, category])
```

### Issue 2: Empty Scenario Fields

**Problem:** If any scenario field is empty/null, the AI prompt may fail.

**Fix:** Add validation in the API route:

```typescript
// In route.ts, after parsing body
if (!scenario.situation || !scenario.persona || !scenario.objective) {
  return new Response("Incomplete scenario data", { status: 400 })
}
```

### Issue 3: API Key Not Configured

**Problem:** `ANTHROPIC_API_KEY` may not be set or is invalid.

**Fix:** Add better error handling:

```typescript
// At the top of route.ts
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not configured")
  return new Response("AI service not configured", { status: 503 })
}
```

### Issue 4: Claude API Errors

**Problem:** Claude API may be returning errors (rate limit, invalid model, etc.)

**Fix:** Add try-catch with detailed error logging:

```typescript
try {
  const stream = await anthropic.messages.stream({
    // ...
  })
  // ...
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
```

### Issue 5: Streaming Response Not Handled

**Problem:** Client may not handle streaming correctly if response format changes.

**Fix:** Verify the streaming response handling in `scenario-practice.tsx`:

```typescript
// Ensure proper error handling for non-ok responses
if (!response.ok) {
  const errorText = await response.text()
  console.error("Roleplay error:", response.status, errorText)
  throw new Error(errorText || "Failed to start")
}

// Ensure body exists before reading
if (!response.body) {
  throw new Error("No response body")
}
```

---

## Implementation

### File: `app/api/coach/roleplay/route.ts`

Update the route handler with improved error handling:

```typescript
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
    // Check API key
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

    // Parse request
    let body: RoleplayRequest
    try {
      body = await request.json()
    } catch {
      return new Response("Invalid JSON body", { status: 400 })
    }

    const { messages, scenario, mode } = body

    // Validate scenario
    if (!validateScenario(scenario)) {
      console.error("Invalid scenario data:", scenario)
      return new Response("Invalid or incomplete scenario data", { status: 400 })
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

      try {
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
      const stream = await anthropic.messages.stream({
        model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 384,
        temperature: 0.8,
        system: buildRoleplayPrompt(scenario),
        messages: messages.length > 0 
          ? messages.map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            }))
          : [], // Empty array for initial message
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
```

### File: `app/learn/scenarios/[category]/_components/scenario-practice.tsx`

Update error handling in the component:

```typescript
// In startConversation useEffect
try {
  const response = await fetch("/api/coach/roleplay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [],
      scenario: buildScenarioContext(),
      mode: "roleplay",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Roleplay start failed:", response.status, errorText)
    throw new Error(errorText || `Failed to start (${response.status})`)
  }

  if (!response.body) {
    throw new Error("No response body received")
  }

  const reader = response.body.getReader()
  // ... rest of streaming logic
} catch (error) {
  console.error("Failed to start practice:", error)
  setMessages([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content: error instanceof Error 
        ? `Unable to start practice: ${error.message}. Please try again.`
        : "I had trouble starting the practice session. Please try again.",
    },
  ])
}
```

---

## Testing Checklist

- [ ] Verify `ANTHROPIC_API_KEY` is set in `.env.local`
- [ ] Test roleplay initiation on a scenario page
- [ ] Test sending messages during roleplay
- [ ] Test "How am I doing?" coaching mode
- [ ] Test ending practice and getting evaluation
- [ ] Test restart functionality
- [ ] Check browser console for errors
- [ ] Check server logs for API errors

---

## Success Criteria

1. ✅ Roleplay starts without errors
2. ✅ Streaming responses display correctly
3. ✅ Coaching mode works when requested
4. ✅ Evaluation returns structured feedback
5. ✅ Clear error messages when something fails
6. ✅ No console errors during normal operation
