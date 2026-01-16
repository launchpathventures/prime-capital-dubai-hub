/**
 * CATALYST - Schedule Step
 *
 * Calendly embed for booking a consultation.
 * Clean integration with subtle loading state.
 */

"use client"

import { useEffect, useRef, useState } from "react"
import type { LeadFormData, FormTheme } from "../types"

interface ScheduleStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  onSubmit: () => void
  isSubmitting: boolean
  theme: FormTheme
  calendlyUrl: string
}

export function ScheduleStep({
  data,
  onUpdate,
  onSubmit,
  isSubmitting,
  calendlyUrl,
}: ScheduleStepProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [calendlyLoaded, setCalendlyLoaded] = useState(false)

  // Load Calendly widget script
  useEffect(() => {
    if (window.Calendly) {
      setCalendlyLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = "https://assets.calendly.com/assets/external/widget.js"
    script.async = true
    script.onload = () => setCalendlyLoaded(true)
    document.body.appendChild(script)
  }, [])

  // Initialize Calendly inline widget
  useEffect(() => {
    if (!calendlyLoaded || !containerRef.current || !window.Calendly) return

    window.Calendly.initInlineWidget({
      url: calendlyUrl,
      parentElement: containerRef.current,
      prefill: {
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        email: data.email || "",
      },
    })

    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event === "calendly.event_scheduled") {
        onUpdate({ scheduledMeeting: true })
        onSubmit()
      }
    }

    window.addEventListener("message", handleCalendlyEvent)
    return () => window.removeEventListener("message", handleCalendlyEvent)
  }, [calendlyLoaded, calendlyUrl, data, onUpdate, onSubmit])

  const handleSkip = () => {
    onUpdate({ scheduledMeeting: false })
    onSubmit()
  }

  const firstName = data.firstName || ""

  return (
    <div className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Almost there, {firstName}.</p>
        <h2 className="lead-form__question">
          Let's find a time to connect
        </h2>
        <p className="lead-form__subtext">
          Choose a convenient time for a brief consultation
        </p>
      </div>

      <div
        ref={containerRef}
        className="lead-form__calendly"
      />

      <div className="lead-form__actions">
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSubmitting}
          className="lead-form__secondary"
        >
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Submitting...
            </span>
          ) : (
            "I'll schedule later"
          )}
        </button>
      </div>
    </div>
  )
}

// Add Calendly type to window
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string
        parentElement: HTMLElement
        prefill?: {
          name?: string
          email?: string
        }
      }) => void
    }
  }
}
