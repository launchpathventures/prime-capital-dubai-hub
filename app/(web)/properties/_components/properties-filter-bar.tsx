/**
 * CATALYST - Properties Filter Bar
 *
 * Count-aware property browse controls. Every option comes from the CRM
 * facets endpoint, and the URL remains the source of truth for list + facet
 * fetches.
 */

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LISTING_TYPE_LABELS,
  type CrmListingType,
  type PublicPropertyFacetOption,
  type PublicPropertyFacets,
} from "@/lib/crm"
import { DEFAULT_BROWSE_LISTING_TYPE } from "@/lib/crm/browse-filters"

interface PropertiesFilterBarProps {
  facets: PublicPropertyFacets
  resultCount: number
}

interface FilterOption {
  value: string
  label: string
  count: number
}

const ALL_VALUE = "__all__"

export function PropertiesFilterBar({ facets, resultCount }: PropertiesFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeQuery = searchParams.get("q") ?? ""
  const [query, setQuery] = useState(activeQuery)

  const applyParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value.trim() === "") next.delete(key)
        else next.set(key, value)
      }
      const qs = next.toString()
      startTransition(() => {
        router.replace(qs ? `/properties?${qs}` : "/properties", { scroll: false })
      })
    },
    [router, searchParams],
  )

  useEffect(() => {
    setQuery(activeQuery)
  }, [activeQuery])

  useEffect(() => {
    const nextQuery = query.trim()
    if (nextQuery === activeQuery) return

    const timeout = window.setTimeout(() => {
      applyParams({ q: nextQuery || null })
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [activeQuery, applyParams, query])

  const currentArea = searchParams.get("area") ?? ""
  const currentType = searchParams.get("property_type") ?? ""
  const currentListing = searchParams.get("listing_type") ?? DEFAULT_BROWSE_LISTING_TYPE
  const currentBedrooms = bedroomBucketFromParams(
    searchParams.get("bedrooms_min"),
    searchParams.get("bedrooms_max"),
  )

  const areaOptions = useMemo(
    () => mapFacetOptions(facets.areas, currentArea, (value) => value),
    [currentArea, facets.areas],
  )
  const propertyTypeOptions = useMemo(
    () => mapFacetOptions(facets.propertyTypes, currentType, titleCase),
    [currentType, facets.propertyTypes],
  )
  const bedroomOptions = useMemo(
    () => mapFacetOptions(facets.bedrooms, currentBedrooms, formatBedroomBucket),
    [currentBedrooms, facets.bedrooms],
  )
  const listingTypeOptions = useMemo(
    () => mapFacetOptions(facets.listingTypes, currentListing, formatListingType),
    [currentListing, facets.listingTypes],
  )

  return (
    <div
      className="properties-filter-bar"
      data-pending={isPending ? "true" : undefined}
    >
      <div className="properties-filter-bar__search">
        <Label htmlFor="properties-search" className="properties-filter-bar__search-label">
          Search by name or development
        </Label>
        <Input
          id="properties-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => {
            setQuery("")
            applyParams({ q: null })
          }}
          clearable
          startIcon={<SearchIcon />}
          placeholder="e.g. Sobha Hartland, Burj Vista"
          className="properties-filter-bar__search-input"
        />
      </div>

      <div className="properties-filter-bar__controls">
        <FilterSelect
          label="Location"
          placeholder="All Locations"
          value={currentArea}
          onChange={(value) => applyParams({ area: value || null })}
          options={areaOptions}
        />
        <FilterSelect
          label="Property Type"
          placeholder="All Types"
          value={currentType}
          onChange={(value) => applyParams({ property_type: value || null })}
          options={propertyTypeOptions}
        />
        <FilterSelect
          label="Bedrooms"
          placeholder="Any Bedrooms"
          value={currentBedrooms}
          onChange={(value) => applyParams(bedroomParamsForBucket(value))}
          options={bedroomOptions}
        />
        <ListingTypeToggle
          value={currentListing}
          options={listingTypeOptions}
          onChange={(value) => applyParams({ listing_type: value || null })}
        />

        <div className="properties-filter-bar__counter">
          <span className="properties-filter-bar__counter-value">{resultCount}</span>
          <span className="properties-filter-bar__counter-label">
            {resultCount === 1 ? "property" : "properties"}
          </span>
        </div>
      </div>
    </div>
  )
}

interface FilterSelectProps {
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  options: FilterOption[]
}

function FilterSelect({ label, placeholder, value, onChange, options }: FilterSelectProps) {
  const items = [
    { value: ALL_VALUE, label: placeholder },
    ...options.map((option) => ({
      value: option.value,
      label: `${option.label} (${option.count})`,
    })),
  ]

  return (
    <div
      className="properties-filter-bar__field"
      data-active={value ? "true" : undefined}
    >
      <span className="properties-filter-bar__field-label">{label}</span>
      <Select
        value={value || ALL_VALUE}
        onValueChange={(nextValue) => {
          if (nextValue == null || nextValue === ALL_VALUE) {
            onChange("")
            return
          }
          onChange(String(nextValue))
        }}
        items={items}
      >
        <SelectTrigger
          aria-label={label}
          className="properties-filter-bar__select-trigger"
          disabled={options.length === 0}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="properties-filter-bar__select-content">
          <SelectItem value={ALL_VALUE}>{placeholder}</SelectItem>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.count === 0 && option.value !== value}
            >
              {option.label} ({option.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

interface ListingTypeToggleProps {
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}

function ListingTypeToggle({ value, options, onChange }: ListingTypeToggleProps) {
  return (
    <div className="properties-filter-bar__listing" role="group" aria-label="Listing Type">
      <span className="properties-filter-bar__field-label">Listing Type</span>
      <div className="properties-filter-bar__listing-options">
        {options.map((option) => {
          const active = value === option.value
          return (
            <Button
              key={option.value}
              type="button"
              variant="ghost"
              size="sm"
              data-active={active ? "true" : undefined}
              disabled={option.count === 0 && !active}
              className="properties-filter-bar__listing-option"
              onClick={() => onChange(active ? "" : option.value)}
            >
              <span>{option.label}</span>
              <span className="properties-filter-bar__listing-count">{option.count}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

function mapFacetOptions(
  facets: PublicPropertyFacetOption[],
  selectedValue: string,
  labelForValue: (value: string) => string,
): FilterOption[] {
  const options = facets.map((facet) => ({
    value: facet.value,
    label: labelForValue(facet.value),
    count: facet.count,
  }))

  if (selectedValue && !options.some((option) => option.value === selectedValue)) {
    return [
      ...options,
      {
        value: selectedValue,
        label: labelForValue(selectedValue),
        count: 0,
      },
    ]
  }

  return options
}

/**
 * Bedroom bucket vocabulary mirrors the values emitted by the CRM facets
 * endpoint. Keeping the URL ↔ bucket ↔ label mapping in a single table avoids
 * the three functions drifting out of sync if the CRM extends the vocabulary.
 */
interface BedroomBucket {
  min: string
  max: string | null
  label: string
}

const BEDROOM_BUCKETS: Record<string, BedroomBucket> = {
  studio: { min: "0", max: "0", label: "Studio" },
  "1": { min: "1", max: "1", label: "1 bedroom" },
  "2": { min: "2", max: "2", label: "2 bedrooms" },
  "3": { min: "3", max: "3", label: "3 bedrooms" },
  "4+": { min: "4", max: null, label: "4 or more" },
}

function bedroomBucketFromParams(min: string | null, max: string | null): string {
  if (!min && !max) return ""
  for (const [value, bucket] of Object.entries(BEDROOM_BUCKETS)) {
    if (bucket.min === min && bucket.max === max) return value
  }
  return ""
}

function bedroomParamsForBucket(value: string): Record<string, string | null> {
  const bucket = BEDROOM_BUCKETS[value]
  if (!bucket) return { bedrooms_min: null, bedrooms_max: null }
  return { bedrooms_min: bucket.min, bedrooms_max: bucket.max }
}

function formatBedroomBucket(value: string): string {
  return BEDROOM_BUCKETS[value]?.label ?? titleCase(value)
}

function formatListingType(value: string): string {
  return LISTING_TYPE_LABELS[value as CrmListingType] ?? titleCase(value)
}

function titleCase(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
