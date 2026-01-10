# LMS-002: Content Sync (Revised)

**Status:** 📋 READY  
**Priority:** Critical (blocks other briefs)  
**Estimated Time:** 1 day  
**Dependencies:** LMS-001 (types)  

---

## ⚠️ Important Philosophy

**The markdown content is the source of truth.** Supabase stores and serves the content as-is. The UI renders markdown and adapts to whatever structure exists in each file.

**DO NOT:**
- Change the content format to fit a UI schema
- Remove or restructure existing prose
- Force content into rigid frontmatter fields
- Create a "cookie-cutter" format

**DO:**
- Sync existing markdown files to Supabase verbatim
- Store frontmatter as flexible JSONB (whatever fields exist)
- Store markdown body as TEXT
- Let the UI render markdown beautifully
- Support audio transcripts for multimodal learning

---

## Multimodal Learning: Audio Transcripts

Each competency and module can have an **audio transcript** — a script designed for text-to-speech generation that provides a coach-led audio experience.

### Purpose

The AI Coach uses audio to:
- **Demonstrate skills in practice** — Learners hear examples of strong vs weak openings
- **Explain the reasoning** — Coach unpacks why certain approaches work
- **Model the behaviour** — Audio shows what "good" sounds like before learners practice

### Content Structure

Audio transcripts live alongside module files:

```
content/lms/1-market-intelligence/
├── _index.md                          # Competency overview
├── _index.audio.md                    # Competency audio intro (optional)
├── 1.1-dubai-overview.md              # Module content
├── 1.1-dubai-overview.audio.md        # Module audio transcript
├── 1.2-competitive-landscape.md
├── 1.2-competitive-landscape.audio.md
└── ...
```

### Audio Transcript Format

```markdown
---
title: "Prime Capital Positioning - Coach Demo"
moduleSlug: "competitive-landscape"
duration: "8 minutes"
voice: "coach"
type: "demonstration"
---

# Coach Introduction

Welcome back. In this audio session, I'm going to demonstrate how to 
position Prime Capital when you first meet a potential client. 

You'll hear two versions — first, a weak opening that sounds like every 
other agent in Dubai. Then, the Prime Capital approach that sets you apart.

## Weak Opening (What to Avoid)

[DEMO: Weak]

"Hi, I'm calling from Prime Capital. We have some amazing properties 
in Dubai Marina. Are you looking to invest? We have great payment plans 
and the prices are going up fast..."

[COACH EXPLAINS]

Notice what happened there? I led with the company name — meaningless to 
someone who doesn't know us. Then I jumped straight to properties and 
created artificial urgency. This is exactly what every pushy agent does.

The client's mental response? "Here we go again."

## Strong Opening (The Prime Capital Way)

[DEMO: Strong]

"Hi Sarah, this is James. I understand you've been exploring Dubai 
property investment. Before I share anything, I'd love to understand 
what's driving your interest — is this primarily for rental yield, 
a lifestyle option, or something else entirely?"

[COACH EXPLAINS]

Completely different energy. I used their name, identified myself simply, 
acknowledged their situation, and immediately made it about them.

The question at the end is crucial — it signals "I'm here to understand, 
not to sell." This is the antidote to Dubai hustle in action.

## Key Differences

Let me break down what made the second approach work...
```

### Why Separate Files

- **Keeps module content clean** — Main file stays focused on reading
- **Different purpose** — Audio is coach-led demonstration, not reference material
- **Independent updates** — Can refine audio without touching core content
- **Clear file structure** — Easy to identify which modules have audio

---

## Objective

Populate the `learning_modules` and `quiz_questions` Supabase tables from existing `content/lms/` markdown files, **preserving all content exactly as written**.

---

## Current Content Format (Examples)

### Competency Index (`_index.md`)

```yaml
---
title: "Market Intelligence"
slug: "market-intelligence"
competencyNumber: 1
description: "Master Dubai's real estate ecosystem..."
estimatedDuration: "4-5 hours"
moduleCount: 10
learningObjectives:
  - "Articulate Dubai's real estate market size..."
prerequisites: []
aiCoach:
  persona: "Market Intelligence Expert"
  focusAreas: [...]
---

# Market Intelligence

## Competency Overview
(Narrative prose...)

## Why This Matters
(Narrative prose with statistics...)

## Modules in This Competency
(Table listing modules...)
```

### Module Files

```yaml
---
title: "Prime Capital Positioning"
slug: "competitive-landscape"
moduleNumber: "1.2"
competency: "market-intelligence"
type: "skills-script"
description: "Learn to articulate Prime Capital's unique positioning..."
estimatedDuration: "25 minutes"
learningObjectives:
  - "Articulate Prime Capital's brand positioning..."
aiCoach:
  persona: "Brand Communication Expert"
  focusAreas: [...]
  practiceScenarios: [...]
---

# Prime Capital Positioning

## Introduction
(Narrative prose...)

## The Brand Promise
(Rich content with tables, blockquotes, examples...)

## Coach Walkthrough: Positioning Conversations
(Detailed scripts and scenarios...)

## Key Takeaways
(Summary list...)
```

### Quiz Files

```yaml
---
title: "Market Intelligence Quiz 1"
slug: "market-intelligence-1"
quizNumber: 1
competency: "market-intelligence"
relatedModule: "1.1-dubai-overview"
passingScore: 80
questionCount: 5
---

# Market Intelligence Quiz 1

### Question 1
**What was the total value...**
- [ ] A) AED 227 billion
- [x] B) AED 427 billion
...
**Explanation**: ...
```

---

## Database Schema (Flexible)

### `learning_modules` table

```sql
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID REFERENCES competencies(id),
  
  -- From frontmatter
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  module_number TEXT,                    -- "1.2", "0.1", etc.
  type TEXT DEFAULT 'knowledge',         -- knowledge, skills, skills-script
  estimated_duration TEXT,               -- "25 minutes"
  
  -- Full content
  frontmatter JSONB,                     -- Store ALL frontmatter fields
  content TEXT NOT NULL,                 -- Full markdown body (after frontmatter)
  
  -- Metadata
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(competency_id, slug)
);
```

**Key insight:** The `frontmatter` JSONB column stores **all** frontmatter fields from the markdown file, whatever they are. No rigid schema — if a module has `aiCoach.practiceScenarios`, it's in there. If another module has different fields, those are stored too.

### `audio_transcripts` table

```sql
CREATE TABLE audio_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Link to module or competency
  module_id UUID REFERENCES learning_modules(id),
  competency_id UUID REFERENCES competencies(id),
  
  -- Content
  slug TEXT NOT NULL,                    -- matches source file
  title TEXT NOT NULL,
  duration TEXT,                         -- "8 minutes"
  voice TEXT DEFAULT 'coach',            -- voice persona
  type TEXT DEFAULT 'demonstration',     -- demonstration, summary, walkthrough
  
  frontmatter JSONB,                     -- All frontmatter fields
  transcript TEXT NOT NULL,              -- Full transcript markdown
  
  -- Audio file (after TTS generation)
  audio_url TEXT,                        -- URL to generated audio file
  audio_generated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(slug)
);
```

### `quiz_questions` table

```sql
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id TEXT NOT NULL,                 -- "market-intelligence-1"
  competency_slug TEXT NOT NULL,
  related_module TEXT,                   -- "1.1-dubai-overview"
  
  question_number INT NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL,                -- [{text: "...", correct: bool}, ...]
  explanation TEXT,
  
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Also store quiz metadata
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,                   -- "market-intelligence-1"
  competency_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 80,
  question_count INT,
  related_module TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Sync Script

Create `scripts/sync-lms-content.ts`:

```typescript
/**
 * CATALYST - LMS Content Sync Script
 * 
 * Syncs markdown content from content/lms/ to Supabase.
 * Preserves all content exactly as written.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { createClient } from "@supabase/supabase-js"

const CONTENT_DIR = path.join(process.cwd(), "content/lms")

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ParsedModule {
  frontmatter: Record<string, unknown>
  content: string
  slug: string
}

// Parse markdown file preserving everything
function parseMarkdownFile(filePath: string): ParsedModule {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data: frontmatter, content } = matter(raw)
  
  // Get slug from frontmatter or filename
  const filename = path.basename(filePath, ".md")
  const slug = (frontmatter.slug as string) || filename.replace(/^\d+\.\d+-/, "")
  
  return { frontmatter, content, slug }
}

// Sync competency index files
async function syncCompetencies() {
  const folders = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.match(/^\d+-/) && fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
  
  for (const folder of folders) {
    const indexPath = path.join(CONTENT_DIR, folder, "_index.md")
    if (!fs.existsSync(indexPath)) continue
    
    const { frontmatter, content } = parseMarkdownFile(indexPath)
    const order = parseInt(folder.split("-")[0])
    const slug = folder.replace(/^\d+-/, "")
    
    // Upsert competency
    await supabase.from("competencies").upsert({
      slug,
      title: frontmatter.title as string,
      description: frontmatter.description as string,
      order,
      metadata: frontmatter,  // Store all frontmatter
      content,                // Store index content
    }, { onConflict: "slug" })
    
    console.log(`✓ Synced competency: ${slug}`)
  }
}

// Sync module files
async function syncModules() {
  // Get competencies for ID lookup
  const { data: competencies } = await supabase
    .from("competencies")
    .select("id, slug")
  
  const competencyMap = new Map(competencies?.map(c => [c.slug, c.id]))
  
  const folders = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.match(/^\d+-/) && fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
  
  for (const folder of folders) {
    const competencySlug = folder.replace(/^\d+-/, "")
    const competencyId = competencyMap.get(competencySlug)
    
    if (!competencyId) {
      console.warn(`⚠ No competency found for ${competencySlug}`)
      continue
    }
    
    const folderPath = path.join(CONTENT_DIR, folder)
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith(".md") && !f.startsWith("_") && !f.startsWith("AUDIT") && !f.startsWith("README"))
    
    let order = 0
    for (const file of files.sort()) {
      const filePath = path.join(folderPath, file)
      const { frontmatter, content, slug } = parseMarkdownFile(filePath)
      
      await supabase.from("learning_modules").upsert({
        competency_id: competencyId,
        slug,
        title: frontmatter.title as string,
        description: frontmatter.description as string,
        module_number: (frontmatter.moduleNumber || frontmatter.module) as string,
        type: (frontmatter.type || frontmatter.moduleType || "knowledge") as string,
        estimated_duration: frontmatter.estimatedDuration as string,
        frontmatter,  // ALL frontmatter preserved
        content,      // Full markdown body
        display_order: order++,
      }, { onConflict: "competency_id,slug" })
      
      console.log(`  ✓ ${slug}`)
    }
  }
}

// Sync quiz files
async function syncQuizzes() {
  const quizzesDir = path.join(CONTENT_DIR, "quizzes")
  if (!fs.existsSync(quizzesDir)) return
  
  const files = fs.readdirSync(quizzesDir).filter(f => f.endsWith(".md"))
  
  for (const file of files) {
    const filePath = path.join(quizzesDir, file)
    const { frontmatter, content } = parseMarkdownFile(filePath)
    
    const quizId = (frontmatter.slug as string) || file.replace(".md", "")
    
    // Insert quiz metadata
    await supabase.from("quizzes").upsert({
      id: quizId,
      competency_slug: frontmatter.competency as string,
      title: frontmatter.title as string,
      description: frontmatter.description as string,
      passing_score: (frontmatter.passingScore as number) || 80,
      question_count: frontmatter.questionCount as number,
      related_module: frontmatter.relatedModule as string,
    }, { onConflict: "id" })
    
    // Parse questions from markdown
    const questions = parseQuizQuestions(content)
    
    // Delete existing questions for this quiz
    await supabase.from("quiz_questions").delete().eq("quiz_id", quizId)
    
    // Insert questions
    for (const [index, q] of questions.entries()) {
      await supabase.from("quiz_questions").insert({
        quiz_id: quizId,
        competency_slug: frontmatter.competency as string,
        related_module: frontmatter.relatedModule as string,
        question_number: index + 1,
        question_text: q.question,
        options: q.options,
        explanation: q.explanation,
        display_order: index,
      })
    }
    
    console.log(`✓ Synced quiz: ${quizId} (${questions.length} questions)`)
  }
}

// Parse quiz questions from markdown
function parseQuizQuestions(content: string) {
  const questions: Array<{
    question: string
    options: Array<{ text: string; correct: boolean }>
    explanation: string
  }> = []
  
  // Split by ### Question N
  const questionBlocks = content.split(/###\s+Question\s+\d+/i).slice(1)
  
  for (const block of questionBlocks) {
    const lines = block.trim().split("\n")
    
    // First bold text is the question
    const questionMatch = block.match(/\*\*(.+?)\*\*/)
    const question = questionMatch ? questionMatch[1] : ""
    
    // Options are - [ ] or - [x] lines
    const options: Array<{ text: string; correct: boolean }> = []
    for (const line of lines) {
      const optionMatch = line.match(/^-\s+\[([ x])\]\s+(.+)/)
      if (optionMatch) {
        options.push({
          text: optionMatch[2].replace(/^[A-D]\)\s*/, ""),
          correct: optionMatch[1] === "x",
        })
      }
    }
    
    // Explanation follows **Explanation**:
    const explanationMatch = block.match(/\*\*Explanation\*\*:\s*(.+?)(?=---|\n\n###|$)/s)
    const explanation = explanationMatch ? explanationMatch[1].trim() : ""
    
    if (question && options.length > 0) {
      questions.push({ question, options, explanation })
    }
  }
  
  return questions
}

// Main
async function main() {
  console.log("🚀 Starting LMS content sync...\n")
  
  console.log("📁 Syncing competencies...")
  await syncCompetencies()
  
  console.log("\n📄 Syncing modules...")
  await syncModules()
  
  console.log("\n🎧 Syncing audio transcripts...")
  await syncAudioTranscripts()
  
  console.log("\n❓ Syncing quizzes...")
  await syncQuizzes()
  
  console.log("\n✅ Sync complete!")
}

main().catch(console.error)
```

### Audio Transcript Sync Function

Add this function to the sync script:

```typescript
// Sync audio transcript files (*.audio.md)
async function syncAudioTranscripts() {
  // Get modules and competencies for linking
  const { data: modules } = await supabase
    .from("learning_modules")
    .select("id, slug, competency_id")
  
  const { data: competencies } = await supabase
    .from("competencies")
    .select("id, slug")
  
  const moduleMap = new Map(modules?.map(m => [m.slug, m]))
  const competencyMap = new Map(competencies?.map(c => [c.slug, c.id]))
  
  const folders = fs.readdirSync(CONTENT_DIR)
    .filter(f => f.match(/^\d+-/) && fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
  
  for (const folder of folders) {
    const folderPath = path.join(CONTENT_DIR, folder)
    const competencySlug = folder.replace(/^\d+-/, "")
    const competencyId = competencyMap.get(competencySlug)
    
    // Find all .audio.md files
    const audioFiles = fs.readdirSync(folderPath)
      .filter(f => f.endsWith(".audio.md"))
    
    for (const file of audioFiles) {
      const filePath = path.join(folderPath, file)
      const { frontmatter, content } = parseMarkdownFile(filePath)
      
      // Determine if this is for a module or competency
      const baseSlug = file.replace(".audio.md", "")
      const isCompetencyAudio = baseSlug === "_index"
      
      // Get linked module if applicable
      const moduleSlug = frontmatter.moduleSlug as string || 
                         baseSlug.replace(/^\d+\.\d+-/, "")
      const linkedModule = moduleMap.get(moduleSlug)
      
      const slug = isCompetencyAudio 
        ? `${competencySlug}-intro` 
        : `${moduleSlug}-audio`
      
      await supabase.from("audio_transcripts").upsert({
        slug,
        module_id: linkedModule?.id || null,
        competency_id: isCompetencyAudio ? competencyId : linkedModule?.competency_id,
        title: frontmatter.title as string,
        duration: frontmatter.duration as string,
        voice: (frontmatter.voice as string) || "coach",
        type: (frontmatter.type as string) || "demonstration",
        frontmatter,
        transcript: content,
      }, { onConflict: "slug" })
      
      console.log(`  🎧 ${slug}`)
    }
  }
}
```

---

## Usage

```bash
# Install dependencies
pnpm add gray-matter

# Set environment variables
export SUPABASE_URL="your-url"
export SUPABASE_SERVICE_ROLE_KEY="your-key"

# Run sync
npx tsx scripts/sync-lms-content.ts
```

---

## UI Rendering

The UI renders markdown content using a markdown renderer. Components can parse the content to extract structure:

```tsx
// In module page
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function ModuleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

For special UI elements (blockquotes as callouts, tables, etc.), use custom markdown components:

```tsx
<ReactMarkdown
  components={{
    blockquote: ({ children }) => (
      <div className="border-l-4 border-primary pl-4 py-2 my-4 bg-muted/30 italic">
        {children}
      </div>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="min-w-full divide-y">{children}</table>
      </div>
    ),
  }}
>
  {content}
</ReactMarkdown>
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `scripts/sync-lms-content.ts` | CREATE |
| `supabase/migrations/xxx_flexible_modules.sql` | CREATE — Schema with JSONB frontmatter |

---

## Acceptance Criteria

- [ ] All competency index files synced to `competencies` table
- [ ] All module files synced to `learning_modules` table
- [ ] **Content is verbatim** — markdown body unchanged
- [ ] **Frontmatter preserved** — all fields stored in JSONB
- [ ] All quizzes synced with questions parsed
- [ ] Script is idempotent (can run multiple times)
- [ ] No content is modified in the filesystem

---

## What This Approach Preserves

✅ **Narrative prose** — All explanations, examples, stories  
✅ **Custom frontmatter** — Each file's unique metadata fields  
✅ **Markdown structure** — Headings, tables, blockquotes, lists  
✅ **Scripts and scenarios** — Inline in the markdown where they belong  
✅ **Flexibility** — Different modules can have different structures  

The UI adapts to the content, not the other way around.
