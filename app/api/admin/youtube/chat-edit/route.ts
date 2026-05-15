/**
 * CATALYST - YouTube Chat Edit API
 *
 * POST /api/admin/youtube/chat-edit
 *
 * Drives the in-context refinement conversation for a script. The model
 * (Sonnet) has three tools available:
 *
 *   - replace_section: targeted edit to one `## Heading` block
 *   - replace_entire_script: full rewrite of the body
 *   - request_regen: proposes a from-scratch regen, which the user must
 *     confirm via /regen-from-chat. We DO NOT auto-trigger the regen here.
 *
 * Direct-edit tools mutate `youtube_scripts` in place and return the updated
 * row. Request-regen is a no-op on the DB side — it just persists the message
 * so the UI can render a confirmation button.
 *
 * Tool turns are recorded on the assistant message row (tool_name, tool_input)
 * so we can render them in the chat UI without re-querying the script diff.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import { BRAND_GUIDE } from "@/lib/youtube/brand-guide"
import {
  getSystemPrompt,
  toFormat,
  FORMAT_META,
  type Format,
} from "@/lib/youtube/prompts"
import {
  checkRateLimit,
  getClientIP,
  createRateLimitResponse,
  RATE_LIMITS,
} from "@/lib/rate-limit"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const MAX_USER_MESSAGE = 4_000
const MAX_HISTORY_MESSAGES = 24

interface ChatEditRequest {
  scriptId: string
  userMessage: string
}

interface ScriptRow {
  id: string
  title: string
  topic: string | null
  format: Format | null
  script_body: string | null
  packaging: string | null
  hook_v1: string | null
  hook_v2: string | null
  validation_score: number | null
  validation_notes: unknown
  validated_at: string | null
  panel_review: unknown
  panel_review_score: number | null
  panel_reviewed_at: string | null
  word_count: number | null
}

/** Columns returned to the client after a direct-edit tool. The client merges
 * these into the in-memory script via a functional setState, so anything not
 * touched here keeps its current value. */
const UPDATED_ROW_COLUMNS =
  "id, title, topic, format, script_body, packaging, hook_v1, hook_v2, " +
  "validation_score, validation_notes, validated_at, " +
  "panel_review, panel_review_score, panel_reviewed_at, word_count"

// =============================================================================
// TOOL DEFINITIONS
// =============================================================================

const TOOLS: Anthropic.Tool[] = [
  {
    name: "replace_section",
    description:
      "Replace a single `## Heading` section in the script. Use this for surgical edits — a different hook, a tighter paragraph, a sharper CTA. The heading must match the exact text after `## ` in the current script.",
    input_schema: {
      type: "object",
      properties: {
        heading: {
          type: "string",
          description:
            "The exact heading text (without the `## ` prefix). Case-insensitive match. Example: 'Hook V1', 'Section 1: Context Loop', 'CTA #2'.",
        },
        new_text: {
          type: "string",
          description:
            "The new content for that section. Do NOT include the heading line itself — just the body. Markdown allowed.",
        },
        explanation: {
          type: "string",
          description:
            "One short sentence shown to the user explaining what you changed and why.",
        },
      },
      required: ["heading", "new_text", "explanation"],
    },
  },
  {
    name: "replace_entire_script",
    description:
      "Replace the full script body in one shot. Use this when most sections need rewriting but the structure and angle stay the same — heavier than replace_section but lighter than a full regen.",
    input_schema: {
      type: "object",
      properties: {
        new_text: {
          type: "string",
          description:
            "The full new script in Markdown, including all headings (`## Hook V1`, `## Section 1`, etc.) per the format spec.",
        },
        explanation: {
          type: "string",
          description:
            "One short paragraph shown to the user summarising what changed.",
        },
      },
      required: ["new_text", "explanation"],
    },
  },
  {
    name: "request_regen",
    description:
      "Propose a fresh regeneration from scratch. Use ONLY when the user wants a fundamentally different angle, structure, or framing that would not be served by edits. The user will be shown your rationale and must confirm before the regen runs — so be specific about what you'll tell the generator to do differently.",
    input_schema: {
      type: "object",
      properties: {
        rationale: {
          type: "string",
          description:
            "Two to four sentences. Lead with the change ('Switch to a deeper supply-side angle...'), then the rationale ('...because the current draft repeats the demand framing without new evidence.'). This will be passed verbatim to the generator as validationFeedback.",
        },
      },
      required: ["rationale"],
    },
  },
]

// =============================================================================
// HELPERS
// =============================================================================

function wordCount(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length
}

/** Escape user-provided text for safe insertion into a regex. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Replace the body of a `## Heading` section in the script. Matches the
 * heading line case-insensitively and consumes everything up to the next
 * `## ` or EOF, then writes back `## Heading\n\n{new_text}`.
 * Returns null if the heading isn't found.
 */
function replaceSection(
  scriptBody: string,
  heading: string,
  newText: string
): string | null {
  const headingRegex = new RegExp(
    `(##\\s+${escapeRegex(heading)}[^\\n]*\\n)([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  )
  if (!headingRegex.test(scriptBody)) return null
  return scriptBody.replace(headingRegex, (_match, headingLine: string) => {
    return `${headingLine}\n${newText.trim()}\n`
  })
}

function extractMarkdownSection(markdown: string, titlePattern: RegExp): string | null {
  const regex = new RegExp(
    `##\\s+${titlePattern.source}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`,
    "i"
  )
  const match = markdown.match(regex)
  if (!match) return null
  return match[1].trim().replace(/^---+\s*$/gm, "").trim() || null
}

function parseScriptSections(markdown: string) {
  return {
    packaging: extractMarkdownSection(markdown, /Packaging/),
    hook_v1: extractMarkdownSection(markdown, /Hook\s*V?1/),
    hook_v2: extractMarkdownSection(markdown, /Hook\s*V?2/),
  }
}

// =============================================================================
// HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-chat", RATE_LIMITS.AI)
    if (rl.limited) return createRateLimitResponse(rl.retryAfter!)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { data: isAdmin } = await supabase.rpc("is_admin")
    if (!isAdmin) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const body: ChatEditRequest = await request.json()
    const { scriptId, userMessage } = body

    if (!scriptId || !userMessage?.trim()) {
      return NextResponse.json(
        { error: "scriptId and userMessage are required" },
        { status: 400 }
      )
    }
    if (userMessage.length > MAX_USER_MESSAGE) {
      return NextResponse.json(
        { error: "Message exceeds maximum length" },
        { status: 413 }
      )
    }

    // -------------------------------------------------------------------------
    // Load script + active chat history
    // -------------------------------------------------------------------------

    const { data: script, error: scriptErr } = await supabase
      .from("youtube_scripts")
      .select(
        "id, title, topic, format, script_body, packaging, hook_v1, hook_v2, validation_score, validation_notes, word_count"
      )
      .eq("id", scriptId)
      .maybeSingle<ScriptRow>()

    if (scriptErr || !script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }

    const { data: history } = await supabase
      .from("youtube_script_messages")
      .select("role, content")
      .eq("script_id", scriptId)
      .is("cleared_at", null)
      .order("created_at", { ascending: true })
      .limit(MAX_HISTORY_MESSAGES)

    // NOTE: we deliberately persist the user row AFTER the Anthropic call
    // succeeds. If we wrote it up front and the AI request then failed, the
    // user row would survive as an orphan — and on the next turn the history
    // fetch would produce two consecutive user messages, which violates
    // Anthropic's role-alternation requirement and wedges the chat.

    // -------------------------------------------------------------------------
    // Build system prompt + messages
    // -------------------------------------------------------------------------

    const format: Format = toFormat(script.format)
    const meta = FORMAT_META[format]
    const formatSpec = getSystemPrompt(format)

    const scriptBlock = script.script_body
      ? `\n\nCURRENT SCRIPT BODY:\n\n${script.script_body}`
      : "\n\n(No script body yet — only metadata available.)"

    const validationBlock = script.validation_notes
      ? `\n\nLATEST VALIDATION NOTES (JSON):\n\n${JSON.stringify(
          script.validation_notes,
          null,
          2
        )}`
      : ""

    const systemPrompt = `You are a script editor working alongside Tahir Majithia's team at Prime Capital Dubai. You refine YouTube scripts through conversation.

You have three tools available:
  - replace_section: surgical edit to one \`## Heading\` block (preferred for small changes)
  - replace_entire_script: full body rewrite (use only when most sections need work but the angle and structure stay the same)
  - request_regen: propose a from-scratch regeneration (use ONLY for fundamental angle or structure changes; the user must confirm before it runs)

Rules of engagement:
- Default to the smallest change that solves the user's request. Prefer replace_section over replace_entire_script.
- If the user is asking a question rather than requesting an edit, just answer in text. Don't reach for a tool when none is needed.
- If a section heading is ambiguous, ask before you edit.
- Every tool call MUST include a short \`explanation\` (or \`rationale\` for request_regen) shown to the user.
- Preserve format conventions for ${meta.label}: hook formula ${meta.hookFormula} (${meta.hookName}), ${meta.ctaCount} CTA${meta.ctaCount === 1 ? "" : "s"}, target ${meta.minutesLabel} / ${meta.wordsLabel}.
- Preserve Tahir's voice (measured, evidence-based, restrained, warm, direct), the credibility anchor (AED 3 billion+, 20+ years, multiple cycles), and the exact sign-off "I'm Tahir Majithia. Prime Capital Dubai. With a plan, not a pitch."
- Use UK English. No banned words. No invented CTAs. No emoji.
- Be concise in your chat replies (1-3 short paragraphs); the heavy work goes into the tool call payload, not the chat prose.

Script metadata:
  Title: ${script.title}
  Topic: ${script.topic ?? "(none)"}
  Format: ${meta.label} (${meta.minutesLabel}, ${meta.wordsLabel})
  Hook formula: ${meta.hookFormula} — ${meta.hookName}
  Current word count: ${script.word_count ?? "unknown"}

${scriptBlock}${validationBlock}

---

BRAND GUIDE (reference):

${BRAND_GUIDE}

---

FORMAT SPEC FOR ${meta.label} (reference — same prompt the generator uses):

${formatSpec}`

    const apiMessages: Anthropic.MessageParam[] = [
      ...(history ?? []).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: userMessage },
    ]

    // -------------------------------------------------------------------------
    // Anthropic call
    // -------------------------------------------------------------------------

    const response = await anthropic.messages.create(
      {
        model: process.env.YOUTUBE_CHAT_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 4096,
        temperature: 0.5,
        system: systemPrompt,
        tools: TOOLS,
        messages: apiMessages,
      },
      { signal: request.signal }
    )

    // Concatenate any text blocks; pick up the first tool_use (we constrain
    // the model to one tool per turn, but be defensive about multiples).
    let assistantText = ""
    let toolName: string | null = null
    let toolInput: Record<string, unknown> | null = null

    for (const block of response.content) {
      if (block.type === "text") {
        assistantText += (assistantText ? "\n\n" : "") + block.text
      } else if (block.type === "tool_use" && !toolName) {
        toolName = block.name
        toolInput = block.input as Record<string, unknown>
      }
    }

    // -------------------------------------------------------------------------
    // Apply direct-edit tools
    // -------------------------------------------------------------------------

    let updatedScript: ScriptRow | null = null
    let toolError: string | null = null

    if (toolName === "replace_section" && toolInput && script.script_body) {
      const heading = String(toolInput.heading ?? "")
      const newText = String(toolInput.new_text ?? "")
      if (!heading || !newText) {
        toolError = "Tool call missing heading or new_text"
      } else {
        const newBody = replaceSection(script.script_body, heading, newText)
        if (!newBody) {
          toolError = `Heading "${heading}" not found in the current script. No edit applied.`
        } else {
          const sections = parseScriptSections(newBody)
          const { data: updated, error: updateErr } = await supabase
            .from("youtube_scripts")
            .update({
              script_body: newBody,
              word_count: wordCount(newBody),
              packaging: sections.packaging,
              hook_v1: sections.hook_v1,
              hook_v2: sections.hook_v2,
              // A targeted edit invalidates both the validator AND the panel
              // review — clear both so stale verdicts don't linger in the UI.
              validation_score: null,
              validation_notes: null,
              validated_at: null,
              panel_review: null,
              panel_review_score: null,
              panel_reviewed_at: null,
            })
            .eq("id", scriptId)
            .select(UPDATED_ROW_COLUMNS)
            .single<ScriptRow>()
          if (updateErr) {
            toolError = "Failed to apply edit to the script"
          } else {
            updatedScript = updated
          }
        }
      }
    } else if (toolName === "replace_entire_script" && toolInput) {
      const newText = String(toolInput.new_text ?? "")
      if (!newText.trim()) {
        toolError = "Tool call missing new_text"
      } else {
        const sections = parseScriptSections(newText)
        const { data: updated, error: updateErr } = await supabase
          .from("youtube_scripts")
          .update({
            script_body: newText,
            word_count: wordCount(newText),
            packaging: sections.packaging,
            hook_v1: sections.hook_v1,
            hook_v2: sections.hook_v2,
            validation_score: null,
            validation_notes: null,
            validated_at: null,
            panel_review: null,
            panel_review_score: null,
            panel_reviewed_at: null,
          })
          .eq("id", scriptId)
          .select(UPDATED_ROW_COLUMNS)
          .single<ScriptRow>()
        if (updateErr) {
          toolError = "Failed to apply full rewrite to the script"
        } else {
          updatedScript = updated
        }
      }
    }
    // request_regen is intentionally a no-op here — the client triggers the
    // actual regen via /regen-from-chat after the user confirms.

    // If a tool failed at the DB level we surface it in the assistant message
    // so the user knows the edit didn't land.
    if (toolError) {
      assistantText = `${assistantText ? assistantText + "\n\n" : ""}_${toolError}_`
    }

    // -------------------------------------------------------------------------
    // Persist both messages now that the AI turn has fully landed.
    //
    // We insert user first, then assistant — separate calls so each gets its
    // own `now()` for `created_at`, preserving order. If the assistant insert
    // fails we roll back the user row to keep the thread well-formed for the
    // next turn.
    // -------------------------------------------------------------------------

    const { data: userRow, error: userInsertErr } = await supabase
      .from("youtube_script_messages")
      .insert({
        script_id: scriptId,
        role: "user",
        content: userMessage,
      })
      .select("*")
      .single()
    if (userInsertErr || !userRow) {
      console.error("Failed to persist user message:", userInsertErr)
      return NextResponse.json(
        { error: "Failed to save message" },
        { status: 500 }
      )
    }

    const { data: assistantRow, error: assistantInsertErr } = await supabase
      .from("youtube_script_messages")
      .insert({
        script_id: scriptId,
        role: "assistant",
        content: assistantText || "(No reply text returned by the model.)",
        tool_name: toolName,
        tool_input: toolInput,
      })
      .select("*")
      .single()
    if (assistantInsertErr || !assistantRow) {
      console.error("Failed to persist assistant message:", assistantInsertErr)
      const { error: rollbackErr } = await supabase
        .from("youtube_script_messages")
        .delete()
        .eq("id", userRow.id)
      if (rollbackErr) {
        console.error("Failed to roll back orphaned user row:", rollbackErr)
      }
      return NextResponse.json(
        { error: "Failed to save assistant message" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      userMessage: userRow,
      assistantMessage: assistantRow,
      updatedScript,
      toolError,
    })
  } catch (error) {
    console.error("Chat edit error:", error)
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    )
  }
}
