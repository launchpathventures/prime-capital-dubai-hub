/**
 * CATALYST - Error Tracking Utility
 *
 * Centralized error tracking for the application.
 * Currently logs to console with structured format.
 * Ready for Sentry/external service integration.
 *
 * Usage:
 * - trackError(error, { context: 'quiz', userId: '123' })
 * - trackError(error, { context: 'api', route: '/api/coach/chat' })
 */

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
 * Track an error with context.
 * Logs structured error data and can be extended to send to external services.
 */
export function trackError(
  error: Error | unknown,
  context: ErrorContext,
  severity: ErrorSeverity = "error"
): void {
  const errorObj = error instanceof Error ? error : new Error(String(error))
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

  // TODO: Integrate with Sentry or other error tracking service
  // Example Sentry integration:
  // if (typeof Sentry !== 'undefined') {
  //   Sentry.withScope((scope) => {
  //     scope.setLevel(severity)
  //     scope.setContext('custom', context)
  //     Sentry.captureException(errorObj)
  //   })
  // }
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
 * Log a warning that doesn't throw.
 */
export function trackWarning(
  message: string,
  context: ErrorContext
): void {
  trackError(new Error(message), context, "warning")
}
