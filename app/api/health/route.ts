/**
 * CATALYST - Health Check Endpoint
 *
 * Returns 200 if the application is healthy, 503 if there are issues.
 * Checks Supabase connectivity to ensure the database is reachable.
 */

import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"
import { trackApiError } from "@/lib/error-tracking"

interface HealthStatus {
  status: "healthy" | "unhealthy"
  timestamp: string
  checks: {
    supabase: {
      status: "ok" | "error"
      latency?: number
      error?: string
    }
  }
}

export async function GET(): Promise<NextResponse<HealthStatus>> {
  const timestamp = new Date().toISOString()
  const checks: HealthStatus["checks"] = {
    supabase: { status: "ok" },
  }

  // Check Supabase connectivity
  const supabaseStart = Date.now()
  try {
    const supabase = createStaticClient()
    // Simple query to check database connectivity
    const { error } = await supabase.from("site_settings").select("key").limit(1)

    if (error) {
      checks.supabase = {
        status: "error",
        error: error.message,
        latency: Date.now() - supabaseStart,
      }
      trackApiError(error, "/api/health", { check: "supabase" })
    } else {
      checks.supabase = {
        status: "ok",
        latency: Date.now() - supabaseStart,
      }
    }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error"
    checks.supabase = {
      status: "error",
      error: errorMessage,
      latency: Date.now() - supabaseStart,
    }
    trackApiError(err, "/api/health", { check: "supabase" })
  }

  // Determine overall health status
  const isHealthy = Object.values(checks).every((check) => check.status === "ok")

  const healthStatus: HealthStatus = {
    status: isHealthy ? "healthy" : "unhealthy",
    timestamp,
    checks,
  }

  return NextResponse.json(healthStatus, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  })
}
