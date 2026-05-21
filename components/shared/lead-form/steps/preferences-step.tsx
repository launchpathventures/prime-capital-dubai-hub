/**
 * CATALYST - Preferences Step
 *
 * Optional buyer qualification: bedrooms (single-select) + property types
 * (multi-select). Split out from the old timeline-budget step so each page
 * stays short and the form doesn't feel like a wall of choices.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon, CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme, PropertyType } from "../types"
import { PROPERTY_TYPE_OPTIONS } from "../types"
import { LeadFormBackButton } from "./back-button"

const BEDROOM_OPTIONS = [
  { value: 0, label: "Studio" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5+" },
]

interface PreferencesStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  onBack?: () => void
  canGoBack?: boolean
}

export function PreferencesStep({ data, onUpdate, onNext, onBack, canGoBack }: PreferencesStepProps) {
  const [bedrooms, setBedrooms] = useState<number | undefined>(data.bedrooms)
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(
    data.propertyTypes || [],
  )

  const togglePropertyType = (type: PropertyType) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      bedrooms: bedrooms !== undefined ? bedrooms : undefined,
      propertyTypes: propertyTypes.length ? propertyTypes : undefined,
    })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">What are you looking for?</h2>
        <p className="lead-form__subtext">
          Optional — helps us shortlist the right properties.
        </p>
      </div>

      <div className="lead-form__section" role="radiogroup" aria-label="How many bedrooms?">
        <p className="lead-form__section-label">
          Bedrooms{" "}
          <span className="lead-form__section-optional">(optional)</span>
        </p>
        <div className="lead-form__options lead-form__options--compact">
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

      <div className="lead-form__section" role="group" aria-label="Property types">
        <p className="lead-form__section-label">
          Property types{" "}
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

      <div className="lead-form__actions">
        <button type="submit" className="lead-form__submit">
          Continue
          <ArrowRightIcon className="lead-form__submit-icon" />
        </button>
        <LeadFormBackButton onBack={onBack} canGoBack={canGoBack} />
      </div>
    </form>
  )
}
