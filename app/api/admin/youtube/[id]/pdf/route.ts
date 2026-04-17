/**
 * CATALYST - YouTube Script PDF Export
 *
 * GET /api/admin/youtube/[id]/pdf
 *
 * Generates a branded PDF from a YouTube script's markdown content.
 * Uses @react-pdf/renderer with Prime Capital styling.
 */

import { NextRequest, NextResponse } from "next/server"
import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import { createClient } from "@/lib/supabase/server"

// =============================================================================
// Brand Colors
// =============================================================================

const SPRUCE = "#576C75"
const ASH = "#3F4142"
const SERENITY = "#A6B5B0"
const LIGHT_BG = "#F8F7F5"

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
  page: {
    padding: "48 44",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: ASH,
    lineHeight: 1.6,
  },
  // Header on first page
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottom: `1pt solid ${SERENITY}`,
  },
  brand: {
    fontSize: 9,
    fontFamily: "Times-Roman",
    letterSpacing: 4,
    color: SPRUCE,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  scriptTitle: {
    fontSize: 22,
    fontFamily: "Times-Bold",
    color: ASH,
    marginBottom: 6,
  },
  scriptMeta: {
    fontSize: 9,
    color: SERENITY,
  },
  // Section headings
  h2: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: SPRUCE,
    marginTop: 20,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: `0.5pt solid ${SERENITY}`,
  },
  h3: {
    fontSize: 11.5,
    fontFamily: "Helvetica-Bold",
    color: ASH,
    marginTop: 14,
    marginBottom: 6,
  },
  // Body text
  paragraph: {
    fontSize: 10.5,
    color: ASH,
    marginBottom: 8,
    lineHeight: 1.6,
  },
  // Table-like rows for packaging section
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: `0.5pt solid ${LIGHT_BG}`,
  },
  tableLabel: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: SPRUCE,
    width: 140,
  },
  tableValue: {
    fontSize: 10,
    color: ASH,
    flex: 1,
  },
  // Horizontal rule
  hr: {
    height: 0,
    borderBottom: `0.5pt solid ${SERENITY}`,
    marginVertical: 12,
  },
  // Bold text (inline)
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 28,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTop: `0.5pt solid ${SERENITY}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7.5,
    color: SERENITY,
    letterSpacing: 0.5,
  },
  // Validation badge area
  validationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: LIGHT_BG,
    padding: "6 12",
    borderRadius: 4,
    marginBottom: 16,
  },
  validationScore: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: SPRUCE,
    marginRight: 8,
  },
  validationLabel: {
    fontSize: 9,
    color: SERENITY,
  },
})

// =============================================================================
// Markdown → PDF Sections Parser
// =============================================================================

type Section = {
  type: "h1" | "h2" | "h3" | "paragraph" | "hr" | "table-row"
  content: string
  label?: string
}

function parseMarkdownToSections(markdown: string): Section[] {
  const lines = markdown.split("\n")
  const sections: Section[] = []
  let currentParagraph = ""

  function flushParagraph() {
    if (currentParagraph.trim()) {
      sections.push({ type: "paragraph", content: currentParagraph.trim() })
      currentParagraph = ""
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Horizontal rule
    if (/^---+\s*$/.test(line) || /^\*\*\*+\s*$/.test(line)) {
      flushParagraph()
      sections.push({ type: "hr", content: "" })
      continue
    }

    // H1
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      flushParagraph()
      sections.push({ type: "h1", content: line.replace(/^#\s+/, "") })
      continue
    }

    // H2
    if (line.startsWith("## ")) {
      flushParagraph()
      sections.push({ type: "h2", content: line.replace(/^##\s+/, "") })
      continue
    }

    // H3
    if (line.startsWith("### ")) {
      flushParagraph()
      sections.push({ type: "h3", content: line.replace(/^###\s+/, "") })
      continue
    }

    // Table rows — "| **Label** | Value |" pattern
    const tableMatch = line.match(
      /^\|\s*\*?\*?(.+?)\*?\*?\s*\|\s*(.+?)\s*\|?\s*$/
    )
    if (tableMatch && !line.includes("---")) {
      flushParagraph()
      const label = tableMatch[1].replace(/\*\*/g, "").trim()
      const value = tableMatch[2].replace(/\*\*/g, "").trim()
      // Skip table header separators and header rows
      if (label !== "Field" && label !== "---" && !label.includes("---")) {
        sections.push({ type: "table-row", content: value, label })
      }
      continue
    }

    // Skip table separator lines
    if (/^\|[\s-|]+\|$/.test(line)) continue

    // Empty line — flush paragraph
    if (line.trim() === "") {
      flushParagraph()
      continue
    }

    // Regular text — accumulate into paragraph
    // Strip markdown bold/italic for clean PDF text
    const cleanLine = line
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
    currentParagraph += (currentParagraph ? " " : "") + cleanLine
  }

  flushParagraph()
  return sections
}

// =============================================================================
// PDF Document Component
// =============================================================================

interface ScriptPdfProps {
  title: string
  content: string
  createdAt: string
  wordCount: number | null
  validationScore: number | null
  targetLength: string | null
}

function ScriptDocument({
  title,
  content,
  createdAt,
  wordCount,
  validationScore,
  targetLength,
}: ScriptPdfProps) {
  const sections = parseMarkdownToSections(content)
  const date = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const metaParts = [
    date,
    wordCount ? `${wordCount.toLocaleString()} words` : null,
    targetLength ? targetLength.replace("_", " ") : null,
  ].filter(Boolean)

  const elements: React.ReactElement[] = []

  // Header
  elements.push(
    React.createElement(
      View,
      { key: "header", style: styles.header },
      React.createElement(Text, { style: styles.brand }, "PRIME CAPITAL DUBAI"),
      React.createElement(Text, { style: styles.scriptTitle }, title),
      React.createElement(
        Text,
        { style: styles.scriptMeta },
        metaParts.join("  ·  ")
      )
    )
  )

  // Validation score badge
  if (validationScore !== null) {
    elements.push(
      React.createElement(
        View,
        { key: "validation", style: styles.validationBadge },
        React.createElement(
          Text,
          { style: styles.validationScore },
          `${validationScore}/100`
        ),
        React.createElement(
          Text,
          { style: styles.validationLabel },
          "Validation Score"
        )
      )
    )
  }

  // Render sections
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const key = `s-${i}`

    switch (section.type) {
      case "h1":
        // Already handled by header — skip or render as h2
        elements.push(
          React.createElement(Text, { key, style: styles.h2 }, section.content)
        )
        break
      case "h2":
        elements.push(
          React.createElement(Text, { key, style: styles.h2 }, section.content)
        )
        break
      case "h3":
        elements.push(
          React.createElement(Text, { key, style: styles.h3 }, section.content)
        )
        break
      case "paragraph":
        elements.push(
          React.createElement(
            Text,
            { key, style: styles.paragraph },
            section.content
          )
        )
        break
      case "hr":
        elements.push(
          React.createElement(View, { key, style: styles.hr })
        )
        break
      case "table-row":
        elements.push(
          React.createElement(
            View,
            { key, style: styles.tableRow },
            React.createElement(
              Text,
              { style: styles.tableLabel },
              section.label || ""
            ),
            React.createElement(
              Text,
              { style: styles.tableValue },
              section.content
            )
          )
        )
        break
    }
  }

  return React.createElement(
    Document,
    { title: `Script - ${title}`, author: "Prime Capital Dubai" },
    React.createElement(
      Page,
      { size: "A4", style: styles.page, wrap: true },
      ...elements,
      // Footer
      React.createElement(
        View,
        { style: styles.footer, fixed: true },
        React.createElement(
          Text,
          { style: styles.footerText },
          "PRIME CAPITAL DUBAI — CONFIDENTIAL"
        ),
        React.createElement(
          Text,
          { style: styles.footerText, render: ({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}` }
        )
      )
    )
  )
}

// =============================================================================
// Route Handler
// =============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: script, error } = await supabase
    .from("youtube_scripts")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error || !script) {
    return NextResponse.json({ error: "Script not found" }, { status: 404 })
  }

  if (!script.script_body) {
    return NextResponse.json(
      { error: "Script has no content to export" },
      { status: 400 }
    )
  }

  const doc = ScriptDocument({
    title: script.title,
    content: script.script_body,
    createdAt: script.created_at || new Date().toISOString(),
    wordCount: script.word_count,
    validationScore: script.validation_score,
    targetLength: script.target_length,
  })

  const buffer = await renderToBuffer(doc)
  const uint8 = new Uint8Array(buffer)

  // Slugify title for filename
  const slug = script.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60)

  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="prime-capital-script-${slug}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  })
}
