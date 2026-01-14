# LMS-012B: Admin Essentials Generation Interface

**Status:** ⏸️ DEFERRED  
**Priority:** Medium (future phase)  
**Estimated Time:** 1-2 days  
**Dependencies:** LMS-012A ✅  

---

## Deferral Decision

**Date:** 13 January 2026

Essentials can be generated via API and scripts during initial rollout. Admin UI deferred until:
- Batch generation/monitoring needed
- Non-technical admins need to manage essentials
- Iterative content refinement required at scale

Current approach: Use `scripts/test-essentials.ts` pattern for generation.

---

## Objective

Build an admin interface for generating, previewing, and managing AI-extracted Essentials for learning modules. This enables content administrators to:

1. Trigger essentials generation for individual modules
2. Preview generated content before saving
3. Specify required facts that must be included
4. Edit generated essentials before publishing
5. Monitor generation status across all modules

---

## Key Principle: Human in the Loop

While AI extracts the essentials, humans validate and refine. The interface ensures:

- **Preview before save** — Admin reviews AI output
- **Required facts** — Admin can specify must-include content
- **Edit capability** — Admin can modify generated essentials
- **Staleness alerts** — Flag modules where source changed since generation

---

## Admin Route Structure

```
/app/admin/lms/
├── page.tsx                    # Module overview with essentials status
├── [moduleId]/
│   └── essentials/
│       └── page.tsx            # Essentials generation interface
└── layout.tsx                  # Admin shell (auth check)
```

---

## Page 1: Module Overview Dashboard

Route: `/admin/lms`

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  LMS Admin — Essentials Management                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filter: [All ▾] [Competency ▾] [Status ▾]    🔍 Search...      │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Module                        │ Essentials │ Status       │  │
│  ├───────────────────────────────┼────────────┼──────────────┤  │
│  │ 0.1 Company Orientation       │ ✅ Ready   │ Current      │  │
│  │ 0.2 Code of Conduct           │ ✅ Ready   │ ⚠️ Stale     │  │
│  │ 0.3 Broker Licensing          │ ❌ Missing │ —            │  │
│  │ 1.1 Dubai Overview            │ ✅ Ready   │ Current      │  │
│  │ 1.2 Prime Capital Positioning │ ✅ Ready   │ Current      │  │
│  │ ...                           │            │              │  │
│  └───────────────────────────────┴────────────┴──────────────┘  │
│                                                                 │
│  Summary: 45/78 modules have essentials (58%)                   │
│           3 modules have stale essentials                       │
│                                                                 │
│  [ Generate All Missing ]  [ Regenerate Stale ]                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Component

```tsx
/**
 * CATALYST - LMS Admin Dashboard
 * 
 * Overview of all modules with essentials generation status.
 */

import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { hashContent } from "@/lib/lms/essentials"

export default async function LMSAdminPage() {
  const supabase = await createClient()
  
  const { data: modules } = await supabase
    .from("learning_modules")
    .select(`
      id,
      slug,
      title,
      module_number,
      content,
      essentials,
      essentials_generated_at,
      essentials_source_hash,
      competencies (
        slug,
        name
      )
    `)
    .order("display_order")
  
  const modulesWithStatus = (modules || []).map(m => ({
    ...m,
    hasEssentials: m.essentials !== null,
    isStale: m.essentials_source_hash 
      ? hashContent(m.content || "") !== m.essentials_source_hash
      : false,
  }))
  
  const withEssentials = modulesWithStatus.filter(m => m.hasEssentials).length
  const staleCount = modulesWithStatus.filter(m => m.isStale).length
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">LMS Admin — Essentials Management</h1>
      
      {/* Summary Stats */}
      <div className="flex gap-4 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{withEssentials}/{modulesWithStatus.length}</div>
          <div className="text-sm text-muted-foreground">Modules with essentials</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-2xl font-bold">{staleCount}</div>
          <div className="text-sm text-muted-foreground">Stale essentials</div>
        </div>
      </div>
      
      {/* Module Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Module</TableHead>
            <TableHead>Competency</TableHead>
            <TableHead>Essentials</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modulesWithStatus.map(module => (
            <TableRow key={module.id}>
              <TableCell>
                <span className="font-medium">{module.module_number}</span>{" "}
                {module.title}
              </TableCell>
              <TableCell>{module.competencies?.name}</TableCell>
              <TableCell>
                {module.hasEssentials ? (
                  <Badge variant="success">Ready</Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </TableCell>
              <TableCell>
                {module.isStale && (
                  <Badge variant="warning">⚠️ Stale</Badge>
                )}
                {module.hasEssentials && !module.isStale && (
                  <span className="text-muted-foreground">Current</span>
                )}
              </TableCell>
              <TableCell>
                <Link href={`/admin/lms/${module.id}/essentials`}>
                  <Button variant="outline" size="sm">
                    {module.hasEssentials ? "Edit" : "Generate"}
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
```

---

## Page 2: Essentials Generation Interface

Route: `/admin/lms/[moduleId]/essentials`

### Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to LMS Admin                                            │
│                                                                 │
│  Generate Essentials                                            │
│  Module 1.2: Prime Capital Positioning                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  CONTEXT (read-only)                                            │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Learning Objectives:                                           │
│  ☑ Articulate Prime Capital's brand positioning                │
│  ☑ Differentiate advisory model from transactional             │
│  ☑ Handle common client questions about agency differences     │
│  ☑ Demonstrate the Prime Capital approach in conversations     │
│                                                                 │
│  AI Coach: Brand Communication Expert                           │
│  Focus Areas: Brand positioning, Differentiation, Communication │
│                                                                 │
│  Available Audio: 1.2-competitive-landscape-audio (8 min)       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  REQUIRED FACTS (admin can add/remove)                          │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  These facts MUST appear in the generated essentials:           │
│                                                                 │
│  ☑ "10,000+ registered agents in Dubai"                        │
│  ☑ "Antidote to Dubai hustle" positioning                      │
│  ☑ "We move complexity out of sight" tagline                   │
│  ☐ [+ Add required fact...]                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [ Preview Generation ]                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

After "Preview Generation":

┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  PREVIEW                                                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TL;DR (editable)                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Prime Capital is positioned as the "antidote to Dubai   │   │
│  │ hustle." While 10,000+ agents compete on volume and     │   │
│  │ pressure tactics, we focus on advisory relationships... │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Key Facts                                               [Edit] │
│  • Dubai has 10,000+ registered agents                   ✓      │
│  • Core tagline: "We move complexity out of sight"       ✓      │
│  • Advisory model (relationship > transaction)                  │
│                                                                 │
│  Scripts                                                 [Edit] │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Scenario: Client asks "why Prime Capital?"              │   │
│  │ Script: "Our role is to make sure you have the..."      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Images                                                  [Edit] │
│  (No images in this module)                                     │
│                                                                 │
│  Audio References                                        [Edit] │
│  🎧 1.2-competitive-landscape-audio (8 min)                     │
│     Context: "Listen to hear the positioning in action"         │
│                                                                 │
│  Practice Scenario                                       [Edit] │
│  Situation: A UK-based investor asks why they should...         │
│  Task: Deliver the Prime Capital positioning clearly...         │
│  Success: Client understands advisory vs transactional          │
│                                                                 │
│  Reflection: "What's your key takeaway from this module?"       │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  [ Regenerate ]  [ Save Essentials ]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Implementation

```tsx
/**
 * CATALYST - Essentials Generation Page
 * 
 * Admin interface for generating and editing module essentials.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Stack, Row, Text } from "@/components/core"
import type { EssentialsContent, LearningModule } from "@/lib/learning-types"

interface EssentialsEditorProps {
  module: LearningModule
  existingEssentials: EssentialsContent | null
}

export function EssentialsEditor({ module, existingEssentials }: EssentialsEditorProps) {
  const [requiredFacts, setRequiredFacts] = useState<string[]>([])
  const [newFact, setNewFact] = useState("")
  const [preview, setPreview] = useState<EssentialsContent | null>(existingEssentials)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const learningObjectives = (module.frontmatter?.learningObjectives as string[]) || []
  const aiCoach = module.frontmatter?.aiCoach as { persona?: string; focusAreas?: string[] } | undefined
  
  // Add a required fact
  const addRequiredFact = () => {
    if (newFact.trim()) {
      setRequiredFacts([...requiredFacts, newFact.trim()])
      setNewFact("")
    }
  }
  
  // Remove a required fact
  const removeRequiredFact = (index: number) => {
    setRequiredFacts(requiredFacts.filter((_, i) => i !== index))
  }
  
  // Generate preview
  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/admin/generate-essentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module.id,
          requiredFacts,
          preview: true, // Don't save yet
        }),
      })
      
      const data = await response.json()
      if (data.essentials) {
        setPreview(data.essentials)
      }
    } catch (error) {
      console.error("Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  // Save essentials
  const handleSave = async () => {
    if (!preview) return
    
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/generate-essentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId: module.id,
          essentials: preview, // Save edited version
        }),
      })
      
      if (response.ok) {
        // Success feedback
      }
    } catch (error) {
      console.error("Save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }
  
  // Update preview field
  const updatePreview = <K extends keyof EssentialsContent>(
    field: K,
    value: EssentialsContent[K]
  ) => {
    if (!preview) return
    setPreview({ ...preview, [field]: value })
  }
  
  return (
    <Stack gap="lg" className="p-8 max-w-4xl">
      <div>
        <Text size="sm" className="text-muted-foreground">Generate Essentials</Text>
        <h1 className="text-2xl font-bold">
          {module.module_number}: {module.title}
        </h1>
      </div>
      
      {/* Context Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Context (read-only)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap="md">
            {/* Learning Objectives */}
            <div>
              <Text weight="medium" className="mb-2">Learning Objectives:</Text>
              <ul className="space-y-1">
                {learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* AI Coach */}
            {aiCoach && (
              <div>
                <Text weight="medium">AI Coach: {aiCoach.persona}</Text>
                {aiCoach.focusAreas && (
                  <Text size="sm" className="text-muted-foreground">
                    Focus: {aiCoach.focusAreas.join(", ")}
                  </Text>
                )}
              </div>
            )}
          </Stack>
        </CardContent>
      </Card>
      
      {/* Required Facts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">
            Required Facts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text size="sm" className="text-muted-foreground mb-4">
            These facts MUST appear in the generated essentials:
          </Text>
          
          <Stack gap="sm">
            {requiredFacts.map((fact, i) => (
              <Row key={i} gap="sm" className="items-center">
                <Checkbox checked disabled />
                <Text className="flex-1">{fact}</Text>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeRequiredFact(i)}
                >
                  ✕
                </Button>
              </Row>
            ))}
            
            <Row gap="sm">
              <Input
                value={newFact}
                onChange={(e) => setNewFact(e.target.value)}
                placeholder="Add required fact..."
                onKeyDown={(e) => e.key === "Enter" && addRequiredFact()}
              />
              <Button onClick={addRequiredFact} variant="outline">Add</Button>
            </Row>
          </Stack>
        </CardContent>
      </Card>
      
      {/* Generate Button */}
      {!preview && (
        <Button 
          onClick={handleGenerate} 
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? "Generating..." : "Preview Generation"}
        </Button>
      )}
      
      {/* Preview Section */}
      {preview && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack gap="lg">
              {/* TL;DR */}
              <div>
                <Text weight="medium" className="mb-2">TL;DR</Text>
                <Textarea
                  value={preview.tldr}
                  onChange={(e) => updatePreview("tldr", e.target.value)}
                  rows={4}
                />
              </div>
              
              {/* Key Facts */}
              <div>
                <Text weight="medium" className="mb-2">Key Facts</Text>
                <ul className="space-y-2">
                  {preview.keyFacts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{fact.fact}</span>
                      {requiredFacts.includes(fact.fact) && (
                        <Badge variant="outline" className="text-xs">Required</Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Scripts */}
              {preview.scripts.length > 0 && (
                <div>
                  <Text weight="medium" className="mb-2">Scripts</Text>
                  {preview.scripts.map((script, i) => (
                    <Card key={i} className="bg-muted/30">
                      <CardContent className="p-4">
                        <Text size="sm" className="text-muted-foreground">
                          {script.scenario}
                        </Text>
                        <Text className="mt-2 italic">"{script.script}"</Text>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Images */}
              {preview.images.length > 0 && (
                <div>
                  <Text weight="medium" className="mb-2">Images</Text>
                  <div className="grid grid-cols-2 gap-4">
                    {preview.images.map((img, i) => (
                      <div key={i} className="border rounded p-2">
                        <img src={img.src} alt={img.alt} className="w-full" />
                        <Text size="sm" className="mt-2">{img.caption}</Text>
                        <Badge variant={img.essential ? "default" : "outline"}>
                          {img.essential ? "Essential" : "Optional"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Audio */}
              {preview.audio.length > 0 && (
                <div>
                  <Text weight="medium" className="mb-2">Audio References</Text>
                  {preview.audio.map((audio, i) => (
                    <Row key={i} gap="sm" className="items-center">
                      <span>🎧</span>
                      <Text>{audio.title} ({audio.duration})</Text>
                    </Row>
                  ))}
                </div>
              )}
              
              {/* Practice */}
              <div>
                <Text weight="medium" className="mb-2">Practice Scenario</Text>
                <Card className="bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <Text size="sm" weight="medium">Situation:</Text>
                    <Text>{preview.practice.situation}</Text>
                    <Text size="sm" weight="medium" className="mt-2">Task:</Text>
                    <Text>{preview.practice.task}</Text>
                  </CardContent>
                </Card>
              </div>
              
              {/* Reflection */}
              <div>
                <Text weight="medium" className="mb-2">Reflection</Text>
                <Text className="italic">{preview.reflection}</Text>
              </div>
            </Stack>
          </CardContent>
        </Card>
      )}
      
      {/* Action Buttons */}
      {preview && (
        <Row gap="md">
          <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
            Regenerate
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Essentials"}
          </Button>
        </Row>
      )}
    </Stack>
  )
}
```

---

## Server Component Wrapper

```tsx
// app/admin/lms/[moduleId]/essentials/page.tsx

import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { EssentialsEditor } from "./essentials-editor"

export default async function EssentialsPage({
  params,
}: {
  params: { moduleId: string }
}) {
  const supabase = await createClient()
  
  const { data: module } = await supabase
    .from("learning_modules")
    .select("*")
    .eq("id", params.moduleId)
    .single()
  
  if (!module) {
    notFound()
  }
  
  return (
    <EssentialsEditor 
      module={module}
      existingEssentials={module.essentials}
    />
  )
}
```

---

## File Structure

```
app/
└── admin/
    └── lms/
        ├── page.tsx                      # Module overview dashboard
        ├── layout.tsx                    # Admin auth check
        └── [moduleId]/
            └── essentials/
                ├── page.tsx              # Server component wrapper
                └── essentials-editor.tsx # Client component
```

---

## Acceptance Criteria

- [ ] `/admin/lms` shows all modules with essentials status (Ready/Missing/Stale)
- [ ] Summary stats show total modules with essentials and stale count
- [ ] Table is sortable and filterable by competency and status
- [ ] `/admin/lms/[moduleId]/essentials` shows module context (objectives, AI coach)
- [ ] Admin can add/remove required facts before generation
- [ ] "Preview Generation" calls API and displays structured preview
- [ ] All preview sections are editable (tldr, facts, scripts, practice, reflection)
- [ ] Images show essential/optional toggle
- [ ] "Save Essentials" persists edited content to database
- [ ] "Regenerate" button allows re-running AI extraction
- [ ] Stale badge shows when source content changed since last generation

---

## Security

- Admin routes require authenticated user
- TODO: Add admin role check (beyond just authenticated)
- API endpoint validates admin permissions before generation

---

## Next Brief

**LMS-012C: Learner Essentials Experience** — The learner-facing UI for consuming essentials with mode toggle.
