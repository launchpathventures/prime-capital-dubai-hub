/**
 * CATALYST - Event Registration Kiosk
 *
 * Route: /register
 *
 * A dead-simple, full-screen registration form Prime runs on an iPad at a
 * stand or event. Staff open the URL, type the event name, and tap "Start" to
 * drop into kiosk mode. Each guest enters their details in one no-scroll
 * screen; on submit they see a thank-you and the form resets for the next
 * person.
 *
 * Leads flow through the SAME pipeline as the website (`POST /api/leads`,
 * formMode "event") so every registration lands in AgentCRM with full
 * metadata. See ./_components/event-kiosk for the payload contract.
 *
 * Usage:
 *   /register                                  → staff type the event name on the setup screen
 *   /register?event=Cityscape%202026           → pre-configured link: skips setup, drops
 *                                                straight into the guest form (no per-use setup)
 *   /register?event=Cityscape%202026&dist=managers → same, but leads held for managers only
 *
 * A pre-configured link is the "preregistered event": share one URL per event and
 * staff never touch the setup screen. The `event` value is the human-readable name;
 * `dist` (or `distribution`) selects lead routing — "team" (default) or "managers".
 */

import type { Metadata } from "next"
import { EventKiosk } from "./_components/event-kiosk"

export const metadata: Metadata = {
  title: "Event Registration",
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ event?: string; dist?: string; distribution?: string }>
}

export default async function RegisterKioskPage({ searchParams }: PageProps) {
  const { event, dist, distribution } = await searchParams
  // Accept either `dist` or the longer `distribution`; anything but "managers" is "team".
  const raw = (dist ?? distribution ?? "").toLowerCase()
  const initialDistribution = raw === "managers" ? "managers" : "team"
  return (
    <EventKiosk
      initialEventName={event ?? ""}
      initialDistribution={initialDistribution}
    />
  )
}
