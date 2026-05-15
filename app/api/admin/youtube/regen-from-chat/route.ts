/**
 * CATALYST - YouTube Regen-From-Chat API
 *
 * POST /api/admin/youtube/regen-from-chat
 *
 * Atomic regen handoff:
 *   1. Snapshot the current script state into youtube_script_versions
 *      (this is the pre-regen "before" picture, plus the chat summary that
 *      motivated the rewrite).
 *   2. Mark every active message in the chat thread as cleared.
 *   3. Stream a fresh generation from Opus using the chat-derived feedback
 *      and the existing previousScript+validationFeedback regen path.
 *
 * The client then persists the streamed body via updateYouTubeScript, same
 * as the /generate-script flow.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
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

const MAX_RATIONALE = 4_000
const MAX_PREV_SCRIPT = 8_000

interface RegenRequest {
  scriptId: string
  /** The rationale from the AI's request_regen tool call, surfaced to and confirmed by the user. */
  rationale: string
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
  word_count: number | null
  validation_score: number | null
  validation_notes: unknown
  panel_review: unknown
  panel_review_score: number | null
}

interface MessageRow {
  id: string
  role: "user" | "assistant"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rl = checkRateLimit(ip, "youtube-script", RATE_LIMITS.AI)
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

    const body: RegenRequest = await request.json()
    const { scriptId, rationale } = body

    if (!scriptId || !rationale?.trim()) {
      return NextResponse.json(
        { error: "scriptId and rationale are required" },
        { status: 400 }
      )
    }

    // -------------------------------------------------------------------------
    // Load script + active chat
    // -------------------------------------------------------------------------

    const { data: script, error: scriptErr } = await supabase
      .from("youtube_scripts")
      .select(
        "id, title, topic, format, script_body, packaging, hook_v1, hook_v2, word_count, validation_score, validation_notes, panel_review, panel_review_score"
      )
      .eq("id", scriptId)
      .maybeSingle<ScriptRow>()

    if (scriptErr || !script) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 })
    }
    if (!script.script_body?.trim()) {
      return NextResponse.json(
        { error: "Cannot regen a script that has no draft yet" },
        { status: 400 }
      )
    }

    const { data: history } = await supabase
      .from("youtube_script_messages")
      .select("id, role, content")
      .eq("script_id", scriptId)
      .is("cleared_at", null)
      .order("created_at", { ascending: true })

    // -------------------------------------------------------------------------
    // Snapshot current state into youtube_script_versions
    // -------------------------------------------------------------------------

    const chatSummary = buildChatSummary(history ?? [], rationale)

    // Read-then-insert isn't atomic, so two simultaneous regens can collide
    // on the (script_id, version_number) unique constraint. We retry once
    // with a fresh max before giving up — sufficient for the realistic case
    // of an accidental double-click.
    let nextVersion = 0
    let versionErr: { code?: string; message: string } | null = null
    for (let attempt = 0; attempt < 2; attempt++) {
      const { data: lastVersion } = await supabase
        .from("youtube_script_versions")
        .select("version_number")
        .eq("script_id", scriptId)
        .order("version_number", { ascending: false })
        .limit(1)
        .maybeSingle<{ version_number: number }>()
      nextVersion = (lastVersion?.version_number ?? 0) + 1

      const result = await supabase
        .from("youtube_script_versions")
        .insert({
          script_id: scriptId,
          version_number: nextVersion,
          script_body: script.script_body,
          packaging: script.packaging,
          hook_v1: script.hook_v1,
          hook_v2: script.hook_v2,
          word_count: script.word_count,
          validation_score: script.validation_score,
          validation_notes: script.validation_notes,
          panel_review: script.panel_review,
          panel_review_score: script.panel_review_score,
          chat_summary: chatSummary,
        })
      versionErr = result.error
      if (!versionErr) break
      // 23505 = unique_violation. Anything else is a real DB error.
      if (versionErr.code !== "23505") break
    }
    if (versionErr) {
      console.error("Failed to snapshot version:", versionErr)
      return NextResponse.json(
        { error: "Failed to snapshot current version" },
        { status: 500 }
      )
    }

    // -------------------------------------------------------------------------
    // Roll off the chat — every active message moves to historical.
    //
    // The validation + panel review fields on the live row are intentionally
    // NOT cleared here: if the stream fails the row keeps its current scores
    // (which match the still-current body). The client's post-stream save
    // nulls them atomically with the new body — see
    // script-detail-page.tsx::handleRegenFromChat.
    // -------------------------------------------------------------------------

    const messageIds = (history ?? []).map((m) => m.id)
    if (messageIds.length > 0) {
      let clearErr: { message: string } | null = null
      for (let attempt = 0; attempt < 2; attempt++) {
        const result = await supabase
          .from("youtube_script_messages")
          .update({ cleared_at: new Date().toISOString() })
          .in("id", messageIds)
        clearErr = result.error
        if (!clearErr) break
      }
      if (clearErr) {
        console.error("Failed to clear chat after retry:", clearErr)
        return NextResponse.json(
          { error: "Snapshot saved but chat rollover failed — please retry" },
          { status: 500 }
        )
      }
    }

    // -------------------------------------------------------------------------
    // Stream the regen from Opus
    // -------------------------------------------------------------------------

    const format: Format = toFormat(script.format)
    const meta = FORMAT_META[format]
    const systemPrompt = getSystemPrompt(format)

    const cappedRationale = rationale.slice(0, MAX_RATIONALE)
    const cappedPrevScript = script.script_body.slice(0, MAX_PREV_SCRIPT)

    const userMessage = `REGENERATE this YouTube script for Prime Capital Dubai. Keep the same topic, angle, and **format** (${meta.label}), but apply the rewrite brief below — which was agreed in chat with the user.

Title / Working Title: ${script.title}
Concept: ${script.topic ?? script.title}
Format: ${meta.label} (${meta.minutesLabel}, ${meta.wordsLabel})

REWRITE BRIEF (agreed in chat — apply every point):
${cappedRationale}

PREVIOUS SCRIPT (rewrite and improve — do not copy verbatim):
${cappedPrevScript}

Generate the improved script now, addressing every point of the rewrite brief above. Follow the format spec exactly.`

    const stream = await anthropic.messages.stream(
      {
        model: process.env.YOUTUBE_SCRIPT_MODEL || "claude-opus-4-20250514",
        max_tokens: 16_384,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      },
      { signal: request.signal }
    )

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          console.error("Regen stream error:", err)
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        // Surface the new version number so the client can render a "v{n}"
        // pill in the snapshot list once the regen completes.
        "X-Snapshot-Version": String(nextVersion),
      },
    })
  } catch (error) {
    console.error("Regen-from-chat error:", error)
    return NextResponse.json(
      { error: "Failed to regenerate script" },
      { status: 500 }
    )
  }
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Build a human-readable summary of the chat thread for the snapshot row.
 * Format: rationale on top, then the bullet-pointed user-side requests so a
 * later reviewer can see at a glance what motivated this regen.
 */
function buildChatSummary(messages: MessageRow[], rationale: string): string {
  const userRequests = messages
    .filter((m) => m.role === "user")
    .map((m) => `- ${m.content.trim().slice(0, 280)}`)
    .slice(-8)

  const parts: string[] = [`Rewrite brief: ${rationale.trim()}`]
  if (userRequests.length > 0) {
    parts.push("User requests during chat:")
    parts.push(...userRequests)
  }
  return parts.join("\n")
}
