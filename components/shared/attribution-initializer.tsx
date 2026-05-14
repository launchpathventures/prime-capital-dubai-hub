/**
 * CATALYST - Attribution Initializer
 *
 * Captures session-level UTM params as soon as the marketing site hydrates.
 */

"use client"

import * as React from "react"
import { captureSessionUtm } from "@/lib/leads/attribution"

export function AttributionInitializer() {
  React.useEffect(() => {
    captureSessionUtm()
  }, [])

  return null
}
