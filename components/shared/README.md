# Shared

Project-specific components composed from Core and UI components.

These are reused across multiple pages but aren't generic enough
to be in `core/` or `ui/`.

## Components

| Component | Purpose | Example use |
|-----------|---------|-------------|
| `DevCard` | Development helper cards with amber styling | Auth dev tools, debug panels |
| `HeaderPopoverProvider` | Coordinates header popovers (only one open at a time) | Wrap Header.Actions |
| `LabelValue` | Display label-value pairs | Profile pages, detail views, settings |
| `StatCard` | Dashboard metric cards | KPIs, analytics, overview pages |
| `SurfaceSwitcher` | Navigate between surfaces (Web, App, Docs, etc.) | Header actions slot |
| `ThemeProvider` | Wraps app for dark mode | Root layout only |
| `ThemeToggle` | Light/Auto/Dark switcher | Header actions slot |
| `UrlToast` | Handle toasts from URL params and Supabase errors | App layout (auto-shows auth feedback) |

## Usage

```tsx
import { LabelValue, StatCard } from "@/components/shared"

// Inline (default)
<LabelValue label="Email" value="user@example.com" />

// Fixed width labels (for alignment)
<LabelValue variant="fixed" label="Email" value="user@example.com" />
<LabelValue variant="fixed" label="Phone" value="+1 234 567 890" />

// Vertical layout
<LabelValue variant="vertical" label="Status" value="Active" adjunct="since 2024" />

// Stat card with trend
<StatCard
  label="Revenue"
  value="$12,345"
  trend="up"
  trendText="+12.5%"
  description="from last month"
/>

// Dev tools card (respects global config)
<DevCard title="Auth" badge={<DevCardBadge>Demo</DevCardBadge>}>
  <p>Current mode description</p>
</DevCard>

// Get current surface from pathname (for custom logic)
import { getSurfaceFromPath, surfaces } from "@/components/shared"

const surface = getSurfaceFromPath("/admin/dashboard")
// { id: "app", label: "App", href: "/app", icon: LayoutDashboardIcon }

// Coordinate header popovers (wrap in Header.Actions)
import { HeaderPopoverProvider, useHeaderPopover } from "@/components/shared"

function MyPopover() {
  const { open, setOpen } = useHeaderPopover("my-popover")
  // Other popovers auto-close when this opens
}
```

## When to create here

✓ Used on multiple pages
✓ Combines 2+ components from `core/` or `ui/`
✓ Has project-specific logic or styling

## When NOT to create here

✗ Only used on one page → inline it in the page
✗ Generic primitive → belongs in `core/`, `ui/`, or `vendor/`
