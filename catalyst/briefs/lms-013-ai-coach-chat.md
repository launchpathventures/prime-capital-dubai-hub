# LMS-013a: AI Coach Infrastructure

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2 days  
**Dependencies:** Supabase, Anthropic Claude API  
**Agent-Safe:** ✅ Yes — well-defined inputs/outputs, follows existing patterns

---

## Objective

Build the backend infrastructure and core UI components for an AI coaching feature. This brief covers the **foundation only** — database, API, and isolated components that can be built without deep integration knowledge.

A separate brief (LMS-013b) covers integration and prompt tuning.

---

## What We're Building

An "Answer-First Explainer" that helps learners:
1. **Find answers fast** — concise responses, not essays
2. **Get simple explanations** — TL;DR for skimmers
3. **Navigate the curriculum** — "Where is X covered?"

**NOT building in v1:**
- Role play mode (v2)
- Quiz mode (v2)
- Conversation persistence (v2)
- Manager dashboards (v2)

---

## Context Levels

The coach behaves differently based on where the learner is:

| Level | Page | Coach Behavior |
|-------|------|----------------|
| **Course** | `/learn` | Navigator — helps find modules |
| **Competency** | `/learn/[competency]` | Curator — recommends path, summarizes |
| **Module** | `/learn/[competency]/[module]` | Expert — answers deeply, cites content |

```typescript
type CoachContext = 
  | { level: "course" }
  | { level: "competency"; competencySlug: string }
  | { level: "module"; competencySlug: string; moduleSlug: string }
```

---

## Database Schema

### Migration: `20260113_coach_messages`

Create file: `supabase/migrations/20260113000000_coach_messages.sql`

```sql
-- =============================================================================
-- AI Coach: Session-based messaging (no persistence between sessions)
-- We store messages temporarily for the session, then can analyze/delete
-- =============================================================================

-- For v1, we're NOT persisting conversations between sessions.
-- This table is for analytics and rate limiting only.

create table if not exists coach_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  
  -- Context
  context_level text not null check (context_level in ('course', 'competency', 'module')),
  competency_slug text,
  module_slug text,
  
  -- Usage tracking
  message_count integer not null default 1,
  
  -- Timestamps
  created_at timestamptz default now()
);

-- Index for rate limiting queries
create index idx_coach_usage_user_time 
  on coach_usage(user_id, created_at desc);

-- RLS
alter table coach_usage enable row level security;

create policy "Users can insert own usage"
  on coach_usage for insert
  with check (auth.uid() = user_id);

create policy "Users can view own usage"
  on coach_usage for select
  using (auth.uid() = user_id);

-- Rate limiting function
create or replace function check_coach_rate_limit(p_user_id uuid)
returns boolean as $$
declare
  recent_count integer;
begin
  select count(*) into recent_count
  from coach_usage
  where user_id = p_user_id
    and created_at > now() - interval '1 hour';
  
  -- 50 messages per hour limit
  return recent_count < 50;
end;
$$ language plpgsql security definer;
```

---

## API Route

### File: `app/api/coach/chat/route.ts`

```typescript
/**
 * CATALYST - AI Coach Chat API
 * 
 * Handles chat requests with context-aware responses.
 * Uses Claude API with streaming for fast responses.
 */

import { NextRequest } from "next/server"
import Anthropic from "@anthropic-ai/sdk"
import { createClient } from "@/lib/supabase/server"
import { getCompetencies, getModuleBySlug } from "@/lib/learning"

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

function buildSystemPrompt(
  context: ChatRequest["context"],
  moduleContent?: string,
  competencyInfo?: { name: string; description: string; moduleCount: number }
): string {
  const base = `You are the AI Coach for Prime Capital Dubai's real estate training program.

CRITICAL RULES:
- Give CONCISE answers (30-50 words unless asked for more)
- Focus ONLY on Dubai real estate and this training curriculum
- Always cite which module covers a topic: "See Module X.X: Title"
- If asked about something outside Dubai RE or the curriculum, politely decline
- Add this disclaimer when giving specific advice: "⚠️ Verify critical details with current regulations."

TONE:
- Professional but approachable
- Direct, not conversational
- Confident but not pushy (matches Prime Capital brand)`

  if (context.level === "module" && moduleContent) {
    return `${base}

CURRENT CONTEXT: Module Level
You are an expert on this specific module. Answer questions using the content below.

MODULE CONTENT:
${moduleContent}

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- If asked about other topics, briefly answer and suggest the relevant module`
  }

  if (context.level === "competency" && competencyInfo) {
    return `${base}

CURRENT CONTEXT: Competency Level
You are helping the learner navigate ${competencyInfo.name} (${competencyInfo.moduleCount} modules).

COMPETENCY: ${competencyInfo.name}
DESCRIPTION: ${competencyInfo.description}

BEHAVIOR:
- Help learners understand what this competency covers
- Recommend which module to start with based on their question
- Summarize key themes across the competency
- Link to specific modules: "See Module X.X: Title"`
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
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
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
    let competencyInfo: { name: string; description: string; moduleCount: number } | undefined

    if (context.level === "module" && context.competencySlug && context.moduleSlug) {
      const module = await getModuleBySlug(context.competencySlug, context.moduleSlug)
      if (module) {
        moduleContent = module.content
      }
    }

    if (context.level === "competency" && context.competencySlug) {
      const competencies = await getCompetencies()
      const comp = competencies.find(c => c.slug === context.competencySlug)
      if (comp) {
        competencyInfo = {
          name: comp.name,
          description: comp.description || "",
          moduleCount: comp.modules?.length || 0,
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
      messages: messages.map(m => ({
        role: m.role,
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
    console.error("Coach chat error:", error)
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
```

---

## Core Components

### 1. Coach Context Provider

**File:** `components/lms/coach/coach-provider.tsx`

```tsx
/**
 * CATALYST - Coach Context Provider
 * 
 * Manages coach state across the learn surface.
 * Handles opening/closing, context, and message state.
 */

"use client"

import * as React from "react"

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CoachContext {
  level: "course" | "competency" | "module"
  competencySlug?: string
  moduleSlug?: string
  competencyName?: string
  moduleName?: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface CoachContextValue {
  // Panel state
  isOpen: boolean
  openCoach: (context?: Partial<CoachContext>) => void
  closeCoach: () => void
  
  // Context
  context: CoachContext
  setContext: (context: CoachContext) => void
  
  // Messages (session only)
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  
  // Loading state
  isLoading: boolean
}

// -----------------------------------------------------------------------------
// Context
// -----------------------------------------------------------------------------

const CoachContext = React.createContext<CoachContextValue | null>(null)

export function useCoach() {
  const context = React.useContext(CoachContext)
  if (!context) {
    throw new Error("useCoach must be used within CoachProvider")
  }
  return context
}

// -----------------------------------------------------------------------------
// Provider
// -----------------------------------------------------------------------------

interface CoachProviderProps {
  children: React.ReactNode
  initialContext?: CoachContext
}

export function CoachProvider({ children, initialContext }: CoachProviderProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [context, setContext] = React.useState<CoachContext>(
    initialContext || { level: "course" }
  )
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const openCoach = React.useCallback((newContext?: Partial<CoachContext>) => {
    if (newContext) {
      setContext(prev => ({ ...prev, ...newContext }))
    }
    setIsOpen(true)
  }, [])

  const closeCoach = React.useCallback(() => {
    setIsOpen(false)
  }, [])

  const clearMessages = React.useCallback(() => {
    setMessages([])
  }, [])

  const sendMessage = React.useCallback(async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/coach/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            level: context.level,
            competencySlug: context.competencySlug,
            moduleSlug: context.moduleSlug,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      // Handle streaming response
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
            updated[lastIdx] = {
              ...updated[lastIdx],
              content: updated[lastIdx].content + chunk,
            }
            return updated
          })
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      // Add error message
      setMessages(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [messages, context])

  const value: CoachContextValue = {
    isOpen,
    openCoach,
    closeCoach,
    context,
    setContext,
    messages,
    sendMessage,
    clearMessages,
    isLoading,
  }

  return (
    <CoachContext.Provider value={value}>
      {children}
    </CoachContext.Provider>
  )
}
```

### 2. Coach Panel (Sidebar)

**File:** `components/lms/coach/coach-panel.tsx`

```tsx
/**
 * CATALYST - Coach Panel
 * 
 * Slide-out sidebar for AI coach chat.
 * Displays context, messages, and input.
 */

"use client"

import * as React from "react"
import { XIcon, SendIcon, SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Stack, Row, Text } from "@/components/core"
import { useCoach } from "./coach-provider"
import { CoachMessages } from "./coach-messages"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CoachPanel() {
  const { isOpen, closeCoach, context, sendMessage, isLoading, messages } = useCoach()
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLTextAreaElement>(null)

  // Focus input when opening
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const message = input.trim()
    setInput("")
    await sendMessage(message)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Quick actions based on context
  const quickActions = React.useMemo(() => {
    if (context.level === "module") {
      return [
        { label: "Summarize Key Points", prompt: "Give me a quick summary of the key points in this module." },
      ]
    }
    if (context.level === "competency") {
      return [
        { label: "Summarize This Competency", prompt: "What are the key things I'll learn in this competency?" },
        { label: "Where Should I Start?", prompt: "Which module should I start with based on the most important concepts?" },
      ]
    }
    return []
  }, [context.level])

  const contextLabel = React.useMemo(() => {
    if (context.level === "module" && context.moduleName) {
      return `Module: ${context.moduleName}`
    }
    if (context.level === "competency" && context.competencyName) {
      return `Competency: ${context.competencyName}`
    }
    return "Course Overview"
  }, [context])

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCoach}
      />
      
      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-full max-w-md",
          "bg-background border-l shadow-xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <Stack className="h-full">
          {/* Header */}
          <div className="border-b p-4">
            <Row align="center" justify="between">
              <Row align="center" gap="sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <SparklesIcon className="h-4 w-4 text-primary" />
                </div>
                <Stack gap="none">
                  <Text weight="medium">AI Coach</Text>
                  <Text size="xs" variant="muted">{contextLabel}</Text>
                </Stack>
              </Row>
              <Button variant="ghost" size="icon" onClick={closeCoach}>
                <XIcon className="h-4 w-4" />
              </Button>
            </Row>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <Stack gap="md">
                <Text variant="muted" className="text-center">
                  Ask me anything about {context.level === "module" ? "this module" : "the curriculum"}.
                </Text>
                
                {/* Quick Actions */}
                {quickActions.length > 0 && (
                  <Stack gap="sm">
                    <Text size="xs" variant="muted" className="uppercase tracking-wide">
                      Quick Actions
                    </Text>
                    {quickActions.map((action) => (
                      <Button
                        key={action.label}
                        variant="outline"
                        className="justify-start"
                        onClick={() => sendMessage(action.prompt)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Stack>
                )}
              </Stack>
            ) : (
              <CoachMessages />
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSubmit}>
              <Stack gap="sm">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question..."
                    rows={2}
                    className={cn(
                      "w-full resize-none rounded-lg border bg-background p-3 pr-12",
                      "text-sm placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute bottom-2 right-2"
                    disabled={!input.trim() || isLoading}
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Text size="xs" variant="muted" className="text-center">
                  ⚠️ For training purposes only. Verify critical details.
                </Text>
              </Stack>
            </form>
          </div>
        </Stack>
      </div>
    </>
  )
}
```

### 3. Coach Messages

**File:** `components/lms/coach/coach-messages.tsx`

```tsx
/**
 * CATALYST - Coach Messages
 * 
 * Renders the message list with proper formatting.
 */

"use client"

import * as React from "react"
import { Stack, Text } from "@/components/core"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

export function CoachMessages() {
  const { messages, isLoading } = useCoach()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Stack gap="md">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "rounded-lg p-3",
            message.role === "user" 
              ? "ml-8 bg-primary text-primary-foreground" 
              : "mr-8 bg-muted"
          )}
        >
          {message.role === "assistant" ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <Text size="sm">{message.content}</Text>
          )}
        </div>
      ))}
      
      {isLoading && messages[messages.length - 1]?.role === "user" && (
        <div className="mr-8 rounded-lg bg-muted p-3">
          <div className="flex gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.1s]" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]" />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </Stack>
  )
}
```

### 4. Coach Trigger (Floating Button)

**File:** `components/lms/coach/coach-trigger.tsx`

```tsx
/**
 * CATALYST - Coach Trigger
 * 
 * Floating action button to open the coach panel.
 */

"use client"

import { SparklesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCoach } from "./coach-provider"
import { cn } from "@/lib/utils"

export function CoachTrigger() {
  const { openCoach, isOpen } = useCoach()

  return (
    <Button
      onClick={() => openCoach()}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 z-30",
        "h-14 w-14 rounded-full shadow-lg",
        "transition-transform hover:scale-105",
        isOpen && "hidden"
      )}
    >
      <SparklesIcon className="h-6 w-6" />
      <span className="sr-only">Open AI Coach</span>
    </Button>
  )
}
```

### 5. Barrel Export

**File:** `components/lms/coach/index.ts`

```typescript
/**
 * CATALYST - Coach Components
 */

export { CoachProvider, useCoach } from "./coach-provider"
export { CoachPanel } from "./coach-panel"
export { CoachMessages } from "./coach-messages"
export { CoachTrigger } from "./coach-trigger"
```

---

## Environment Variables

Add to `.env.local`:

```bash
# AI Coach (Anthropic Claude)
ANTHROPIC_API_KEY=sk-ant-...
COACH_MODEL=claude-sonnet-4-20250514
```

Add to `.env.example`:

```bash
# AI Coach (Anthropic Claude)
ANTHROPIC_API_KEY=
COACH_MODEL=claude-sonnet-4-20250514
```

---

## Package Dependencies

```bash
pnpm add @anthropic-ai/sdk
```

---

## Deliverables Checklist

- [ ] Create migration file `supabase/migrations/20260113000000_coach_messages.sql`
- [ ] Apply migration: `pnpm supabase db push`
- [ ] Create API route `app/api/coach/chat/route.ts`
- [ ] Create `components/lms/coach/` directory with all components
- [ ] Add `@anthropic-ai/sdk` dependency
- [ ] Add environment variables
- [ ] Test API route with curl/Postman

---

## Testing the API

```bash
# Test with curl (replace token)
curl -X POST http://localhost:3000/api/coach/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -d '{
    "messages": [{"role": "user", "content": "What is the advisory model?"}],
    "context": {"level": "course"}
  }'
```

---

## Success Criteria

1. ✅ API returns streaming responses from Claude
2. ✅ Rate limiting works (50/hour)
3. ✅ Usage is logged to `coach_usage` table
4. ✅ Components render without errors
5. ✅ Context provider manages state correctly

---

## Next Brief

**LMS-013b: AI Coach Integration** covers:
- LearnShell integration
- Page-level entry points (header, bottom prompt)
- Context passing from pages
- Prompt tuning based on real usage
- Mobile responsive polish
