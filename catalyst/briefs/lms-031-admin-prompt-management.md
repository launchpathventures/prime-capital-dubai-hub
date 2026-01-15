# LMS-031: Admin Prompt Management

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 4-6 hours  
**Dependencies:** LMS-029 (AI Coach Context Enhancement)  
**Agent-Safe:** ✅ Yes — CRUD operations, standard patterns

---

## Objective

Create an admin interface for managing AI system prompts. Currently, prompts are hardcoded in route files, making them difficult to tune without developer intervention. This brief adds database-driven prompts with an admin UI.

---

## Background

### Current State

AI prompts are hardcoded in:
- `app/api/coach/chat/route.ts` — Coach chat prompts (course, competency, module levels)
- `app/api/coach/roleplay/route.ts` — Scenario roleplay prompts

### The Problem

- Product team cannot adjust prompts without code changes
- No version history for prompts
- Testing different prompts requires deployments
- No visibility into which prompts are active

### The Solution

1. **Database Storage:** Store prompts in Supabase with versioning
2. **Admin UI:** Interface for editing prompts per context type
3. **Live Updates:** Changes apply immediately without redeployment
4. **Fallbacks:** Default prompts if database is unavailable

---

## Scope

### In Scope
- Database schema for prompt storage
- Admin page for viewing/editing prompts
- API updates to load prompts from database
- Version history with ability to rollback
- Default fallback prompts

### Out of Scope
- A/B testing of prompts
- Analytics on prompt effectiveness
- Prompt templates/variables
- Per-user prompt customization

---

## Technical Design

### 1. Database Schema

**Migration:** `supabase/migrations/20260115_ai_prompts.sql`

```sql
-- =============================================================================
-- AI Prompts: Database-driven prompt management
-- =============================================================================

-- Prompt types enum
create type ai_prompt_type as enum (
  'coach_base',           -- Base coach personality
  'coach_course',         -- Course-level context
  'coach_competency',     -- Competency-level context
  'coach_module',         -- Module-level context
  'roleplay_character',   -- Roleplay character prompt
  'roleplay_evaluation'   -- Roleplay evaluation prompt
);

-- Main prompts table
create table if not exists ai_prompts (
  id uuid primary key default gen_random_uuid(),
  
  -- Prompt identification
  prompt_type ai_prompt_type not null unique,
  name text not null,
  description text,
  
  -- Prompt content
  content text not null,
  
  -- Metadata
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  updated_by uuid references auth.users(id)
);

-- Version history
create table if not exists ai_prompt_versions (
  id uuid primary key default gen_random_uuid(),
  prompt_id uuid references ai_prompts(id) on delete cascade not null,
  
  -- Version content
  content text not null,
  version_number integer not null,
  
  -- Metadata
  created_at timestamptz default now(),
  created_by uuid references auth.users(id),
  change_note text
);

-- Indexes
create index idx_ai_prompts_type on ai_prompts(prompt_type);
create index idx_ai_prompt_versions_prompt on ai_prompt_versions(prompt_id);

-- RLS
alter table ai_prompts enable row level security;
alter table ai_prompt_versions enable row level security;

-- Admin can read/write prompts
create policy "Admins can manage prompts"
  on ai_prompts for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can manage prompt versions"
  on ai_prompt_versions for all
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Service role can read (for API routes)
create policy "Service can read prompts"
  on ai_prompts for select
  using (true);

-- Updated_at trigger
create or replace function update_ai_prompt_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger ai_prompts_updated_at
  before update on ai_prompts
  for each row
  execute function update_ai_prompt_timestamp();

-- Insert default prompts
insert into ai_prompts (prompt_type, name, description, content) values
(
  'coach_base',
  'Coach Base Personality',
  'Core personality and rules for the AI Coach',
  'You are the AI Coach for Prime Capital Dubai''s real estate training program.

CRITICAL RULES:
- Give CONCISE answers (30-50 words unless asked for more)
- Focus ONLY on Dubai real estate and this training curriculum
- Always cite which module covers a topic: "See Module X.X: Title"
- If asked about something outside Dubai RE or the curriculum, politely decline
- Add this disclaimer when giving specific regulatory or legal advice: "⚠️ Verify critical details with current regulations."

SCOPE LIMITATIONS:
- You can ONLY help with learning about Dubai real estate
- Decline requests for: code, general knowledge, jokes, personal advice, anything unrelated to Dubai RE
- If the question is off-topic, say: "I''m focused on helping you learn about Dubai real estate. Is there something about the curriculum I can help with?"

TONE:
- Professional but approachable
- Direct, not conversational
- Confident but not pushy (matches Prime Capital brand)'
),
(
  'coach_course',
  'Course Level Context',
  'Additional context when coach is at course level',
  'CURRENT CONTEXT: Course Level
You are helping the learner navigate the entire curriculum.

BEHAVIOR:
- Help learners find the right module for their question
- Give brief topic overviews, then point to specific modules with links
- Use the curriculum structure to guide recommendations
- If a question spans multiple modules, list all relevant ones'
),
(
  'coach_competency',
  'Competency Level Context',
  'Additional context when coach is at competency level',
  'CURRENT CONTEXT: Competency Level
You are helping the learner navigate this specific competency.

BEHAVIOR:
- Help learners understand what this competency covers
- Recommend which module to start with based on their question
- Use clickable module links so learners can navigate directly
- Summarize key themes across the competency'
),
(
  'coach_module',
  'Module Level Context',
  'Additional context when coach is at module level',
  'CURRENT CONTEXT: Module Level
You are an expert on this specific module.

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- Reference the current page content when relevant
- If asked about other topics, briefly answer and suggest the relevant module'
),
(
  'roleplay_character',
  'Roleplay Character Prompt',
  'System prompt for scenario roleplay as client',
  'You are roleplaying as a client in a real estate consultation scenario.

BEHAVIOR RULES:
- Stay 100% in character as this client
- Express concerns naturally based on your persona
- React realistically to the consultant''s responses
- If they address your concerns well, show gradual openness
- If they dismiss, deflect, or use pushy tactics, show skepticism or resistance
- Keep responses conversational (2-4 sentences typical)
- Never break character unless user explicitly asks for coaching help

COACHING MODE (only if user asks "How am I doing?", "Can I get feedback?", or similar):
- Briefly step out of character: "Stepping out of character for a moment..."
- Provide constructive feedback on their approach so far
- Reference what the scenario is testing
- Then return: "Back in character as the client..."'
),
(
  'roleplay_evaluation',
  'Roleplay Evaluation Prompt',
  'System prompt for evaluating roleplay sessions',
  'You are an expert evaluator for real estate sales training.

EVALUATION CRITERIA:
- passed = true if they addressed the core client concern effectively
- Consider: Did they acknowledge the concern? Provide substance? Maintain trust?
- Be encouraging but honest — this is for learning

Respond only with valid JSON in this format:
{
  "passed": true/false,
  "objectivesMet": ["objective 1 they achieved"],
  "objectivesMissed": ["objective they missed"],
  "overallFeedback": "2-3 sentences on overall performance",
  "strengths": ["specific thing they did well"],
  "improvements": ["specific suggestion"]
}'
);
```

### 2. Prompt Loading Utility

**File:** `lib/lms/ai-prompts.ts`

```typescript
/**
 * CATALYST - AI Prompt Loader
 * 
 * Loads AI prompts from database with caching and fallbacks.
 */

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
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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

  roleplay_character: `You are roleplaying as a client in a real estate consultation scenario.

BEHAVIOR RULES:
- Stay 100% in character as this client
- Express concerns naturally based on your persona
- React realistically to the consultant's responses
- Keep responses conversational (2-4 sentences typical)
- Never break character unless user explicitly asks for coaching help`,

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
      console.warn(`Failed to load prompt ${type}, using default:`, error?.message)
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
export async function getPrompts(types: PromptType[]): Promise<Record<PromptType, string>> {
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
      const dataMap = new Map(data?.map(d => [d.prompt_type, d.content]) || [])
      
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
```

### 3. Admin UI

**File:** `app/learn/admin/prompts/page.tsx`

```tsx
/**
 * CATALYST - Admin Prompt Management
 * 
 * Interface for managing AI system prompts.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getUserRole, getUserForMenu } from "@/lib/auth/require-auth"
import { LearnShell } from "../../_surface/learn-shell"
import { PromptEditor } from "./_components/prompt-editor"

export const metadata: Metadata = {
  title: "AI Prompts | Admin",
}

interface Prompt {
  id: string
  prompt_type: string
  name: string
  description: string | null
  content: string
  is_active: boolean
  updated_at: string
}

async function getPrompts(): Promise<Prompt[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("ai_prompts")
    .select("*")
    .order("prompt_type")
  
  if (error) {
    console.error("Failed to fetch prompts:", error)
    return []
  }
  
  return data
}

export default async function AdminPromptsPage() {
  const [userRole, userMenu] = await Promise.all([
    getUserRole(),
    getUserForMenu(),
  ])
  
  // Admin only
  if (userRole !== "admin") {
    redirect("/learn")
  }
  
  const prompts = await getPrompts()
  
  return (
    <LearnShell
      activeSection="admin"
      userRole={userRole}
      user={userMenu ?? undefined}
    >
      <div className="admin-prompts">
        <header className="admin-prompts__header">
          <h1>AI Prompts</h1>
          <p>Manage system prompts for the AI Coach and Scenario Roleplay.</p>
        </header>
        
        <div className="admin-prompts__list">
          {prompts.map((prompt) => (
            <PromptEditor key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </div>
    </LearnShell>
  )
}
```

**File:** `app/learn/admin/prompts/_components/prompt-editor.tsx`

```tsx
"use client"

/**
 * CATALYST - Prompt Editor Component
 * 
 * Editable prompt card with save functionality.
 */

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SaveIcon, RotateCcwIcon, HistoryIcon, CheckIcon } from "lucide-react"
import { updatePrompt } from "../actions"

interface Prompt {
  id: string
  prompt_type: string
  name: string
  description: string | null
  content: string
  is_active: boolean
  updated_at: string
}

interface PromptEditorProps {
  prompt: Prompt
}

export function PromptEditor({ prompt }: PromptEditorProps) {
  const [content, setContent] = useState(prompt.content)
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  
  const hasChanges = content !== prompt.content
  
  const handleSave = () => {
    startTransition(async () => {
      const result = await updatePrompt(prompt.id, content)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }
  
  const handleReset = () => {
    setContent(prompt.content)
  }
  
  const formatType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }
  
  return (
    <div className="prompt-editor">
      <div className="prompt-editor__header">
        <div>
          <h3 className="prompt-editor__title">{prompt.name}</h3>
          <p className="prompt-editor__description">{prompt.description}</p>
        </div>
        <Badge variant={prompt.is_active ? "default" : "secondary"}>
          {formatType(prompt.prompt_type)}
        </Badge>
      </div>
      
      <textarea
        className="prompt-editor__textarea"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />
      
      <div className="prompt-editor__footer">
        <span className="prompt-editor__updated">
          Last updated: {new Date(prompt.updated_at).toLocaleDateString()}
        </span>
        
        <div className="prompt-editor__actions">
          {hasChanges && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcwIcon className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isPending}
          >
            {saved ? (
              <>
                <CheckIcon className="h-4 w-4 mr-1" />
                Saved
              </>
            ) : (
              <>
                <SaveIcon className="h-4 w-4 mr-1" />
                {isPending ? "Saving..." : "Save"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
```

**File:** `app/learn/admin/prompts/actions.ts`

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserRole } from "@/lib/auth/require-auth"
import { clearPromptCache } from "@/lib/lms/ai-prompts"
import { revalidatePath } from "next/cache"

export async function updatePrompt(
  promptId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  // Admin check
  const role = await getUserRole()
  if (role !== "admin") {
    return { success: false, error: "Unauthorized" }
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { success: false, error: "Not authenticated" }
  }
  
  // Get current version number
  const { data: versions } = await supabase
    .from("ai_prompt_versions")
    .select("version_number")
    .eq("prompt_id", promptId)
    .order("version_number", { ascending: false })
    .limit(1)
  
  const nextVersion = (versions?.[0]?.version_number || 0) + 1
  
  // Get current content for version history
  const { data: current } = await supabase
    .from("ai_prompts")
    .select("content")
    .eq("id", promptId)
    .single()
  
  // Save version history
  if (current) {
    await supabase.from("ai_prompt_versions").insert({
      prompt_id: promptId,
      content: current.content,
      version_number: nextVersion - 1,
      created_by: user.id,
      change_note: "Before update",
    })
  }
  
  // Update prompt
  const { error } = await supabase
    .from("ai_prompts")
    .update({
      content,
      updated_by: user.id,
    })
    .eq("id", promptId)
  
  if (error) {
    console.error("Failed to update prompt:", error)
    return { success: false, error: error.message }
  }
  
  // Clear cache so new prompt is used immediately
  clearPromptCache()
  
  // Revalidate admin page
  revalidatePath("/learn/admin/prompts")
  
  return { success: true }
}
```

### 4. Update API Routes

Update coach chat route to use database prompts:

**In `app/api/coach/chat/route.ts`:**

```typescript
import { getPrompts, type PromptType } from "@/lib/lms/ai-prompts"

async function buildSystemPrompt(
  context: ChatRequest["context"],
  moduleContent?: string,
  competencyInfo?: CompetencyInfo,
  userQuestion?: string
): Promise<string> {
  // Load prompts from database
  const prompts = await getPrompts([
    "coach_base",
    "coach_course",
    "coach_competency",
    "coach_module",
  ])
  
  const base = prompts.coach_base

  if (context.level === "module" && moduleContent) {
    return `${base}

${prompts.coach_module}

MODULE CONTENT:
${moduleContent.slice(0, 15000)}`
  }

  if (context.level === "competency" && competencyInfo) {
    // ... existing competency logic with prompts.coach_competency
  }

  // Course level with curriculum index
  // ... existing logic with prompts.coach_course
}
```

---

## Styling

**Add to:** `app/learn/learn.css`

```css
/* Admin Prompts Page */
.admin-prompts {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-prompts__header {
  margin-bottom: 2rem;
}

.admin-prompts__header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.admin-prompts__header p {
  color: var(--color-muted-foreground);
}

.admin-prompts__list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Prompt Editor */
.prompt-editor {
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}

.prompt-editor__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.prompt-editor__title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.prompt-editor__description {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
}

.prompt-editor__textarea {
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  resize: vertical;
}

.prompt-editor__textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px oklch(from var(--color-primary) l c h / 0.2);
}

.prompt-editor__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.prompt-editor__updated {
  font-size: 0.75rem;
  color: var(--color-muted-foreground);
}

.prompt-editor__actions {
  display: flex;
  gap: 0.5rem;
}
```

---

## Implementation Checklist

### Phase 1: Database (1 hour)
- [ ] Create migration file
- [ ] Run migration locally
- [ ] Verify default prompts are inserted
- [ ] Test RLS policies

### Phase 2: Prompt Loader (1 hour)
- [ ] Create `lib/lms/ai-prompts.ts`
- [ ] Implement caching
- [ ] Test fallback behavior
- [ ] Export types

### Phase 3: Admin UI (2 hours)
- [ ] Create admin prompts page
- [ ] Create prompt editor component
- [ ] Implement save action
- [ ] Add to admin navigation

### Phase 4: API Integration (1 hour)
- [ ] Update chat route to use loader
- [ ] Update roleplay route to use loader
- [ ] Test prompt changes apply immediately
- [ ] Verify cache clearing works

### Phase 5: Testing (1 hour)
- [ ] Test editing prompts as admin
- [ ] Verify non-admins cannot access
- [ ] Test coach uses updated prompts
- [ ] Test fallback when DB unavailable

---

## Success Criteria

1. ✅ Admin can view all AI prompts
2. ✅ Admin can edit and save prompts
3. ✅ Changes apply immediately (no redeploy)
4. ✅ Version history is preserved
5. ✅ Non-admins cannot access prompt management
6. ✅ Fallback prompts work when DB unavailable

---

## Navigation Update

Add to admin section in sidebar:

**In `lib/navigation.ts` or equivalent:**

```typescript
{
  label: "AI Prompts",
  href: "/learn/admin/prompts",
  icon: SparklesIcon,
}
```
