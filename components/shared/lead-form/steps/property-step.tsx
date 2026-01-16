/**
 * CATALYST - Property Step
 *
 * For sellers: Property details with clean sectioned layout.
 */

"use client"

import { useState } from "react"
import { ArrowRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type {
  LeadFormData,
  FormTheme,
  PropertyType,
  SaleTimeline,
  PriceRange,
} from "../types"
import { PROPERTY_TYPE_OPTIONS, TIMELINE_OPTIONS, BUDGET_OPTIONS } from "../types"

interface PropertyStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
}

export function PropertyStep({ data, onUpdate, onNext }: PropertyStepProps) {
  const [location, setLocation] = useState(data.propertyLocation || "")
  const [propertyType, setPropertyType] = useState<PropertyType | undefined>(
    data.propertyType
  )
  const [timeline, setTimeline] = useState<SaleTimeline | undefined>(data.saleTimeline)
  const [price, setPrice] = useState<PriceRange | undefined>(data.targetPrice)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!location.trim()) newErrors.location = "Please enter the property location"
    if (!propertyType) newErrors.propertyType = "Please select property type"
    if (!timeline) newErrors.timeline = "Please select your timeline"
    if (!price) newErrors.price = "Please select target price"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onUpdate({
      propertyLocation: location,
      propertyType,
      saleTimeline: timeline,
      targetPrice: price,
    })
    onNext()
  }

  const firstName = data.firstName || ""

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <p className="lead-form__greeting">Great, {firstName}.</p>
        <h2 className="lead-form__question">
          Tell us about your property
        </h2>
      </div>

      {/* Property Location & Type */}
      <div className="lead-form__section">
        <div className="lead-form__field">
          <label className="lead-form__label">Property Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setErrors((prev) => ({ ...prev, location: "" }))
            }}
            placeholder="e.g., Palm Jumeirah, Downtown Dubai"
            className={cn("lead-form__input", errors.location && "lead-form__input--error")}
          />
          {errors.location && <p className="lead-form__error">{errors.location}</p>}
        </div>

        <p className="lead-form__section-label" style={{ marginTop: "1.5rem" }}>
          Property Type
        </p>
        <div className="lead-form__options lead-form__options--grid">
          {PROPERTY_TYPE_OPTIONS.map((option) => {
            const isSelected = propertyType === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setPropertyType(option.value)
                  setErrors((prev) => ({ ...prev, propertyType: "" }))
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
        {errors.propertyType && (
          <p className="lead-form__error">{errors.propertyType}</p>
        )}
      </div>

      {/* Sale Timeline */}
      <div className="lead-form__section">
        <p className="lead-form__section-label">When do you want to sell?</p>
        <div className="lead-form__options">
          {TIMELINE_OPTIONS.map((option, idx) => {
            const isSelected = timeline === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTimeline(option.value)
                  setErrors((prev) => ({ ...prev, timeline: "" }))
                }}
                className={cn(
                  "lead-form__option",
                  isSelected && "lead-form__option--selected"
                )}
              >
                <span className="lead-form__option-key">{idx + 1}</span>
                <span className="lead-form__option-content">
                  <span className="lead-form__option-label">{option.label}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errors.timeline && <p className="lead-form__error">{errors.timeline}</p>}
      </div>

      {/* Target Price */}
      <div className="lead-form__section">
        <p className="lead-form__section-label">Estimated property value</p>
        <div className="lead-form__options lead-form__options--grid">
          {BUDGET_OPTIONS.map((option) => {
            const isSelected = price === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setPrice(option.value)
                  setErrors((prev) => ({ ...prev, price: "" }))
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
        {errors.price && <p className="lead-form__error">{errors.price}</p>}
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
