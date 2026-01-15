# LMS-029i: Markdown Export

**Status:** 📋 READY  
**Priority:** Medium  
**Estimated Time:** 1 hour  
**Dependencies:** LMS-029h  

---

## Objective

Export all feedback as a Markdown file for AI-assisted content updates.

---

## Tasks

### 1. Export API Route

**File:** `app/api/feedback/export/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // Verify admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Get filter params
  const { searchParams } = request.nextUrl
  const status = searchParams.get("status")
  const type = searchParams.get("type")

  // Fetch feedback
  let query = supabase
    .from("lms_feedback")
    .select("*")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status)
  }

  if (type && type !== "all") {
    query = query.eq("feedback_type", type)
  }

  const { data: feedback, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Generate Markdown
  const markdown = generateMarkdown(feedback || [])

  // Return as downloadable file
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="feedback-export-${Date.now()}.md"`
    }
  })
}

function generateMarkdown(feedback: any[]): string {
  const date = new Date().toISOString().split("T")[0]
  
  let md = `# LMS Content Feedback Export

**Generated:** ${date}  
**Total Items:** ${feedback.length}

---

`

  // Group by competency/module
  const grouped = groupByContext(feedback)

  // General feedback first
  if (grouped.general?.length) {
    md += `## General Feedback

${grouped.general.map(formatFeedbackItem).join("\n\n---\n\n")}

---

`
  }

  // Module-specific feedback
  for (const [competency, modules] of Object.entries(grouped.modules || {})) {
    md += `## ${formatCompetencyName(competency)}

`
    for (const [module, items] of Object.entries(modules as Record<string, any[]>)) {
      md += `### ${formatModuleName(module)}

${items.map(formatFeedbackItem).join("\n\n---\n\n")}

`
    }
  }

  return md
}

function groupByContext(feedback: any[]) {
  const result: {
    general: any[]
    modules: Record<string, Record<string, any[]>>
  } = {
    general: [],
    modules: {}
  }

  for (const item of feedback) {
    if (item.feedback_type === "general") {
      result.general.push(item)
    } else {
      const comp = item.competency_slug || "unknown"
      const mod = item.module_slug || "unknown"
      
      if (!result.modules[comp]) {
        result.modules[comp] = {}
      }
      if (!result.modules[comp][mod]) {
        result.modules[comp][mod] = []
      }
      result.modules[comp][mod].push(item)
    }
  }

  return result
}

function formatFeedbackItem(item: any): string {
  const parts: string[] = []

  // Header with ID and status
  parts.push(`**Feedback ID:** \`${item.id}\`  `)
  parts.push(`**Status:** ${item.status}  `)
  parts.push(`**Date:** ${new Date(item.created_at).toISOString().split("T")[0]}`)

  // Quoted text
  if (item.quoted_text) {
    parts.push("")
    parts.push(`> ${item.quoted_text}`)
  }

  // Main content
  if (item.text_content) {
    parts.push("")
    parts.push(item.text_content)
  }

  // Voice transcription
  if (item.voice_transcription) {
    parts.push("")
    parts.push(`**Voice Note:** ${item.voice_transcription}`)
  }

  // Attachments
  if (item.attachments?.length) {
    parts.push("")
    parts.push(`**Attachments:** ${item.attachments.length} file(s)`)
  }

  // Page URL
  if (item.page_url) {
    parts.push("")
    parts.push(`**Page:** ${item.page_url}`)
  }

  return parts.join("\n")
}

function formatCompetencyName(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatModuleName(slug: string): string {
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
```

### 2. Update Export Button with Filters

Update `app/learn/admin/feedback/feedback-filters.tsx`:

```typescript
// Build export URL with current filters
const exportUrl = useMemo(() => {
  const params = new URLSearchParams()
  if (status !== "all") params.set("status", status)
  if (type !== "all") params.set("type", type)
  const query = params.toString()
  return `/api/feedback/export${query ? `?${query}` : ""}`
}, [status, type])

// Update button
<Button variant="outline" asChild>
  <a href={exportUrl} download>
    <Download className="h-4 w-4 mr-2" />
    Export Markdown
  </a>
</Button>
```

---

## Export Format Example

```markdown
# LMS Content Feedback Export

**Generated:** 2026-01-15  
**Total Items:** 3

---

## General Feedback

**Feedback ID:** `abc123`  
**Status:** new  
**Date:** 2026-01-15

The navigation is confusing when switching between modules.

---

## Market Intelligence

### Market Overview

**Feedback ID:** `def456`  
**Status:** in_progress  
**Date:** 2026-01-14

> The statistics mentioned are from 2024

This section needs updated Q4 2025 market data.

**Page:** /learn/market-intelligence/market-overview

---
```

---

## Verification

- [ ] Export endpoint works
- [ ] Admin-only access enforced
- [ ] Filters apply to export
- [ ] Markdown is well-formatted
- [ ] Feedback IDs included
- [ ] Grouped by competency/module
- [ ] File downloads with timestamp
