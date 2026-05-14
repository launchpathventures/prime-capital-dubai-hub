/**
 * CATALYST - Lead UTM Attribution Tests
 */

import { describe, expect, it } from "vitest"
import {
  captureSessionUtm,
  readStoredUtm,
  readUtmFromSearch,
  UTM_SESSION_STORAGE_KEY,
} from "@/lib/leads/attribution"

function createStorage(initial?: Record<string, string>) {
  const data = new Map(Object.entries(initial ?? {}))
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => {
      data.set(key, value)
    },
  }
}

describe("lead UTM attribution", () => {
  it("maps URL utm_* params to the CRM camelCase fields", () => {
    expect(
      readUtmFromSearch(
        "?utm_source=youtube&utm_medium=video&utm_campaign=test123&utm_content=ad-3&utm_term=dubai-offplan",
      ),
    ).toEqual({
      utmSource: "youtube",
      utmMedium: "video",
      utmCampaign: "test123",
      utmContent: "ad-3",
      utmTerm: "dubai-offplan",
    })
  })

  it("captures the first UTM touch for the current browser session", () => {
    const storage = createStorage()

    expect(captureSessionUtm("?utm_source=youtube&utm_campaign=test123", storage)).toEqual({
      utmSource: "youtube",
      utmCampaign: "test123",
    })
    expect(readStoredUtm(storage)).toEqual({
      utmSource: "youtube",
      utmCampaign: "test123",
    })
  })

  it("does not overwrite session attribution on later page views", () => {
    const storage = createStorage({
      [UTM_SESSION_STORAGE_KEY]: JSON.stringify({
        utmSource: "youtube",
        utmCampaign: "test123",
      }),
    })

    expect(captureSessionUtm("?utm_source=google&utm_campaign=later", storage)).toEqual({
      utmSource: "youtube",
      utmCampaign: "test123",
    })
  })

  it("omits UTM attribution when none has been captured", () => {
    const storage = createStorage()

    expect(captureSessionUtm("?source=instagram", storage)).toBeNull()
    expect(readStoredUtm(storage)).toBeNull()
  })

  it("recovers from malformed stored attribution", () => {
    const storage = createStorage({
      [UTM_SESSION_STORAGE_KEY]: "{not-json",
    })

    expect(captureSessionUtm("?utm_source=linkedin", storage)).toEqual({
      utmSource: "linkedin",
    })
  })
})
