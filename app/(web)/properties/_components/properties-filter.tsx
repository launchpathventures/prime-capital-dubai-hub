/**
 * CATALYST - Properties Grid + Load More
 *
 * Renders the property card grid seeded with the server's first page, then
 * walks the CRM cursor via /api/properties to reveal the rest of the inventory
 * (the CRM caps each request at 50 rows). Filtering still lives entirely in the
 * URL; this component is remounted (keyed on the filter string) whenever the
 * active filters change, so load-more state always resets to page 1.
 */

"use client"

import { useCallback, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ArrowRightIcon, Loader2Icon, MapPinIcon } from "lucide-react"

import { Container, Stack, Text, Title } from "@/components/core"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { propertyTypeImages } from "../../_surface/property-images"
import { formatCrmBedrooms, formatCrmPriceRange, getStatusBadge, type CrmProperty } from "@/lib/crm"

interface PropertiesGridProps {
  /** Server-rendered first page (already filtered). */
  initialProperties: CrmProperty[]
  /** Opaque cursor for the next page, or null when there is no more inventory. */
  initialCursor: string | null
  initialHasMore: boolean
}

interface PropertiesPageResponse {
  properties: CrmProperty[]
  nextCursor: string | null
  hasMore: boolean
  total: number
}

export function PropertiesGrid({
  initialProperties,
  initialCursor,
  initialHasMore,
}: PropertiesGridProps) {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState(initialProperties)
  const [cursor, setCursor] = useState(initialCursor)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (!cursor || isLoading) return
    setIsLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set("cursor", cursor)
      const res = await fetch(`/api/properties?${params.toString()}`)
      if (!res.ok) return
      const data = (await res.json()) as PropertiesPageResponse
      setProperties((prev) => [...prev, ...data.properties])
      setCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } catch {
      // Swallow: a failed load-more leaves the current results intact and the
      // button available to retry.
    } finally {
      setIsLoading(false)
    }
  }, [cursor, isLoading, searchParams])

  return (
    <section className="bg-[var(--web-off-white)] py-[var(--web-section-gap)]">
      <Container size="xl">
        {properties.length === 0 ? (
          <Stack gap="md" align="center" className="text-center py-12">
            <Title as="h2" className="font-headline text-[var(--web-ash)] text-2xl font-normal">
              No properties match those filters
            </Title>
            <Text className="text-[var(--web-spruce)] text-[15px] font-light max-w-md">
              Loosen your criteria or contact us for off-market opportunities.
            </Text>
          </Stack>
        ) : (
          <Stack gap="xl" align="center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {hasMore && (
              <Button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="h-12 px-8 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  "Load More Properties"
                )}
              </Button>
            )}
          </Stack>
        )}
      </Container>
    </section>
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
            {property.sqft != null && property.sqft > 0
              ? ` • ${property.sqft.toLocaleString("en-AE")} sqft`
              : ""}
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
