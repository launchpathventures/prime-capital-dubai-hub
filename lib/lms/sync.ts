/**
 * CATALYST - LMS Content Sync
 *
 * Syncs markdown content from content/lms/ to Supabase.
 * Preserves all content exactly as written.
 *
 * Philosophy: Markdown is source of truth. Store frontmatter as flexible JSONB.
 * UI adapts to content.
 */

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { createClient } from "@supabase/supabase-js"

// =============================================================================
// TYPES
// =============================================================================

interface ParsedMarkdown {
  frontmatter: Record<string, unknown>
  content: string
  slug: string
}

interface QuizQuestion {
  question: string
  options: Array<{ text: string; correct: boolean }>
  explanation: string
}

// =============================================================================
// CONFIGURATION
// =============================================================================

function getContentDir(): string {
  return path.join(process.cwd(), "content/lms")
}

function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables."
    )
  }

  return createClient(url, serviceRoleKey)
}

// =============================================================================
// PARSING HELPERS
// =============================================================================

/**
 * Parse markdown file preserving everything.
 * Returns frontmatter, content, and slug.
 */
function parseMarkdownFile(filePath: string): ParsedMarkdown {
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data: frontmatter, content } = matter(raw)

  // Get slug from frontmatter or filename
  const filename = path.basename(filePath, ".md")
  const slug =
    (frontmatter.slug as string) || filename.replace(/^\d+(\.\d+)?-/, "")

  return { frontmatter, content, slug }
}

/**
 * Get competency folders from content directory.
 * Folders are named like "1-market-intelligence", "2-client-discovery".
 */
function getCompetencyFolders(contentDir: string): string[] {
  return fs
    .readdirSync(contentDir)
    .filter(
      (f) =>
        f.match(/^\d+-/) && fs.statSync(path.join(contentDir, f)).isDirectory()
    )
    .sort()
}

/**
 * Parse quiz questions from markdown content.
 * Questions are formatted as ### Question N with checkboxes for options.
 */
function parseQuizQuestions(content: string): QuizQuestion[] {
  const questions: QuizQuestion[] = []

  // Split by ### Question N
  const questionBlocks = content.split(/###\s+Question\s+\d+/i).slice(1)

  for (const block of questionBlocks) {
    const lines = block.trim().split("\n")

    // First bold text is the question
    const questionMatch = block.match(/\*\*(.+?)\*\*/)
    const question = questionMatch ? questionMatch[1] : ""

    // Options are - [ ] or - [x] lines
    const options: Array<{ text: string; correct: boolean }> = []
    for (const line of lines) {
      const optionMatch = line.match(/^-\s+\[([ x])\]\s+(.+)/)
      if (optionMatch) {
        options.push({
          text: optionMatch[2].replace(/^[A-D]\)\s*/, ""),
          correct: optionMatch[1] === "x",
        })
      }
    }

    // Explanation follows **Explanation**:
    const explanationMatch = block.match(
      /\*\*Explanation\*\*:\s*([\s\S]+?)(?=---|\n\n###|$)/
    )
    const explanation = explanationMatch ? explanationMatch[1].trim() : ""

    if (question && options.length > 0) {
      questions.push({ question, options, explanation })
    }
  }

  return questions
}

// =============================================================================
// SYNC FUNCTIONS
// =============================================================================

/**
 * Sync competency index files to competencies table.
 * Reads _index.md from each competency folder.
 */
export async function syncCompetencies(): Promise<void> {
  const contentDir = getContentDir()
  const supabase = createSupabaseAdmin()

  const folders = getCompetencyFolders(contentDir)

  for (const folder of folders) {
    const indexPath = path.join(contentDir, folder, "_index.md")
    if (!fs.existsSync(indexPath)) {
      console.warn(`⚠ No _index.md found in ${folder}, skipping`)
      continue
    }

    const { frontmatter } = parseMarkdownFile(indexPath)
    const order = parseInt(folder.split("-")[0])
    const slug = folder.replace(/^\d+-/, "")

    // Upsert competency
    const { error } = await supabase.from("competencies").upsert(
      {
        slug,
        name: (frontmatter.title as string) || slug,
        description: frontmatter.description as string,
        display_order: order,
      },
      { onConflict: "slug" }
    )

    if (error) {
      console.error(`✗ Error syncing competency ${slug}:`, error.message)
    } else {
      console.log(`✓ Synced competency: ${slug}`)
    }
  }
}

/**
 * Sync module files to learning_modules table.
 * Reads all .md files (except _index.md) from each competency folder.
 */
export async function syncModules(): Promise<void> {
  const contentDir = getContentDir()
  const supabase = createSupabaseAdmin()

  // Get competencies for ID lookup
  const { data: competencies, error: compError } = await supabase
    .from("competencies")
    .select("id, slug")

  if (compError) {
    throw new Error(`Failed to fetch competencies: ${compError.message}`)
  }

  const competencyMap = new Map(competencies?.map((c) => [c.slug, c.id]))

  const folders = getCompetencyFolders(contentDir)

  for (const folder of folders) {
    const competencySlug = folder.replace(/^\d+-/, "")
    const competencyId = competencyMap.get(competencySlug)

    if (!competencyId) {
      console.warn(`⚠ No competency found for ${competencySlug}, skipping`)
      continue
    }

    const folderPath = path.join(contentDir, folder)
    const files = fs
      .readdirSync(folderPath)
      .filter(
        (f) =>
          f.endsWith(".md") &&
          !f.startsWith("_") &&
          !f.endsWith(".audio.md") &&
          !f.startsWith("AUDIT") &&
          !f.startsWith("README") &&
          !f.startsWith("EXECUTIVE") &&
          !f.startsWith("STATISTICS")
      )
      .sort()

    console.log(`  📁 ${competencySlug} (${files.length} modules)`)

    let order = 0
    for (const file of files) {
      const filePath = path.join(folderPath, file)
      const { frontmatter, content, slug } = parseMarkdownFile(filePath)

      const { error } = await supabase.from("learning_modules").upsert(
        {
          competency_id: competencyId,
          slug,
          title: (frontmatter.title as string) || slug,
          description: frontmatter.description as string,
          module_number:
            (frontmatter.moduleNumber as string) ||
            (frontmatter.module as string),
          type:
            (frontmatter.type as string) ||
            (frontmatter.moduleType as string) ||
            "knowledge",
          estimated_duration: frontmatter.estimatedDuration as string,
          frontmatter, // ALL frontmatter preserved
          content, // Full markdown body
          display_order: order++,
        },
        { onConflict: "competency_id,slug" }
      )

      if (error) {
        console.error(`    ✗ Error syncing module ${slug}:`, error.message)
      } else {
        console.log(`    ✓ ${slug}`)
      }
    }
  }
}

/**
 * Sync audio transcript files (*.audio.md) to audio_transcripts table.
 */
export async function syncAudioTranscripts(): Promise<void> {
  const contentDir = getContentDir()
  const supabase = createSupabaseAdmin()

  // Get modules and competencies for linking
  const { data: modules, error: modError } = await supabase
    .from("learning_modules")
    .select("id, slug, competency_id")

  if (modError) {
    throw new Error(`Failed to fetch modules: ${modError.message}`)
  }

  const { data: competencies, error: compError } = await supabase
    .from("competencies")
    .select("id, slug")

  if (compError) {
    throw new Error(`Failed to fetch competencies: ${compError.message}`)
  }

  const moduleMap = new Map(modules?.map((m) => [m.slug, m]))
  const competencyMap = new Map(competencies?.map((c) => [c.slug, c.id]))

  const folders = getCompetencyFolders(contentDir)

  let audioCount = 0
  for (const folder of folders) {
    const folderPath = path.join(contentDir, folder)
    const competencySlug = folder.replace(/^\d+-/, "")
    const competencyId = competencyMap.get(competencySlug)

    // Find all .audio.md files
    const audioFiles = fs
      .readdirSync(folderPath)
      .filter((f) => f.endsWith(".audio.md"))

    for (const file of audioFiles) {
      const filePath = path.join(folderPath, file)
      const { frontmatter, content } = parseMarkdownFile(filePath)

      // Determine if this is for a module or competency
      const baseSlug = file.replace(".audio.md", "")
      const isCompetencyAudio = baseSlug === "_index"

      // Get linked module if applicable
      const moduleSlug =
        (frontmatter.moduleSlug as string) ||
        baseSlug.replace(/^\d+(\.\d+)?-/, "")
      const linkedModule = moduleMap.get(moduleSlug)

      const slug = isCompetencyAudio
        ? `${competencySlug}-intro-audio`
        : `${moduleSlug}-audio`

      const { error } = await supabase.from("audio_transcripts").upsert(
        {
          slug,
          module_id: linkedModule?.id || null,
          competency_id: isCompetencyAudio
            ? competencyId
            : linkedModule?.competency_id,
          title: (frontmatter.title as string) || slug,
          duration: frontmatter.duration as string,
          voice: (frontmatter.voice as string) || "coach",
          type: (frontmatter.type as string) || "demonstration",
          frontmatter,
          transcript: content,
        },
        { onConflict: "slug" }
      )

      if (error) {
        console.error(`  ✗ Error syncing audio ${slug}:`, error.message)
      } else {
        console.log(`  🎧 ${slug}`)
        audioCount++
      }
    }
  }

  if (audioCount === 0) {
    console.log("  (No audio transcripts found)")
  }
}

/**
 * Sync quiz files to quiz_questions table.
 * Reads markdown files from content/lms/quizzes/ folder.
 */
export async function syncQuizzes(): Promise<void> {
  const contentDir = getContentDir()
  const supabase = createSupabaseAdmin()

  const quizzesDir = path.join(contentDir, "quizzes")
  if (!fs.existsSync(quizzesDir)) {
    console.log("  (No quizzes folder found)")
    return
  }

  const files = fs.readdirSync(quizzesDir).filter((f) => f.endsWith(".md") && !f.startsWith("AUDIT"))

  for (const file of files) {
    const filePath = path.join(quizzesDir, file)
    const { frontmatter, content } = parseMarkdownFile(filePath)

    const quizId = (frontmatter.slug as string) || file.replace(".md", "")

    // Parse questions from markdown
    const questions = parseQuizQuestions(content)

    // Delete existing questions for this quiz
    const { error: deleteError } = await supabase
      .from("quiz_questions")
      .delete()
      .eq("quiz_id", quizId)

    if (deleteError) {
      console.error(
        `  ✗ Error clearing existing questions for ${quizId}:`,
        deleteError.message
      )
      continue
    }

    // Insert questions
    for (const [index, q] of questions.entries()) {
      const { error } = await supabase.from("quiz_questions").insert({
        quiz_id: quizId,
        competency_slug: frontmatter.competency as string,
        related_module: frontmatter.relatedModule as string,
        question_number: index + 1,
        question_text: q.question,
        question: q.question, // Also populate legacy column
        options: q.options,
        explanation: q.explanation,
        display_order: index,
      })

      if (error) {
        console.error(
          `    ✗ Error inserting question ${index + 1}:`,
          error.message
        )
      }
    }

    console.log(`  ✓ ${quizId} (${questions.length} questions)`)
  }
}

// =============================================================================
// MAIN SYNC FUNCTION
// =============================================================================

/**
 * Run full LMS content sync.
 * Syncs competencies, modules, audio transcripts, and quizzes.
 */
export async function syncLmsContent(): Promise<void> {
  console.log("🚀 Starting LMS content sync...\n")

  console.log("📁 Syncing competencies...")
  await syncCompetencies()

  console.log("\n📄 Syncing modules...")
  await syncModules()

  console.log("\n🎧 Syncing audio transcripts...")
  await syncAudioTranscripts()

  console.log("\n❓ Syncing quizzes...")
  await syncQuizzes()

  console.log("\n✅ Sync complete!")
}
