# LMS-021: Scenario AI Roleplay Practice

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 6-8 hours  
**Dependencies:** LMS-020 (Scenario Progress), LMS-013 (AI Coach Infrastructure)  

---

## Objective

Enable in-app AI roleplay practice directly within scenarios. Instead of copying prompts to external AI tools, users initiate practice inline. The AI adopts the client persona, maintains character throughout, and evaluates performance against scenario objectives at session end.

---

## Background

### Current State

- **Scenarios have AI prompts:** Each scenario includes a detailed prompt for external AI practice
- **Copy-paste workflow:** Users copy prompt → external AI → practice → return to submit reflection
- **AI Coach exists:** Infrastructure for Claude chat already built (provider, panel, API)
- **Reflection completion:** LMS-020 implemented reflection-based scenario completion

### The Problem

External practice creates friction:
- Context switching breaks flow
- No tracking of whether practice happened
- Prompt copying is manual and error-prone
- Disconnected from the learning platform

### The Solution

Inline roleplay that:
- Starts with one click from within the scenario
- Uses existing AI infrastructure
- Evaluates against scenario objectives
- Auto-completes scenario on successful practice

---

## Scope

### In Scope
- Inline practice UI within scenario accordion
- Roleplay API endpoint with persona prompting
- Hybrid mode (roleplay + coaching on request)
- End-session evaluation against objectives
- Auto-completion on passing evaluation
- Restart capability

### Out of Scope
- Conversation persistence/history
- Voice/audio roleplay
- Manager review of practice sessions
- Mobile-first optimizations (desktop primary)

---

## Technical Design

### API Endpoint

New endpoint: `POST /api/coach/roleplay`

```typescript
interface RoleplayRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>
  scenario: {
    id: string              // e.g., "OB-01"
    category: string        // e.g., "objections"
    title: string
    situation: string
    persona: string         // Full persona block
    objective: string       // Consultant's objective
    challenges: string      // Key challenges
    approach: string        // Model approach hints
  }
  mode: "roleplay" | "evaluate"
}

interface RoleplayResponse {
  // Streaming text for roleplay mode
  // Structured evaluation for evaluate mode
}

interface EvaluationResult {
  passed: boolean
  objectivesMet: string[]
  objectivesMissed: string[]
  feedback: string
  suggestedImprovements: string[]
}
```

### System Prompts

**Roleplay Mode:**
```
You are roleplaying as {persona.name}, a {persona.background}.

SCENARIO CONTEXT:
{situation}

YOUR CHARACTER:
- Background: {persona.background}
- Motivation: {persona.motivation}
- Communication style: {persona.communicationStyle}
- Concerns: {persona.concerns}

BEHAVIOR RULES:
- Stay 100% in character as the client
- Express your concerns naturally based on your persona
- React realistically to the consultant's responses
- If they address your concerns well, show openness
- If they dismiss or deflect, show skepticism
- Never break character unless user explicitly asks for coaching

COACHING MODE (only if user asks "How am I doing?" or similar):
- Briefly step out of character
- Provide constructive feedback on their approach
- Reference the scenario objectives
- Then return to character

Keep responses natural and conversational (2-4 sentences typical).
```

**Evaluation Mode:**
```
You are evaluating a roleplay practice session for a real estate consultant.

SCENARIO OBJECTIVES:
{objective}

KEY CHALLENGES TO ADDRESS:
{challenges}

MODEL APPROACH (what good looks like):
{approach}

CONVERSATION TO EVALUATE:
{messages}

Evaluate whether the consultant:
1. Addressed the client's core concerns
2. Used appropriate techniques from the model approach
3. Maintained professional tone
4. Would likely achieve a positive outcome

Provide structured feedback with:
- Overall pass/fail (did they meet the main objective?)
- What they did well
- What they could improve
- Specific suggestions for next time
```

### UI Components

#### 1. Practice Trigger Button

Replace the "Copy Prompt" button with "Start Practice":

```tsx
// In scenario accordion, after AI prompt section
<div className="scenario-practice">
  {!isPracticing ? (
    <Button onClick={startPractice}>
      <SparklesIcon /> Start AI Practice
    </Button>
  ) : (
    <ScenarioPracticeChat 
      scenario={scenario}
      onEnd={handleEndPractice}
    />
  )}
</div>
```

#### 2. Practice Chat Component

Inline chat within the scenario:

```tsx
interface ScenarioPracticeChatProps {
  scenario: ParsedScenario
  category: string
  onComplete: (passed: boolean) => void
  onCancel: () => void
}
```

Features:
- Message list with persona-styled bubbles
- Input field at bottom
- "End Practice" button
- "Get Coaching" button (breaks character for tips)
- Loading states during AI response

#### 3. Evaluation Modal

When user ends practice:

```tsx
interface EvaluationModalProps {
  evaluation: EvaluationResult
  onRetry: () => void
  onComplete: () => void  // Only shown if passed
}
```

Shows:
- Pass/fail status with icon
- Objectives met (checkmarks)
- Objectives missed (warnings)
- Detailed feedback
- "Try Again" or "Complete Scenario" buttons

---

## User Flow

```
1. User opens scenario accordion
2. Reviews scenario content (situation, persona, objectives)
3. Clicks "Start AI Practice"
4. Chat interface expands inline
5. AI (as client persona) starts conversation
6. User practices consultant responses
7. Can click "Get Coaching" for tips mid-practice
8. When ready, clicks "End Practice"
9. AI evaluates conversation against objectives
10. If passed → scenario marked complete, reflection auto-filled
11. If not passed → feedback shown, can retry or exit
```

---

## Deliverables

### 1. API Route

**File:** `app/api/coach/roleplay/route.ts`

```typescript
/**
 * CATALYST - Scenario Roleplay API
 * 
 * Handles roleplay practice and evaluation for scenarios.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

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
- Then return: "Back in character as [name]..."

Start the conversation as the client, based on the scenario situation. The consultant (user) has just engaged with you.`
}

function buildEvaluationPrompt(scenario: ScenarioContext, messages: Array<{ role: string; content: string }>): string {
  const conversationText = messages
    .map(m => `${m.role === "user" ? "CONSULTANT" : "CLIENT"}: ${m.content}`)
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
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body: RoleplayRequest = await request.json()
    const { messages, scenario, mode } = body

    if (mode === "evaluate") {
      // Non-streaming evaluation
      const response = await anthropic.messages.create({
        model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1024,
        temperature: 0.3, // Lower temp for consistent evaluation
        system: "You are an expert evaluator for real estate sales training. Respond only with valid JSON.",
        messages: [{
          role: "user",
          content: buildEvaluationPrompt(scenario, messages),
        }],
      })

      const content = response.content[0]
      if (content.type === "text") {
        try {
          const evaluation = JSON.parse(content.text)
          return Response.json(evaluation)
        } catch {
          // If JSON parsing fails, return a default failure
          return Response.json({
            passed: false,
            objectivesMet: [],
            objectivesMissed: ["Unable to evaluate session"],
            overallFeedback: "The evaluation could not be completed. Please try the practice session again.",
            strengths: [],
            improvements: ["Complete a longer practice conversation for better evaluation"],
          })
        }
      }
    }

    // Streaming roleplay response
    const stream = await anthropic.messages.stream({
      model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 384, // Shorter for natural dialogue
      temperature: 0.8, // Higher for more natural variation
      system: buildRoleplayPrompt(scenario),
      messages: messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    })

    // Return streaming response
    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
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
```

### 2. Practice Chat Component

**File:** `app/learn/scenarios/[category]/_components/scenario-practice.tsx`

```tsx
"use client"

/**
 * CATALYST - Scenario Practice Chat
 * 
 * Inline roleplay practice within scenario accordion.
 */

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { 
  SparklesIcon, 
  SendIcon, 
  XIcon,
  Loader2Icon,
  HelpCircleIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react"
import type { ParsedScenario } from "./scenario-accordion"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface EvaluationResult {
  passed: boolean
  objectivesMet: string[]
  objectivesMissed: string[]
  overallFeedback: string
  strengths: string[]
  improvements: string[]
}

interface ScenarioPracticeProps {
  scenario: ParsedScenario
  category: string
  onComplete: (passed: boolean) => void
  onCancel: () => void
}

export function ScenarioPractice({ 
  scenario, 
  category,
  onComplete, 
  onCancel 
}: ScenarioPracticeProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [isStarting, setIsStarting] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when ready
  useEffect(() => {
    if (!isLoading && !isStarting && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isLoading, isStarting])

  // Start conversation with AI opening
  useEffect(() => {
    const startConversation = async () => {
      setIsLoading(true)
      
      try {
        const response = await fetch("/api/coach/roleplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [],
            scenario: {
              id: scenario.id,
              category,
              title: scenario.title,
              situation: scenario.situation,
              persona: scenario.persona,
              objective: scenario.objective,
              challenges: scenario.challenges,
              approach: scenario.approach,
            },
            mode: "roleplay",
          }),
        })

        if (!response.ok) throw new Error("Failed to start")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
        }
        setMessages([assistantMessage])

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value)
            setMessages(prev => {
              const updated = [...prev]
              updated[0] = { ...updated[0], content: updated[0].content + chunk }
              return updated
            })
          }
        }
      } catch (error) {
        console.error("Failed to start practice:", error)
      } finally {
        setIsLoading(false)
        setIsStarting(false)
      }
    }

    startConversation()
  }, [scenario, category])

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch("/api/coach/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          scenario: {
            id: scenario.id,
            category,
            title: scenario.title,
            situation: scenario.situation,
            persona: scenario.persona,
            objective: scenario.objective,
            challenges: scenario.challenges,
            approach: scenario.approach,
          },
          mode: "roleplay",
        }),
      })

      if (!response.ok) throw new Error("Failed to send")

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      }
      setMessages(prev => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          setMessages(prev => {
            const updated = [...prev]
            const lastIdx = updated.length - 1
            updated[lastIdx] = { ...updated[lastIdx], content: updated[lastIdx].content + chunk }
            return updated
          })
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages(prev => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, scenario, category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const message = input.trim()
    setInput("")
    sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const requestCoaching = () => {
    sendMessage("How am I doing? Can I get some feedback on my approach so far?")
  }

  const endPractice = async () => {
    if (messages.length < 4) {
      // Not enough conversation to evaluate
      setEvaluation({
        passed: false,
        objectivesMet: [],
        objectivesMissed: ["Conversation too short to evaluate"],
        overallFeedback: "Please have a longer conversation (at least 2-3 exchanges) before ending the practice session.",
        strengths: [],
        improvements: ["Continue the conversation to demonstrate your approach"],
      })
      return
    }

    setIsEvaluating(true)

    try {
      const response = await fetch("/api/coach/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          scenario: {
            id: scenario.id,
            category,
            title: scenario.title,
            situation: scenario.situation,
            persona: scenario.persona,
            objective: scenario.objective,
            challenges: scenario.challenges,
            approach: scenario.approach,
          },
          mode: "evaluate",
        }),
      })

      if (!response.ok) throw new Error("Evaluation failed")

      const result: EvaluationResult = await response.json()
      setEvaluation(result)
    } catch (error) {
      console.error("Evaluation error:", error)
      setEvaluation({
        passed: false,
        objectivesMet: [],
        objectivesMissed: ["Evaluation failed"],
        overallFeedback: "We couldn't evaluate your session. Please try again.",
        strengths: [],
        improvements: [],
      })
    } finally {
      setIsEvaluating(false)
    }
  }

  const restart = () => {
    setMessages([])
    setEvaluation(null)
    setIsStarting(true)
    // The useEffect will restart the conversation
  }

  // Show evaluation results
  if (evaluation) {
    return (
      <div className="scenario-practice__evaluation">
        <div className={`scenario-practice__evaluation-header ${evaluation.passed ? "scenario-practice__evaluation-header--passed" : "scenario-practice__evaluation-header--failed"}`}>
          {evaluation.passed ? (
            <>
              <CheckCircle2Icon className="h-8 w-8" />
              <h3>Great Work!</h3>
            </>
          ) : (
            <>
              <AlertCircleIcon className="h-8 w-8" />
              <h3>Keep Practicing</h3>
            </>
          )}
        </div>

        <div className="scenario-practice__evaluation-body">
          <p className="scenario-practice__feedback">{evaluation.overallFeedback}</p>

          {evaluation.strengths.length > 0 && (
            <div className="scenario-practice__section">
              <h4>What You Did Well</h4>
              <ul>
                {evaluation.strengths.map((s, i) => (
                  <li key={i}><CheckCircle2Icon className="h-4 w-4 text-green-500" /> {s}</li>
                ))}
              </ul>
            </div>
          )}

          {evaluation.improvements.length > 0 && (
            <div className="scenario-practice__section">
              <h4>Areas to Improve</h4>
              <ul>
                {evaluation.improvements.map((s, i) => (
                  <li key={i}><AlertCircleIcon className="h-4 w-4 text-amber-500" /> {s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="scenario-practice__evaluation-actions">
          <Button variant="outline" onClick={restart}>
            Try Again
          </Button>
          {evaluation.passed ? (
            <Button onClick={() => onComplete(true)}>
              <CheckCircle2Icon className="h-4 w-4 mr-2" />
              Complete Scenario
            </Button>
          ) : (
            <Button variant="ghost" onClick={onCancel}>
              Exit Practice
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="scenario-practice">
      {/* Header */}
      <div className="scenario-practice__header">
        <div className="scenario-practice__header-left">
          <SparklesIcon className="h-4 w-4 text-primary" />
          <span>AI Practice Session</span>
        </div>
        <div className="scenario-practice__header-right">
          <Button variant="ghost" size="sm" onClick={requestCoaching} disabled={isLoading || isStarting}>
            <HelpCircleIcon className="h-4 w-4 mr-1" />
            Get Coaching
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="scenario-practice__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`scenario-practice__message ${
              message.role === "user" 
                ? "scenario-practice__message--user" 
                : "scenario-practice__message--assistant"
            }`}
          >
            {message.role === "assistant" && (
              <div className="scenario-practice__avatar">
                {scenario.persona.match(/\*\*Name:\*\*\s*(\w+)/)?.[1]?.[0] || "C"}
              </div>
            )}
            <div className="scenario-practice__bubble">
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="scenario-practice__message scenario-practice__message--assistant">
            <div className="scenario-practice__avatar">
              {scenario.persona.match(/\*\*Name:\*\*\s*(\w+)/)?.[1]?.[0] || "C"}
            </div>
            <div className="scenario-practice__bubble scenario-practice__bubble--loading">
              <span className="scenario-practice__typing">
                <span></span><span></span><span></span>
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="scenario-practice__input-form">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your response as the consultant..."
          rows={2}
          className="scenario-practice__input"
          disabled={isLoading || isStarting}
        />
        <div className="scenario-practice__input-actions">
          <Button 
            type="button" 
            variant="outline" 
            onClick={endPractice}
            disabled={isLoading || isStarting || messages.length < 2}
          >
            {isEvaluating ? <Loader2Icon className="h-4 w-4 animate-spin mr-2" /> : null}
            End & Evaluate
          </Button>
          <Button type="submit" disabled={!input.trim() || isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
```

### 3. Update Scenario Accordion

Modify `scenario-accordion.tsx` to integrate practice:

```tsx
// Add to imports
import { ScenarioPractice } from "./scenario-practice"
import { completeScenario } from "@/lib/actions/scenario-actions"

// Add state to ScenarioItem
const [isPracticing, setIsPracticing] = useState(false)

// Add handlers
const handleStartPractice = () => {
  setIsPracticing(true)
}

const handlePracticeComplete = async (passed: boolean) => {
  if (passed) {
    // Auto-complete with generated reflection
    await completeScenario(category, scenario.id, {
      learned: "Completed AI practice session with passing evaluation.",
      improve: "Continue practicing to refine approach.",
    })
  }
  setIsPracticing(false)
}

const handlePracticeCancel = () => {
  setIsPracticing(false)
}

// Replace AI Prompt section with Practice section
{isPracticing ? (
  <ScenarioPractice
    scenario={scenario}
    category={category}
    onComplete={handlePracticeComplete}
    onCancel={handlePracticeCancel}
  />
) : (
  <div className="scenario-section scenario-section--practice">
    <div className="scenario-practice-cta">
      <div className="scenario-practice-cta__content">
        <h4 className="scenario-practice-cta__title">
          <SparklesIcon className="h-4 w-4" />
          Ready to Practice?
        </h4>
        <p className="scenario-practice-cta__description">
          Start an AI roleplay session. The AI will play the client role 
          while you practice as the consultant.
        </p>
      </div>
      <Button onClick={handleStartPractice} className="scenario-practice-cta__button">
        <SparklesIcon className="h-4 w-4 mr-2" />
        Start AI Practice
      </Button>
    </div>
    
    {/* Keep copy prompt as fallback */}
    <details className="scenario-prompt-fallback">
      <summary>Or copy prompt for external AI</summary>
      <pre className="scenario-prompt__code">
        <code>{scenario.aiPrompt}</code>
      </pre>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? <CheckIcon className="h-3.5 w-3.5 mr-1.5" /> : <CopyIcon className="h-3.5 w-3.5 mr-1.5" />}
        {copied ? "Copied!" : "Copy Prompt"}
      </Button>
    </details>
  </div>
)}
```

### 4. CSS Styles

Add to `learn.css`:

```css
/* =============================================================================
   Scenario Practice Chat
   ============================================================================= */

.scenario-practice {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--lms-radius-lg);
  overflow: hidden;
  margin-top: 1rem;
}

.scenario-practice__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: white;
  border-bottom: 1px solid var(--gray-200);
}

.scenario-practice__header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
}

.scenario-practice__header-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.scenario-practice__messages {
  padding: 1rem;
  max-height: 24rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.scenario-practice__message {
  display: flex;
  gap: 0.75rem;
  max-width: 85%;
}

.scenario-practice__message--user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.scenario-practice__message--assistant {
  align-self: flex-start;
}

.scenario-practice__avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--gray-200);
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.scenario-practice__bubble {
  padding: 0.75rem 1rem;
  border-radius: var(--lms-radius-md);
  font-size: 0.875rem;
  line-height: 1.5;
}

.scenario-practice__message--user .scenario-practice__bubble {
  background: var(--color-primary);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.scenario-practice__message--assistant .scenario-practice__bubble {
  background: white;
  border: 1px solid var(--gray-200);
  border-bottom-left-radius: 0.25rem;
}

.scenario-practice__bubble--loading {
  padding: 1rem;
}

.scenario-practice__typing {
  display: flex;
  gap: 0.25rem;
}

.scenario-practice__typing span {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--gray-400);
  border-radius: 50%;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.scenario-practice__typing span:nth-child(1) { animation-delay: 0s; }
.scenario-practice__typing span:nth-child(2) { animation-delay: 0.2s; }
.scenario-practice__typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-0.5rem); }
}

.scenario-practice__input-form {
  padding: 1rem;
  background: white;
  border-top: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.scenario-practice__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--lms-radius-md);
  font-size: 0.875rem;
  resize: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.scenario-practice__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary) l c h / 0.1);
}

.scenario-practice__input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Evaluation Results */
.scenario-practice__evaluation {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--lms-radius-lg);
  overflow: hidden;
  margin-top: 1rem;
}

.scenario-practice__evaluation-header {
  padding: 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.scenario-practice__evaluation-header--passed {
  background: linear-gradient(135deg, var(--green-50), var(--green-100));
  color: var(--green-700);
}

.scenario-practice__evaluation-header--failed {
  background: linear-gradient(135deg, var(--amber-50), var(--amber-100));
  color: var(--amber-700);
}

.scenario-practice__evaluation-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.scenario-practice__evaluation-body {
  padding: 1.5rem;
}

.scenario-practice__feedback {
  font-size: 0.9375rem;
  color: var(--gray-700);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.scenario-practice__section {
  margin-top: 1rem;
}

.scenario-practice__section h4 {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  margin-bottom: 0.5rem;
}

.scenario-practice__section ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.scenario-practice__section li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--gray-700);
}

.scenario-practice__section li svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.scenario-practice__evaluation-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
}

/* Practice CTA */
.scenario-practice-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, oklch(from var(--color-primary) l c h / 0.05), oklch(from var(--color-primary) l c h / 0.1));
  border: 1px solid oklch(from var(--color-primary) l c h / 0.2);
  border-radius: var(--lms-radius-md);
}

.scenario-practice-cta__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 0.25rem 0;
}

.scenario-practice-cta__description {
  font-size: 0.8125rem;
  color: var(--gray-600);
  margin: 0;
}

/* Fallback Prompt */
.scenario-prompt-fallback {
  margin-top: 1rem;
  font-size: 0.8125rem;
}

.scenario-prompt-fallback summary {
  color: var(--gray-500);
  cursor: pointer;
  user-select: none;
}

.scenario-prompt-fallback summary:hover {
  color: var(--gray-700);
}

.scenario-prompt-fallback[open] summary {
  margin-bottom: 0.75rem;
}

/* Dark Mode */
:root.dark .scenario-practice {
  background: var(--gray-900);
  border-color: var(--gray-700);
}

:root.dark .scenario-practice__header {
  background: var(--gray-850);
  border-bottom-color: var(--gray-700);
}

:root.dark .scenario-practice__header-left {
  color: var(--gray-300);
}

:root.dark .scenario-practice__avatar {
  background: var(--gray-700);
  color: var(--gray-300);
}

:root.dark .scenario-practice__message--assistant .scenario-practice__bubble {
  background: var(--gray-800);
  border-color: var(--gray-700);
}

:root.dark .scenario-practice__input-form {
  background: var(--gray-850);
  border-top-color: var(--gray-700);
}

:root.dark .scenario-practice__input {
  background: var(--gray-900);
  border-color: var(--gray-600);
  color: var(--gray-100);
}

:root.dark .scenario-practice__evaluation {
  background: var(--gray-850);
  border-color: var(--gray-700);
}

:root.dark .scenario-practice__evaluation-header--passed {
  background: oklch(from var(--green-900) l c h / 0.3);
  color: var(--green-400);
}

:root.dark .scenario-practice__evaluation-header--failed {
  background: oklch(from var(--amber-900) l c h / 0.3);
  color: var(--amber-400);
}

:root.dark .scenario-practice__feedback {
  color: var(--gray-300);
}

:root.dark .scenario-practice__section h4 {
  color: var(--gray-400);
}

:root.dark .scenario-practice__section li {
  color: var(--gray-300);
}

:root.dark .scenario-practice__evaluation-actions {
  background: var(--gray-900);
  border-top-color: var(--gray-700);
}

:root.dark .scenario-practice-cta {
  background: oklch(from var(--color-primary) l c h / 0.1);
  border-color: oklch(from var(--color-primary) l c h / 0.2);
}

:root.dark .scenario-practice-cta__title {
  color: var(--gray-100);
}

:root.dark .scenario-practice-cta__description {
  color: var(--gray-400);
}
```

---

## Integration with Completion

When practice passes, auto-complete the scenario:

```typescript
// In handlePracticeComplete
const handlePracticeComplete = async (passed: boolean) => {
  if (passed) {
    await completeScenario(category, scenario.id, {
      learned: "Completed AI roleplay practice with passing evaluation. Key skills demonstrated in handling client concerns.",
      improve: "Continue practicing variations of this scenario to build confidence.",
    })
  }
  setIsPracticing(false)
}
```

---

## Success Criteria

1. ✅ User can start practice from within scenario
2. ✅ AI stays in character throughout roleplay
3. ✅ "Get Coaching" provides feedback without ending session
4. ✅ End evaluation checks against scenario objectives
5. ✅ Passing evaluation auto-completes scenario
6. ✅ User can retry if evaluation fails
7. ✅ Fallback to copy-paste still available

---

## Testing Checklist

- [ ] Start practice, AI opens in character
- [ ] Send 3-4 messages, AI maintains persona
- [ ] Request coaching, AI breaks character then returns
- [ ] End practice with short conversation (< 4 messages) — should fail
- [ ] End practice with longer conversation — should get evaluation
- [ ] Pass evaluation — scenario marked complete
- [ ] Fail evaluation — can retry or exit
- [ ] Mobile responsive layout works
- [ ] Dark mode styles correct

---

## Estimated Implementation Time

| Task | Time |
|------|------|
| API route | 1 hour |
| Practice component | 2 hours |
| Accordion integration | 1 hour |
| CSS styles | 1 hour |
| Testing & polish | 2 hours |
| **Total** | **7 hours** |
