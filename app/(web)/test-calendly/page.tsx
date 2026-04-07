/**
 * CATALYST - Calendly Embed Test Page
 *
 * Temporary page to verify Calendly inline widget renders correctly.
 * Delete after confirming the embed works.
 *
 * Uses Next.js Script component to load Calendly's widget.js properly.
 */

"use client"

import Script from "next/script"
import { config } from "@/lib/config"

const CALENDLY_URL = `${config.links.calendlySeller}?primary_color=576c75&text_color=3f4142&hide_event_type_details=1&hide_gdpr_banner=1`

export default function TestCalendlyPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Calendly Embed Test</h1>

      <div
        className="calendly-inline-widget"
        data-url={CALENDLY_URL}
        style={{ minWidth: "320px", height: "700px" }}
      />

      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
    </div>
  )
}
