/**
 * CATALYST - Properties Filter Component
 *
 * Server-rendered filter UI driven by URL query params.
 * Keeps the properties grid interactive without client hydration overhead.
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, MapPinIcon } from "lucide-react"
import { propertyTypeImages } from "../../_surface/property-images"

type Property = {
  slug: string
  title: string
  type: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  area: string
  description: string
  featured?: boolean
  status?: string
  coverImage?: string | null
}

interface PropertiesFilterProps {
  properties: Property[]
  activeType?: string
  areaFilter?: string
}

export function PropertiesFilter({
  properties,
  activeType = "all",
  areaFilter = "",
}: PropertiesFilterProps) {
  const normalisedType = activeType || "all"
  const normalisedAreaFilter = areaFilter.trim().toLowerCase()

  // Get unique types
  const types = Array.from(new Set(properties.map((p) => p.type)))
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = properties.filter((p) => p.type === type).length
    return acc
  }, {} as Record<string, number>)

  // Filter properties by type and area
  let filteredProperties = normalisedType === "all"
    ? properties
    : properties.filter((p) => p.type === normalisedType)

  if (normalisedAreaFilter) {
    filteredProperties = filteredProperties.filter((p) =>
      p.location.toLowerCase().includes(normalisedAreaFilter)
    )
  }

  const getFilterHref = (type: string) => {
    const params = new URLSearchParams()
    if (type !== "all") params.set("type", type)
    if (areaFilter) params.set("area", areaFilter)
    const query = params.toString()
    return `/properties${query ? `?${query}` : ""}`
  }

  return (
    <>
      {/* Filter Tabs */}
      <section className="bg-[var(--web-off-white)] py-8 border-b border-[var(--web-serenity)]/20">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={getFilterHref("all")}
              className={`px-5 py-2 rounded-[2px] text-[13px] uppercase tracking-wider transition-colors ${
                normalisedType === "all"
                  ? "bg-[var(--web-ash)] text-[var(--web-off-white)]"
                  : "bg-transparent text-[var(--web-spruce)] border border-[var(--web-spruce)]/30 hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
              }`}
              scroll={false}
            >
              All Properties ({properties.length})
            </Link>
            {types.map((type) => (
              <Link
                key={type}
                href={getFilterHref(type)}
                className={`px-5 py-2 rounded-[2px] text-[13px] uppercase tracking-wider transition-colors capitalize ${
                  normalisedType === type
                    ? "bg-[var(--web-ash)] text-[var(--web-off-white)]"
                    : "bg-transparent text-[var(--web-spruce)] border border-[var(--web-spruce)]/30 hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
                }`}
                scroll={false}
              >
                {type} ({typeCounts[type]})
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Properties Grid */}
      <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
        <Container size="xl">
          {filteredProperties.length === 0 ? (
            <Stack gap="md" align="center" className="text-center py-12">
              <Text className="text-[var(--web-spruce)] text-[15px] font-light">
                No properties found matching your criteria. Contact us for off-market opportunities.
              </Text>
            </Stack>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.slug} property={property} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  )
}

function PropertyCard({ property }: { property: Property }) {
  // Use cover image if available, otherwise fall back to type-based placeholder
  const imageUrl = property.coverImage || propertyTypeImages[property.type.toLowerCase()] || propertyTypeImages.default

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group block bg-white overflow-hidden card-lift"
    >
      <div className="relative">
        {/* Image */}
        <div className="relative h-[220px] overflow-hidden">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Featured badge */}
          {property.featured && (
            <Badge
              variant="secondary"
              className="absolute top-4 right-4 bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider"
            >
              Featured
            </Badge>
          )}

          {/* Location */}
          <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white text-[13px]">
            <MapPinIcon className="h-3.5 w-3.5" />
            {property.location}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Title
            as="h3"
            className="font-headline text-[var(--web-ash)] text-lg font-normal mb-2 group-hover:text-[var(--web-spruce)] transition-colors"
          >
            {property.title}
          </Title>

          <div className="text-[var(--web-spruce)] text-[14px] font-light mb-4">
            {property.bedrooms} Bed • {property.bathrooms} Bath • {property.area}
          </div>

          <div className="flex items-center justify-between">
            <div className="font-headline text-[var(--web-ash)] text-lg">
              {property.price}
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

