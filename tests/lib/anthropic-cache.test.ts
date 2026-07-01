/**
 * CATALYST - Anthropic Prompt Caching Helper Tests
 */

import type Anthropic from "@anthropic-ai/sdk"
import { describe, expect, it } from "vitest"
import {
  cachedSystemPrompt,
  withCachedFinalTool,
} from "@/lib/ai/anthropic-cache"

describe("anthropic-cache helpers", () => {
  it("wraps a system prompt as a cacheable text block", () => {
    expect(cachedSystemPrompt("Stable instructions")).toEqual([
      {
        type: "text",
        text: "Stable instructions",
        cache_control: {
          type: "ephemeral",
          ttl: "5m",
        },
      },
    ])
  })

  it("adds a 5 minute cache breakpoint to the final custom tool", () => {
    const tools: Anthropic.ToolUnion[] = [
      {
        name: "replace_section",
        description: "Replace one section.",
        input_schema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "web_search",
        type: "web_search_20250305",
      },
      {
        name: "request_regen",
        description: "Request regeneration.",
        input_schema: {
          type: "object",
          properties: {},
        },
      },
    ]

    const cached = withCachedFinalTool(tools)

    expect(cached).not.toBe(tools)
    expect(cached[0]).not.toHaveProperty("cache_control")
    expect(cached[1]).not.toHaveProperty("cache_control")
    expect(cached[2]).toMatchObject({
      cache_control: {
        type: "ephemeral",
        ttl: "5m",
      },
    })
    expect(tools[2]).not.toHaveProperty("cache_control")
  })

  it("preserves existing cache control on the final custom tool", () => {
    const tools: Anthropic.ToolUnion[] = [
      {
        name: "replace_entire_script",
        description: "Replace the script.",
        cache_control: {
          type: "ephemeral",
          ttl: "1h",
        },
        input_schema: {
          type: "object",
          properties: {},
        },
      },
    ]

    expect(withCachedFinalTool(tools)[0]).toMatchObject({
      cache_control: {
        type: "ephemeral",
        ttl: "1h",
      },
    })
  })

  it("skips provider tools when no custom tool is present", () => {
    const tools: Anthropic.ToolUnion[] = [
      {
        name: "web_search",
        type: "web_search_20250305",
      },
    ]

    expect(withCachedFinalTool(tools)[0]).not.toHaveProperty("cache_control")
  })
})
