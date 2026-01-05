/**
 * CATALYST - Property Card Component
 *
 * Displays a property listing in card format for the marketing website.
 * Used on the properties page and homepage featured properties section.
 */

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  type Property,
  formatPriceRange,
  formatBedroomRange,
  formatSizeRange,
} from "@/lib/content"
import { MapPinIcon, BedDoubleIcon, RulerIcon } from "lucide-react"

interface PropertyCardProps {
  property: Property
  className?: string
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const statusBadge = property.completionStatus === "off-plan" ? "Off-Plan" : "Ready"
  const statusVariant = property.completionStatus === "off-plan" ? "secondary" : "default"

  return (
    <Link href={`/properties/${property.slug}`}>
      <Card
        className={cn(
          "property-card overflow-hidden group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20",
          className
        )}
      >
        {/* Property Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {property.images[0] ? (
            <Image
              src={property.images[0]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">No image</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant={statusVariant} className="text-xs">
              {statusBadge}
            </Badge>
          </div>

          {/* Type Badge */}
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs capitalize">
              {property.type}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-headline text-lg font-medium leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPinIcon className="h-3.5 w-3.5" />
            <span>{property.location}</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Price */}
          <div className="text-xl font-semibold text-primary mb-3">
            {formatPriceRange(property.priceFrom, property.priceTo, property.currency)}
          </div>

          {/* Specs */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <BedDoubleIcon className="h-4 w-4" />
              <span>{formatBedroomRange(property.bedroomsFrom, property.bedroomsTo)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RulerIcon className="h-4 w-4" />
              <span>{formatSizeRange(property.sizeFrom, property.sizeTo, property.sizeUnit)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
