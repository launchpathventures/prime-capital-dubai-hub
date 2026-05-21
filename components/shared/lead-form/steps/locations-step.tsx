/**
 * CATALYST - Locations Step
 *
 * Searchable, multi-select location capture with custom values. Replaces the
 * grid of buttons that made the old step feel like a wall — buyers can now
 * type to filter Dubai areas or add bespoke locations (e.g. a developer name
 * or a sub-community) the CRM team still wants to capture.
 *
 * Capped at MAX_LOCATIONS so the lead stays focused. Keyboard navigable:
 * arrows traverse the suggestions, Enter selects, Backspace on empty input
 * removes the last chip.
 */

"use client"

import { useMemo, useRef, useState } from "react"
import { ArrowRightIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeadFormData, FormTheme } from "../types"
import { LOCATION_OPTIONS } from "../types"
import { LeadFormBackButton } from "./back-button"

const MAX_LOCATIONS = 5

type Suggestion = {
  kind: "preset" | "custom"
  value: string
  label: string
}

interface LocationsStepProps {
  data: Partial<LeadFormData>
  onUpdate: (data: Partial<LeadFormData>) => void
  onNext: () => void
  theme: FormTheme
  onBack?: () => void
  canGoBack?: boolean
}

export function LocationsStep({ data, onUpdate, onNext, onBack, canGoBack }: LocationsStepProps) {
  const [locations, setLocations] = useState<string[]>(data.locations || [])
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listboxId = "lead-form-locations-listbox"

  const atCap = locations.length >= MAX_LOCATIONS

  const suggestions = useMemo(() => {
    const trimmed = query.trim()
    const lower = trimmed.toLowerCase()

    const matches: Suggestion[] = LOCATION_OPTIONS.filter((option) => {
      if (locations.includes(option.value)) return false
      if (!lower) return true
      return option.label.toLowerCase().includes(lower)
    }).map((o) => ({ kind: "preset", value: o.value, label: o.label }))

    // Offer a "Add custom" row when the typed value doesn't match any preset
    // exactly. This is what makes the field different from a select — buyers
    // routinely name areas not on the canonical list.
    const exactMatch = LOCATION_OPTIONS.some(
      (o) => o.label.toLowerCase() === lower,
    )
    const alreadySelected = locations.some(
      (l) => l.toLowerCase() === lower,
    )
    if (trimmed && !exactMatch && !alreadySelected) {
      matches.unshift({
        kind: "custom",
        value: trimmed,
        label: `Add "${trimmed}"`,
      })
    }

    return matches
  }, [query, locations])

  // Clamp during render so a shrinking suggestion list (e.g. after picking
  // an item) doesn't leave the highlight pointing at a missing row.
  const safeActiveIndex =
    suggestions.length === 0
      ? 0
      : Math.min(activeIndex, suggestions.length - 1)

  const addLocation = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    if (locations.includes(trimmed)) return
    if (locations.length >= MAX_LOCATIONS) return
    setLocations((prev) => [...prev, trimmed])
    setQuery("")
    setActiveIndex(0)
  }

  const removeLocation = (value: string) => {
    setLocations((prev) => prev.filter((l) => l !== value))
    inputRef.current?.focus({ preventScroll: true })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (suggestions.length === 0) return
      setIsOpen(true)
      setActiveIndex((i) => (i + 1) % suggestions.length)
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      if (suggestions.length === 0) return
      setIsOpen(true)
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
      return
    }
    if (e.key === "Enter") {
      if (!isOpen && !query.trim()) return
      e.preventDefault()
      const choice = suggestions[safeActiveIndex]
      if (choice) {
        addLocation(choice.value)
        return
      }
      if (query.trim()) {
        addLocation(query)
      }
      return
    }
    if (e.key === "Escape") {
      setIsOpen(false)
      return
    }
    if (e.key === "Backspace" && !query && locations.length > 0) {
      e.preventDefault()
      setLocations((prev) => prev.slice(0, -1))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ locations: locations.length ? locations : undefined })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="lead-form__step">
      <div>
        <h2 className="lead-form__question">Any preferred locations?</h2>
        <p className="lead-form__subtext">
          Optional — search Dubai areas or add your own. Up to {MAX_LOCATIONS}.
        </p>
      </div>

      <div
        className={cn(
          "lead-form__combo",
          atCap && "lead-form__combo--full",
        )}
      >
        {locations.length > 0 && (
          <ul className="lead-form__chips" aria-label="Selected locations">
            {locations.map((value) => (
              <li key={value} className="lead-form__chip">
                <span className="lead-form__chip-label">{value}</span>
                <button
                  type="button"
                  className="lead-form__chip-remove"
                  aria-label={`Remove ${value}`}
                  onClick={() => removeLocation(value)}
                >
                  <XIcon size={12} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="lead-form__combo-field">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={
              isOpen && suggestions[safeActiveIndex]
                ? `lead-form-loc-opt-${safeActiveIndex}`
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setActiveIndex(0)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              // Defer so a click on a suggestion fires before the dropdown
              // closes. mousedown→blur→click is the standard combobox dance.
              window.setTimeout(() => setIsOpen(false), 120)
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              atCap
                ? `Maximum ${MAX_LOCATIONS} reached`
                : "Search areas or type your own..."
            }
            disabled={atCap}
            className="lead-form__input lead-form__combo-input"
            autoComplete="off"
          />

          {isOpen && suggestions.length > 0 && !atCap && (
            <ul
              id={listboxId}
              role="listbox"
              className="lead-form__combo-list"
            >
              {suggestions.map((option, idx) => {
                const isActive = idx === safeActiveIndex
                return (
                  <li
                    key={`${option.kind}-${option.value}`}
                    id={`lead-form-loc-opt-${idx}`}
                    role="option"
                    aria-selected={isActive}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      addLocation(option.value)
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      "lead-form__combo-option",
                      isActive && "lead-form__combo-option--active",
                      option.kind === "custom" && "lead-form__combo-option--custom",
                    )}
                  >
                    {option.label}
                  </li>
                )
              })}
            </ul>
          )}
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
