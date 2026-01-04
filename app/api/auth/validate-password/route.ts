/**
 * CATALYST - Password Validation API
 *
 * Validates password for password-protected mode.
 * Sets a session cookie on success.
 */

import { NextRequest, NextResponse } from "next/server"

// Get password from environment (server-only)
const AUTH_PASSWORD = process.env.AUTH_PASSWORD

// Session cookie config
const SESSION_COOKIE_NAME = "catalyst_auth_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production"
  
  try {
    const body = await request.json()
    const { password } = body

    // No password configured = password mode not active
    if (!AUTH_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Password authentication not configured" },
        { status: 400 }
      )
    }

    // Validate password
    if (password !== AUTH_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      )
    }

    // Create response and set cookie directly on it
    // This ensures the cookie is included in the response headers
    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    )
  }
}
