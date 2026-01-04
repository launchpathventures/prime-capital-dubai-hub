/**
 * CATALYST - Maps Example
 *
 * Property listings page for Auckland, New Zealand demonstrating:
 * - Interactive MapLibre GL map with property markers
 * - Toggle between Map and List views
 * - Shared filters (price, bedrooms, property type)
 * - Property cards with images and details
 * - Click interactions between map markers and property selection
 * - Map reset functionality
 *
 * Uses MapLibre GL with free CARTO/OpenStreetMap tiles (no API key required).
 */

"use client"

import { useState, useCallback, useMemo } from "react"
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Container, Row, Stack, Text, Title } from "@/components/core"
import { ExamplePrompt, getExample } from "../../_surface"

const example = getExample("maps")!

import {
  MapPinIcon,
  ListIcon,
  MapIcon,
  HeartIcon,
  BedDoubleIcon,
  BathIcon,
  RulerIcon,
  HomeIcon,
  BuildingIcon,
  TreesIcon,
  FilterIcon,
  XIcon,
  LocateFixedIcon,
  PackageIcon,
} from "lucide-react"

// =============================================================================
// TYPES
// =============================================================================

interface Property {
  id: string
  title: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  sqft: number
  type: "house" | "apartment" | "condo" | "townhouse"
  image: string
  lat: number
  lng: number
  featured?: boolean
}

type ViewMode = "map" | "list"
type PriceFilter = "all" | "under-500k" | "500k-1m" | "over-1m"
type BedroomFilter = "all" | "1" | "2" | "3" | "4+"
type TypeFilter = "all" | "house" | "apartment" | "condo" | "townhouse"

// =============================================================================
// MOCK DATA - Auckland, New Zealand Properties
// =============================================================================

// Default map center for Auckland (includes pitch and bearing for full reset)
const DEFAULT_VIEW = {
  latitude: -36.8485,
  longitude: 174.7633,
  zoom: 12,
  pitch: 0,
  bearing: 0,
}

const properties: Property[] = [
  // Under $500K - 1 bed apartments
  {
    id: "1",
    title: "City Fringe Studio",
    address: "42 K Road, Newton",
    price: 385000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 450,
    type: "apartment",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
    lat: -36.8580,
    lng: 174.7540,
  },
  {
    id: "2",
    title: "Compact CBD Apartment",
    address: "15 Queen St, Auckland CBD",
    price: 475000,
    bedrooms: 1,
    bathrooms: 1,
    sqft: 520,
    type: "apartment",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    lat: -36.8465,
    lng: 174.7658,
  },
  // $500K-$1M - 2 bed mixed types
  {
    id: "3",
    title: "Ponsonby Character Flat",
    address: "88 Ponsonby Rd, Ponsonby",
    price: 695000,
    bedrooms: 2,
    bathrooms: 1,
    sqft: 850,
    type: "apartment",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400&h=300&fit=crop",
    lat: -36.8520,
    lng: 174.7420,
    featured: true,
  },
  {
    id: "4",
    title: "Harbour View Condo",
    address: "200 Quay St, Viaduct",
    price: 875000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1050,
    type: "condo",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    lat: -36.8420,
    lng: 174.7635,
    featured: true,
  },
  {
    id: "5",
    title: "Mt Eden Townhouse",
    address: "34 Valley Rd, Mt Eden",
    price: 945000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1100,
    type: "townhouse",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
    lat: -36.8770,
    lng: 174.7600,
  },
  // $500K-$1M - 3 bed
  {
    id: "6",
    title: "Grey Lynn Villa",
    address: "56 Surrey Cres, Grey Lynn",
    price: 985000,
    bedrooms: 3,
    bathrooms: 1,
    sqft: 1400,
    type: "house",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop",
    lat: -36.8610,
    lng: 174.7350,
  },
  // Over $1M - 3 bed houses
  {
    id: "7",
    title: "Parnell Heritage Home",
    address: "12 St Stephens Ave, Parnell",
    price: 1450000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    type: "house",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    lat: -36.8560,
    lng: 174.7780,
    featured: true,
  },
  {
    id: "8",
    title: "Devonport Cottage",
    address: "8 Victoria Rd, Devonport",
    price: 1250000,
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1650,
    type: "house",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=300&fit=crop",
    lat: -36.8290,
    lng: 174.7950,
  },
  // Over $1M - 4+ bed family homes
  {
    id: "9",
    title: "Remuera Family Estate",
    address: "25 Arney Rd, Remuera",
    price: 2850000,
    bedrooms: 5,
    bathrooms: 3,
    sqft: 3200,
    type: "house",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=300&fit=crop",
    lat: -36.8680,
    lng: 174.7920,
  },
  {
    id: "10",
    title: "Herne Bay Luxury",
    address: "99 Jervois Rd, Herne Bay",
    price: 3200000,
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    type: "house",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    lat: -36.8450,
    lng: 174.7320,
  },
  // Condos and Townhouses for type filter variety
  {
    id: "11",
    title: "Mission Bay Condo",
    address: "45 Tamaki Dr, Mission Bay",
    price: 1150000,
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "condo",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=400&h=300&fit=crop",
    lat: -36.8520,
    lng: 174.8150,
  },
  {
    id: "12",
    title: "Epsom Modern Townhouse",
    address: "78 Manukau Rd, Epsom",
    price: 1350000,
    bedrooms: 4,
    bathrooms: 2,
    sqft: 1900,
    type: "townhouse",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=400&h=300&fit=crop",
    lat: -36.8850,
    lng: 174.7680,
  },
]

// =============================================================================
// HELPERS
// =============================================================================

function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(2)}M`
  }
  return `$${(price / 1000).toFixed(0)}K`
}

function getPropertyTypeIcon(type: Property["type"]) {
  switch (type) {
    case "house":
      return HomeIcon
    case "apartment":
      return BuildingIcon
    case "condo":
      return BuildingIcon
    case "townhouse":
      return TreesIcon
    default:
      return HomeIcon
  }
}

// =============================================================================
// COMPONENTS
// =============================================================================

function PropertyCard({
  property,
  isSelected,
  onSelect,
  onFavorite,
  isFavorite,
}: {
  property: Property
  isSelected: boolean
  onSelect: (id: string) => void
  onFavorite: (id: string) => void
  isFavorite: boolean
}) {
  const TypeIcon = getPropertyTypeIcon(property.type)

  return (
    <Card
      className={`group py-0 cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary shadow-md" : ""
      }`}
      onClick={() => onSelect(property.id)}
    >
      {/* Image */}
      <div className="relative aspect-[3/2] overflow-hidden bg-muted">
        <img
          src={property.image}
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {property.featured && (
          <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-xs">Featured</Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 size-7 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background ${
            isFavorite ? "text-rose-500" : "text-muted-foreground"
          }`}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            onFavorite(property.id)
          }}
        >
          <HeartIcon className={`size-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
      </div>

      {/* Content */}
      <CardContent className="p-3 pt-0 pb-4">
        <Stack gap="xs">
          {/* Price - prominent */}
          <Text weight="bold" size="lg" className="text-foreground">
            {formatPrice(property.price)}
          </Text>
          
          {/* Title */}
          <Text weight="medium" size="sm" className="line-clamp-1">{property.title}</Text>
          
          {/* Address */}
          <Row gap="xs" align="center">
            <MapPinIcon className="size-3 shrink-0 text-muted-foreground" />
            <Text size="xs" variant="muted" className="line-clamp-1">{property.address}</Text>
          </Row>
          
          {/* Stats */}
          <Row gap="sm" className="pt-2 mt-1 border-t border-border/50">
            <Row gap="xs" align="center">
              <BedDoubleIcon className="size-3.5 text-muted-foreground" />
              <Text size="xs" variant="muted">{property.bedrooms} bd</Text>
            </Row>
            <Row gap="xs" align="center">
              <BathIcon className="size-3.5 text-muted-foreground" />
              <Text size="xs" variant="muted">{property.bathrooms} ba</Text>
            </Row>
            <Row gap="xs" align="center">
              <RulerIcon className="size-3.5 text-muted-foreground" />
              <Text size="xs" variant="muted">{property.sqft.toLocaleString()}</Text>
            </Row>
          </Row>
          
          {/* Type badge */}
          <Badge variant="secondary" className="w-fit text-xs font-normal capitalize mt-1">
            <TypeIcon className="size-3 mr-1" />
            {property.type}
          </Badge>
        </Stack>
      </CardContent>
    </Card>
  )
}

function MapMarker({
  property,
  isSelected,
  onClick,
}: {
  property: Property
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer px-2.5 py-1 rounded-full font-semibold text-xs shadow-md transition-all duration-200 border ${
        isSelected
          ? "bg-foreground text-background border-foreground scale-110 z-10"
          : "bg-background text-foreground border-border hover:border-foreground/30 hover:scale-105"
      }`}
    >
      {formatPrice(property.price)}
    </div>
  )
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function MapsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("map")
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [popupProperty, setPopupProperty] = useState<Property | null>(null)

  // Filters
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")
  const [bedroomFilter, setBedroomFilter] = useState<BedroomFilter>("all")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")

  // Map state
  const [viewState, setViewState] = useState(DEFAULT_VIEW)

  const resetMapView = useCallback(() => {
    setViewState(DEFAULT_VIEW)
    setSelectedProperty(null)
    setPopupProperty(null)
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handlePropertySelect = useCallback((id: string) => {
    setSelectedProperty(id)
    const property = properties.find((p) => p.id === id)
    if (property && viewMode === "map") {
      setViewState((prev) => ({
        ...prev,
        latitude: property.lat,
        longitude: property.lng,
        zoom: 14,
      }))
      setPopupProperty(property)
    }
  }, [viewMode])

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Price filter
      if (priceFilter === "under-500k" && p.price >= 500000) return false
      if (priceFilter === "500k-1m" && (p.price < 500000 || p.price >= 1000000)) return false
      if (priceFilter === "over-1m" && p.price < 1000000) return false

      // Bedroom filter
      if (bedroomFilter === "1" && p.bedrooms !== 1) return false
      if (bedroomFilter === "2" && p.bedrooms !== 2) return false
      if (bedroomFilter === "3" && p.bedrooms !== 3) return false
      if (bedroomFilter === "4+" && p.bedrooms < 4) return false

      // Type filter
      if (typeFilter !== "all" && p.type !== typeFilter) return false

      return true
    })
  }, [priceFilter, bedroomFilter, typeFilter])

  const activeFiltersCount = [priceFilter, bedroomFilter, typeFilter].filter((f) => f !== "all").length

  const clearAllFilters = useCallback(() => {
    setPriceFilter("all")
    setBedroomFilter("all")
    setTypeFilter("all")
  }, [])

  return (
    <Container className="maps-page py-6">
      {/* Prompt */}
      <ExamplePrompt summary={example.summary}>
        {example.prompt}
        <Card className="mt-4 p-3 bg-muted/50 border-dashed">
          <Row gap="sm" align="center">
            <PackageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <Text size="sm" variant="muted">
              Uses{" "}
              <a href="https://visgl.github.io/react-map-gl/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">react-map-gl</a>{" "}
              with MapLibre GL — no API key required
            </Text>
          </Row>
        </Card>
      </ExamplePrompt>

      {/* Header */}
      <div className="mt-6">
        <Card className="bg-gradient-to-r from-violet-500/[0.06] via-violet-500/[0.02] to-transparent">
          <CardContent className="py-4">
            <Row gap="lg" align="center" justify="between" className="flex-wrap gap-y-4">
              {/* Left: Title */}
              <Row gap="md" align="center">
                <div className="flex size-11 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                  <MapPinIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <Stack gap="none">
                  <Title size="h3">Property Listings</Title>
                  <Text size="sm" variant="muted">
                    {filteredProperties.length} properties in Auckland
                  </Text>
                </Stack>
              </Row>

              {/* Right: View Toggle + Filters */}
              <Row gap="md" align="center" className="flex-wrap">
                {/* Filters */}
                <Row gap="sm" align="center">
                  {activeFiltersCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="h-9 bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300 text-sm py-2 px-3 gap-2 cursor-pointer hover:bg-violet-200 dark:hover:bg-violet-800/50 transition-colors"
                      onClick={clearAllFilters}
                    >
                      <FilterIcon className="size-4" />
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
                      <XIcon className="size-4" />
                    </Badge>
                  )}
                  <Select value={priceFilter} onValueChange={(v) => setPriceFilter(v as PriceFilter)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Price</SelectItem>
                      <SelectItem value="under-500k">Under $500K</SelectItem>
                      <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                      <SelectItem value="over-1m">Over $1M</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={bedroomFilter} onValueChange={(v) => setBedroomFilter(v as BedroomFilter)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Beds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Beds</SelectItem>
                      <SelectItem value="1">1 Bed</SelectItem>
                      <SelectItem value="2">2 Beds</SelectItem>
                      <SelectItem value="3">3 Beds</SelectItem>
                      <SelectItem value="4+">4+ Beds</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </Row>

                {/* View Toggle */}
                <div className="flex rounded-lg border bg-muted/50 p-1">
                  <Button
                    variant={viewMode === "map" ? "default" : "ghost"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setViewMode("map")}
                  >
                    <MapIcon className="h-4 w-4" />
                    Map
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setViewMode("list")}
                  >
                    <ListIcon className="h-4 w-4" />
                    List
                  </Button>
                </div>
              </Row>
            </Row>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="mt-6">
        {viewMode === "map" ? (
          /* Map View */
          <div className="h-[calc(100vh-360px)] min-h-[400px] relative rounded-lg overflow-hidden border">
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
              style={{ width: "100%", height: "100%" }}
            >
              <NavigationControl position="top-right" />

              {/* Reset Map Button */}
              <div className="absolute top-[100px] right-2.5 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-[29px] bg-background shadow-md"
                  onClick={resetMapView}
                  title="Reset map view"
                >
                  <LocateFixedIcon className="size-4" />
                </Button>
              </div>

              {/* Property Markers */}
              {filteredProperties.map((property) => (
                <Marker
                  key={property.id}
                  latitude={property.lat}
                  longitude={property.lng}
                  anchor="bottom"
                >
                  <MapMarker
                    property={property}
                    isSelected={selectedProperty === property.id}
                    onClick={() => {
                      setSelectedProperty(property.id)
                      setPopupProperty(property)
                    }}
                  />
                </Marker>
              ))}

              {/* Popup */}
              {popupProperty && (
                <Popup
                  latitude={popupProperty.lat}
                  longitude={popupProperty.lng}
                  anchor="bottom"
                  offset={25}
                  closeOnClick={false}
                  onClose={() => setPopupProperty(null)}
                  className="maps-popup"
                >
                  <div className="w-64">
                    <img
                      src={popupProperty.image}
                      alt={popupProperty.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                    <div className="p-3">
                      <Text weight="bold" size="lg">{formatPrice(popupProperty.price)}</Text>
                      <Text weight="medium" className="line-clamp-1 mt-1">{popupProperty.title}</Text>
                      <Text size="sm" variant="muted" className="line-clamp-1">{popupProperty.address}</Text>
                      <Row gap="md" className="mt-2 pt-2 border-t border-border/50">
                        <Text size="sm" variant="muted">{popupProperty.bedrooms} bd</Text>
                        <Text size="sm" variant="muted">{popupProperty.bathrooms} ba</Text>
                        <Text size="sm" variant="muted">{popupProperty.sqft.toLocaleString()} sqft</Text>
                      </Row>
                    </div>
                  </div>
                </Popup>
              )}
            </Map>
          </div>
        ) : (
          /* List View */
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isSelected={selectedProperty === property.id}
                  onSelect={handlePropertySelect}
                  onFavorite={toggleFavorite}
                  isFavorite={favorites.has(property.id)}
                />
              ))}
            </div>
            {filteredProperties.length === 0 && (
              <Card className="p-12 text-center">
                <Stack gap="md" align="center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <HomeIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Title size="h4">No properties found</Title>
                  <Text variant="muted">Try adjusting your filters to see more results.</Text>
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </Stack>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Custom styles for popup and attribution */}
      <style jsx global>{`
        .maps-popup .maplibregl-popup-content {
          padding: 0;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        }
        .maps-popup .maplibregl-popup-close-button {
          font-size: 1.25rem;
          padding: 0.5rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        .maps-popup .maplibregl-popup-close-button:hover {
          background: transparent;
        }
        /* Hide the compact attribution toggle button */
        .maplibregl-ctrl-attrib-button {
          display: none !important;
        }
        /* Always show attribution in collapsed form */
        .maplibregl-ctrl-attrib {
          font-size: 10px;
          opacity: 0.7;
        }
      `}</style>
    </Container>
  )
}
