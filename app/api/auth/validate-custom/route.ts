/**
 * CATALYST - Custom Auth Validation API
 *
 * Proxies authentication to a custom endpoint.
 * Sets a session cookie on success (same as password mode).
 */

import { NextRequest, NextResponse } from "next/server"

// Get custom endpoint from environment
const AUTH_CUSTOM_ENDPOINT = process.env.AUTH_CUSTOM_ENDPOINT

// Session cookie config (shared with password mode)
const SESSION_COOKIE_NAME = "catalyst_auth_session"
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export async function POST(request: NextRequest) {
  const isProduction = process.env.NODE_ENV === "production"
  
  try {
    const body = await request.json()
    const { email, password, action = "login" } = body

    // No endpoint configured
    if (!AUTH_CUSTOM_ENDPOINT) {
      return NextResponse.json(
        { success: false, error: "Custom auth endpoint not configured" },
        { status: 400 }
      )
    }

    // Forward to custom endpoint
    const customResponse = await fetch(AUTH_CUSTOM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, action }),
    })

    const data = await customResponse.json()

    // Create response and set cookie directly on it if successful
    const response = NextResponse.json(data, { status: customResponse.status })
    
    if (data.success) {
      response.cookies.set(SESSION_COOKIE_NAME, "authenticated", {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: SESSION_DURATION,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("Custom auth error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to authenticate" },
      { status: 500 }
    )
  }
}
