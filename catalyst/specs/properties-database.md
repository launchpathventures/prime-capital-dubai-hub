# Properties Database Schema

> **Unified schema supporting Prime Capital Dubai, Steven Leckie, and Reelly API**

This document defines the complete database structure for the properties module, designed to accommodate multiple data sources while maintaining a consistent interface.

---

## Overview

The properties module uses a **unified data architecture** that supports:

| Platform | Data Source | Primary Use Case |
|----------|-------------|------------------|
| **Prime Capital Dubai** | Supabase | Curated luxury listings with investment analysis |
| **Steven Leckie** | Airtable → Supabase | Expert commentary and educational content |
| **Reelly** | External API | High-volume property data with unit configurations |

### Design Principles

1. **Single source of truth** — One `properties` table serves all platforms
2. **Flexible schema** — JSONB fields accommodate varying data structures
3. **Source tracking** — Every record knows its origin for sync management
4. **Backward compatibility** — Legacy fields preserved alongside new structures

---

## Database Schema

### SQL Definition

```sql
-- =============================================================================
-- UNIFIED PROPERTIES SCHEMA v2
-- Supports: Prime Capital Dubai, Steven Leckie, and Reelly API
-- =============================================================================

CREATE TABLE IF NOT EXISTS properties (
  -- =========================================================================
  -- IDENTITY
  -- =========================================================================
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,                          -- Primary display name (Reelly: name)
  project_name TEXT,                            -- Alternative/internal name
  
  -- =========================================================================
  -- CLASSIFICATION
  -- =========================================================================
  type TEXT,                                    -- Normalized: apartment, villa, penthouse, townhouse, plot
  property_type TEXT,                           -- Display format: "Luxury Apartment", "Waterfront Villa"
  status TEXT DEFAULT 'draft' 
    CHECK (status IN ('draft', 'active', 'inactive', 'sold', 'reserved', 'archived', 
                      'under_construction', 'completed', 'launching')),
  sale_status TEXT 
    CHECK (sale_status IN ('available', 'under_offer', 'sold', 'coming_soon', 
                           'sold_out', 'limited_availability')),
  completion_status TEXT DEFAULT 'off-plan' 
    CHECK (completion_status IN ('off-plan', 'ready', 'under_construction')),
  completion_date DATE,                         -- Actual date (Reelly: completion_datetime)
  completion_display TEXT,                      -- Display format: "Q4 2027", "Ready Now"
  
  -- Flags
  featured BOOLEAN DEFAULT false,
  is_partner_project BOOLEAN DEFAULT false,     -- Reelly: is_partner_project
  published BOOLEAN DEFAULT false,
  
  -- =========================================================================
  -- LOCATION
  -- =========================================================================
  location TEXT NOT NULL,                       -- Area/neighborhood (Reelly: area)
  community TEXT,                               -- Sub-area: "The Crescent", "Emaar Beachfront"
  city TEXT DEFAULT 'Dubai',
  country TEXT DEFAULT 'UAE',
  coordinates JSONB,                            -- { "lat": 25.1, "lng": 55.2 }
  coordinates_raw TEXT,                         -- Original string format from Reelly
  
  -- =========================================================================
  -- DEVELOPER
  -- =========================================================================
  developer TEXT,
  developer_website TEXT,
  developer_description TEXT,                   -- "About the Developer" content
  project_website TEXT,                         -- Reelly: website
  
  -- =========================================================================
  -- PRICING
  -- =========================================================================
  currency TEXT DEFAULT 'AED',
  price_from NUMERIC,                           -- Starting price (min)
  price_to NUMERIC,                             -- Max price (optional)
  price_display TEXT,                           -- Override: "Price on Request", "From AED 2.5M"
  price_per_sqft NUMERIC,                       -- For comparisons
  service_charge NUMERIC,                       -- AED per sqft/year
  
  -- =========================================================================
  -- SPECIFICATIONS
  -- =========================================================================
  -- Numeric (for filtering/sorting)
  bedrooms_from INTEGER,
  bedrooms_to INTEGER,
  bathrooms INTEGER,
  size_from NUMERIC,
  size_to NUMERIC,
  size_unit TEXT DEFAULT 'sqft',
  floor_from INTEGER,
  floor_to INTEGER,
  parking_spaces INTEGER,
  
  -- Display formats (for flexible presentation)
  bedrooms_display TEXT,                        -- "Studio, 1, 2, 3", "1-3 BR"
  size_display TEXT,
  
  -- =========================================================================
  -- CONTENT
  -- =========================================================================
  -- Core content
  description TEXT,                             -- Full description (Reelly: overview)
  short_description TEXT,                       -- For cards/listings (excerpt)
  features JSONB DEFAULT '[]',                  -- ["Private Pool", "Sea View", "Smart Home"]
  amenities JSONB DEFAULT '[]',                 -- Building/community amenities
  
  -- Extended content sections (Steven Leckie style)
  content_sections JSONB DEFAULT '{}',
  /*
    {
      "paymentPlan": "40/60 Payment Plan",
      "paymentPlanDetails": "Detailed breakdown...",
      "reasonsToInvest": "Key investment drivers...",
      "locationAndViews": "Location highlights...",
      "units": "Available unit types...",
      "unitsPricing": "Pricing breakdown...",
      "amenities": "Detailed amenities..."
    }
  */
  
  -- =========================================================================
  -- MEDIA
  -- =========================================================================
  -- Primary images (simple access)
  cover_image TEXT,                             -- Hero/primary (Reelly: cover_image_url)
  secondary_image TEXT,                         -- Interior/lifestyle shot
  amenities_image TEXT,                         -- Amenities showcase
  
  -- Categorized galleries (unified across all sources)
  images JSONB DEFAULT '[]',                    -- General gallery array (flat list)
  gallery JSONB DEFAULT '{}',                   -- Categorized images
  /*
    {
      "exterior": ["url1", "url2"],
      "interior": ["url1", "url2"],        -- Reelly: interior
      "masterPlan": ["url1"],              -- Reelly: master_plan
      "floorPlans": ["url1", "url2"],
      "lobby": ["url1"],                   -- Reelly: lobby
      "amenities": ["url1", "url2"],
      "views": ["url1"],
      "architecture": ["url1", "url2"],    -- Reelly: architecture
      "buildings": ["url1", "url2"]        -- Reelly: buildings
    }
  */
  
  -- Rich media
  videos JSONB DEFAULT '[]',                    -- Video URLs
  virtual_tour_url TEXT,                        -- Matterport, etc.
  brochure_url TEXT,                            -- Downloadable PDF
  
  -- =========================================================================
  -- INVESTMENT DATA
  -- =========================================================================
  investment JSONB DEFAULT '{}',
  /*
    {
      "expectedRentalYield": 7.5,
      "historicalAppreciation": 12,
      "pricePerSqFt": 2500,
      "areaAvgPricePerSqFt": 2800,
      "reasonsToInvest": ["Point 1", "Point 2"],
      "comparables": [
        { "project": "Name", "location": "Area", "pricePerSqFt": 2600 }
      ],
      "locationHighlights": [
        { "time": "5 min", "destination": "Dubai Mall" }
      ],
      "developerTrackRecord": "25 years, 50+ projects"
    }
  */
  
  -- Direct investment fields (for simpler queries)
  expected_rental_yield NUMERIC,                -- e.g., 7.5 for 7.5%
  
  -- Expert commentary (Steven Leckie style)
  commentary TEXT,                              -- Expert analysis/opinion
  risk_assessment TEXT,                         -- Risk evaluation
  
  -- =========================================================================
  -- UNIT CONFIGURATIONS (supports Reelly unit_blocks)
  -- =========================================================================
  unit_types JSONB DEFAULT '[]',
  /*
    [
      {
        "id": 123,                           -- Reelly: id
        "name": "1BR Type A",                -- Reelly: name
        "unitType": "Apartment",             -- Reelly: unit_type
        "normalizedType": "apartment",       -- Reelly: normalized_type
        "bedrooms": 1,
        "bedroomsDisplay": "1",              -- Reelly: unit_bedrooms (string)
        "bathrooms": 1,
        "size": 850,
        "sizeFrom": 800,                     -- Reelly: units_area_from
        "sizeTo": 900,                       -- Reelly: units_area_to
        "sizeUnit": "sqft",                  -- Reelly: area_unit
        "priceFrom": 1500000,                -- Reelly: units_price_from
        "priceTo": 1800000,                  -- Reelly: units_price_to
        "priceCurrency": "AED",              -- Reelly: price_currency
        "floorPlans": ["url1"],
        "typicalUnitImage": "url",           -- Reelly: typical_unit_image_url
        "availableCount": 5,                 -- Reelly: units_amount
        "externalId": "reelly-123"
      }
    ]
  */
  
  -- =========================================================================
  -- PAYMENT PLANS (supports multiple plans from Reelly)
  -- =========================================================================
  payment_plans JSONB DEFAULT '[]',             -- Array of payment plans
  /*
    [
      {
        "name": "Standard Plan",
        "summary": "40/60 Payment Plan",
        "isDefault": true,
        "booking": 10,
        "duringConstruction": 30,
        "onHandover": 60,
        "postHandover": { "months": 24, "percent": 0 },
        "milestones": [
          { "percent": 10, "description": "On booking" },
          { "percent": 10, "description": "Within 30 days" }
        ],
        "details": "Flexible payment terms available..."
      }
    ]
  */
  
  -- Legacy single payment plan (for backward compatibility)
  payment_plan JSONB DEFAULT '{}',
  
  -- Reelly-specific payment fields
  post_handover BOOLEAN DEFAULT false,          -- Reelly: post_handover
  has_escrow BOOLEAN DEFAULT false,             -- Reelly: has_escrow
  deposit_description TEXT,                     -- Reelly: deposit_description
  
  -- =========================================================================
  -- ADMINISTRATIVE
  -- =========================================================================
  display_order INTEGER DEFAULT 0,
  source TEXT,                                  -- 'manual', 'airtable', 'reelly', 'import'
  external_id TEXT,                             -- ID from external system
  external_id_numeric INTEGER,                  -- Reelly uses numeric IDs
  
  -- Sync tracking (for Reelly/Airtable)
  last_synced_at TIMESTAMPTZ,
  sync_hash TEXT,                               -- For detecting changes
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);
```

### Indexes

```sql
-- Identity & lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_external_id ON properties(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_properties_external_id_numeric ON properties(external_id_numeric) WHERE external_id_numeric IS NOT NULL;

-- Filtering
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_published ON properties(published);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_completion_status ON properties(completion_status);

-- Location
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(location);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_developer ON properties(developer);

-- Sorting & ranges
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price_from);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms_from, bedrooms_to);
CREATE INDEX IF NOT EXISTS idx_properties_display_order ON properties(display_order);
CREATE INDEX IF NOT EXISTS idx_properties_completion_date ON properties(completion_date);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Source tracking
CREATE INDEX IF NOT EXISTS idx_properties_source ON properties(source);
CREATE INDEX IF NOT EXISTS idx_properties_last_synced ON properties(last_synced_at);
```

### Row Level Security

```sql
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public can read published, active properties
CREATE POLICY "Public can view published properties"
  ON properties FOR SELECT
  USING (published = true AND status = 'active');

-- Authenticated users have full access (admin)
CREATE POLICY "Authenticated users have full access"
  ON properties FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

---

## TypeScript Interface

```typescript
/**
 * Unified Property interface supporting all platforms
 * - Prime Capital Dubai
 * - Steven Leckie (Airtable)
 * - Reelly API
 */
export interface Property {
  // Identity
  id: string
  slug: string
  title: string                              // Reelly: name, SL: name
  projectName?: string
  
  // Classification
  type?: string                              // Normalized: apartment, villa, penthouse
  propertyType?: string                      // Display: "Luxury Apartment"
  status: PropertyStatus
  saleStatus?: SaleStatus
  completionStatus: CompletionStatus
  completionDate?: string                    // ISO date (Reelly: completion_datetime)
  completionDisplay?: string                 // "Q4 2027", "Ready Now"
  featured: boolean
  isPartnerProject: boolean                  // Reelly: is_partner_project
  published: boolean
  
  // Location
  location: string                           // Reelly: area
  community?: string
  city: string
  country: string
  coordinates?: { lat: number; lng: number }
  coordinatesRaw?: string                    // Original string from Reelly
  
  // Developer
  developer?: string
  developerWebsite?: string                  // Reelly: developer_website
  developerDescription?: string
  projectWebsite?: string                    // Reelly: website
  
  // Pricing
  currency: string
  priceFrom?: number
  priceTo?: number
  priceDisplay?: string
  pricePerSqft?: number
  serviceCharge?: number
  
  // Specifications (numeric)
  bedroomsFrom?: number
  bedroomsTo?: number
  bathrooms?: number
  sizeFrom?: number
  sizeTo?: number
  sizeUnit: string
  floorFrom?: number
  floorTo?: number
  parkingSpaces?: number
  
  // Specifications (display)
  bedroomsDisplay?: string
  sizeDisplay?: string
  
  // Content
  description?: string                       // Reelly: overview
  shortDescription?: string
  features: string[]
  amenities: string[]
  contentSections?: ContentSections
  
  // Media - Simple access
  coverImage?: string                        // Reelly: cover_image_url
  secondaryImage?: string
  amenitiesImage?: string
  
  // Media - Galleries
  images: string[]
  gallery?: PropertyGallery
  
  // Rich media
  videos?: string[]
  virtualTourUrl?: string
  brochureUrl?: string
  
  // Investment
  investment?: InvestmentData
  expectedRentalYield?: number
  commentary?: string
  riskAssessment?: string
  
  // Unit configurations (Reelly: unit_blocks)
  unitTypes?: UnitType[]
  
  // Payment plans (Reelly supports multiple)
  paymentPlans?: PaymentPlan[]
  paymentPlan?: PaymentPlan                  // Legacy single plan
  
  // Reelly-specific fields
  postHandover?: boolean                     // Reelly: post_handover
  hasEscrow?: boolean                        // Reelly: has_escrow
  depositDescription?: string                // Reelly: deposit_description
  
  // Administrative
  displayOrder: number
  source?: 'manual' | 'airtable' | 'reelly' | 'import'
  externalId?: string
  externalIdNumeric?: number                 // Reelly uses numeric IDs
  lastSyncedAt?: string
  syncHash?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}
```

### Supporting Types

```typescript
type PropertyStatus = 
  | 'draft' 
  | 'active' 
  | 'inactive' 
  | 'sold' 
  | 'reserved' 
  | 'archived'
  | 'under_construction'
  | 'completed'
  | 'launching'

type SaleStatus = 
  | 'available' 
  | 'under_offer' 
  | 'sold' 
  | 'coming_soon'
  | 'sold_out'
  | 'limited_availability'

type CompletionStatus = 'off-plan' | 'ready' | 'under_construction'

interface ContentSections {
  paymentPlan?: string
  paymentPlanDetails?: string
  reasonsToInvest?: string
  locationAndViews?: string
  units?: string
  unitsPricing?: string
  amenities?: string
}

interface PropertyGallery {
  exterior?: string[]
  interior?: string[]              // Reelly: interior
  masterPlan?: string[]            // Reelly: master_plan
  floorPlans?: string[]
  lobby?: string[]                 // Reelly: lobby
  amenities?: string[]
  views?: string[]
  architecture?: string[]          // Reelly: architecture
  buildings?: string[]             // Reelly: buildings
}

interface InvestmentData {
  expectedRentalYield?: number
  historicalAppreciation?: number
  pricePerSqFt?: number
  areaAvgPricePerSqFt?: number
  reasonsToInvest?: string[]
  comparables?: Array<{
    project: string
    location: string
    pricePerSqFt: number
  }>
  locationHighlights?: Array<{
    time: string
    destination: string
  }>
  developerTrackRecord?: string
}

interface UnitType {
  id?: number                      // Reelly: id
  name: string                     // Reelly: name
  unitType?: string                // Reelly: unit_type ("Apartment", "Villa")
  normalizedType?: string          // Reelly: normalized_type
  bedrooms?: number
  bedroomsDisplay?: string         // Reelly: unit_bedrooms (string)
  bathrooms?: number
  size?: number                    // Single size value
  sizeFrom?: number                // Reelly: units_area_from
  sizeTo?: number                  // Reelly: units_area_to
  sizeUnit?: string                // Reelly: area_unit
  priceFrom?: number               // Reelly: units_price_from
  priceTo?: number                 // Reelly: units_price_to
  priceCurrency?: string           // Reelly: price_currency
  floorPlans?: string[]
  typicalUnitImage?: string        // Reelly: typical_unit_image_url
  availableCount?: number          // Reelly: units_amount
  externalId?: string
}

interface PaymentPlan {
  name?: string
  summary?: string
  isDefault?: boolean
  booking?: number                 // Percentage
  duringConstruction?: number      // Percentage
  onHandover?: number              // Percentage
  postHandover?: {
    months: number
    percent: number
  }
  milestones?: Array<{
    percent: number
    description: string
    dueDate?: string
  }>
  details?: string
}
```

---

## Field Mapping Reference

### Reelly API → Unified Schema

| Reelly Field | Unified Field | Notes |
|--------------|---------------|-------|
| `id` | `external_id_numeric` | Integer ID |
| `name` | `title` | Primary display name |
| `developer` | `developer` | Direct mapping |
| `developer_website` | `developer_website` | Direct mapping |
| `area` | `location` | Neighborhood/area name |
| `city` | `city` | Direct mapping |
| `country` | `country` | Direct mapping |
| `status` | `status` | May need value mapping |
| `is_partner_project` | `is_partner_project` | Direct mapping |
| `cover_image_url` | `cover_image` | Primary image |
| `post_handover` | `post_handover` | Payment flag |
| `sale_status` | `sale_status` | May need value mapping |
| `completion_datetime` | `completion_date` | Parse to DATE |
| `has_escrow` | `has_escrow` | Trust flag |
| `coordinates` | `coordinates_raw`, `coordinates` | Parse "lat,lng" string |
| `overview` | `description` | Full description |
| `website` | `project_website` | Project URL |
| `deposit_description` | `deposit_description` | Payment terms |
| `unit_blocks` | `unit_types` | Transform array |
| `payment_plans` | `payment_plans` | Direct array |
| `master_plan` | `gallery.masterPlan` | Image array |
| `lobby` | `gallery.lobby` | Image array |
| `interior` | `gallery.interior` | Image array |
| `architecture` | `gallery.architecture` | Image array |
| `buildings` | `gallery.buildings` | Image array |

### Steven Leckie (Airtable) → Unified Schema

| Airtable Field | Unified Field | Notes |
|----------------|---------------|-------|
| Property Name | `title` | Primary display name |
| Property Slug | `slug` | URL identifier |
| Developer | `developer` | Direct mapping |
| Suburbs UI | `location` | Area/neighborhood |
| Minimum Price | `price_from` | Starting price |
| Completion Date | `completion_display` | "Q4 2027" format |
| Property Landing Page UI | `property_type` | Display format |
| Top Property List | `featured` | = "Top Property" |
| Created | `created_at` | Timestamp |
| Expected Rental Yield Percent | `expected_rental_yield` | Percentage |
| Type | `type` | Normalized type |
| Bedrooms | `bedrooms_display` | "1-3", "Studio, 1, 2" |
| Primary Property Image | `cover_image` | Hero image |
| Interior/Secondary Property Image | `secondary_image` | Lifestyle shot |
| Amenities Property Image | `amenities_image` | Amenities showcase |
| Payment Plan | `content_sections.paymentPlan` | Summary text |
| Payment Plan Details | `content_sections.paymentPlanDetails` | Detailed breakdown |
| Property Description | `description` | Full description |
| Reasons To Invest | `content_sections.reasonsToInvest` | Investment drivers |
| Location & Views | `content_sections.locationAndViews` | Location highlights |
| Units | `content_sections.units` | Available units |
| Units Pricing | `content_sections.unitsPricing` | Pricing breakdown |
| Amenities | `content_sections.amenities` | Detailed amenities |
| About The Developer | `developer_description` | Developer info |

### Prime Capital Dubai → Unified Schema

| Prime Capital Field | Unified Field | Notes |
|--------------------|---------------|-------|
| `id` | `id` | UUID |
| `slug` | `slug` | URL identifier |
| `title` | `title` | Primary display name |
| `type` | `type` | Normalized type |
| `location` | `location` | Area/neighborhood |
| `city` | `city` | Direct mapping |
| `country` | `country` | Direct mapping |
| `developer` | `developer` | Direct mapping |
| `priceFrom` | `price_from` | Starting price |
| `priceTo` | `price_to` | Maximum price |
| `currency` | `currency` | Default AED |
| `bedroomsFrom` | `bedrooms_from` | Numeric min |
| `bedroomsTo` | `bedrooms_to` | Numeric max |
| `bathrooms` | `bathrooms` | Direct mapping |
| `sizeFrom` | `size_from` | Numeric min |
| `sizeTo` | `size_to` | Numeric max |
| `sizeUnit` | `size_unit` | sqft/sqm |
| `completionDate` | `completion_date` | ISO date |
| `completionStatus` | `completion_status` | off-plan/ready |
| `description` | `description` | Full description |
| `features` | `features` | String array |
| `coverImage` | `cover_image` | Primary image |
| `images` | `images` | General gallery |
| `masterPlanImages` | `gallery.masterPlan` | Image array |
| `interiorImages` | `gallery.interior` | Image array |
| `lobbyImages` | `gallery.lobby` | Image array |
| `architectureImages` | `gallery.architecture` | Image array |
| `coordinates` | `coordinates` | JSONB {lat, lng} |
| `investment` | `investment` | JSONB object |
| `unitTypes` | `unit_types` | JSONB array |
| `featured` | `featured` | Boolean flag |
| `isPartnerProject` | `is_partner_project` | Boolean flag |
| `displayOrder` | `display_order` | Sort order |

---

## Data Transformation

### Reelly Adapter

```typescript
/**
 * Transform Reelly API response to unified Property format
 */
export function transformReellyProperty(reelly: ReellyProperty): Partial<Property> {
  // Parse coordinates from string "lat,lng" format
  const coordinates = reelly.coordinates 
    ? parseCoordinates(reelly.coordinates) 
    : undefined

  // Aggregate prices from unit_blocks
  const prices = reelly.unit_blocks?.reduce((acc, unit) => ({
    min: Math.min(acc.min, unit.units_price_from || Infinity),
    max: Math.max(acc.max, unit.units_price_to || 0)
  }), { min: Infinity, max: 0 })

  // Aggregate bedrooms from unit_blocks
  const bedrooms = reelly.unit_blocks?.reduce((acc, unit) => {
    const beds = parseBedroomString(unit.unit_bedrooms)
    return {
      min: Math.min(acc.min, beds.min),
      max: Math.max(acc.max, beds.max)
    }
  }, { min: Infinity, max: 0 })

  return {
    slug: generateSlug(reelly.name),
    title: reelly.name,
    
    // Classification
    status: mapReellyStatus(reelly.status),
    saleStatus: reelly.sale_status as SaleStatus,
    isPartnerProject: reelly.is_partner_project,
    completionDate: reelly.completion_datetime?.split('T')[0],
    
    // Location
    location: reelly.area,
    city: reelly.city,
    country: reelly.country,
    coordinates,
    coordinatesRaw: reelly.coordinates,
    
    // Developer
    developer: reelly.developer,
    developerWebsite: reelly.developer_website,
    projectWebsite: reelly.website,
    
    // Pricing (aggregated from units)
    priceFrom: prices?.min !== Infinity ? prices.min : undefined,
    priceTo: prices?.max !== 0 ? prices.max : undefined,
    
    // Specifications (aggregated from units)
    bedroomsFrom: bedrooms?.min !== Infinity ? bedrooms.min : undefined,
    bedroomsTo: bedrooms?.max !== 0 ? bedrooms.max : undefined,
    
    // Content
    description: reelly.overview,
    
    // Media
    coverImage: reelly.cover_image_url,
    gallery: {
      masterPlan: reelly.master_plan || [],
      lobby: reelly.lobby || [],
      interior: reelly.interior || [],
      architecture: reelly.architecture || [],
      buildings: reelly.buildings || []
    },
    
    // Unit types
    unitTypes: reelly.unit_blocks?.map(block => ({
      id: block.id,
      name: block.name,
      unitType: block.unit_type,
      normalizedType: block.normalized_type,
      bedroomsDisplay: block.unit_bedrooms,
      sizeFrom: block.units_area_from,
      sizeTo: block.units_area_to,
      sizeUnit: block.area_unit,
      priceFrom: block.units_price_from,
      priceTo: block.units_price_to,
      priceCurrency: block.price_currency,
      typicalUnitImage: block.typical_unit_image_url,
      availableCount: block.units_amount
    })),
    
    // Payment
    paymentPlans: reelly.payment_plans || [],
    postHandover: reelly.post_handover,
    hasEscrow: reelly.has_escrow,
    depositDescription: reelly.deposit_description,
    
    // Admin
    source: 'reelly',
    externalIdNumeric: reelly.id,
    externalId: `reelly-${reelly.id}`
  }
}

// Helper: parse "lat,lng" string to coordinates object
function parseCoordinates(str: string): { lat: number; lng: number } | undefined {
  const [lat, lng] = str.split(',').map(s => parseFloat(s.trim()))
  if (isNaN(lat) || isNaN(lng)) return undefined
  return { lat, lng }
}

// Helper: parse bedroom string to min/max
function parseBedroomString(str: string): { min: number; max: number } {
  if (!str) return { min: Infinity, max: 0 }
  
  // Handle "Studio" 
  if (str.toLowerCase().includes('studio')) {
    return { min: 0, max: 0 }
  }
  
  // Handle ranges like "1-3"
  const rangeMatch = str.match(/(\d+)\s*-\s*(\d+)/)
  if (rangeMatch) {
    return { min: parseInt(rangeMatch[1]), max: parseInt(rangeMatch[2]) }
  }
  
  // Handle single numbers
  const num = parseInt(str)
  if (!isNaN(num)) {
    return { min: num, max: num }
  }
  
  return { min: Infinity, max: 0 }
}

// Helper: generate URL slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper: map Reelly status to unified status
function mapReellyStatus(status: string): PropertyStatus {
  const statusMap: Record<string, PropertyStatus> = {
    'active': 'active',
    'inactive': 'inactive',
    'sold': 'sold',
    'under_construction': 'under_construction',
    'completed': 'completed',
    'launching': 'launching'
  }
  return statusMap[status?.toLowerCase()] || 'draft'
}
```

### Steven Leckie Adapter

```typescript
/**
 * Transform Airtable record to unified Property format
 */
export function transformAirtableProperty(record: AirtableRecord): Partial<Property> {
  const fields = record.fields
  
  return {
    slug: fields['Property Slug'],
    title: fields['Property Name'],
    
    // Classification
    type: normalizeType(fields['Type']),
    propertyType: extractPropertyType(fields['Property Landing Page UI']),
    featured: fields['Top Property List'] === 'Top Property',
    completionDisplay: fields['Completion Date'],
    
    // Location
    location: fields['Suburbs UI'],
    city: 'Dubai',
    country: 'UAE',
    
    // Developer
    developer: fields['Developer'],
    developerDescription: fields['About The Developer'],
    
    // Pricing
    currency: 'AED',
    priceFrom: fields['Minimum Price'],
    
    // Specifications
    bedroomsDisplay: fields['Bedrooms'],
    expectedRentalYield: fields['Expected Rental Yield Percent'],
    
    // Content
    description: fields['Property Description'],
    contentSections: {
      paymentPlan: fields['Payment Plan'],
      paymentPlanDetails: fields['Payment Plan Details'],
      reasonsToInvest: fields['Reasons To Invest'],
      locationAndViews: fields['Location & Views'],
      units: fields['Units'],
      unitsPricing: fields['Units Pricing'],
      amenities: fields['Amenities']
    },
    
    // Media
    coverImage: fields['Primary Property Image']?.[0]?.url,
    secondaryImage: fields['Interior/Secondary Property Image']?.[0]?.url,
    amenitiesImage: fields['Amenities Property Image']?.[0]?.url,
    
    // Expert content
    commentary: fields['Commentary'],
    riskAssessment: fields['Risk Assessment'],
    
    // Admin
    source: 'airtable',
    externalId: record.id,
    createdAt: fields['Created']
  }
}
```

---

## Future Considerations

### Related Tables

As the platform grows, consider these additional tables:

| Table | Purpose |
|-------|---------|
| `property_enquiries` | Lead capture per property |
| `property_views` | Analytics tracking |
| `property_favorites` | User wishlists |
| `property_documents` | Legal/marketing docs |
| `developers` | Developer profiles (normalize) |
| `communities` | Location/area profiles |
| `property_comparisons` | Saved comparison sets |

### Sync Management

For external data sources:

```sql
-- Track sync operations
CREATE TABLE IF NOT EXISTS property_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,                    -- 'reelly', 'airtable'
  operation TEXT NOT NULL,                 -- 'full', 'incremental'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  properties_created INTEGER DEFAULT 0,
  properties_updated INTEGER DEFAULT 0,
  properties_unchanged INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  status TEXT DEFAULT 'running'            -- 'running', 'completed', 'failed'
);
```

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-30 | 2.0 | Added Reelly API support, payment_plans array, gallery categories |
| 2026-01-30 | 1.5 | Added Steven Leckie fields, content_sections, expert commentary |
| 2026-01-06 | 1.0 | Initial Prime Capital Dubai schema |
