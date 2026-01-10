# LMS-006: Module Learning Experience

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 2-3 days  
**Dependencies:** LMS-001, LMS-002, LMS-003  

---

## Objective

Build the full module page at `/learn/[competency]/[module]` with a multimodal learning experience:

1. **Read** — Beautifully rendered markdown content
2. **Listen** — AI Coach audio demonstrations (when available)
3. **Practice** — Interactive scenarios with AI clients

The UI adapts to whatever content exists — no forced structure.

---

## Key Principle: Content-Driven Rendering

The module page renders **whatever is in the markdown file**. Different modules have different structures, and that's fine. The UI uses:

- **Custom markdown renderer** — Transforms standard markdown into rich UI components
- **Frontmatter fields** — Renders dedicated components for `learningObjectives`, `aiCoach`, etc.
- **Audio transcripts** — Shows audio player when `.audio.md` file exists

---

## Page Structure Wireframe

```
┌────────────────┬──────────────────────────────────────────────┐
│   Sidebar      │  ← BACK TO COMPETENCY OVERVIEW               │
│                │                                              │
│                │  MODULE 1.2                                  │
│                │  Prime Capital Positioning                   │
│                │  Learn to articulate Prime Capital's...      │
│                │                                              │
│                │  ┌────────────────────────────────────────┐  │
│                │  │ 🎧 COACH DEMONSTRATION                 │  │
│                │  │                                        │  │
│                │  │ Listen to the AI Coach demonstrate     │  │
│                │  │ strong vs weak positioning approaches. │  │
│                │  │                                        │  │
│                │  │  ▶ ━━━━━━━━━━━━━━━━━━━━━━  8:24       │  │
│                │  │                                        │  │
│                │  │  [View Transcript]                     │  │
│                │  └────────────────────────────────────────┘  │
│                │                                              │
│                │  🎯 Learning Objectives                      │
│                │  ✓ Articulate Prime Capital's positioning   │
│                │  ✓ Differentiate advisory from transact...  │
│                │  ✓ Handle common questions about agency...  │
│                │                                              │
│                │  ─────────────────────────────────────────   │
│                │                                              │
│                │  [Rendered Markdown Content]                 │
│                │  - Headings → Section dividers              │
│                │  - Blockquotes → Script callouts            │
│                │  - Tables → Comparison cards                │
│                │  - ### Scenario → Practice cards            │
│                │                                              │
│                │  ─────────────────────────────────────────   │
│                │                                              │
│                │  📚 Resources (if frontmatter.resources)    │
│                │                                              │
│                │  ┌────────────────────────────────────────┐  │
│                │  │     [Continue to Knowledge Check →]    │  │
│                │  └────────────────────────────────────────┘  │
└────────────────┴──────────────────────────────────────────────┘
```

---

## Audio Coach Demonstration Wireframe

When a module has an associated `.audio.md` file, display the coach demonstration player:

```
┌────────────────────────────────────────────────────────────────┐
│  🎧 COACH DEMONSTRATION                                        │
│                                                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Prime Capital Positioning - Coach Demo                 │   │
│  │  8 minutes • Skill demonstration                        │   │
│  │                                                         │   │
│  │  Listen as the coach demonstrates strong vs weak       │   │
│  │  positioning approaches, then explains why each works  │   │
│  │  (or doesn't).                                         │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  ▶  │  ━━━━━━━━━●━━━━━━━━━━━━━  3:42 / 8:24    │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  📜 Show Transcript                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  When expanded (Show Transcript):                             │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  # Coach Introduction                                   │   │
│  │                                                         │   │
│  │  Welcome back. In this session, I'm going to           │   │
│  │  demonstrate how to position Prime Capital...           │   │
│  │                                                         │   │
│  │  ## Weak Opening (What to Avoid)                        │   │
│  │                                                         │   │
│  │  [DEMO: Weak]                         ▶ Jump to 1:24   │   │
│  │  "Hi, I'm calling from Prime Capital..."               │   │
│  │                                                         │   │
│  │  [COACH EXPLAINS]                     ▶ Jump to 2:15   │   │
│  │  Notice what happened there? I led with...             │   │
│  └────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## Deliverables

### 1. Markdown Renderer Component

Create `components/lms/markdown-renderer.tsx` — transforms markdown into rich UI:

```tsx
/**
 * CATALYST - LMS Markdown Renderer
 * 
 * Renders markdown content with enriched visual components.
 * The source content stays as markdown - only rendering is enhanced.
 */

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("lms-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Blockquotes → Script callouts
          blockquote: BlockquoteComponent,
          
          // Tables → Styled comparison tables  
          table: TableComponent,
          th: TableHeaderCell,
          
          // Headings → Section dividers with scenario detection
          h2: H2Component,
          h3: H3Component,
          
          // Lists → Styled with icons
          ol: OrderedListComponent,
          li: ListItemComponent,
          
          // Paragraphs with pattern detection (Context:, Approach:)
          p: ParagraphComponent,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

// Blockquote → Script/Quote Card
function BlockquoteComponent({ children }: { children: React.ReactNode }) {
  return (
    <Card className="my-6 border-l-4 border-l-primary bg-muted/30">
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-3">
          <span className="text-2xl flex-shrink-0">💬</span>
          <div className="flex-1 italic text-foreground/90">
            {children}
          </div>
        </div>
        <Text size="xs" className="text-right text-muted-foreground mt-2">
          — Example Script
        </Text>
      </CardContent>
    </Card>
  )
}

// Tables → Rich comparison tables with ✓/✗ icons
function TableComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

function TableHeaderCell({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  const isNegative = text?.toLowerCase().includes("typical") || 
                     text?.toLowerCase().includes("instead of")
  const isPositive = text?.toLowerCase().includes("prime capital") || 
                     text?.toLowerCase().includes("we")
  
  return (
    <th className="px-4 py-3 text-left font-semibold bg-muted/50">
      <span className="flex items-center gap-2">
        {isNegative && <span className="text-red-500">✗</span>}
        {isPositive && <span className="text-green-500">✓</span>}
        {children}
      </span>
    </th>
  )
}

// H3 with scenario detection
function H3Component({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Detect scenario patterns like "Scenario 1:" or "### Scenario:"
  if (text?.toLowerCase().startsWith("scenario")) {
    return (
      <div className="mt-8 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-2">
          🎭 Practice Scenario
        </div>
        <h3 className="text-xl font-semibold">
          {text.replace(/^scenario\s*\d*:\s*/i, "")}
        </h3>
      </div>
    )
  }
  
  return <h3 className="text-xl font-semibold mt-8 mb-4">{children}</h3>
}

// Pattern-detected paragraphs
function ParagraphComponent({ children }: { children: React.ReactNode }) {
  const text = extractText(children)
  
  // Context: pattern → blue callout
  if (text?.match(/^\*?\*?Context\*?\*?:/i)) {
    return (
      <div className="my-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Text size="xs" className="uppercase tracking-wider text-blue-600 font-semibold mb-1">
          Context
        </Text>
        <p className="text-blue-900">{text.replace(/^\*?\*?Context\*?\*?:\s*/i, "")}</p>
      </div>
    )
  }
  
  // Approach: pattern → green callout
  if (text?.match(/^\*?\*?Approach\*?\*?:/i)) {
    return (
      <div className="my-4 p-4 rounded-lg bg-green-50 border border-green-200">
        <Text size="xs" className="uppercase tracking-wider text-green-600 font-semibold mb-1">
          Approach
        </Text>
        <p className="text-green-900">{text.replace(/^\*?\*?Approach\*?\*?:\s*/i, "")}</p>
      </div>
    )
  }
  
  return <p className="my-4 leading-relaxed">{children}</p>
}

// Utility
function extractText(children: React.ReactNode): string | null {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(extractText).filter(Boolean).join("")
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as any).props.children)
  }
  return null
}
```

### 2. Audio Coach Player Component

Create `components/lms/audio-coach-player.tsx`:

```tsx
/**
 * CATALYST - Audio Coach Player
 * 
 * Plays AI coach demonstration audio with transcript support.
 * Shows "demonstrate then explain" format with transcript toggle.
 */

"use client"

import { useState, useRef } from "react"
import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { 
  PlayIcon, 
  PauseIcon, 
  Volume2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeadphonesIcon,
} from "lucide-react"
import { MarkdownRenderer } from "./markdown-renderer"

interface AudioCoachPlayerProps {
  title: string
  duration: string
  type: string
  transcript: string
  audioUrl?: string | null
}

export function AudioCoachPlayer({ 
  title, 
  duration, 
  type,
  transcript,
  audioUrl,
}: AudioCoachPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [showTranscript, setShowTranscript] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  
  const totalSeconds = parseDuration(duration)
  
  const togglePlay = () => {
    if (!audioRef.current) return
    
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }
  
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }
  
  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
      <CardContent className="p-6">
        <Stack gap="md">
          {/* Header */}
          <Row align="center" gap="md">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <HeadphonesIcon className="h-6 w-6 text-purple-600" />
            </div>
            <Stack gap="none" className="flex-1">
              <Text size="xs" className="uppercase tracking-wider text-purple-600 font-semibold">
                Coach Demonstration
              </Text>
              <Title size="h4">{title}</Title>
              <Text size="sm" className="text-muted-foreground">
                {duration} • {type}
              </Text>
            </Stack>
          </Row>
          
          {/* Description */}
          <Text className="text-muted-foreground">
            Listen as the coach demonstrates strong vs weak approaches, 
            then explains the reasoning behind each technique.
          </Text>
          
          {/* Audio Player */}
          {audioUrl ? (
            <div className="bg-white/50 rounded-lg p-4">
              <audio 
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />
              
              <Row align="center" gap="md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-10 w-10 rounded-full bg-purple-600 text-white hover:bg-purple-700"
                >
                  {isPlaying ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
                
                <div className="flex-1">
                  <Slider
                    value={[currentTime]}
                    max={totalSeconds}
                    step={1}
                    onValueChange={handleSeek}
                    className="cursor-pointer"
                  />
                </div>
                
                <Text size="sm" className="text-muted-foreground w-24 text-right">
                  {formatTime(currentTime)} / {duration}
                </Text>
                
                <Volume2Icon className="h-4 w-4 text-muted-foreground" />
              </Row>
            </div>
          ) : (
            <div className="bg-white/50 rounded-lg p-4 text-center">
              <Text className="text-muted-foreground">
                🔊 Audio coming soon — view transcript below
              </Text>
            </div>
          )}
          
          {/* Transcript Toggle */}
          <Button
            variant="ghost"
            onClick={() => setShowTranscript(!showTranscript)}
            className="gap-2"
          >
            📜 {showTranscript ? "Hide" : "Show"} Transcript
            {showTranscript ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
          
          {/* Transcript Content */}
          {showTranscript && (
            <div className="bg-white rounded-lg p-4 border max-h-96 overflow-y-auto">
              <MarkdownRenderer 
                content={transcript} 
                className="prose-sm"
              />
            </div>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)\s*(?:min|minute)/i)
  return match ? parseInt(match[1]) * 60 : 300
}
```

### 3. Learning Objectives Component

Create `components/lms/learning-objectives.tsx`:

```tsx
/**
 * CATALYST - Learning Objectives
 */

import { Stack, Text } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2Icon } from "lucide-react"

interface LearningObjectivesProps {
  objectives: string[]
}

export function LearningObjectives({ objectives }: LearningObjectivesProps) {
  if (!objectives || objectives.length === 0) return null
  
  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardContent className="p-6">
        <Text size="xs" className="uppercase tracking-wider text-green-600 font-semibold mb-4 flex items-center gap-2">
          🎯 Learning Objectives
        </Text>
        <ul className="space-y-2">
          {objectives.map((obj, i) => (
            <li key={i} className="flex gap-3 items-start">
              <CheckCircle2Icon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
```

### 4. Resource List Component

Create `components/lms/resource-list.tsx`:

```tsx
/**
 * CATALYST - Resource List
 */

import { Stack, Row, Text, Title } from "@/components/core"
import { Card, CardContent } from "@/components/ui/card"
import { FileTextIcon, VideoIcon, ExternalLinkIcon, ChevronRightIcon } from "lucide-react"

interface Resource {
  title: string
  type: string
  url?: string
}

interface ResourceListProps {
  resources: Resource[]
}

export function ResourceList({ resources }: ResourceListProps) {
  if (!resources || resources.length === 0) return null
  
  return (
    <Stack gap="md">
      <Title size="h3" className="flex items-center gap-2">
        📚 Resources
      </Title>
      
      <Stack gap="xs">
        {resources.map((resource, i) => (
          <Card key={i} className="border hover:border-foreground/20 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <Row align="center" justify="between">
                <Row gap="sm" align="center">
                  <ResourceIcon type={resource.type} />
                  <Text size="sm">{resource.title}</Text>
                </Row>
                <ChevronRightIcon className="h-4 w-4 text-muted-foreground" />
              </Row>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}

function ResourceIcon({ type }: { type: string }) {
  switch (type) {
    case "video":
      return <VideoIcon className="h-4 w-4 text-muted-foreground" />
    case "link":
      return <ExternalLinkIcon className="h-4 w-4 text-muted-foreground" />
    default:
      return <FileTextIcon className="h-4 w-4 text-muted-foreground" />
  }
}
```

### 5. Knowledge Check CTA

Create `components/lms/knowledge-check-cta.tsx`:

```tsx
/**
 * CATALYST - Knowledge Check CTA
 */

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"

interface KnowledgeCheckCTAProps {
  quizId: string
}

export function KnowledgeCheckCTA({ quizId }: KnowledgeCheckCTAProps) {
  return (
    <div className="pt-6 border-t">
      <Button asChild size="lg" className="w-full gap-2">
        <Link href={`/learn/quiz/${quizId}`}>
          Continue to Knowledge Check
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  )
}
```

### 6. Module Page

Update `app/learn/[competency]/[module]/page.tsx`:

```tsx
/**
 * CATALYST - Module Page
 *
 * Multimodal learning experience: Read, Listen, Practice.
 * Route: /learn/[competency]/[module]
 */

import Link from "next/link"
import { notFound } from "next/navigation"
import { Stack, Text, Title } from "@/components/core"
import { ChevronLeftIcon } from "lucide-react"
import { 
  getModule, 
  getCompetency, 
  getAudioTranscript,
} from "@/lib/learning"
import { 
  MarkdownRenderer,
  AudioCoachPlayer,
  LearningObjectives,
  ResourceList,
  KnowledgeCheckCTA,
} from "@/components/lms"

interface PageProps {
  params: Promise<{ 
    competency: string
    module: string 
  }>
}

export default async function ModulePage({ params }: PageProps) {
  const { competency: competencySlug, module: moduleSlug } = await params
  
  // Fetch all data in parallel
  const [competency, module, audioTranscript] = await Promise.all([
    getCompetency(competencySlug),
    getModule(competencySlug, moduleSlug),
    getAudioTranscript(moduleSlug),
  ])
  
  if (!competency || !module) {
    notFound()
  }
  
  // Extract from flexible frontmatter (JSONB)
  const frontmatter = module.frontmatter || {}
  const learningObjectives = frontmatter.learningObjectives as string[] | undefined
  const resources = frontmatter.resources as Array<{ title: string; type: string }> | undefined
  const quizId = frontmatter.quizId as string | undefined
  
  return (
    <Stack gap="xl">
      {/* Back link */}
      <Link 
        href={`/learn/${competencySlug}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to {competency.title}
      </Link>
      
      {/* Header */}
      <Stack gap="sm">
        <Text size="xs" className="uppercase tracking-wider text-muted-foreground">
          Module {module.module_number}
        </Text>
        <Title size="h1" className="text-2xl sm:text-3xl">
          {module.title}
        </Title>
        {module.description && (
          <Text className="text-muted-foreground text-lg">
            {module.description}
          </Text>
        )}
      </Stack>
      
      {/* Audio Coach Demonstration (if transcript exists) */}
      {audioTranscript && (
        <AudioCoachPlayer
          title={audioTranscript.title}
          duration={audioTranscript.duration || "5 minutes"}
          type={audioTranscript.type || "demonstration"}
          transcript={audioTranscript.transcript}
          audioUrl={audioTranscript.audio_url}
        />
      )}
      
      {/* Learning Objectives (if in frontmatter) */}
      {learningObjectives && (
        <LearningObjectives objectives={learningObjectives} />
      )}
      
      {/* Main Content - Rendered Markdown */}
      <div className="prose prose-lg max-w-none">
        <MarkdownRenderer content={module.content} />
      </div>
      
      {/* Resources (if in frontmatter) */}
      {resources && resources.length > 0 && (
        <ResourceList resources={resources} />
      )}
      
      {/* Knowledge Check CTA (if quizId in frontmatter) */}
      {quizId && (
        <KnowledgeCheckCTA quizId={quizId} />
      )}
    </Stack>
  )
}
```

### 7. Data Fetching Function

Add to `lib/learning.ts`:

```typescript
/**
 * Get audio transcript for a module
 */
export async function getAudioTranscript(moduleSlug: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from("audio_transcripts")
    .select("*")
    .eq("module_slug", moduleSlug)
    .single()
  
  if (error || !data) return null
  
  return {
    title: data.title,
    duration: data.duration,
    type: data.type,
    transcript: data.transcript,
    audio_url: data.audio_url,
  }
}
```

### 8. Component Index

Update `components/lms/index.ts`:

```typescript
/**
 * CATALYST - LMS Components
 */

// Reading
export { MarkdownRenderer } from "./markdown-renderer"
export { LearningObjectives } from "./learning-objectives"
export { ResourceList } from "./resource-list"

// Listening
export { AudioCoachPlayer } from "./audio-coach-player"

// Navigation
export { KnowledgeCheckCTA } from "./knowledge-check-cta"
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `components/lms/markdown-renderer.tsx` | CREATE |
| `components/lms/audio-coach-player.tsx` | CREATE |
| `components/lms/learning-objectives.tsx` | CREATE |
| `components/lms/resource-list.tsx` | CREATE |
| `components/lms/knowledge-check-cta.tsx` | CREATE |
| `components/lms/index.ts` | UPDATE |
| `app/learn/[competency]/[module]/page.tsx` | UPDATE — Complete rewrite |
| `lib/learning.ts` | UPDATE — Add `getAudioTranscript` |

---

## Acceptance Criteria

- [ ] Module header shows number, title, description
- [ ] Audio player appears when `.audio.md` transcript exists
- [ ] Audio player has play/pause, progress slider, time display
- [ ] Transcript toggle shows/hides markdown content
- [ ] Learning objectives render from frontmatter
- [ ] Main content renders with enhanced markdown (scripts, tables, scenarios)
- [ ] Resources list renders with icons
- [ ] Knowledge check CTA appears when quizId exists
- [ ] All sections handle missing data gracefully (conditional rendering)
- [ ] Layout is responsive (stacked on mobile)
- [ ] Custom markdown components render:
  - `> "quote"` → Script callout card
  - Tables → Styled with ✓/✗ icons
  - `### Scenario:` → Practice scenario card
  - `**Context:**` → Blue context callout

---

## Data Flow

```
Module Page
├── getCompetency(slug) → { title, description }
├── getModule(competencySlug, moduleSlug) 
│   └── Returns: { title, description, content, frontmatter: JSONB }
├── getAudioTranscript(moduleSlug)
│   └── Returns: { title, duration, type, transcript, audio_url } | null
│
└── Renders:
    ├── Header (always)
    ├── AudioCoachPlayer (if audioTranscript)
    ├── LearningObjectives (if frontmatter.learningObjectives)
    ├── MarkdownRenderer (always - module.content)
    ├── ResourceList (if frontmatter.resources)
    └── KnowledgeCheckCTA (if frontmatter.quizId)
```

---

## Notes

- **Content is NOT changed** — markdown files stay as-is
- **Audio is additive** — `.audio.md` files are separate from main content
- **Frontmatter is flexible** — JSONB column stores whatever fields exist
- **Custom renderers** — Transform standard markdown patterns into rich UI
- **Graceful degradation** — Missing data = section not shown
