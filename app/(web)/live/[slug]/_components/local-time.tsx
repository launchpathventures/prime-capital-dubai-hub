/**
 * CATALYST - Local Time Display
 *
 * Renders the event start time in the visitor's detected timezone
 * using Intl.DateTimeFormat. No geolocation permission required.
 *
 * Renders on both server and client; suppressHydrationWarning tolerates
 * the expected text diff (server sees its own timezone, browser sees the
 * visitor's). This is more reliable than a mount-gate that can silently
 * fail during hydration.
 */

"use client"

interface LocalTimeProps {
  /** ISO 8601 start time of the event (e.g. "2026-05-02T15:00:00Z") */
  startsAt: string
  /** Optional className for the wrapper */
  className?: string
}

function formatLocal(startsAt: string): string | null {
  try {
    const date = new Date(startsAt)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return new Intl.DateTimeFormat(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone,
    }).format(date)
  } catch {
    return null
  }
}

export function LocalTime({ startsAt, className }: LocalTimeProps) {
  const label = formatLocal(startsAt)

  if (!label) return null

  return (
    <span className={className} suppressHydrationWarning>
      In your timezone: {label}
    </span>
  )
}
