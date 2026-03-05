/**
 * CATALYST - Properties Filter Component
 *
 * Server-rendered filter UI driven by URL query params.
 * Supports type, area, and tag filters (e.g., ?tag=distressed).
 */

import Link from "next/link"
import Image from "next/image"
import { Container, Stack, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, MapPinIcon, TagIcon } from "lucide-react"
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
  tags?: string[]
}

interface PropertiesFilterProps {
  properties: Property[]
  activeType?: string
  areaFilter?: string
  tagFilter?: string
}

export function PropertiesFilter({
  properties,
  activeType = "all",
  areaFilter = "",
  tagFilter = "",
}: PropertiesFilterProps) {
  const normalisedType = activeType || "all"
  const normalisedAreaFilter = areaFilter.trim().toLowerCase()
  const normalisedTagFilter = tagFilter.trim().toLowerCase()

  // Get unique types
  const types = Array.from(new Set(properties.map((p) => p.type)))
  const typeCounts = types.reduce((acc, type) => {
    acc[type] = properties.filter((p) => p.type === type).length
    return acc
  }, {} as Record<string, number>)

  // Count distressed properties
  const distressedCount = properties.filter((p) => p.tags?.includes("distressed")).length

  // Filter properties by type, area, and tag
  let filteredProperties = normalisedType === "all"
    ? properties
    : properties.filter((p) => p.type === normalisedType)

  if (normalisedAreaFilter) {
    filteredProperties = filteredProperties.filter((p) =>
      p.location.toLowerCase().includes(normalisedAreaFilter)
    )
  }

  if (normalisedTagFilter) {
    filteredProperties = filteredProperties.filter((p) =>
      p.tags?.includes(normalisedTagFilter)
    )
  }

  const getFilterHref = (type: string, tag?: string) => {
    const params = new URLSearchParams()
    if (type !== "all") params.set("type", type)
    if (areaFilter && !tag) params.set("area", areaFilter)
    if (tag) params.set("tag", tag)
    else if (tagFilter && type !== "all") params.set("tag", tagFilter)
    const query = params.toString()
    return `/properties${query ? `?${query}` : ""}`
  }

  const isDistressedActive = normalisedTagFilter === "distressed" && normalisedType === "all"

  return (
    <>
      {/* Filter Tabs */}
      <section className="bg-[var(--web-off-white)] py-8 border-b border-[var(--web-serenity)]/20">
        <Container size="xl">
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={getFilterHref("all")}
              className={`px-5 py-2 rounded-[2px] text-[13px] uppercase tracking-wider transition-colors ${
                normalisedType === "all" && !normalisedTagFilter
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
                  normalisedType === type && !normalisedTagFilter
                    ? "bg-[var(--web-ash)] text-[var(--web-off-white)]"
                    : "bg-transparent text-[var(--web-spruce)] border border-[var(--web-spruce)]/30 hover:bg-[var(--web-spruce)] hover:text-[var(--web-off-white)]"
                }`}
                scroll={false}
              >
                {type} ({typeCounts[type]})
              </Link>
            ))}
            {/* Distressed Sale filter */}
            {distressedCount > 0 && (
              <Link
                href={isDistressedActive ? getFilterHref("all") : "/properties?tag=distressed"}
                className={`px-5 py-2 rounded-[2px] text-[13px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                  isDistressedActive
                    ? "bg-[var(--web-ash)] text-[var(--web-serenity)]"
                    : "bg-transparent text-[var(--web-ash)] border border-[var(--web-ash)]/40 hover:bg-[var(--web-ash)] hover:text-[var(--web-serenity)]"
                }`}
                scroll={false}
              >
                <TagIcon className="h-3.5 w-3.5" />
                Distressed Sale ({distressedCount})
              </Link>
            )}
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
  const imageUrl = property.coverImage || propertyTypeImages[property.type.toLowerCase()] || propertyTypeImages.default
  const isDistressed = property.tags?.includes("distressed")

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

          {/* Badges — top right */}
          <div className="absolute top-4 right-4 flex gap-2">
            {isDistressed && (
              <Badge className="bg-[var(--web-ash)] text-[var(--web-serenity)] border-0 text-[10px] uppercase tracking-wider">
                <TagIcon className="h-3 w-3 mr-1" />
                Distressed Sale
              </Badge>
            )}
            {property.featured && (
              <Badge
                variant="secondary"
                className="bg-[var(--web-spruce)] text-[var(--web-off-white)] text-[10px] uppercase tracking-wider"
              >
                Featured
              </Badge>
            )}
          </div>

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
