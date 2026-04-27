/**
 * CATALYST - Timeline & Budget Step
 *
 * For buyers/investors: Timeline and budget selection.
 * Clean sections with elegant option tiles.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  LeadFormData,
  FormTheme,
  InvestTimeline,
  BudgetRange,
  PropertyType,
} from "../types"
import {
  TIMELINE_OPTIONS,
  BUDGET_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  LOCATION_OPTIONS,
} from "../types"

const MAX_LOCATIONS = 5
const BEDROOM_OPTIONS = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5+" },
]

interface TimelineBudgetStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function TimelineBudgetStep({
  data,
  onUpdate,
  onNext,
}: TimelineBudgetStepProps) {
  const [timeline, setTimeline] = useState<InvestTimeline | undefined>(
    data.investTimeline
  )
  const [budget, setBudget] = useState<BudgetRange | undefined>(data.budget)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(
    data.propertyTypes || [],
  )
  const [locations, setLocations] = useState<string[]>(data.locations || [])
  const [bedrooms, setBedrooms] = useState<number | undefined>(data.bedrooms)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const togglePropertyType = (type: PropertyType) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const toggleLocation = (loc: string) => {
    setLocations((prev) => {
      if (prev.includes(loc)) return prev.filter((l) => l !== loc)
      // Cap at MAX_LOCATIONS — adding beyond the cap is a silent no-op so
      // the user sees nothing happen rather than getting a jumpy error.
      if (prev.length >= MAX_LOCATIONS) return prev
      return [...prev, loc]
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!timeline) newErrors.timeline = "Please select your timeline"
    if (!budget) newErrors.budget = "Please select your budget"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onUpdate({
      investTimeline: timeline,
      budget,
      // Only emit optional fields if the user actually picked something —
      // empty arrays/undefined keeps payloads tight.
      propertyTypes: propertyTypes.length ? propertyTypes : undefined,
      locations: locations.length ? locations : undefined,
      bedrooms: bedrooms !== undefined ? bedrooms : undefined,
    })
    onNext()
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Great, {firstName}.</p>
        <h2 className="lead-form__question">
          Tell us about your investment plans
        </h2>
      </div>

      {/* Timeline Section */}
      <div className="lead-form__section" role="radiogroup" aria-label="When are you looking to invest?" aria-required="true">
        <p className="lead-form__section-label" id="invest-timeline-label">When are you looking to invest?</p>

        <div className="lead-form__options">
          {TIMELINE_OPTIONS.map((option, idx) => {
            const isSelected = timeline === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setTimeline(option.value)
                  setErrors((e) => ({ ...e, timeline: "" }))
                }}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected"
                )}
              >
                <span className="lead-form__option-key" aria-hidden="true">{idx + 1}</span>
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.timeline && <p id="invest-timeline-error" role="alert" className="lead-form__error">{errors.timeline}</p>}
      </div>

      {/* Budget Section */}
      <div className="lead-form__section" role="radiogroup" aria-label="What's your investment budget?" aria-required="true">
        <p className="lead-form__section-label" id="budget-label">What's your investment budget?</p>

        <div className="lead-form__options lead-form__options--grid">
          {BUDGET_OPTIONS.map((option) => {
            const isSelected = budget === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => {
                  setBudget(option.value)
                  setErrors((e) => ({ ...e, budget: "" }))
                }}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected"
                )}
              >
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.budget && <p id="budget-error" role="alert" className="lead-form__error">{errors.budget}</p>}
      </div>

      {/* Bedrooms (optional, single-select). Field is optional in the
          payload via "skip" — once selected, the user picks a different
          option to change it (standard radio-group semantics). */}
      <div className="lead-form__section" role="radiogroup" aria-label="How many bedrooms?">
        <p className="lead-form__section-label">
          How many bedrooms?{" "}
          <span className="lead-form__section-optional">(optional)</span>
        </p>
        <div className="lead-form__options lead-form__options--grid">
          {BEDROOM_OPTIONS.map((option) => {
            const isSelected = bedrooms === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setBedrooms(option.value)}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected",
                )}
              >
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Property types (optional, multi-select) */}
      <div className="lead-form__section" role="group" aria-label="Property types">
        <p className="lead-form__section-label">
          Which property types interest you?{" "}
          <span className="lead-form__section-optional">(optional)</span>
        </p>
        <div className="lead-form__options lead-form__options--grid">
          {PROPERTY_TYPE_OPTIONS.map((option) => {
            const isSelected = propertyTypes.includes(option.value)
            return (
              <button
                key={option.value}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                onClick={() => togglePropertyType(option.value)}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected",
                )}
              >
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
                <span className="lead-form__option-check" aria-hidden="true">
                  {isSelected && <CheckIcon size={14} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Locations (optional, multi-select with cap) */}
      <div className="lead-form__section" role="group" aria-label="Preferred locations">
        <p className="lead-form__section-label">
          Preferred locations?{" "}
          <span className="lead-form__section-optional">
            (optional, up to {MAX_LOCATIONS})
          </span>
        </p>
        <div className="lead-form__options lead-form__options--grid">
          {LOCATION_OPTIONS.map((option) => {
            const isSelected = locations.includes(option.value)
            const atCap = !isSelected && locations.length >= MAX_LOCATIONS
            return (
              <button
                key={option.value}
                type="button"
                role="checkbox"
                aria-checked={isSelected}
                aria-disabled={atCap}
                disabled={atCap}
                onClick={() => toggleLocation(option.value)}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected",
                  atCap && "lead-form__option--disabled",
                )}
              >
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
                <span className="lead-form__option-check" aria-hidden="true">
                  {isSelected && <CheckIcon size={14} />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
      </div>
    </form>
  )
}
