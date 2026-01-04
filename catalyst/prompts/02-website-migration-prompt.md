# Website Migration Prompt
## Phase 2: Migrate Website from Ant Design to shadcn/ui

**Context**: You are migrating the Prime Capital Dubai website from Ant Design to shadcn/ui. The legacy website is in `/legacy/website/`. The target structure is the current repository root. The LMS migration (Phase 1) should be complete before this phase.

---

## Background

Read these documents first to understand the project:
- `/catalyst/specs/project-vision.md` — Project intent and scope
- `/catalyst/specs/project-architecture.md` — Decisions and rationale

Also review the existing Catalyst documentation:
- `/catalyst/CATALYST.md` — Framework overview
- `/catalyst/PATTERNS.md` — Code patterns
- `/catalyst/SURFACES.md` — Surface definitions

**Key decisions affecting this migration:**
1. Component library changes from Ant Design to shadcn/ui
2. Marketing pages use `(web)/` route group (already exists)
3. Admin area uses `(app)/` route group for CMS functions
4. Feature flags control section visibility (properties, team)
5. Desktop-optimised, mobile-functional for public pages
6. Brand compliance is non-negotiable (Palatino headlines, Lato body, brand colours)

**Existing route groups in this repo:**
- `(app)` — Admin/app area (add CMS routes here)
- `(auth)` — Authentication
- `(docs)` — Documentation
- `(present)` — Presentations
- `(web)` — Public website/marketing pages (migrate content here)

---

## Source Structure (Legacy Website - Ant Design)

```
/legacy/website/
├── app/
│   ├── layout.tsx                # Root layout with AntdRegistry — TRANSFORM
│   ├── (marketing)/              # Marketing pages — MIGRATE
│   │   ├── layout.tsx            # SiteLayout wrapper
│   │   ├── page.tsx              # Homepage
│   │   ├── about/
│   │   ├── services/
│   │   ├── properties/
│   │   ├── team/
│   │   ├── contact/
│   │   └── strategy-kit/
│   ├── admin/                    # Admin panel — MIGRATE to unified admin
│   │   ├── layout.tsx            # Ant Design admin shell
│   │   ├── page.tsx
│   │   ├── properties/
│   │   ├── team/
│   │   ├── testimonials/
│   │   ├── stats/
│   │   └── settings/
│   └── (auth)/
│       └── admin/login/
├── components/
│   ├── Header.tsx                # Scroll-aware header — REBUILD in shadcn
│   ├── Footer.tsx                # Marketing footer — REBUILD in shadcn
│   ├── MobileNav.tsx             # Mobile drawer — REBUILD in shadcn
│   ├── SiteLayout.tsx            # Marketing wrapper — REBUILD in shadcn
│   └── AppShell.tsx              # Admin shell (Ant) — REPLACE with existing
├── theme/
│   ├── tokens.ts                 # Brand tokens — MIGRATE to CSS variables
│   └── themeConfig.ts            # Ant theme — REMOVE
├── lib/
│   ├── config.ts                 # Feature flags — MERGE
│   ├── content.ts                # Dual-source provider — MIGRATE
│   ├── data.ts                   # JSON readers — MIGRATE
│   ├── navigation.ts             # Site nav — MERGE
│   └── supabase/                 # Supabase module — COMPARE & MERGE
└── data/
    ├── config.json               # Feature flags — MIGRATE
    ├── properties.json           # Property data — MIGRATE
    ├── team.json                 # Team data — MIGRATE
    ├── testimonials.json         # Testimonials — MIGRATE
    ├── stats.json                # Stats — MIGRATE
    └── services.json             # Services — MIGRATE
```

---

## Target Structure

```
/app/
├── (web)/                        # Marketing pages — MIGRATE content here
│   ├── layout.tsx                # SiteLayout (shadcn)
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── properties/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── team/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── contact/page.tsx
│   └── strategy-kit/page.tsx
├── (app)/                        # Admin area (from Phase 1 + CMS)
│   ├── layout.tsx                # App shell
│   ├── page.tsx                  # Dashboard
│   ├── properties/page.tsx       # Property CRUD — ADD
│   ├── team/page.tsx             # Team CRUD — ADD
│   ├── testimonials/page.tsx     # Testimonials CRUD — ADD
│   ├── stats/page.tsx            # Stats CRUD — ADD
│   ├── learning/                 # (from Phase 1)
│   ├── users/                    # (from Phase 1)
│   ├── progress/                 # (from Phase 1)
│   └── settings/page.tsx         # Site settings & feature flags — ADD
├── learn/                        # (from Phase 1)
├── hub/                          # (Phase 3)
├── (auth)/
│   └── login/page.tsx            # Unified login
└── layout.tsx                    # Root layout (no Ant)

/components/
├── ui/                           # shadcn primitives (existing)
├── site-header.tsx               # Marketing header — CREATE
├── site-footer.tsx               # Marketing footer — CREATE
├── mobile-nav.tsx                # Mobile navigation — CREATE
├── site-layout.tsx               # Marketing layout wrapper — CREATE
├── property-card.tsx             # Property display — CREATE
├── team-card.tsx                 # Team member display — CREATE
├── testimonial-card.tsx          # Testimonial display — CREATE
├── stat-card.tsx                 # Stat display — CREATE
├── lead-form.tsx                 # Fillout embed wrapper — CREATE
└── lms-header.tsx                # (from Phase 1)

/lib/
├── config.ts                     # Unified config
├── content.ts                    # Dual-source data provider
├── navigation.ts                 # Site + admin navigation
└── supabase/                     # Supabase utilities

/data/
├── config.json                   # Feature flags
├── properties.json               # Fallback data
├── team.json
├── testimonials.json
├── stats.json
└── services.json
```

---

## Migration Tasks

### 1. Remove Ant Design Dependencies

**From `/legacy/website/package.json`, do NOT migrate:**
- `@ant-design/nextjs-registry`
- `@ant-design/v5-patch-for-react-19`
- `antd`

**From root layout, remove:**
- `AntdRegistry` wrapper
- `ConfigProvider` with Ant theme
- Any Ant-specific imports

### 2. Migrate Brand Tokens to CSS Variables

**From:** `/legacy/website/theme/tokens.ts`
**To:** `/app/globals.css`

Convert Ant Design theme tokens to CSS custom properties:

```css
:root {
  /* Brand Colors */
  --brand-spruce: 82 46% 40%;      /* #576C75 in HSL */
  --brand-ash: 210 2% 25%;          /* #3F4142 */
  --brand-off-white: 40 23% 94%;    /* #F2EFEA */
  --brand-serenity: 156 12% 68%;    /* #A6B5B0 */
  
  /* Semantic mappings */
  --background: var(--brand-off-white);
  --foreground: var(--brand-ash);
  --primary: var(--brand-spruce);
  --primary-foreground: var(--brand-off-white);
  --muted: var(--brand-serenity);
  
  /* Typography */
  --font-headline: 'Palatino', 'Palatino Linotype', 'Book Antiqua', serif;
  --font-body: 'Lato', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 3. Rebuild Marketing Components in shadcn/ui

#### SiteHeader (was Header.tsx)

**Behaviour to preserve:**
- Transparent on page load, solid on scroll
- Scroll threshold: 20px
- Navigation links filtered by feature flags
- Mobile: hamburger menu triggers MobileNav

**shadcn components to use:**
- `Button` for nav links
- `Sheet` for mobile menu (instead of Ant Drawer)

```tsx
// components/site-header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

export function SiteHeader({ navigation }) {
  const [scrolled, setScrolled] = useState(false)
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return (
    <header className={cn(
      'fixed top-0 w-full z-50 transition-colors duration-300',
      scrolled ? 'bg-background/95 backdrop-blur border-b' : 'bg-transparent'
    )}>
      {/* ... */}
    </header>
  )
}
```

#### MobileNav (was MobileNav.tsx)

**Behaviour to preserve:**
- Full-screen overlay
- Links filtered by feature flags
- Close on navigation

**shadcn components to use:**
- `Sheet` with `side="right"` or `side="left"`
- `SheetContent` for the drawer

#### SiteFooter (was Footer.tsx)

**Content to preserve:**
- Logo
- Navigation links
- Contact details (address, phone, email)
- Social links
- Legal links (privacy, terms)
- Copyright

**shadcn approach:**
- Pure Tailwind layout, no specific shadcn components needed
- Use `Separator` if needed

#### SiteLayout (was SiteLayout.tsx)

**Behaviour to preserve:**
- Wraps marketing pages
- Includes SiteHeader and SiteFooter
- Handles scroll-to-top on navigation

```tsx
// components/site-layout.tsx
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'

export function SiteLayout({ children, navigation }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader navigation={navigation} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
```

### 4. Rebuild Content Cards

#### PropertyCard

**From:** Ant Design Card
**To:** shadcn Card

```tsx
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PropertyCard({ property }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] relative">
        {/* Image */}
      </div>
      <CardHeader>
        <Badge>{property.type}</Badge>
        <h3 className="font-headline text-xl">{property.title}</h3>
      </CardHeader>
      <CardContent>
        {/* Details */}
      </CardContent>
    </Card>
  )
}
```

#### TeamCard, TestimonialCard, StatCard

Follow same pattern — replace Ant Card with shadcn Card.

### 5. Rebuild Admin CMS Pages

The admin shell should already exist from Phase 1. Add CMS-specific pages:

#### /admin/properties/page.tsx

**Features:**
- Table listing all properties
- Add/Edit/Delete actions
- Image upload to Supabase Storage
- Toggle published/draft status

**shadcn components:**
- `Table` for listing
- `Dialog` for add/edit modal
- `Form` components for fields
- `Button` for actions

#### /admin/team/page.tsx

Same pattern as properties.

#### /admin/testimonials/page.tsx

Same pattern as properties.

#### /admin/stats/page.tsx

Simpler — just key/value pairs with edit capability.

#### /admin/settings/page.tsx

**Features:**
- Feature flags (toggles for properties, team, blog sections)
- Site metadata (title, description)

**shadcn components:**
- `Switch` for feature flags
- `Input` for text fields
- `Button` for save

### 6. Migrate Data Layer

#### /lib/content.ts

Keep the dual-source pattern. Update imports if Supabase client changed:

```typescript
import { createClient } from '@/lib/supabase/client'
import * as jsonData from './data'

const supabase = createClient()

export async function getProperties() {
  // Try Supabase first, fall back to JSON
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('published', true)
    .order('display_order')
  
  if (error || !data?.length) {
    return jsonData.getProperties()
  }
  
  return data.map(dbToProperty)
}

// ... similar for team, testimonials, stats, services
```

#### /lib/config.ts

Merge website config with existing (post-Phase 1):

```typescript
export const config = {
  app: {
    name: 'Prime Capital Dubai',
    description: '...',
  },
  features: {
    properties: true,
    team: true,
    blog: false,  // Future
  },
  learning: {
    // ... from Phase 1
  },
  // ...
}
```

### 7. Migrate JSON Data Files

Copy from `/legacy/website/data/` to `/data/`:
- `config.json`
- `properties.json`
- `team.json`
- `testimonials.json`
- `stats.json`
- `services.json`

### 8. Migrate Supabase Schema (CMS Tables)

Add to existing schema (from Phase 1):

```sql
-- Properties
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT,  -- 'apartment', 'villa', 'penthouse', etc.
  location TEXT,
  developer TEXT,
  price_from NUMERIC,
  price_to NUMERIC,
  bedrooms_from INTEGER,
  bedrooms_to INTEGER,
  size_from NUMERIC,
  size_to NUMERIC,
  completion_date DATE,
  description TEXT,
  features JSONB DEFAULT '[]',
  images JSONB DEFAULT '[]',
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  expertise JSONB DEFAULT '[]',
  image_url TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author_name TEXT,
  author_title TEXT,
  author_location TEXT,
  published BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stats
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

-- Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]',
  icon TEXT,
  display_order INTEGER DEFAULT 0
);

-- Site settings
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. Update Marketing Pages

For each page in `(marketing)/`, update:
- Remove any Ant Design component imports
- Use shadcn equivalents or pure Tailwind
- Ensure brand typography classes applied

**Typography classes to use:**
```css
.font-headline { font-family: var(--font-headline); }
.font-body { font-family: var(--font-body); }
```

Or Tailwind config:
```js
// tailwind.config.js
fontFamily: {
  headline: ['Palatino', 'Palatino Linotype', 'serif'],
  body: ['Lato', '-apple-system', 'sans-serif'],
}
```

### 10. Forms (Fillout.com Embeds)

Keep Fillout.com embeds for Contact and Strategy Kit forms. Create a wrapper component:

```tsx
// components/lead-form.tsx
export function LeadForm({ formId, className }) {
  return (
    <div className={cn('fillout-embed', className)}>
      <iframe
        src={`https://forms.fillout.com/t/${formId}`}
        className="w-full min-h-[500px] border-0"
      />
    </div>
  )
}
```

---

## Component Mapping Reference

| Ant Design Component | shadcn/ui Equivalent |
|---------------------|---------------------|
| `Button` | `Button` |
| `Card` | `Card`, `CardHeader`, `CardContent` |
| `Drawer` | `Sheet`, `SheetContent` |
| `Modal` | `Dialog`, `DialogContent` |
| `Form`, `Form.Item` | `Form`, `FormField`, `FormItem` |
| `Input` | `Input` |
| `Select` | `Select`, `SelectTrigger`, `SelectContent` |
| `Switch` | `Switch` |
| `Table` | `Table`, `TableHeader`, `TableBody`, `TableRow` |
| `Tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `Menu` | `DropdownMenu` or `NavigationMenu` |
| `Breadcrumb` | `Breadcrumb` |
| `Badge` | `Badge` |
| `Skeleton` | `Skeleton` |
| `message` (toast) | `toast` (from sonner) |
| `Typography` | Tailwind classes |
| `Space` | Tailwind flex/gap |
| `Row`/`Col` | Tailwind grid |
| `Divider` | `Separator` |

---

## Do NOT Migrate

- `/legacy/website/theme/themeConfig.ts` — Ant-specific
- Any `@ant-design/*` imports
- Ant Design CSS overrides
- `AntdRegistry` wrapper

---

## Verification Checklist

After migration, verify:

**Public Pages:**
- [ ] Homepage renders with all sections
- [ ] Header scroll behaviour works (transparent → solid)
- [ ] Mobile navigation opens/closes
- [ ] Properties page lists properties (if enabled)
- [ ] Property detail pages render
- [ ] Team page lists members (if enabled)
- [ ] Team member detail pages render
- [ ] About page renders
- [ ] Services page renders
- [ ] Contact page with form
- [ ] Strategy Kit page with form
- [ ] Footer displays on all pages

**Admin CMS:**
- [ ] Properties CRUD works
- [ ] Team CRUD works
- [ ] Testimonials CRUD works
- [ ] Stats CRUD works
- [ ] Settings/feature flags work
- [ ] Image upload to Supabase Storage works

**Brand Compliance:**
- [ ] Palatino headlines rendering
- [ ] Lato body text rendering
- [ ] Brand colours correct (Spruce, Ash, Off White, Serenity)
- [ ] No Ant Design styling visible

**Data Layer:**
- [ ] Supabase data loads when available
- [ ] JSON fallback works when Supabase empty
- [ ] Feature flags control section visibility
- [ ] Real-time updates work

**Responsive:**
- [ ] Desktop layout correct (1280px+)
- [ ] Tablet layout acceptable (768px)
- [ ] Mobile layout functional (375px)

---

## Notes

- Preserve all scroll animations and transitions from legacy
- Maintain exact brand colour values
- Test Fillout.com embed styling matches brand
- Ensure no Ant Design CSS leaks through
- Admin panel should feel consistent with learning admin (Phase 1)
