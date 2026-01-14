/**
 * CATALYST - Generate Essentials API
 *
 * POST /api/admin/generate-essentials
 *
 * Generates AI-extracted essentials for a learning module.
 * Uses Claude to extract pedagogically-structured content.
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import Anthropic from "@anthropic-ai/sdk"
import {
  ESSENTIALS_PROMPT_VERSION,
  hashContent,
  buildEssentialsPrompt,
  parseEssentialsResponse,
} from "@/lib/lms/essentials"
import type { EssentialsContent } from "@/lib/learning-types"

// =============================================================================
// TYPES
// =============================================================================

interface GenerateRequest {
  moduleId: string
  requiredFacts?: string[]
  preview?: boolean // If true, return essentials without saving
  essentials?: EssentialsContent // If provided, save this instead of generating
}

// =============================================================================
// MAIN HANDLER
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Parse request
    const body = (await request.json()) as GenerateRequest
    const { moduleId, requiredFacts = [], preview = false, essentials: providedEssentials } = body

    if (!moduleId) {
      return NextResponse.json({ error: "moduleId is required" }, { status: 400 })
    }

    // 2. Create Supabase client and verify auth
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // TODO: Add admin role check when roles are implemented
    // For now, any authenticated user can generate essentials

    // 3. Fetch module with competency context
    const { data: module, error: moduleError } = await supabase
      .from("learning_modules")
      .select(
        `
        id,
        slug,
        title,
        type,
        content,
        estimated_duration,
        frontmatter,
        competency_id,
        competencies (
          id,
          slug,
          name,
          description
        )
      `
      )
      .eq("id", moduleId)
      .single()

    if (moduleError || !module) {
      console.error("Module fetch error:", moduleError)
      return NextResponse.json({ error: "Module not found" }, { status: 404 })
    }

    // 4. Fetch related audio transcripts
    const { data: audioTranscripts } = await supabase
      .from("audio_transcripts")
      .select("slug, title, duration, type")
      .eq("module_id", moduleId)

    // 5. Calculate source hash
    const sourceHash = hashContent(module.content || "")

    // 6. If essentials provided (admin edit), save directly
    if (providedEssentials) {
      const essentialsToSave = {
        ...providedEssentials,
        generatedAt: new Date().toISOString(),
        sourceHash,
        promptVersion: ESSENTIALS_PROMPT_VERSION,
      }

      const { error: updateError } = await supabase
        .from("learning_modules")
        .update({
          essentials: essentialsToSave,
          essentials_generated_at: new Date().toISOString(),
          essentials_source_hash: sourceHash,
          essentials_prompt_version: ESSENTIALS_PROMPT_VERSION,
        })
        .eq("id", moduleId)

      if (updateError) {
        console.error("Update error:", updateError)
        return NextResponse.json({ error: "Failed to save essentials" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        essentials: essentialsToSave,
        sourceHash,
        promptVersion: ESSENTIALS_PROMPT_VERSION,
      })
    }

    // 7. Generate essentials via Claude
    const competency = module.competencies as unknown as { name: string; description: string | null } | null

    const { systemPrompt, userPrompt } = buildEssentialsPrompt({
      module: {
        title: module.title,
        type: module.type,
        content: module.content || "",
        estimated_duration: module.estimated_duration,
        frontmatter: module.frontmatter as Record<string, unknown> | null,
      },
      competency: {
        name: competency?.name || "Unknown",
        description: competency?.description || null,
      },
      audioTranscripts: (audioTranscripts || []).map((a) => ({
        slug: a.slug,
        title: a.title,
        duration: a.duration || "unknown",
        type: a.type,
      })),
      requiredFacts,
    })

    // 8. Call Claude API
    const anthropic = new Anthropic()

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    })

    // 9. Parse response
    const content = response.content[0]
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response type from AI" }, { status: 500 })
    }

    let essentials: EssentialsContent
    try {
      essentials = parseEssentialsResponse(content.text)
    } catch (parseError) {
      console.error("Parse error:", parseError)
      console.error("Raw response:", content.text)
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          rawResponse: content.text.substring(0, 500),
        },
        { status: 500 }
      )
    }

    // Add metadata
    essentials.generatedAt = new Date().toISOString()
    essentials.sourceHash = sourceHash
    essentials.promptVersion = ESSENTIALS_PROMPT_VERSION

    // 10. If preview mode, return without saving
    if (preview) {
      return NextResponse.json({
        success: true,
        essentials,
        sourceHash,
        promptVersion: ESSENTIALS_PROMPT_VERSION,
        preview: true,
      })
    }

    // 11. Save to database
    const { error: updateError } = await supabase
      .from("learning_modules")
      .update({
        essentials,
        essentials_generated_at: new Date().toISOString(),
        essentials_source_hash: sourceHash,
        essentials_prompt_version: ESSENTIALS_PROMPT_VERSION,
      })
      .eq("id", moduleId)

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: "Failed to save essentials" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      essentials,
      sourceHash,
      promptVersion: ESSENTIALS_PROMPT_VERSION,
    })
  } catch (error) {
    console.error("Generate essentials error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
