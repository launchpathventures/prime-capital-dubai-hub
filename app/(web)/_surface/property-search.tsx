/**
 * CATALYST - Property Search Bar
 *
 * Floating search bar for the homepage hero. Dropdown options come from the
 * CRM facets payload (lib/crm/facets.ts) — never from inventory inference
 * or hardcoded arrays. Submits to /properties as a GET form.
 */
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"

interface PropertySearchProps {
  /** Canonical area list from facets.areas[]. */
  locations: string[]
  /** Canonical property type list from facets.property_types[]. */
  types: string[]
}

export function PropertySearch({ types, locations }: PropertySearchProps) {
  /** Capitalise first letter of each word */
  function titleCase(s: string) {
    return s.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <form action="/properties" method="GET" className="property-search">
      {/* Brand tag — visual anchor on the bar */}
      <span className="property-search__tag">Search</span>

      {/* Property Type */}
      <div className="property-search__field">
        <div className="property-search__select-wrap">
          <select
            id="search-type"
            name="property_type"
            defaultValue=""
            className="property-search__select"
            aria-label="Property type"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {titleCase(t)}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="property-search__chevron" />
        </div>
      </div>

      <div className="property-search__divider" />

      {/* Location */}
      <div className="property-search__field property-search__field--grow">
        <div className="property-search__select-wrap">
          <select
            id="search-area"
            name="area"
            defaultValue=""
            className="property-search__select"
            aria-label="Area or community"
          >
            <option value="">All Areas</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="property-search__chevron" />
        </div>
      </div>

      {/* Search button */}
      <button type="submit" className="property-search__btn">
        <span>Search</span>
        <ArrowRightIcon className="property-search__btn-icon" />
      </button>
    </form>
  )
}
