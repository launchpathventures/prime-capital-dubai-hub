/**
 * CATALYST - Error Tracking Utility
 *
 * Centralized error tracking for the application.
 * Integrates with Sentry when DSN is configured.
 * Falls back to structured console logging.
 *
 * Usage:
 * - trackError(error, { context: 'quiz', userId: '123' })
 * - trackError(error, { context: 'api', route: '/api/coach/chat' })
 */

import * as Sentry from "@sentry/nextjs"

type ErrorContext = {
  context: string
  userId?: string
  route?: string
  component?: string
  action?: string
  [key: string]: unknown
}

type ErrorSeverity = "error" | "warning" | "info"

interface TrackedError {
  message: string
  stack?: string
  severity: ErrorSeverity
  context: ErrorContext
  timestamp: string
  digest?: string
}

/**
 * Check if Sentry is configured and enabled.
 */
function isSentryEnabled(): boolean {
  // Check for DSN in client or server environment
  const dsn =
    process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN
  return Boolean(dsn) && process.env.NODE_ENV === "production"
}

/**
 * Map our severity levels to Sentry severity levels.
 */
function mapSeverityToSentry(
  severity: ErrorSeverity
): Sentry.SeverityLevel {
  switch (severity) {
    case "warning":
      return "warning"
    case "info":
      return "info"
    case "error":
    default:
      return "error"
  }
}

/**
 * Track an error with context.
 * Sends to Sentry when configured, otherwise logs structured error data.
 */
export function trackError(
  error: Error | unknown,
  context: ErrorContext,
  severity: ErrorSeverity = "error"
): void {
  // Supabase PostgrestError is a plain object, not an Error instance
  const errorMessage = error instanceof Error
    ? error.message
    : (typeof error === "object" && error !== null && "message" in error)
      ? String((error as { message: unknown }).message)
      : String(error)
  const errorObj = error instanceof Error ? error : new Error(errorMessage)
  const digestMatch = (error as { digest?: string })?.digest

  const tracked: TrackedError = {
    message: errorObj.message,
    stack: errorObj.stack,
    severity,
    context,
    timestamp: new Date().toISOString(),
    digest: digestMatch,
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Tracking]", tracked)
    return
  }

  // Production logging - structured for log aggregation
  console.error(JSON.stringify(tracked))

  // Send to Sentry if configured
  if (isSentryEnabled()) {
    Sentry.withScope((scope) => {
      scope.setLevel(mapSeverityToSentry(severity))
      scope.setContext("custom", context)

      // Add tags for easier filtering in Sentry
      scope.setTag("error_context", context.context)
      if (context.component) scope.setTag("component", context.component)
      if (context.route) scope.setTag("route", context.route)
      if (context.action) scope.setTag("action", context.action)
      if (digestMatch) scope.setTag("digest", digestMatch)

      // Add user context if available
      if (context.userId) {
        scope.setUser({ id: context.userId })
      }

      Sentry.captureException(errorObj)
    })
  }
}

/**
 * Track an API error with route context.
 */
export function trackApiError(
  error: Error | unknown,
  route: string,
  additionalContext: Record<string, unknown> = {}
): void {
  trackError(error, {
    context: "api",
    route,
    ...additionalContext,
  })
}

/**
 * Track a component error (for error boundaries).
 */
export function trackComponentError(
  error: Error | unknown,
  component: string,
  digest?: string
): void {
  trackError(error, {
    context: "component",
    component,
    digest,
  })
}

/**
 * Track an action error (for server actions).
 */
export function trackActionError(
  error: Error | unknown,
  action: string,
  additionalContext: Record<string, unknown> = {}
): void {
  trackError(error, {
    context: "action",
    action,
    ...additionalContext,
  })
}

/**
 * Track a Supabase query error with table context.
 */
export function trackSupabaseError(
  error: Error | unknown,
  table: string,
  operation: "select" | "insert" | "update" | "delete" | "rpc",
  additionalContext: Record<string, unknown> = {}
): void {
  trackError(error, {
    context: "supabase",
    table,
    operation,
    ...additionalContext,
  })
}

/**
 * Log a warning that doesn't throw.
 */
export function trackWarning(
  message: string,
  context: ErrorContext
): void {
  trackError(new Error(message), context, "warning")
}
