/**
 * CATALYST - Properties Filter
 *
 * Server-rendered filter UI driven by URL query params using CRM canonical
 * field names (property_type, area, bedrooms_min/max, price_min/max).
 */

import Link from "next/link"
import Image from "next/image"

import { Container, Stack, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, MapPinIcon } from "lucide-react"

import { propertyTypeImages } from "../../_surface/property-images"
import { formatCrmBedrooms, formatCrmPriceRange, getStatusBadge, type CrmProperty } from "@/lib/crm"

interface PropertiesFilterProps {
  properties: CrmProperty[]
  /** Currently active CRM property_type filter, or "all". */
  activeType: string
  /** Currently active area filter (case-insensitive substring match for tabs). */
  areaFilter: string
}

export function PropertiesFilter({ properties, activeType, areaFilter }: PropertiesFilterProps) {
  const normalisedType = (activeType || "all").toLowerCase()
  const normalisedArea = areaFilter.trim().toLowerCase()

  const types = Array.from(new Set(properties.map((p) => p.propertyType.toLowerCase())))
  const typeCounts = types.reduce<Record<string, number>>((acc, type) => {
    acc[type] = properties.filter((p) => p.propertyType.toLowerCase() === type).length
    return acc
  }, {})

  let filtered = properties
  if (normalisedType !== "all") {
    filtered = filtered.filter((p) => p.propertyType.toLowerCase() === normalisedType)
  }
  if (normalisedArea) {
    filtered = filtered.filter((p) => p.area.toLowerCase().includes(normalisedArea))
  }

  const filterHref = (type: string) => {
    const params = new URLSearchParams()
    if (type !== "all") params.set("property_type", type)
    if (areaFilter) params.set("area", areaFilter)
    const qs = params.toString()
    return `/properties${qs ? `?${qs}` : ""}`
  }

  return (
    <>
      <section className="bg-[var(--web-off-white)] py-8 border-b border-[var(--web-serenity)]/20">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-3">
            <FilterTab href={filterHref("all")} active={normalisedType === "all"}>
              All Properties ({properties.length})
            </FilterTab>
            {types.map((type) => (
              <FilterTab key={type} href={filterHref(type)} active={normalisedType === type} capitalize>
                {type} ({typeCounts[type]})
              </FilterTab>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          {filtered.length === 0 ? (
            <Stack gap="md" align="center" className="text-center py-12">
              <Text className="text-[var(--web-spruce)] text-[15px] font-light">
                No properties match those filters. Contact us for off-market opportunities.
              </Text>
            </Stack>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

function FilterTab({
  href,
  active,
  capitalize,
  children,
}: {
  href: string
  active: boolean
  capitalize?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`px-5 py-2 rounded-[2px] text-[13px] uppercase tracking-wider transition-colors ${
        capitalize ? "capitalize" : ""
      } ${
        active
          ? "bg-[var(--web-ash)] text-[var(--web-off-white)]"
          : "bg-transparent text-[var(--web-spruce)] border border-[var(--web-spruce)]/30 hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
      }`}
    >
      {children}
    </Link>
  )
}

function PropertyCard({ property }: { property: CrmProperty }) {
  const imageUrl =
    property.images[0] ||
    propertyTypeImages[property.propertyType.toLowerCase()] ||
    propertyTypeImages.default
  const statusBadge = getStatusBadge(property.status)

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white overflow-hidden card-lift"
    >
      <div className="relative">
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-4 right-4 flex gap-2">
            {statusBadge && (
              <Badge className="bg-[var(--web-ash)] text-[var(--web-serenity)] border-0 text-[10px] uppercase tracking-wider">
                {statusBadge}
              </Badge>
            )}
            {property.promotionStatus === "top_property" && (
              <Badge
                variant="secondary"
                className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider"
              >
                Featured
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-[13px]">
            <MapPinIcon className="h-3.5 w-3.5" />
            {property.area}
          </div>
        </div>

        <div className="p-5">
          <Title
            as="h3"
            className="font-headline text-[var(--web-ash)] text-lg font-normal mb-2 group-hover:text-[var(--web-spruce)] transition-colors"
          >
            {property.title}
          </Title>

          <div className="text-[var(--web-spruce)] text-[14px] font-light mb-4">
            {formatCrmBedrooms(property)}
            {property.bathrooms != null ? ` • ${property.bathrooms} Bath` : ""}
            {property.sqft != null ? ` • ${property.sqft.toLocaleString("en-AE")} sqft` : ""}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-headline text-[var(--web-ash)] text-lg">
              {formatCrmPriceRange(property)}
            </div>
            <span className="text-[var(--web-spruce)] text-[11px] uppercase tracking-[0.15em] flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              View Details
              <ArrowRightIcon className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
