/**
 * CATALYST - Property Search Bar
 *
 * Data-driven floating search bar for the homepage hero.
 * Off-plan only — Prime Capital focuses exclusively on off-plan sales.
 * Dropdowns populated from actual property data via props.
 */
import { ArrowRightIcon, ChevronDownIcon } from "lucide-react"

interface PropertySearchProps {
  /** Unique property types from the database (e.g. ["villa", "penthouse"]) */
  types: string[]
  /** Unique locations from the database (e.g. ["Palm Jumeirah, Dubai", "Downtown Dubai"]) */
  locations: string[]
}

export function PropertySearch({ types, locations }: PropertySearchProps) {
  /** Capitalise first letter of each word */
  function titleCase(s: string) {
    return s.replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <form action="/properties" method="GET" className="property-search">
      {/* Off-Plan indicator — subtle inline label */}
      <span className="property-search__tag">Off-Plan</span>

      {/* Property Type */}
      <div className="property-search__field">
        <div className="property-search__select-wrap">
          <select
            id="search-type"
            name="type"
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
