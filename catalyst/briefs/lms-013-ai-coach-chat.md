# LMS-013: AI Coach Chat Feature

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 4-5 days  
**Dependencies:** LMS-006 (Module Experience), Supabase, Anthropic Claude API  

---

## Objective

Build an AI-powered coaching chat feature that allows learners to:

1. **Ask questions** about learning material across the entire curriculum
2. **Get contextual coaching** within specific modules
3. **Role-play scenarios** with AI acting as different client personas
4. **Receive feedback** on their understanding and application of concepts

The AI Coach is universally available (accessible from any page) but context-aware (knows the current module when relevant).

---

## Key Principle: Context-First Coaching

The AI Coach uses the module's `aiCoach` frontmatter to tailor its persona, focus areas, and coaching style. When accessed outside a module context, it defaults to a generalist "Prime Capital Training Coach" persona.

### Context Hierarchy

```
1. Module-specific context (when viewing a module)
   - aiCoach.persona from frontmatter
   - aiCoach.focusAreas
   - aiCoach.practiceScenarios
   - Module content as reference material
   
2. Competency context (when on competency page)
   - Competency-level aiCoach config from _index.md
   - All modules in competency as reference
   
3. Global context (dashboard, course overview)
   - General Prime Capital training coach
   - Full curriculum as reference (high-level)
```

---

## Wireframe: Chat Panel

The chat panel is a slide-out drawer accessible from a floating button on all `/learn/*` pages.

```
┌────────────────────────────────────────────────────────────────┐
│                                                          [✕]   │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  🎯 AI Coach                                           │   │
│  │  Brand Communication Expert                            │   │
│  │  Module: Prime Capital Positioning                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  [Coach Avatar]                                         │   │
│  │                                                         │   │
│  │  Welcome! I'm your Brand Communication Coach for       │   │
│  │  this module. I can help you:                          │   │
│  │                                                         │   │
│  │  • Understand Prime Capital's positioning              │   │
│  │  • Practice introducing the brand to skeptical clients │   │
│  │  • Role-play differentiation conversations             │   │
│  │                                                         │   │
│  │  What would you like to explore?                       │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─ Quick Actions ────────────────────────────────────────┐   │
│  │  [Quiz Me] [Role Play] [Explain This] [Find in Course] │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ─────────────────────────────────────────────────────────────│
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  [Message input]                              [Send ➤] │   │
│  │                                                         │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

### Floating Trigger Button

```
┌──────────────────────────────────────────────────────┐
│                                                       │
│  [Page Content]                                       │
│                                                       │
│                                          ┌─────────┐ │
│                                          │   🎯    │ │
│                                          │  Coach  │ │
│                                          └─────────┘ │
└──────────────────────────────────────────────────────┘
```

Position: Fixed bottom-right, above any existing FAB patterns.

---

## Chat Modes

### 1. Ask Mode (Default)

Free-form Q&A about the learning material.

**System prompt context:**
- Current module content (if applicable)
- Module's aiCoach configuration
- Relevant sections from other modules if needed

**Example interactions:**
- "What's the difference between advisory and transactional models?"
- "How do I handle a client who says 'I can find properties on my own'?"
- "What are the key statistics I need to remember for this module?"

### 2. Quiz Mode

The coach asks questions to test understanding.

**Triggered by:** "Quiz me" button or asking "Test my knowledge"

**Behavior:**
- Generates questions based on current module/competency
- Provides immediate feedback with explanations
- Tracks performance in conversation (not persisted)

### 3. Role Play Mode

AI plays a client persona for practice.

**Triggered by:** "Role play" button or asking for practice

**Available scenarios** (from `aiCoach.practiceScenarios`):
- "Introduce Prime Capital to skeptical investor"
- "Explain difference from other agencies"
- "Respond to 'why should I use you' question"

**Behavior:**
- AI adopts client persona (skeptical, busy, demanding, etc.)
- Learner practices their responses
- AI provides coaching feedback after the scenario

### 4. Explain Mode

Deep-dive explanation of specific concepts.

**Triggered by:** "Explain this" button (uses current page section if available)

**Behavior:**
- Identifies the concept needing explanation
- Provides layered explanation (simple → detailed)
- Uses examples from the Dubai real estate context

---

## Technical Architecture

### API Route: `/api/coach/chat`

```typescript
// POST /api/coach/chat
interface ChatRequest {
  messages: Message[]
  context: {
    moduleSlug?: string
    competencySlug?: string
    currentSection?: string // heading/section user is viewing
    mode: "ask" | "quiz" | "roleplay" | "explain"
    scenarioId?: string // for role play mode
  }
}

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatResponse {
  message: string
  suggestions?: string[] // follow-up prompts
  references?: Reference[] // links to relevant module sections
}

interface Reference {
  moduleSlug: string
  competencySlug: string
  sectionHeading: string
  relevance: number
}
```

### System Prompt Construction

```typescript
function buildSystemPrompt(context: ChatContext): string {
  const base = `You are an AI Coach for Prime Capital Dubai's real estate training program.
Your role is to help agents learn and practice their skills.
Always maintain a professional, supportive tone aligned with Prime Capital's brand values.`

  if (context.module) {
    const aiCoach = context.module.frontmatter?.aiCoach
    return `${base}

Current Role: ${aiCoach?.persona || "Training Coach"}
Focus Areas: ${aiCoach?.focusAreas?.join(", ") || "General training"}

Module Context:
- Title: ${context.module.title}
- Description: ${context.module.description}

Reference Material:
${context.module.content}

${buildModeInstructions(context.mode)}`
  }
  
  return `${base}

You are a generalist Prime Capital Training Coach. Help the learner navigate 
the curriculum and find relevant modules for their questions.`
}
```

### Mode-Specific Instructions

```typescript
function buildModeInstructions(mode: string): string {
  switch (mode) {
    case "quiz":
      return `Quiz Mode: Ask one question at a time about the module content.
After the learner responds, provide feedback and explanation.
Use a mix of factual recall and scenario-based questions.`

    case "roleplay":
      return `Role Play Mode: You are playing the role of a potential client.
Adopt the specified persona and engage in realistic dialogue.
After 3-5 exchanges, break character and provide coaching feedback.`

    case "explain":
      return `Explain Mode: Provide clear, layered explanations.
Start with a simple summary, then offer to go deeper.
Use concrete examples from Dubai real estate.`

    default:
      return `Ask Mode: Answer questions helpfully and accurately.
Reference specific parts of the module content when relevant.
If a question goes beyond current module, guide to relevant content.`
  }
}
```

---

## Database Schema

### New Table: `coach_conversations`

```sql
create table coach_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  module_id uuid references learning_modules(id),
  competency_id uuid references competencies(id),
  
  -- Conversation state
  messages jsonb not null default '[]',
  mode text not null default 'ask',
  
  -- Analytics
  message_count integer not null default 0,
  started_at timestamptz default now(),
  last_message_at timestamptz default now(),
  
  created_at timestamptz default now()
);

-- Index for user's recent conversations
create index idx_coach_conversations_user 
  on coach_conversations(user_id, last_message_at desc);

-- RLS: Users can only see their own conversations
alter table coach_conversations enable row level security;

create policy "Users can view own conversations"
  on coach_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own conversations"
  on coach_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own conversations"
  on coach_conversations for update
  using (auth.uid() = user_id);
```

### Optional: `coach_feedback` (for role play scoring)

```sql
create table coach_feedback (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references coach_conversations(id),
  user_id uuid references auth.users(id) not null,
  
  -- Role play specific
  scenario_id text,
  performance_score integer, -- 1-5
  feedback_summary text,
  strengths text[],
  improvements text[],
  
  created_at timestamptz default now()
);
```

---

## Components

### 1. CoachPanel (`components/lms/coach-panel.tsx`)

Main drawer component containing the chat interface.

```tsx
interface CoachPanelProps {
  isOpen: boolean
  onClose: () => void
  context: {
    moduleSlug?: string
    competencySlug?: string
    aiCoach?: AICoachConfig
  }
}
```

### 2. CoachTrigger (`components/lms/coach-trigger.tsx`)

Floating action button to open the coach panel.

```tsx
interface CoachTriggerProps {
  onClick: () => void
  hasActiveConversation?: boolean
}
```

### 3. CoachMessages (`components/lms/coach-messages.tsx`)

Message list with proper formatting for different content types.

```tsx
interface CoachMessagesProps {
  messages: Message[]
  isLoading?: boolean
}
```

### 4. CoachInput (`components/lms/coach-input.tsx`)

Input field with quick action buttons.

```tsx
interface CoachInputProps {
  onSend: (message: string) => void
  onModeChange: (mode: string) => void
  currentMode: string
  disabled?: boolean
  suggestions?: string[]
}
```

### 5. CoachProvider (`components/lms/coach-provider.tsx`)

Context provider for coach state across the learn surface.

```tsx
interface CoachContextValue {
  isOpen: boolean
  openCoach: (context?: Partial<CoachContext>) => void
  closeCoach: () => void
  currentContext: CoachContext
  conversation: Conversation | null
  sendMessage: (content: string) => Promise<void>
  setMode: (mode: string) => void
}
```

---

## Integration Points

### Learn Shell Integration

Add CoachProvider and CoachTrigger to LearnShell:

```tsx
// app/learn/_surface/learn-shell.tsx
export function LearnShell({ children, ... }) {
  return (
    <CoachProvider>
      <div className="learn-shell">
        {/* existing content */}
        {children}
        
        {/* Coach trigger - always visible */}
        <CoachTrigger />
        
        {/* Coach panel - slides in when open */}
        <CoachPanel />
      </div>
    </CoachProvider>
  )
}
```

### Module Page Integration

Pass module context to coach when opening:

```tsx
// In module page component
const { openCoach } = useCoach()

// When user clicks "Ask Coach" or opens panel
openCoach({
  moduleSlug: module.slug,
  competencySlug: competency.slug,
  aiCoach: module.frontmatter?.aiCoach,
  currentSection: visibleSection, // from scroll position
})
```

### Markdown Integration (Optional Enhancement)

Add "Ask about this" hover buttons on key sections:

```tsx
// In markdown-renderer.tsx for key headings
<div className="group relative">
  <h2>{heading}</h2>
  <button 
    className="opacity-0 group-hover:opacity-100"
    onClick={() => openCoach({ 
      mode: "explain",
      currentSection: heading 
    })}
  >
    Ask Coach
  </button>
</div>
```

---

## Environment Variables

Add to `.env.local`:

```bash
# AI Coach Configuration
ANTHROPIC_API_KEY=sk-ant-...
COACH_MODEL=claude-sonnet-4-20250514
COACH_MAX_TOKENS=1024
COACH_TEMPERATURE=0.7
```

---

## Deliverables Checklist

### Phase 1: Foundation (Day 1-2)
- [ ] Database migration for `coach_conversations`
- [ ] API route `/api/coach/chat` with Claude integration
- [ ] System prompt construction with context handling
- [ ] Basic CoachPanel and CoachTrigger components
- [ ] CoachProvider context for state management

### Phase 2: Chat Interface (Day 2-3)
- [ ] Message rendering with markdown support
- [ ] Streaming response support
- [ ] Quick action buttons (Quiz Me, Role Play, etc.)
- [ ] Mode switching logic
- [ ] Conversation persistence

### Phase 3: Integration (Day 3-4)
- [ ] LearnShell integration
- [ ] Module context passing
- [ ] Competency context passing
- [ ] Mobile responsive design

### Phase 4: Advanced Features (Day 4-5)
- [ ] Role play mode with personas
- [ ] Quiz mode with feedback
- [ ] "Find in course" reference linking
- [ ] Conversation history (last 3 conversations)
- [ ] Error handling and rate limiting

---

## Success Criteria

1. **Accessible**: Coach trigger visible on all `/learn/*` pages
2. **Contextual**: Responses reflect current module/competency context
3. **Responsive**: Works well on mobile (drawer pattern)
4. **Fast**: Streaming responses, < 2s to first token
5. **Helpful**: Learners can get answers without leaving the page
6. **Practice-oriented**: Role play mode enables skill rehearsal

---

## Out of Scope (v1)

- Voice input/output
- Integration with quiz system scoring
- Manager visibility into coaching conversations
- Custom persona creation
- Multi-turn role play with persistence
- Proactive coaching suggestions

---

## Technical Notes

### Claude API Configuration

```typescript
import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// For streaming responses
const stream = await anthropic.messages.stream({
  model: process.env.COACH_MODEL || "claude-sonnet-4-20250514",
  max_tokens: parseInt(process.env.COACH_MAX_TOKENS || "1024"),
  temperature: parseFloat(process.env.COACH_TEMPERATURE || "0.7"),
  system: buildSystemPrompt(context),
  messages: messages,
})
```

### Context Size Management

Module content can be large. Strategy:
1. For small modules (< 8k tokens): Include full content
2. For large modules: Include summary + relevant sections based on user query
3. Use embedding search to find relevant sections if query is specific

### Rate Limiting

- 10 messages per minute per user
- 100 messages per hour per user
- Store limits in Redis or Supabase

---

## References

- [Anthropic Claude API Docs](https://docs.anthropic.com/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- Current aiCoach frontmatter schema in module markdown files
- [LMS-006](lms-006-module-experience.md) for module page architecture
