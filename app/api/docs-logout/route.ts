/**
 * CATALYST - Docs Logout API
 *
 * Clears the docs access cookie used by DOCS_PASSWORD protection.
 * Must be POST-only to avoid accidental triggering via link prefetch.
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const DOCS_AUTH_COOKIE = "catalyst_docs_auth"

export async function POST(request: NextRequest) {
  const isHttps = request.nextUrl.protocol === "https:"

  const response = NextResponse.redirect(new URL("/docs/login", request.url), 303)
  response.cookies.set(DOCS_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/docs",
    maxAge: 0,
  })

  return response
}
