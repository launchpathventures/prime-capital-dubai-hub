# LMS-029: AI Coach Context Enhancement

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 4-6 hours  
**Dependencies:** LMS-013 (AI Coach Infrastructure)  
**Agent-Safe:** ✅ Yes — well-defined inputs/outputs

---

## Objective

Fix AI Coach hallucination by providing comprehensive curriculum context at all levels. Currently the coach hallucinates when asked about curriculum topics because it lacks access to the full course content.

---

## Background

### Current State

The AI Coach receives different levels of context depending on where the user is:

| Level | Current Context | Problem |
|-------|----------------|---------|
| **Course** | Generic prompt only | No curriculum data → hallucinates |
| **Competency** | Module titles/descriptions only | Can't answer content questions |
| **Module** | Single module content (12k chars max) | Works well for that module only |

### The Problem

When a user asks "What are the key RERA regulations I need to know?" at the course level, the coach:
1. Has no access to curriculum content
2. Can't cite specific modules
3. Makes up information that may be inaccurate

### The Solution

1. **Curriculum Index:** Build a structured summary of all competencies and modules
2. **Smart Context Loading:** Load relevant module content based on the question
3. **Page-Specific Context:** Always include the current page's content when coach is opened

---

## Scope

### In Scope
- Build curriculum index/summary for course-level context
- Include all module summaries in competency-level context
- Pass page-specific context (essentials, scenarios) to coach
- Add curriculum search capability to find relevant modules

### Out of Scope
- RAG/vector embeddings (future enhancement)
- Conversation persistence
- Manager analytics on coach usage

---

## Technical Design

### 1. Curriculum Index Generator

Create a function that generates a structured curriculum summary for the coach.

**File:** `lib/lms/curriculum-index.ts`

```typescript
/**
 * CATALYST - Curriculum Index for AI Coach
 * 
 * Generates a structured summary of the entire curriculum
 * for use in AI Coach system prompts.
 */

import { createClient } from "@/lib/supabase/server"

interface ModuleSummary {
  number: string           // e.g., "0.1"
  title: string
  slug: string
  competencySlug: string
  keyTopics: string[]      // Extracted from learning objectives or essentials
  estimatedDuration: number
}

interface CompetencySummary {
  number: number
  name: string
  slug: string
  description: string
  modules: ModuleSummary[]
}

interface CurriculumIndex {
  totalModules: number
  totalCompetencies: number
  estimatedTotalHours: number
  competencies: CompetencySummary[]
  /** Pre-formatted string for AI prompt */
  promptText: string
}

/**
 * Generate a curriculum index for the AI Coach.
 * Caches the result for 1 hour since curriculum doesn't change often.
 */
let cachedIndex: CurriculumIndex | null = null
let cacheTime: number = 0
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

export async function getCurriculumIndex(): Promise<CurriculumIndex> {
  // Return cached if fresh
  if (cachedIndex && Date.now() - cacheTime < CACHE_TTL) {
    return cachedIndex
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("competencies")
    .select(`
      id,
      slug,
      name,
      description,
      display_order,
      learning_modules (
        id,
        slug,
        title,
        display_order,
        duration_minutes,
        essentials
      )
    `)
    .order("display_order", { ascending: true })

  if (error) throw error

  const competencies: CompetencySummary[] = data.map((comp) => {
    const modules = (comp.learning_modules || [])
      .sort((a, b) => a.display_order - b.display_order)
      .map((mod, idx) => ({
        number: `${comp.display_order}.${idx + 1}`,
        title: mod.title,
        slug: mod.slug,
        competencySlug: comp.slug,
        keyTopics: extractKeyTopics(mod.essentials),
        estimatedDuration: mod.duration_minutes || 25,
      }))

    return {
      number: comp.display_order,
      name: comp.name,
      slug: comp.slug,
      description: comp.description || "",
      modules,
    }
  })

  const totalModules = competencies.reduce((sum, c) => sum + c.modules.length, 0)
  const totalMinutes = competencies.reduce(
    (sum, c) => sum + c.modules.reduce((s, m) => s + m.estimatedDuration, 0),
    0
  )

  const index: CurriculumIndex = {
    totalModules,
    totalCompetencies: competencies.length,
    estimatedTotalHours: Math.round(totalMinutes / 60),
    competencies,
    promptText: formatForPrompt(competencies),
  }

  // Cache it
  cachedIndex = index
  cacheTime = Date.now()

  return index
}

/**
 * Extract key topics from module essentials.
 */
function extractKeyTopics(essentials: unknown): string[] {
  if (!essentials || typeof essentials !== "object") return []
  
  const e = essentials as Record<string, unknown>
  const topics: string[] = []
  
  // Extract from key facts
  if (Array.isArray(e.keyFacts)) {
    topics.push(...e.keyFacts.slice(0, 3).map((f: { title: string }) => f.title))
  }
  
  // Extract from scripts
  if (Array.isArray(e.scripts)) {
    topics.push(...e.scripts.slice(0, 2).map((s: { title: string }) => s.title))
  }
  
  return topics.slice(0, 5) // Max 5 topics per module
}

/**
 * Format the curriculum index for use in AI prompt.
 */
function formatForPrompt(competencies: CompetencySummary[]): string {
  const lines: string[] = [
    "CURRICULUM STRUCTURE:",
    "",
  ]

  for (const comp of competencies) {
    lines.push(`## Competency ${comp.number}: ${comp.name}`)
    lines.push(`${comp.description}`)
    lines.push("")
    
    for (const mod of comp.modules) {
      const topicsStr = mod.keyTopics.length > 0 
        ? ` — Topics: ${mod.keyTopics.join(", ")}`
        : ""
      lines.push(`  - [Module ${mod.number}: ${mod.title}](/learn/${mod.competencySlug}/${mod.slug})${topicsStr}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

/**
 * Find modules relevant to a user's question.
 * Simple keyword matching for now; upgrade to embeddings later.
 */
export function findRelevantModules(
  question: string,
  index: CurriculumIndex,
  limit: number = 5
): ModuleSummary[] {
  const lowerQ = question.toLowerCase()
  const keywords = lowerQ.split(/\s+/).filter(w => w.length > 3)
  
  const scored: Array<{ module: ModuleSummary; score: number }> = []
  
  for (const comp of index.competencies) {
    for (const mod of comp.modules) {
      let score = 0
      
      // Check title
      const lowerTitle = mod.title.toLowerCase()
      for (const kw of keywords) {
        if (lowerTitle.includes(kw)) score += 3
      }
      
      // Check topics
      for (const topic of mod.keyTopics) {
        const lowerTopic = topic.toLowerCase()
        for (const kw of keywords) {
          if (lowerTopic.includes(kw)) score += 2
        }
      }
      
      // Check competency name
      const lowerComp = comp.name.toLowerCase()
      for (const kw of keywords) {
        if (lowerComp.includes(kw)) score += 1
      }
      
      if (score > 0) {
        scored.push({ module: mod, score })
      }
    }
  }
  
  // Sort by score and return top matches
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.module)
}
```

### 2. Enhanced System Prompt Builder

Update the chat route to include curriculum context at all levels.

**File:** `app/api/coach/chat/route.ts`

```typescript
// Add import
import { getCurriculumIndex, findRelevantModules } from "@/lib/lms/curriculum-index"

// Update buildSystemPrompt function
async function buildSystemPrompt(
  context: ChatRequest["context"],
  moduleContent?: string,
  competencyInfo?: CompetencyInfo,
  userQuestion?: string  // NEW: Pass first user message for context
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

  // MODULE LEVEL - Deepest context
  if (context.level === "module" && moduleContent) {
    return `${base}

CURRENT CONTEXT: Module Level
You are an expert on this specific module. Answer questions using the content below.

MODULE CONTENT:
${moduleContent.slice(0, 15000)}

BEHAVIOR:
- Answer questions about this module in depth
- Quote or paraphrase the content when relevant
- Use the exact markdown link format: [Module Title](/learn/competency/module)
- If asked about other topics, briefly answer and suggest the relevant module`
  }

  // COMPETENCY LEVEL - Medium context
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

  // COURSE LEVEL - Full curriculum index
  const curriculumIndex = await getCurriculumIndex()
  
  // Find potentially relevant modules based on user's question
  let relevantModulesText = ""
  if (userQuestion) {
    const relevant = findRelevantModules(userQuestion, curriculumIndex, 5)
    if (relevant.length > 0) {
      relevantModulesText = `

POTENTIALLY RELEVANT MODULES FOR THIS QUESTION:
${relevant.map(m => `- [Module ${m.number}: ${m.title}](/learn/${m.competencySlug}/${m.slug}) — Topics: ${m.keyTopics.join(", ")}`).join("\n")}`
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
- Use the POTENTIALLY RELEVANT MODULES section to guide your answer
- Give brief topic overviews, then point to specific modules with links
- If a question spans multiple modules, list all relevant ones`
}
```

### 3. Page-Specific Context Injection

Update the coach provider to accept and pass page-specific content.

**Update CoachContext type in:** `components/lms/coach/coach-provider.tsx`

```typescript
export interface CoachContext {
  level: "course" | "competency" | "module"
  competencySlug?: string
  moduleSlug?: string
  competencyName?: string
  moduleName?: string
  /** Module content for deeper context */
  moduleContent?: string
  /** Page-specific context (essentials, scenario, etc.) */
  pageContext?: {
    type: "module" | "scenario" | "quiz" | "general"
    title: string
    content: string  // Summarized page content
    url: string      // Current page URL
  }
}
```

**Update API to use pageContext:**

In `app/api/coach/chat/route.ts`, add page context to module-level prompts:

```typescript
if (context.level === "module" && moduleContent) {
  let pageContextSection = ""
  if (context.pageContext) {
    pageContextSection = `

CURRENT PAGE: ${context.pageContext.title}
PAGE URL: ${context.pageContext.url}
PAGE CONTENT SUMMARY:
${context.pageContext.content.slice(0, 3000)}
`
  }

  return `${base}

CURRENT CONTEXT: Module Level
You are an expert on this specific module. Answer questions using the content below.
${pageContextSection}
MODULE CONTENT:
${moduleContent.slice(0, 12000)}

BEHAVIOR:
- Answer questions about this module in depth
- Reference the current page content when relevant
- Quote or paraphrase the content when relevant
- If asked about other topics, briefly answer and suggest the relevant module`
}
```

### 4. Update Module Page to Pass Context

**File:** `app/learn/[competency]/[module]/page.tsx`

The page already passes `moduleContent` to the shell. Ensure essentials are also included:

```typescript
// In the return statement, update coachContext:
coachContext={{ 
  level: "module",
  competencySlug,
  competencyName: currentCompetency.name,
  moduleSlug,
  moduleName: currentModule.title,
  moduleContent: currentModule.content || undefined,
  pageContext: {
    type: "module",
    title: currentModule.title,
    content: mode === "essentials" && currentModule.essentials 
      ? JSON.stringify(currentModule.essentials)
      : currentModule.content || "",
    url: `/learn/${competencySlug}/${moduleSlug}`,
  }
}}
```

---

## Implementation Checklist

### Phase 1: Curriculum Index (2 hours)
- [ ] Create `lib/lms/curriculum-index.ts` with caching
- [ ] Implement `getCurriculumIndex()` function
- [ ] Implement `findRelevantModules()` for keyword matching
- [ ] Test index generation with existing data

### Phase 2: Update Chat API (2 hours)
- [ ] Update `buildSystemPrompt` to be async
- [ ] Add curriculum index to course-level prompts
- [ ] Add relevant module detection based on user question
- [ ] Test with various curriculum questions

### Phase 3: Page Context (1 hour)
- [ ] Update `CoachContext` type with `pageContext`
- [ ] Update module page to pass essentials/content as page context
- [ ] Update scenario pages to pass scenario context
- [ ] Test coach responses reference current page

### Phase 4: Testing (1 hour)
- [ ] Test: "What are RERA regulations?" at course level
- [ ] Test: "How do I handle price objections?" at course level
- [ ] Test: Questions about current module content
- [ ] Verify no hallucination on known topics

---

## Success Criteria

1. ✅ Course-level coach knows all competencies and modules
2. ✅ Coach can suggest relevant modules for any curriculum topic
3. ✅ Coach uses markdown links that are clickable
4. ✅ Module-level coach includes current page context
5. ✅ No hallucination on topics covered in the curriculum
6. ✅ Off-topic questions are politely declined

---

## Future Enhancements (v2)

- [ ] Vector embeddings for semantic search
- [ ] Load full module content dynamically based on question
- [ ] Cross-module context for related topics
- [ ] Usage analytics to improve relevance scoring
