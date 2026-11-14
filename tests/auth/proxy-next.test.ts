/**
 * CATALYST - Proxy ?next= / ?redirect= tests (serviceos#2347)
 *
 * An already-signed-in visitor on /auth/* is bounced to ?next=; that, and the docs
 * password page's ?redirect=, must only ever land on this site.
 */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"

import { UNSAFE_NEXTS } from "./unsafe-nexts.fixture"

const ORIGIN = "https://hub.test"
const LANDING = "/auth/redirect"

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: { getUser: async () => ({ data: { user: { id: "u1" } } }) },
    from: () => ({ select: () => ({ eq: () => ({ single: async () => ({ data: { role: "admin" } }) }) }) }),
  }),
}))

async function loadProxy(env: Record<string, string>) {
  vi.resetModules()
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value)
  return (await import("@/proxy")).proxy
}

function location(res: Response): URL {
  return new URL(res.headers.get("location") as string, ORIGIN)
}

describe("proxy already-signed-in bounce", () => {
  beforeEach(() => vi.unstubAllEnvs())

  const modes: { label: string; env: Record<string, string>; headers: Record<string, string> }[] = [
    {
      label: "password mode",
      env: { AUTH_MODE: "password", AUTH_PASSWORD: "x" },
      headers: { cookie: "catalyst_auth_session=authenticated" },
    },
    {
      label: "supabase mode",
      env: {
        AUTH_MODE: "supabase",
        NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
        NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon",
      },
      headers: {},
    },
  ]

  for (const mode of modes) {
    it.each(UNSAFE_NEXTS)(`${mode.label}: stays on this site for %j`, async (next) => {
      const proxy = await loadProxy(mode.env)
      const req = new NextRequest(`${ORIGIN}/auth/login?next=${encodeURIComponent(next)}`, {
        headers: mode.headers,
      })
      const loc = location(await proxy(req))
      expect(loc.origin).toBe(ORIGIN)
      expect(loc.pathname).toBe(LANDING)
    })

    it(`${mode.label}: follows a safe path and keeps its query`, async () => {
      const proxy = await loadProxy(mode.env)
      const req = new NextRequest(`${ORIGIN}/auth/login?next=${encodeURIComponent("/path?x=1")}`, {
        headers: mode.headers,
      })
      const loc = location(await proxy(req))
      expect(loc.origin).toBe(ORIGIN)
      expect(loc.pathname).toBe("/path")
      expect(loc.searchParams.get("x")).toBe("1")
    })
  }
})

describe("proxy docs login ?redirect=", () => {
  beforeEach(() => vi.unstubAllEnvs())

  // sha256Base64Url("pw") is what the proxy expects in the cookie; read it back from a first, signed-out request.
  async function authedCookie(proxy: (r: NextRequest) => Promise<Response>) {
    const res = await proxy(new NextRequest(`${ORIGIN}/docs/x?password=pw`))
    return res.headers.get("set-cookie")!.split(";")[0]
  }

  it.each(UNSAFE_NEXTS)("stays on this site for %j", async (redirect) => {
    const proxy = await loadProxy({ DOCS_PASSWORD: "pw", NEXT_PUBLIC_DOCS_ENABLED: "true" })
    const cookie = await authedCookie(proxy)
    const req = new NextRequest(`${ORIGIN}/docs/login?redirect=${encodeURIComponent(redirect)}`, {
      headers: { cookie },
    })
    const loc = location(await proxy(req))
    expect(loc.origin).toBe(ORIGIN)
    expect(loc.pathname).toBe("/docs")
  })

  it("follows a safe docs path", async () => {
    const proxy = await loadProxy({ DOCS_PASSWORD: "pw", NEXT_PUBLIC_DOCS_ENABLED: "true" })
    const cookie = await authedCookie(proxy)
    const req = new NextRequest(`${ORIGIN}/docs/login?redirect=${encodeURIComponent("/docs/a?x=1")}`, {
      headers: { cookie },
    })
    const loc = location(await proxy(req))
    expect(loc.pathname).toBe("/docs/a")
    expect(loc.searchParams.get("x")).toBe("1")
  })
})
