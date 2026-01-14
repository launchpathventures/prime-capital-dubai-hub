# LMS-012A: Essentials Schema & Extraction API

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 2-3 days  
**Dependencies:** LMS-001, LMS-002, LMS-006  

---

## Objective

Add an AI-generated "Essentials" layer to each learning module — a pedagogically-structured extraction that provides the 20% of content needed for 80% of client conversations. This enables a dual-mode learning experience without maintaining two separate content files.

---

## Background: The Pedagogical Problem

The current LMS content is comprehensive (~222K words across 124 files) but overwhelming for new agents. The original learning architecture specified 15-25 minute bite-sized modules using the LPAR framework (Learn-Practice-Apply-Reflect), but content has drifted toward comprehensive reference material.

**Solution**: Single source of truth (deep dive markdown) with AI-extracted Essentials that:
- Preserve critical facts, numbers, and scripts
- Include relevant images and audio references
- Follow LPAR structure for active learning
- Can be regenerated when source content changes

---

## Database Schema Changes

### Migration: Add Essentials Columns

```sql
-- LMS-012A: Add essentials columns to learning_modules
-- Stores AI-generated essential content alongside full content

ALTER TABLE learning_modules 
ADD COLUMN IF NOT EXISTS essentials JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_generated_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_source_hash TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS essentials_prompt_version TEXT DEFAULT NULL;

COMMENT ON COLUMN learning_modules.essentials IS 'AI-generated essential content in structured JSON format';
COMMENT ON COLUMN learning_modules.essentials_generated_at IS 'Timestamp when essentials were last generated';
COMMENT ON COLUMN learning_modules.essentials_source_hash IS 'Hash of source content used for generation (detect staleness)';
COMMENT ON COLUMN learning_modules.essentials_prompt_version IS 'Version of prompt used for generation (track quality improvements)';

-- Index for querying modules with/without essentials
CREATE INDEX IF NOT EXISTS idx_learning_modules_essentials_status 
  ON learning_modules ((essentials IS NOT NULL));
```

---

## Essentials JSON Schema

The `essentials` JSONB column stores structured content extracted by AI:

```typescript
/**
 * CATALYST - Essentials Content Schema
 * 
 * Structured format for AI-generated module essentials.
 * Designed for pedagogical effectiveness with LPAR framework.
 */

interface EssentialsContent {
  // ==========================================================================
  // LEARN: Core Summary
  // ==========================================================================
  
  /** 200-word maximum executive summary - the "TL;DR" */
  tldr: string
  
  /** Critical facts with specific numbers that clients ask about */
  keyFacts: Array<{
    fact: string        // "169,083 transactions in 2024"
    context?: string    // "Demonstrates market liquidity"
    source?: string     // "## Market Scale and Performance"
  }>
  
  /** Client-facing scripts extracted verbatim (not summarized) */
  scripts: Array<{
    scenario: string    // "Client asks 'why Prime Capital?'"
    script: string      // The exact words to use
    source?: string     // Section reference in deep dive
  }>
  
  // ==========================================================================
  // VISUAL & AUDIO ASSETS
  // ==========================================================================
  
  /** Images from /public/images/lms/ that are essential for learning */
  images: Array<{
    src: string         // "/images/lms/documents/oqood-certificate.png"
    alt: string         // Extracted from markdown ![alt](...)
    caption: string     // Extracted from markdown ![](...  "caption")
    essential: boolean  // AI + admin determines if required
    context?: string    // Why learners need to see this
  }>
  
  /** Audio references linking to audio_transcripts table */
  audio: Array<{
    slug: string        // "1.2-competitive-landscape-audio"
    title: string       // "Coach Demo: Positioning"
    duration: string    // "8 minutes"
    context: string     // "Listen to hear the positioning in action"
  }>
  
  // ==========================================================================
  // PRACTICE & APPLY: LPAR Framework
  // ==========================================================================
  
  /** Practice scenario for skills application */
  practice: {
    situation: string   // Client/context setup
    task: string        // What learner should do/say
    success: string     // What good looks like
  }
  
  /** Single reflection question for consolidation */
  reflection: string
  
  // ==========================================================================
  // METADATA
  // ==========================================================================
  
  /** ISO timestamp of generation */
  generatedAt: string
  
  /** Hash of source content for staleness detection */
  sourceHash: string
  
  /** Prompt version for tracking quality improvements */
  promptVersion: string
}
```

---

## TypeScript Types

Add to `lib/learning-types.ts`:

```typescript
// =============================================================================
// ESSENTIALS TYPES
// =============================================================================

export interface EssentialsFact {
  fact: string
  context?: string
  source?: string
}

export interface EssentialsScript {
  scenario: string
  script: string
  source?: string
}

export interface EssentialsImage {
  src: string
  alt: string
  caption: string
  essential: boolean
  context?: string
}

export interface EssentialsAudio {
  slug: string
  title: string
  duration: string
  context: string
}

export interface EssentialsPractice {
  situation: string
  task: string
  success: string
}

export interface EssentialsContent {
  tldr: string
  keyFacts: EssentialsFact[]
  scripts: EssentialsScript[]
  images: EssentialsImage[]
  audio: EssentialsAudio[]
  practice: EssentialsPractice
  reflection: string
  generatedAt: string
  sourceHash: string
  promptVersion: string
}
```

---

## API Route: Generate Essentials

Create `/app/api/admin/generate-essentials/route.ts`:

```typescript
/**
 * CATALYST - Generate Essentials API
 * 
 * POST /api/admin/generate-essentials
 * 
 * Generates AI-extracted essentials for a learning module.
 * Requires admin authentication.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import crypto from "crypto"

const PROMPT_VERSION = "1.0"

export async function POST(request: NextRequest) {
  // 1. Verify admin auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // TODO: Add admin role check
  
  // 2. Get module ID from request
  const { moduleId, requiredFacts } = await request.json()
  
  if (!moduleId) {
    return NextResponse.json({ error: "moduleId required" }, { status: 400 })
  }
  
  // 3. Fetch module with full context
  const { data: module, error: moduleError } = await supabase
    .from("learning_modules")
    .select(`
      *,
      competencies (
        id,
        slug,
        name,
        description
      )
    `)
    .eq("id", moduleId)
    .single()
  
  if (moduleError || !module) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 })
  }
  
  // 4. Fetch related audio transcripts
  const { data: audioTranscripts } = await supabase
    .from("audio_transcripts")
    .select("slug, title, duration, type")
    .eq("module_id", moduleId)
  
  // 5. Generate essentials via Claude
  const essentials = await generateEssentials({
    module,
    competency: module.competencies,
    audioTranscripts: audioTranscripts || [],
    requiredFacts: requiredFacts || [],
  })
  
  // 6. Calculate source hash
  const sourceHash = crypto
    .createHash("md5")
    .update(module.content || "")
    .digest("hex")
  
  // 7. Store essentials
  const { error: updateError } = await supabase
    .from("learning_modules")
    .update({
      essentials,
      essentials_generated_at: new Date().toISOString(),
      essentials_source_hash: sourceHash,
      essentials_prompt_version: PROMPT_VERSION,
    })
    .eq("id", moduleId)
  
  if (updateError) {
    return NextResponse.json({ error: "Failed to save essentials" }, { status: 500 })
  }
  
  return NextResponse.json({ 
    success: true, 
    essentials,
    sourceHash,
    promptVersion: PROMPT_VERSION,
  })
}
```

---

## AI Prompt Engineering

The prompt must include full pedagogical context to ensure quality extraction:

```typescript
/**
 * Build the prompt for essentials generation.
 * Includes all context needed for pedagogically-sound extraction.
 */

interface GenerateEssentialsParams {
  module: LearningModule & { competencies: Competency }
  competency: Competency
  audioTranscripts: Array<{ slug: string; title: string; duration: string; type: string }>
  requiredFacts: string[]
}

async function generateEssentials(params: GenerateEssentialsParams): Promise<EssentialsContent> {
  const { module, competency, audioTranscripts, requiredFacts } = params
  
  const anthropic = new Anthropic()
  
  const systemPrompt = `You are an expert learning designer creating "Essentials" summaries for real estate training modules.

Your task is to extract a pedagogically-structured summary that gives new agents the 20% of content they need for 80% of client conversations.

OUTPUT FORMAT: Valid JSON matching the EssentialsContent schema.

CRITICAL RULES:
1. NEVER lose specific numbers, statistics, or thresholds — clients ask about these
2. EXTRACT scripts verbatim — these are the exact words agents should use
3. PRESERVE all document images — agents must recognize official paperwork
4. Keep tldr under 200 words — ruthlessly cut "nice to know" content
5. Focus on actionable knowledge — what can the agent DO with this?
6. Reference audio transcripts when they demonstrate the skill being taught`

  const userPrompt = `# GENERATION CONTEXT

## 1. Learner Persona
Name: Nadia (New Agent)
Background: Sales experience, new to Dubai real estate
Goals:
  - Get productive quickly to start earning
  - Avoid embarrassment in early client conversations
  - Know what to say when clients ask common questions
Constraints: 2-3 hours/day, mobile-first consumption

## 2. Module Metadata
Title: ${module.title}
Competency: ${competency.name}
Type: ${module.type} (knowledge | skills | skills-script)
Estimated Duration: ${module.estimated_duration || "25 minutes"}

## 3. Learning Objectives (MUST address ALL in essentials)
${(module.frontmatter?.learningObjectives as string[] || []).map(obj => `- ${obj}`).join('\n')}

## 4. AI Coach Context
${module.frontmatter?.aiCoach ? JSON.stringify(module.frontmatter.aiCoach, null, 2) : 'No AI coach configured'}

## 5. Required Facts (admin-specified, MUST include)
${requiredFacts.length > 0 ? requiredFacts.map(f => `- ${f}`).join('\n') : 'None specified'}

## 6. Available Audio Transcripts
${audioTranscripts.length > 0 
  ? audioTranscripts.map(a => `- ${a.slug}: "${a.title}" (${a.duration}, ${a.type})`).join('\n')
  : 'No audio available'}

## 7. Image Extraction Rules
Scan for markdown images: ![alt text](/images/path/file.png "caption")
For each image:
- Extract src, alt, caption
- Mark essential=true if: document agents must recognize, or referenced by learning objective
- Add context explaining why learners need this image
CRITICAL: Never lose document images (title deeds, certificates, forms)

## 8. Full Module Content
${module.content}

---

Generate the EssentialsContent JSON now. Ensure all learning objectives are addressed.`

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      { role: "user", content: userPrompt }
    ],
    system: systemPrompt,
  })
  
  // Parse JSON from response
  const content = response.content[0]
  if (content.type !== "text") {
    throw new Error("Unexpected response type")
  }
  
  // Extract JSON from response (may be wrapped in markdown code block)
  const jsonMatch = content.text.match(/```json\n?([\s\S]*?)\n?```/) || 
                    content.text.match(/\{[\s\S]*\}/)
  
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from response")
  }
  
  const jsonStr = jsonMatch[1] || jsonMatch[0]
  const essentials = JSON.parse(jsonStr) as EssentialsContent
  
  // Add metadata
  essentials.generatedAt = new Date().toISOString()
  essentials.promptVersion = PROMPT_VERSION
  
  return essentials
}
```

---

## Content Hash Utility

For detecting when source content has changed:

```typescript
// lib/lms/essentials.ts

import crypto from "crypto"

/**
 * Generate hash of module content for staleness detection.
 */
export function hashContent(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex")
}

/**
 * Check if essentials are stale (source content changed).
 */
export function isEssentialsStale(
  module: { content: string; essentials_source_hash: string | null }
): boolean {
  if (!module.essentials_source_hash) return true
  return hashContent(module.content) !== module.essentials_source_hash
}
```

---

## Data Access Functions

Add to `lib/learning.ts`:

```typescript
/**
 * Get module with essentials status.
 */
export async function getModuleWithEssentials(
  competencySlug: string,
  moduleSlug: string
): Promise<LearningModule | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("learning_modules")
    .select(`
      *,
      competencies!inner (slug)
    `)
    .eq("competencies.slug", competencySlug)
    .eq("slug", moduleSlug)
    .single()
  
  if (error || !data) return null
  
  return {
    ...data,
    essentialsAvailable: data.essentials !== null,
    essentialsStale: data.essentials_source_hash 
      ? hashContent(data.content) !== data.essentials_source_hash
      : false,
  }
}
```

---

## File Structure

```
lib/
├── lms/
│   ├── essentials.ts          # Hash utilities, staleness check
│   └── index.ts               # Export essentials functions
├── learning-types.ts          # Add EssentialsContent types
└── learning.ts                # Add getModuleWithEssentials

app/
└── api/
    └── admin/
        └── generate-essentials/
            └── route.ts       # AI generation endpoint

supabase/
└── migrations/
    └── 20260113_essentials_schema.sql
```

---

## Acceptance Criteria

- [ ] Migration adds `essentials`, `essentials_generated_at`, `essentials_source_hash`, `essentials_prompt_version` columns
- [ ] TypeScript types defined for `EssentialsContent` and sub-types
- [ ] API route `/api/admin/generate-essentials` accepts `moduleId` and optional `requiredFacts`
- [ ] AI prompt includes full pedagogical context (persona, objectives, coach config)
- [ ] Generated essentials include: tldr, keyFacts, scripts, images, audio, practice, reflection
- [ ] Images extracted from markdown with `![alt](src "caption")` pattern
- [ ] Audio transcripts linked by slug with context
- [ ] Source hash calculated and stored for staleness detection
- [ ] `isEssentialsStale()` utility function works correctly

---

## Testing

```bash
# 1. Run migration
pnpm supabase db push

# 2. Test API (requires auth)
curl -X POST http://localhost:3000/api/admin/generate-essentials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"moduleId": "uuid-here"}'

# 3. Verify essentials stored
pnpm supabase db query "SELECT slug, essentials IS NOT NULL as has_essentials FROM learning_modules LIMIT 5"
```

---

## Next Brief

**LMS-012B: Admin Generation Interface** — UI for triggering generation, previewing results, and managing required facts.
