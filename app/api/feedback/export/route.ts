/**
 * CATALYST - Feedback Export API
 *
 * Exports feedback as Markdown for AI-assisted content updates.
 * GET /api/feedback/export
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { type Feedback } from "@/lib/lms/feedback"

export async function GET(request: NextRequest) {
  const supabase = await createClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
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
  const markdown = generateMarkdown((feedback as Feedback[]) || [])

  // Return as downloadable file
  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="feedback-export-${Date.now()}.md"`,
    },
  })
}

// -----------------------------------------------------------------------------
// Markdown Generation
// -----------------------------------------------------------------------------

function generateMarkdown(feedback: Feedback[]): string {
  const date = new Date().toISOString().split("T")[0]

  let md = `# LMS Content Feedback Export

**Generated:** ${date}  
**Total Items:** ${feedback.length}

---

`

  // Group by competency/module
  const grouped = groupByContext(feedback)

  // General feedback first
  if (grouped.general.length > 0) {
    md += `## General Feedback

${grouped.general.map(formatFeedbackItem).join("\n\n---\n\n")}

---

`
  }

  // Module-specific feedback
  for (const [competency, modules] of Object.entries(grouped.modules)) {
    md += `## ${formatSlug(competency)}

`
    for (const [module, items] of Object.entries(modules)) {
      md += `### ${formatSlug(module)}

${items.map(formatFeedbackItem).join("\n\n---\n\n")}

`
    }
  }

  return md
}

type GroupedFeedback = {
  general: Feedback[]
  modules: Record<string, Record<string, Feedback[]>>
}

function groupByContext(feedback: Feedback[]): GroupedFeedback {
  const result: GroupedFeedback = {
    general: [],
    modules: {},
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

function formatFeedbackItem(item: Feedback): string {
  const parts: string[] = []

  // Header with ID and status
  parts.push(`**Feedback ID:** \`${item.id}\`  `)
  parts.push(`**Status:** ${item.status}  `)
  parts.push(
    `**Date:** ${new Date(item.created_at).toISOString().split("T")[0]}`
  )

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
  if (item.attachments && item.attachments.length > 0) {
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

function formatSlug(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
