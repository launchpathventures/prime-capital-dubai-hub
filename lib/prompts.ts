/**
 * CATALYST - Prompt file utilities
 *
 * Reads prompt files from /catalyst/prompts/ at build time.
 * Used by the Prompts docs pages to display raw markdown content.
 */

import { readFileSync } from "fs"
import { join } from "path"

/**
 * Read a prompt file from /catalyst/prompts/
 * Only works in Server Components (uses Node fs module)
 */
export function getPrompt(filename: string): string {
  const path = join(process.cwd(), "catalyst/prompts", filename)
  return readFileSync(path, "utf-8")
}

/**
 * Read a markdown file from /catalyst/
 * Only works in Server Components (uses Node fs module)
 */
export function getCatalystDoc(filename: string): string {
  const path = join(process.cwd(), "catalyst", filename)
  return readFileSync(path, "utf-8")
}

/**
 * Prompt metadata for display
 */
export interface PromptMeta {
  /** Display name shown in tab/header */
  name: string
  /** Source filename in /catalyst/prompts/ */
  source: string
  /** Raw markdown content (loaded at build time) */
  content: string
}

/**
 * Load multiple prompts by filename
 */
export function getPrompts(
  promptDefs: Array<{ name: string; source: string }>
): PromptMeta[] {
  return promptDefs.map((def) => ({
    name: def.name,
    source: def.source,
    content: getPrompt(def.source),
  }))
}
