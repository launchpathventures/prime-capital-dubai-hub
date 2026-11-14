/**
 * CATALYST - A trailing slash on NEXT_PUBLIC_APP_URL must not reach page addresses.
 *
 * Production's value ends in "/", which once made the sitemap and robots.txt
 * emit "https://host//page" (serviceos#2342). The code must cope with the value.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "primecapitaldubai.com" }),
}))
vi.mock("@/lib/crm/client", () => ({
  getAllCrmProperties: async () => [{ slug: "marina-view" }, { slug: "palm-tower" }],
}))
vi.mock("@/lib/content", () => ({
  getWebTeamMembers: async () => [{ slug: "jane-doe" }],
}))

const TRAILING = "https://primecapitaldubai.com/"
const afterScheme = (url: string) => url.replace(/^https?:\/\//, "")

async function loadConfig() {
  vi.resetModules()
  return (await import("@/lib/config")).config
}

describe("app URL with a trailing slash", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", TRAILING)
  })
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it("config.app.url has no trailing slash", async () => {
    const config = await loadConfig()
    expect(config.app.url).toBe("https://primecapitaldubai.com")
  })

  it("strips several trailing slashes and leaves a clean value alone", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://primecapitaldubai.com///")
    expect((await loadConfig()).app.url).toBe("https://primecapitaldubai.com")
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://primecapitaldubai.com")
    expect((await loadConfig()).app.url).toBe("https://primecapitaldubai.com")
  })

  it("falls back to localhost when the value is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "")
    expect((await loadConfig()).app.url).toBe("http://localhost:3000")
  })

  it("sitemap URLs contain no // after the scheme", async () => {
    vi.resetModules()
    const { default: sitemap } = await import("@/app/sitemap")
    const entries = await sitemap()
    expect(entries.length).toBeGreaterThan(8)
    for (const entry of entries) {
      expect(afterScheme(entry.url)).not.toContain("//")
    }
    expect(entries.map((e) => e.url)).toContain("https://primecapitaldubai.com")
    expect(entries.map((e) => e.url)).toContain("https://primecapitaldubai.com/properties/marina-view")
  })

  it("robots.txt sitemap line has no // after the scheme", async () => {
    vi.resetModules()
    const { default: robots } = await import("@/app/robots")
    const result = await robots()
    expect(result.sitemap).toBe("https://primecapitaldubai.com/sitemap.xml")
    expect(afterScheme(String(result.sitemap))).not.toContain("//")
  })
})
