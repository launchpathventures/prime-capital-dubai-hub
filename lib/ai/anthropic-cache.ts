/**
 * CATALYST - Anthropic Prompt Caching Helpers
 */

import type Anthropic from "@anthropic-ai/sdk"

const FIVE_MINUTE_CACHE_CONTROL = {
  type: "ephemeral",
  ttl: "5m",
} satisfies Anthropic.CacheControlEphemeral

/**
 * Anthropic can cache explicit text blocks, not the shorthand system string.
 * Keep this tiny so route handlers can opt in only for stable prompt prefixes.
 */
export function cachedSystemPrompt(systemPrompt: string): Anthropic.TextBlockParam[] {
  return [
    {
      type: "text",
      text: systemPrompt,
      cache_control: FIVE_MINUTE_CACHE_CONTROL,
    },
  ]
}

/**
 * Place one cache breakpoint on the final custom function tool. Provider tools
 * such as web_search are intentionally skipped.
 */
export function withCachedFinalTool<T extends Anthropic.ToolUnion>(tools: readonly T[]): T[] {
  const next = tools.map((tool) => ({ ...tool })) as T[]

  for (let index = next.length - 1; index >= 0; index--) {
    const tool = next[index]
    if (!("input_schema" in tool)) continue

    next[index] = {
      ...tool,
      cache_control: tool.cache_control ?? FIVE_MINUTE_CACHE_CONTROL,
    } as T
    break
  }

  return next
}
