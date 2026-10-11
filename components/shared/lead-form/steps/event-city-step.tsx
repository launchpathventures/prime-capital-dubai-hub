/**
 * CATALYST - Event City Step
 *
 * Final step of a multi-city event registration: pick the stop to attend.
 * Each card shows the day, date, venue and hours so people can choose without
 * leaving the form. The chosen city is sent to the CRM as `eventCity`.
 */

"use client"

import { useId, useState } from "react"
import { CalendarDaysIcon, CheckIcon, ClockIcon, MapPinIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EventCityOption, LeadFormData, FormTheme } from "../types"
import { LeadFormBackButton } from "./back-button"

interface EventCityStepProps {
  data: Partial<LeadFormData>
  cities: EventCityOption[]
  onSubmit: (data: Partial<LeadFormData>) => void
  isSubmitting: boolean
  theme: FormTheme
  submitLabel?: string
  onBack?: () => void
  canGoBack?: boolean
}

export function EventCityStep({
  data,
  cities,
  onSubmit,
  isSubmitting,
  submitLabel = "Register",
  onBack,
  canGoBack,
}: EventCityStepProps) {
  const [eventCity, setEventCity] = useState(data.eventCity || "")
  const [error, setError] = useState<string | null>(null)
  const questionId = useId()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventCity) {
      setError("Please choose the city you will attend")
      return
    }
    setError(null)
    onSubmit({ eventCity })
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 id={questionId} className="lead-form__question">
          Which city will you attend?
        </h2>
        <p className="lead-form__subtext">Choose the day and venue that suit you.</p>
      </div>

      <div
        className="lead-form__city-list"
        role="radiogroup"
        aria-labelledby={questionId}
        aria-required
        aria-invalid={!!error}
      >
        {cities.map((city) => {
          const selected = eventCity === city.value
          return (
            <button
              key={city.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => {
                setEventCity(city.value)
                setError(null)
              }}
              className={cn(
                "lead-form__city-card",
                selected && "lead-form__city-card--selected",
              )}
            >
              <span className="lead-form__city-head">
                <span className="lead-form__city-name">{city.value}</span>
                <span className="lead-form__city-check" aria-hidden>
                  {selected && <CheckIcon />}
                </span>
              </span>
              <span className="lead-form__city-detail">
                <CalendarDaysIcon aria-hidden />
                {city.day} {city.date} 2026
              </span>
              <span className="lead-form__city-detail">
                <MapPinIcon aria-hidden />
                {city.venue}
              </span>
              <span className="lead-form__city-detail">
                <ClockIcon aria-hidden />
                {city.hours}
              </span>
            </button>
          )
        })}
      </div>

      {error && (
        <span role="alert" className="lead-form__error">
          {error}
        </span>
      )}

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="lead-form__loading">
              <span className="lead-form__spinner" />
              Sending...
            </span>
          ) : (
            <>
              <CheckIcon className="lead-form__submit-icon" style={{ marginRight: 4 }} />
              {submitLabel}
            </>
          )}
        </button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}
