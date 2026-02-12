/**
 * CATALYST - Sentry Edge Configuration
 *
 * Initializes Sentry for edge runtime error tracking.
 * Only enabled in production when SENTRY_DSN is set.
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
})
