/**
 * CATALYST - Sentry Client Configuration
 *
 * Initializes Sentry for client-side error tracking.
 * Only enabled in production when NEXT_PUBLIC_SENTRY_DSN is set.
 */

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0.1,
})
