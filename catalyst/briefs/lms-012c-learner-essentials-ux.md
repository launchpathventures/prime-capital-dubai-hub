# LMS-012C: Learner Essentials Experience

**Status:** � IN PROGRESS  
**Priority:** High  
**Estimated Time:** 2-3 days  
**Dependencies:** LMS-012A ✅  

---

## Implementation Status

✅ **Core Components Built:**
- `components/lms/mode-switch.tsx` — Toggle between Essentials/Deep Dive
- `components/lms/essentials-view.tsx` — Renders TL;DR, facts, scripts, practice, reflection
- `app/learn/[competency]/[module]/page-client.tsx` — Client wrapper for mode switching
- `app/learn/learn.css` — Essentials mode styling (light + dark mode)

✅ **Module Page Updated:**
- Fetches essentials from Supabase
- URL query param support: `?mode=essentials|deepdive`
- Defaults to essentials if available
- Mode toggle shown when essentials exist
- ToC hidden in essentials mode

🔲 **Remaining:**
- Test with real module data
- Audio player integration
- AI Coach practice integration
- Progress tracking for mode

---

## Objective

Build the learner-facing experience for consuming Essentials — a focused, LPAR-structured view that delivers the 20% of content needed for 80% of client conversations. This includes:

1. **Essentials Mode** — Default for new learners, showing AI-extracted summary
2. **Deep Dive Mode** — Full markdown content for those who want more
3. **Mode Toggle** — Seamless switching between views
4. **Progress Tracking** — Track completion in both modes

---

## Key Principle: Essentials First, Deep Dive Available

The learning experience should guide learners toward focused consumption while keeping comprehensive content accessible:

- **New learners** start in Essentials Mode (faster path to productivity)
- **Experienced agents** can toggle to Deep Dive for reference
- **Cross-links** connect Essentials to relevant Deep Dive sections
- **Completion** can be achieved in either mode

---

## Route Structure

```
/learn/[competency]/[module]
├── ?mode=essentials  (default if essentials available)
├── ?mode=deepdive    (full content view)
```

Same route, mode determined by query param with intelligent defaults.

---

## Mode Selection Logic

```typescript
/**
 * Determine which mode to show the learner.
 */
function getDefaultMode(module: LearningModule, searchParams: { mode?: string }): "essentials" | "deepdive" {
  // Explicit mode in URL takes precedence
  if (searchParams.mode === "essentials" || searchParams.mode === "deepdive") {
    return searchParams.mode
  }
  
  // If essentials available, default to essentials
  if (module.essentials) {
    return "essentials"
  }
  
  // Fallback to deep dive
  return "deepdive"
}
```

---

## Wireframe: Essentials Mode

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Market Intelligence                                          │
│                                                                 │
│  Module 1.2                                     ⏱ 15 min        │
│  Prime Capital Positioning                                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Essentials ●]  [Deep Dive ○]                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TL;DR                                                          │
│  ─────────────────────────────────────────────────────────────  │
│  Prime Capital is positioned as the "antidote to Dubai          │
│  hustle." While 10,000+ agents compete on volume and            │
│  pressure tactics, we focus on advisory relationships with      │
│  sophisticated investors. Your role is to provide               │
│  intelligence, not push properties.                             │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🎯 Key Facts                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ • Dubai has 10,000+ registered agents                    │   │
│  │ • Core tagline: "We move complexity out of sight"        │   │
│  │ • Advisory model: relationship > transaction             │   │
│  │ • Client perception gap: "hustle" reputation to overcome │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📝 Script: "Why Prime Capital?"                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  "Our role is to make sure you have the information      │   │
│  │   and access you need to make decisions that align       │   │
│  │   with your goals. We're not here to convince you        │   │
│  │   to buy anything."                                      │   │
│  │                                                          │   │
│  │                                    [Copy Script 📋]      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🎧 Coach Demo                                          8 min   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  Listen to hear the positioning in action                │   │
│  │                                                          │   │
│  │  ▶ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  0:00 / 8:24      │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  💬 Practice Scenario                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  🎭 A UK-based investor asks:                            │   │
│  │  "I've dealt with Dubai agents before. What makes        │   │
│  │   you different?"                                        │   │
│  │                                                          │   │
│  │  Your task: Deliver the Prime Capital positioning        │   │
│  │  clearly, addressing their likely concerns about         │   │
│  │  aggressive sales tactics.                               │   │
│  │                                                          │   │
│  │  [ Practice with AI Coach ]                              │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🤔 Reflection                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │  What's your key takeaway from this module?              │   │
│  │                                                          │   │
│  │  ┌─────────────────────────────────────────────────┐    │   │
│  │  │                                                  │    │   │
│  │  │                                                  │    │   │
│  │  └─────────────────────────────────────────────────┘    │   │
│  │                                                          │   │
│  │  [ Save Reflection ]                                     │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  📖 Want the full details?                                      │
│     This essentials view covers the key points.                 │
│     [Switch to Deep Dive →] for comprehensive content.          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [ ← Previous Module ]           [ Mark Complete ✓ ]  [ Next →] │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Wireframe: Mode Toggle Component

```
┌──────────────────────────────────────────┐
│  [Essentials ●]  [Deep Dive ○]           │  ← Pill toggle
│                                          │
│  ⏱ 15 min        📖 Full: 25 min         │  ← Duration indicator
└──────────────────────────────────────────┘
```

When hovering/focusing:

```
┌──────────────────────────────────────────┐
│  [Essentials ●]  [Deep Dive ○]           │
│                                          │
│  ┌──────────────────────────────────┐    │
│  │ Essentials: Key facts, scripts,  │    │
│  │ and practice (15 min)            │    │
│  │                                  │    │
│  │ Deep Dive: Full module content   │    │
│  │ with complete context (25 min)   │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

---

## Component: Essentials View

```tsx
/**
 * CATALYST - Essentials View Component
 * 
 * Renders the AI-extracted essentials in LPAR format.
 */

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Stack, Row, Text, Title } from "@/components/core"
import { CopyIcon, PlayIcon } from "lucide-react"
import type { EssentialsContent } from "@/lib/learning-types"
import { AudioPlayer } from "@/components/lms/audio-player"
import { CoachPractice } from "@/components/lms/coach-practice"
import Image from "next/image"

interface EssentialsViewProps {
  essentials: EssentialsContent
  moduleSlug: string
  competencySlug: string
  onSwitchMode: () => void
}

export function EssentialsView({ 
  essentials, 
  moduleSlug, 
  competencySlug,
  onSwitchMode 
}: EssentialsViewProps) {
  return (
    <Stack gap="xl" className="essentials-view">
      {/* TL;DR Section */}
      <section className="essentials-tldr">
        <Title level={2} className="text-lg font-semibold mb-3">TL;DR</Title>
        <Text className="text-foreground/90 leading-relaxed">
          {essentials.tldr}
        </Text>
      </section>
      
      {/* Key Facts */}
      <section className="essentials-facts">
        <Row gap="sm" className="items-center mb-3">
          <span className="text-xl">🎯</span>
          <Title level={2} className="text-lg font-semibold">Key Facts</Title>
        </Row>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <ul className="space-y-2">
              {essentials.keyFacts.map((fact, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <div>
                    <Text>{fact.fact}</Text>
                    {fact.context && (
                      <Text size="sm" className="text-muted-foreground">
                        {fact.context}
                      </Text>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
      
      {/* Scripts */}
      {essentials.scripts.length > 0 && (
        <section className="essentials-scripts">
          <Row gap="sm" className="items-center mb-3">
            <span className="text-xl">📝</span>
            <Title level={2} className="text-lg font-semibold">
              Script: {essentials.scripts[0].scenario}
            </Title>
          </Row>
          
          {essentials.scripts.map((script, i) => (
            <Card key={i} className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <Text className="italic text-lg leading-relaxed">
                  "{script.script}"
                </Text>
                <Row gap="sm" className="justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(script.script)}
                  >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Copy Script
                  </Button>
                </Row>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
      
      {/* Images */}
      {essentials.images.filter(img => img.essential).length > 0 && (
        <section className="essentials-images">
          <Row gap="sm" className="items-center mb-3">
            <span className="text-xl">🖼️</span>
            <Title level={2} className="text-lg font-semibold">Key Documents</Title>
          </Row>
          
          <div className="grid gap-4">
            {essentials.images
              .filter(img => img.essential)
              .map((img, i) => (
                <figure key={i} className="border rounded-lg overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={600}
                    height={400}
                    className="w-full"
                  />
                  <figcaption className="p-3 bg-muted/30">
                    <Text weight="medium">{img.caption}</Text>
                    {img.context && (
                      <Text size="sm" className="text-muted-foreground mt-1">
                        {img.context}
                      </Text>
                    )}
                  </figcaption>
                </figure>
              ))}
          </div>
        </section>
      )}
      
      {/* Audio */}
      {essentials.audio.length > 0 && (
        <section className="essentials-audio">
          <Row gap="sm" className="items-center mb-3">
            <span className="text-xl">🎧</span>
            <Title level={2} className="text-lg font-semibold">Coach Demo</Title>
            <Text size="sm" className="text-muted-foreground ml-auto">
              {essentials.audio[0].duration}
            </Text>
          </Row>
          
          {essentials.audio.map((audio, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Text className="mb-3">{audio.context}</Text>
                <AudioPlayer 
                  slug={audio.slug}
                  title={audio.title}
                />
              </CardContent>
            </Card>
          ))}
        </section>
      )}
      
      {/* Practice Scenario */}
      <section className="essentials-practice">
        <Row gap="sm" className="items-center mb-3">
          <span className="text-xl">💬</span>
          <Title level={2} className="text-lg font-semibold">Practice Scenario</Title>
        </Row>
        
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900">
          <CardContent className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">🎭</span>
              <Text className="font-medium">{essentials.practice.situation}</Text>
            </div>
            
            <div className="mb-4 pl-10">
              <Text size="sm" className="text-muted-foreground mb-1">Your task:</Text>
              <Text>{essentials.practice.task}</Text>
            </div>
            
            <div className="pl-10">
              <CoachPractice
                scenario={essentials.practice}
                moduleSlug={moduleSlug}
                competencySlug={competencySlug}
              />
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Reflection */}
      <section className="essentials-reflection">
        <Row gap="sm" className="items-center mb-3">
          <span className="text-xl">🤔</span>
          <Title level={2} className="text-lg font-semibold">Reflection</Title>
        </Row>
        
        <Card>
          <CardContent className="p-6">
            <Text className="mb-4">{essentials.reflection}</Text>
            <Textarea 
              placeholder="Write your key takeaway..."
              rows={3}
              className="mb-3"
            />
            <Button variant="outline" size="sm">Save Reflection</Button>
          </CardContent>
        </Card>
      </section>
      
      {/* Deep Dive CTA */}
      <section className="essentials-deepdive-cta">
        <Card className="bg-muted/20">
          <CardContent className="p-6 text-center">
            <Text className="text-muted-foreground mb-2">
              📖 Want the full details?
            </Text>
            <Text size="sm" className="text-muted-foreground mb-4">
              This essentials view covers the key points.
            </Text>
            <Button variant="outline" onClick={onSwitchMode}>
              Switch to Deep Dive →
            </Button>
          </CardContent>
        </Card>
      </section>
    </Stack>
  )
}
```

---

## Component: Mode Toggle

```tsx
/**
 * CATALYST - Learning Mode Toggle
 * 
 * Switch between Essentials and Deep Dive modes.
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface ModeSwitchProps {
  essentialsDuration?: string  // "15 min"
  deepDiveDuration?: string    // "25 min"
  hasEssentials: boolean
}

export function ModeSwitch({ 
  essentialsDuration = "15 min",
  deepDiveDuration = "25 min",
  hasEssentials
}: ModeSwitchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentMode = searchParams.get("mode") || (hasEssentials ? "essentials" : "deepdive")
  
  const setMode = (mode: "essentials" | "deepdive") => {
    const params = new URLSearchParams(searchParams)
    params.set("mode", mode)
    router.push(`?${params.toString()}`, { scroll: false })
  }
  
  if (!hasEssentials) {
    return null // No toggle if essentials not available
  }
  
  return (
    <div className="mode-switch">
      <div className="inline-flex rounded-full bg-muted p-1">
        <button
          onClick={() => setMode("essentials")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            currentMode === "essentials" 
              ? "bg-background shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Essentials
        </button>
        <button
          onClick={() => setMode("deepdive")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            currentMode === "deepdive" 
              ? "bg-background shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Deep Dive
        </button>
      </div>
      
      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
        <span>⏱ {currentMode === "essentials" ? essentialsDuration : deepDiveDuration}</span>
        {currentMode === "essentials" && (
          <span>📖 Full: {deepDiveDuration}</span>
        )}
      </div>
    </div>
  )
}
```

---

## Updated Module Page

Modify the existing module page to support both modes:

```tsx
// app/learn/[competency]/[module]/page.tsx

import { notFound } from "next/navigation"
import { getModuleWithEssentials } from "@/lib/learning"
import { ModeSwitch } from "@/components/lms/mode-switch"
import { EssentialsView } from "@/components/lms/essentials-view"
import { MarkdownRenderer } from "@/components/lms/markdown-renderer"
import { ModuleHeader } from "@/components/lms/module-header"
import { ModuleNav } from "@/components/lms/module-nav"

interface ModulePageProps {
  params: { competency: string; module: string }
  searchParams: { mode?: string }
}

export default async function ModulePage({ params, searchParams }: ModulePageProps) {
  const module = await getModuleWithEssentials(params.competency, params.module)
  
  if (!module) {
    notFound()
  }
  
  // Determine mode
  const hasEssentials = module.essentials !== null
  const mode = searchParams.mode || (hasEssentials ? "essentials" : "deepdive")
  
  return (
    <div className="module-page">
      {/* Header with title, duration, objectives */}
      <ModuleHeader module={module} />
      
      {/* Mode Toggle */}
      <div className="my-6">
        <ModeSwitch
          hasEssentials={hasEssentials}
          essentialsDuration="15 min"
          deepDiveDuration={module.estimated_duration || "25 min"}
        />
      </div>
      
      {/* Content Area */}
      <div className="module-content">
        {mode === "essentials" && module.essentials ? (
          <EssentialsView
            essentials={module.essentials}
            moduleSlug={module.slug}
            competencySlug={params.competency}
            onSwitchMode={() => {}}
          />
        ) : (
          <MarkdownRenderer content={module.content} />
        )}
      </div>
      
      {/* Navigation */}
      <ModuleNav 
        competencySlug={params.competency}
        currentModuleSlug={params.module}
      />
    </div>
  )
}
```

---

## CSS: Essentials Mode Styling

Add to `app/learn/learn.css`:

```css
/* =============================================================================
 * ESSENTIALS MODE STYLING
 * ============================================================================= */

.essentials-view {
  max-width: 720px;
  margin: 0 auto;
}

/* TL;DR */
.essentials-tldr {
  padding: 1.5rem;
  background: oklch(from var(--color-primary) l c h / 0.05);
  border-radius: 0.75rem;
  border-left: 4px solid var(--color-primary);
}

/* Key Facts Card */
.essentials-facts ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Script Cards */
.essentials-scripts blockquote {
  font-size: 1.125rem;
  line-height: 1.75;
}

/* Practice Scenario */
.essentials-practice .scenario-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: oklch(from var(--color-warning) l c h / 0.1);
  color: var(--color-warning);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Mode Switch */
.mode-switch {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

/* Deep Dive CTA */
.essentials-deepdive-cta {
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
}

/* Responsive */
@media (max-width: 640px) {
  .essentials-view {
    padding: 0 1rem;
  }
  
  .essentials-tldr {
    padding: 1rem;
  }
}
```

---

## File Structure

```
components/
└── lms/
    ├── essentials-view.tsx      # Main essentials renderer
    ├── mode-switch.tsx          # Toggle between modes
    ├── audio-player.tsx         # Audio playback (existing)
    ├── coach-practice.tsx       # AI practice launcher (existing)
    └── markdown-renderer.tsx    # Deep dive renderer (existing)

app/
└── learn/
    ├── learn.css                # Add essentials styles
    └── [competency]/
        └── [module]/
            └── page.tsx         # Updated with mode support
```

---

## Progress Tracking

Completion should work in either mode. Update progress tracking to record which mode was used:

```typescript
// When marking module complete
await supabase
  .from("learning_progress")
  .upsert({
    user_id: userId,
    module_id: moduleId,
    status: "completed",
    completed_at: new Date().toISOString(),
    completed_in_mode: mode, // "essentials" | "deepdive"
  })
```

---

## Acceptance Criteria

- [ ] Module page shows mode toggle when essentials available
- [ ] Default mode is "essentials" when available
- [ ] URL reflects current mode via `?mode=` query param
- [ ] Essentials view renders all sections: TL;DR, Key Facts, Scripts, Images, Audio, Practice, Reflection
- [ ] Scripts have "Copy Script" button that works
- [ ] Images marked `essential: true` are displayed
- [ ] Audio player integrates with existing audio_transcripts
- [ ] Practice scenario launches AI Coach
- [ ] Reflection textarea saves input
- [ ] "Switch to Deep Dive" button changes mode
- [ ] Deep Dive mode renders full markdown content
- [ ] Mode preference persists during session
- [ ] Progress tracking records which mode was used for completion
- [ ] Mobile responsive layout for all essentials components

---

## Future Enhancements

- **Personalized mode** — Remember user's preferred mode
- **Essentials progress** — Track which sections viewed
- **Spaced repetition** — Resurface key facts over time
- **Quiz integration** — Link to knowledge checks from essentials
- **Offline support** — Cache essentials for offline learning

---

## Related Briefs

- **LMS-012A**: Schema & Extraction API (dependency)
- **LMS-012B**: Admin Generation Interface (dependency)
- **LMS-006**: Module Learning Experience (enhanced by this)
- **LMS-011**: Audio Transcripts (integrated)
