/**
 * CATALYST - Essentials Utilities
 *
 * Utilities for working with AI-generated module essentials.
 */

import crypto from "crypto"
import type { EssentialsContent, LearningModule } from "@/lib/learning-types"

// =============================================================================
// CONSTANTS
// =============================================================================

export const ESSENTIALS_PROMPT_VERSION = "1.0"

// =============================================================================
// CONTENT HASHING
// =============================================================================

/**
 * Generate MD5 hash of module content for staleness detection.
 * Used to determine if essentials need regeneration.
 */
export function hashContent(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex")
}

/**
 * Check if essentials are stale (source content has changed).
 */
export function isEssentialsStale(module: {
  content: string
  essentials_source_hash: string | null
}): boolean {
  if (!module.essentials_source_hash) return true
  return hashContent(module.content) !== module.essentials_source_hash
}

// =============================================================================
// IMAGE EXTRACTION
// =============================================================================

/**
 * Extract images from markdown content.
 * Parses: ![alt text](/images/path/file.png "caption")
 */
export function extractImagesFromMarkdown(content: string): Array<{
  src: string
  alt: string
  caption: string
}> {
  const images: Array<{ src: string; alt: string; caption: string }> = []
  
  // Match markdown images: ![alt](src "caption") or ![alt](src)
  const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g
  let match
  
  while ((match = imageRegex.exec(content)) !== null) {
    const [, alt, src, caption] = match
    
    // Only include images from /images/lms/
    if (src.startsWith("/images/lms/")) {
      images.push({
        src,
        alt: alt || "",
        caption: caption || alt || "",
      })
    }
  }
  
  return images
}

// =============================================================================
// PROMPT BUILDING
// =============================================================================

interface PromptContext {
  module: {
    title: string
    type: string
    content: string
    estimated_duration: string | null
    frontmatter: Record<string, unknown> | null
  }
  competency: {
    name: string
    description: string | null
  }
  audioTranscripts: Array<{
    slug: string
    title: string
    duration: string | null
    type: string
  }>
  requiredFacts: string[]
}

/**
 * Build the AI prompt for essentials generation.
 * Includes full pedagogical context for quality extraction.
 */
export function buildEssentialsPrompt(context: PromptContext): {
  systemPrompt: string
  userPrompt: string
} {
  const { module, competency, audioTranscripts, requiredFacts } = context
  
  const learningObjectives = (module.frontmatter?.learningObjectives as string[]) || []
  const aiCoach = module.frontmatter?.aiCoach as {
    persona?: string
    focusAreas?: string[]
  } | undefined
  
  // Extract images from content for reference
  const images = extractImagesFromMarkdown(module.content)
  
  const systemPrompt = `You are an expert learning designer creating "Essentials" summaries for real estate training modules.

Your task is to extract a pedagogically-structured summary that gives new agents the 20% of content they need for 80% of client conversations.

OUTPUT FORMAT: Valid JSON matching the EssentialsContent schema exactly. No markdown code blocks, just raw JSON.

SCHEMA:
{
  "tldr": "string (200 words max)",
  "keyFacts": [{ "fact": "string", "context": "string (optional)", "source": "string (optional)" }],
  "scripts": [{ "scenario": "string", "script": "string (verbatim)", "source": "string (optional)" }],
  "images": [{ "src": "string", "alt": "string", "caption": "string", "essential": boolean, "context": "string (optional)" }],
  "audio": [{ "slug": "string", "title": "string", "duration": "string", "context": "string" }],
  "practice": { "situation": "string", "task": "string", "success": "string" },
  "reflection": "string"
}

CRITICAL RULES:
1. NEVER lose specific numbers, statistics, or thresholds — clients ask about these
2. EXTRACT scripts verbatim — these are the exact words agents should use
3. PRESERVE all document images (title deeds, certificates, forms) — agents must recognize them
4. Keep tldr under 200 words — ruthlessly cut "nice to know" content
5. Focus on actionable knowledge — what can the agent DO with this?
6. Reference audio transcripts when they demonstrate the skill being taught
7. Address ALL learning objectives in your extraction
8. Required facts MUST appear in keyFacts array`

  const userPrompt = `# GENERATION CONTEXT

## 1. Learner Persona
Name: Nadia (New Agent)
Background: Sales experience, new to Dubai real estate
Goals:
  - Get productive quickly to start earning
  - Avoid embarrassment in early client conversations
  - Know what to say when clients ask common questions
Constraints: 2-3 hours/day, mobile-first consumption

## 2. Module Metadata
Title: ${module.title}
Competency: ${competency.name}
Type: ${module.type} (knowledge | skills | skills-script)
Estimated Duration: ${module.estimated_duration || "25 minutes"}

## 3. Learning Objectives (MUST address ALL in essentials)
${learningObjectives.length > 0 ? learningObjectives.map(obj => `- ${obj}`).join('\n') : 'No specific objectives defined'}

## 4. AI Coach Context
${aiCoach ? `Persona: ${aiCoach.persona || 'Coach'}\nFocus Areas: ${(aiCoach.focusAreas || []).join(', ')}` : 'No AI coach configured'}

## 5. Required Facts (MUST appear in keyFacts)
${requiredFacts.length > 0 ? requiredFacts.map(f => `- "${f}"`).join('\n') : 'None specified - extract the most important facts'}

## 6. Available Audio Transcripts
${audioTranscripts.length > 0 
  ? audioTranscripts.map(a => `- slug: "${a.slug}", title: "${a.title}", duration: "${a.duration || 'unknown'}", type: "${a.type}"`).join('\n')
  : 'No audio available for this module'}

## 7. Images Found in Content
${images.length > 0
  ? images.map(img => `- src: "${img.src}", alt: "${img.alt}", caption: "${img.caption}"`).join('\n')
  : 'No images in this module'}

For each image, determine if essential=true based on:
- Does it show a document agents must recognize? → essential
- Is it referenced by a learning objective? → essential
- Is it a "nice to have" illustration? → not essential

## 8. Full Module Content

${module.content}

---

Generate the EssentialsContent JSON now. Remember:
- Address all learning objectives
- Include all required facts
- Extract scripts verbatim (not summarized)
- Mark document images as essential
- Keep tldr under 200 words`

  return { systemPrompt, userPrompt }
}

// =============================================================================
// RESPONSE PARSING
// =============================================================================

/**
 * Parse AI response to extract EssentialsContent JSON.
 * Handles responses with or without markdown code blocks.
 */
export function parseEssentialsResponse(responseText: string): EssentialsContent {
  // Try to extract JSON from markdown code block first
  const jsonMatch = responseText.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
  
  let jsonStr: string
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  } else {
    // Try to find raw JSON object
    const objectMatch = responseText.match(/\{[\s\S]*\}/)
    if (!objectMatch) {
      throw new Error("No JSON found in response")
    }
    jsonStr = objectMatch[0]
  }
  
  const parsed = JSON.parse(jsonStr)
  
  // Validate required fields
  if (!parsed.tldr || !parsed.keyFacts || !parsed.practice || !parsed.reflection) {
    throw new Error("Missing required fields in essentials response")
  }
  
  return parsed as EssentialsContent
}
