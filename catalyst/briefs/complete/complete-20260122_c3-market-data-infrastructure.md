# C3: Market Data Infrastructure

> **Priority:** HIGH | **Status:** PARTIAL — Database ready, UI pending

---

## Context

LMS modules contain time-sensitive market data (prices, supply figures, transaction volumes) that becomes stale. Previously, updates required:
1. Editing markdown files
2. Regenerating essentials
3. Regenerating audio

This brief establishes infrastructure to decouple dynamic data from static content.

---

## Goal

Create a refreshable market data system with:
1. **Database storage** — `market_data` table (DONE)
2. **Refresh mechanism** — Edge function for manual updates (DONE)
3. **Interactive UI** — Data explorer component in modules (PENDING)
4. **Parity with training material** — Charts, tables matching original screenshots (PENDING)

---

## Deliverables

### 1. Market Data Table ✅

**Migration:** `create_market_data_table`

```sql
CREATE TABLE market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  value JSONB NOT NULL,
  source TEXT,
  source_url TEXT,
  valid_from DATE,
  valid_until DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Categories:**
- `market` — Overall market statistics (transaction volumes, growth)
- `supply` — Pipeline and delivery forecasts
- `pricing` — Median prices by area
- `area_data` — Area-specific developer lists, price ranges

**RLS:** Public read (active data only), admin write via service role

### 2. Initial Data Seed ✅

Seeded 7 data records from training materials and 2025 research:

| Key | Category | Description |
|-----|----------|-------------|
| `market_overview_2025` | market | AED 917bn total, 115% growth |
| `supply_pipeline_2025` | supply | 78,536 units, 50k/year forecast |
| `existing_stock_by_area` | supply | Top 11 areas by existing units |
| `under_construction_by_area` | supply | Top 11 areas by construction |
| `median_prices_by_area` | pricing | AED/sqft by area |
| `area_jvc` | area_data | JVC developers, pricing |
| `area_dubai_south` | area_data | Dubai South developers, pricing |

### 3. Edge Function ✅

**Function:** `refresh-market-data`
**Endpoint:** `POST /functions/v1/refresh-market-data`
**Auth:** JWT required (admin only)

**Actions:**

```typescript
// Check current data status
{ "action": "status" }

// Manual data update
{ 
  "action": "manual-update",
  "data": {
    "data_key": "area_jvc",
    "category": "area_data",
    "value": { ... },
    "source": "Knight Frank Q1 2026",
    "valid_until": "2026-06-30"
  }
}

// Automated refresh (placeholder for future API integrations)
{ "action": "refresh" }
```

---

## Usage Pattern

### For Module Content

Instead of hardcoding prices in module content:

```markdown
❌ Old way:
"JVC prices range from AED 700-1,400 per sqft"

✅ New way:
"JVC prices range from AED 900-1,600 per sqft"
(Reference market_data.area_jvc for current values)
```

### For Weekly Refresh

1. **Manual (recommended for now):**
   - Admin calls edge function with `manual-update` action
   - Data is updated in table
   - Modules automatically display updated data

2. **Future automation:**
   - Cron job calls `refresh` action weekly
   - Function fetches from DLD/PropertyFinder APIs
   - Stale data flagged for review

---

## Future Enhancements

- [ ] DLD API integration (if available)
- [ ] PropertyFinder API integration
- [ ] Bayut API integration
- [ ] Automated email alerts for stale data
- [ ] Admin UI for data management

---

## Technical Notes

- **valid_until field:** Used to flag stale data. Set to end of current year by default.
- **source tracking:** Each record tracks where data came from for auditing.
- **JSONB flexibility:** Schema-less value field allows different data shapes per category.
- **RLS security:** Only service role can write; public can read active data.

---

## Acceptance Criteria

- [x] `market_data` table created with appropriate schema
- [x] RLS policies configured
- [x] Initial data seeded from training materials
- [x] Edge function deployed for data management
- [x] Documentation complete
- [ ] **MarketDataExplorer component** — Interactive charts/tables
- [ ] **Module integration** — Component embedded in `area-knowledge`, `dubai-overview`, `area-deep-dives`
- [ ] **Visual parity** — Matches training material screenshots (bar charts, tables)

---

## Pending: MarketDataExplorer Component

### What it should display (matching training material):

**1. Supply Pipeline Chart**
- Total 2025 handovers: 78,536 units
- Breakdown: Completed / Construction / On Hold
- Source: `market_data.supply_pipeline_2025`

**2. Existing Stock by Area (Bar Chart)**
- Top 11 areas ranked by existing units
- Dubai Marina (28,983) → Meydan (6,813)
- Source: `market_data.existing_stock_by_area`

**3. Under Construction by Area (Bar Chart)**
- Top 11 areas ranked by units under construction
- Business Bay (19,854) → Al Furjan (7,422)
- Source: `market_data.under_construction_by_area`

**4. Median Prices by Area (Table/Chart)**
- AED per sqft by area
- Palm Jumeirah (3,264) → JLT (1,526)
- Source: `market_data.median_prices_by_area`

### Component location:
`components/lms/market-data-explorer.tsx`

### Module integration:
Add `<MarketDataExplorer category="supply" />` to relevant module markdown or essentials.

---

## Related Briefs

- **C2: Market Intelligence** — Uses this data for module content updates
