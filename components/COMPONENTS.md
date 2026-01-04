# Component Reference

Quick reference for AI agents. Check here first before creating new components.

---

## BEM Naming Convention

All components use BEM-style class names with semantic prefixes for consistent styling hooks.

**Core rules:**
1. **Every component needs a namespace/prefix** — enables CSS targeting and DevTools identification
2. **Use semantic prefixes** — based on domain/purpose, not folder location
3. **BEM format:** `.{prefix}-{name}`, `.{prefix}-{name}__{element}`, `.{prefix}-{name}--{modifier}`

**Prefix examples by folder:**

| Folder | Prefix Style | Examples |
|--------|--------------|----------|
| `core/` | `core-` | `core-stack`, `core-text`, `core-avatar` |
| `ui/` | `ui-` | `ui-button`, `ui-card`, `ui-tabs__list` |
| `layout/` | `layout-` | `layout-shell`, `layout-sidebar`, `layout-header` |
| `shared/` | semantic | `dev-card`, `stat-card`, `user-menu` |
| `vendor/` | semantic | `chart`, `chart-area`, `sortable-item`, `drag-handle` |
| `_surface/` | surface name | `web-shell`, `app-shell`, `docs-shell` |

**Key principle:** The prefix should identify the component family, not the folder. 
- `dev-` could apply to `dev-card`, `dev-tools`, `dev-badge`
- `chart-` applies to `chart-area`, `chart-bar`, `chart-line`
- `web-`, `app-`, `docs-` identify the surface context

---

## ⚠️ Common Mistakes

1. **Using raw `<div>` for layout** — Use `Stack`, `Row`, `Grid` from `core/`
2. **Using raw `<p>`/`<span>` with text classes** — Use `Text`, `Title` from `core/`
3. **Writing raw HTML when a UI component exists** — Check `ui/` before using `<button>`, `<input>`, `<a>`
4. **Creating inline components that shadcn has** — Install instead: `npx shadcn@latest add <name>`
5. **Using Radix `asChild` pattern** — This codebase uses base-ui's `render` prop instead
6. **Duplicating component logic** — Compose from existing components, don't rebuild

---

## Decision Flow

1. **Need layout (flex/grid containers)?**
   - Use `Stack` (vertical), `Row` (horizontal), or `Grid` (responsive grid)
   - Use `Container` for max-width, `Section` for page sections
   - Only use raw `<div>` for one-off structural needs

2. **Need text?**
   - Use `Text` for body text, labels, descriptions
   - Use `Title` for headings (h1-h6)
   - Only add `className` for color overrides not in variants

3. **Need visual indicators?**
   - Use `Dot` for status/activity indicators
   - Use `Avatar` for user initials
   - Use `Count` for numeric badges

4. **Need a UI primitive?**
   - Check `ui/` first
   - If missing, install from shadcn: `npx shadcn@latest add <component>`
   - If shadcn doesn't have it, check for a package → add to `vendor/`

5. **Need a composed component used across pages?**
   - Check `shared/`
   - Create there if missing

6. **Need something for one page only?**
   - Inline it in the page file
   - Keep it simple (< 50 lines)

7. **Never inline if shadcn has it** — install and use the real component

---

## Folder Structure

| Location | What goes here | Examples |
|----------|---------------|----------|
| `ui/` | shadcn primitives only. Easy to upgrade. | Button, Dialog, Input |
| `core/` | Catalyst Core: layout, typography, visual. | Stack, Row, Text, Title, Dot, Avatar |
| `shared/` | Project components. Composed from core. | LabelValue, StatCard |
| `vendor/` | External packages wrapped/styled. | Calendar, DataTable |
| `layout/` | Shell building blocks (sidebar, header, etc.). | Shell, Sidebar, Header |
| Inline | One-off components for a single page. | Keep < 50 lines |

**Shells live with their surfaces:**

| Shell | Location | Surface |
|-------|----------|--------|
| `WebShell` | `app/(web)/_surface/web-shell.tsx` | Marketing |
| `AppShell` | `app/(app)/_surface/app-shell.tsx` | Dashboard |
| `DocsShell` | `app/(docs)/_surface/docs-shell.tsx` | Documentation |
| `SlidesShell` | `app/(present)/_surface/slides-shell.tsx` | Presentations |

---

## Composition Rules

### Use Core components before raw divs

```tsx
// ❌ Don't write raw flex/grid
<div className="flex flex-col gap-4">
  <h2 className="text-2xl font-bold">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>

// ✅ Use Core components
<Stack gap="md">
  <Title size="h2">Title</Title>
  <Text variant="muted">Description</Text>
</Stack>
```

### Use existing variants before custom classes

```tsx
// ❌ Don't write raw classes
<button className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-accent">

// ✅ Use the component with its variant
<Button variant="ghost" size="icon">
```

### Tailwind always overrides base CSS

UI components use a hybrid CSS/Tailwind approach:
- **Base CSS** (`design/components/ui.css`): Structural styles (display, cursor, transitions, focus ring)
- **Tailwind** (CVA): Colors and variant-specific styles

You can override ANY base style with Tailwind:

```tsx
// ✅ Custom sizing — Tailwind wins over base CSS
<Button className="h-14 px-8 text-lg rounded-full">
  Custom Button
</Button>

// ✅ Remove border for custom effects
<Button className="border-0 shadow-lg shadow-primary/20">
  Fancy Button
</Button>
```

### Use render prop for composition (base-ui pattern)

```tsx
// ❌ Radix pattern — doesn't work in this codebase
<PopoverTrigger asChild>
  <Button>...</Button>
</PopoverTrigger>

// ✅ Base-ui pattern — use render prop
<PopoverTrigger render={<Button>...</Button>} />
<TooltipTrigger render={<Toggle pressed={isActive}>...</Toggle>} />
```

### Document composition in shared components

```tsx
/**
 * COMPOSED FROM:
 * - Button (ui/button) — trigger
 * - Toggle (ui/toggle) — option buttons
 * - Popover (ui/popover) — container
 */
```

---

## Component Headers

All UI components have metadata headers for upgrade tracking:

```typescript
/**
 * CATALYST - Button Component
 *
 * @source shadcn/ui v3.6.2 + @base-ui/react v1.0.0
 * @customised No — stock component
 */
```

When customising, update the header:

```typescript
/**
 * @customised Yes
 *   - Added size="xl" variant
 *   - Changed default border radius
 */
```

---

## Component Styling

Catalyst uses a **CSS + Tailwind hybrid** approach. See `design/DESIGN.md` for full details.

### Quick Reference

| Where | What | Example |
|-------|------|---------|
| `design/components/*.css` | Base structural styles | `display`, `cursor`, `transition`, `:focus-visible`, `:disabled` |
| Component CVA | Colors, spacing, sizing | `bg-primary`, `h-9`, `px-2.5`, `hover:bg-primary/80` |
| Instance className | One-off overrides | `<Button className="bg-purple-600" />` |

### BEM Classes

Add BEM classes to components for CSS targeting and DevTools identification:

```tsx
// Block class (always)
className={cn("ui-button", ...)}

// Modifier class (in CVA variants)
variant: {
  primary: "ui-button--primary bg-primary ...",
  outline: "ui-button--outline border-border ...",
}

// Element class (compound components)
className={cn("ui-card__header", ...)}
```

### When Creating New Components

1. **Add base CSS** to `design/components/{category}.css` using `:where()`
2. **Add BEM block class** as first class in component
3. **Add BEM modifier classes** as first item in each CVA variant
4. **Keep Tailwind** for colors, spacing, and instance-variable styles

**Upgrade rules:**
- `@customised No` → safe to overwrite with new version
- `@customised Yes` → review changes before upgrading

---

## ui/ (shadcn + base-ui)

Primitives from shadcn/ui built on `@base-ui/react`. Install more with `npx shadcn@latest add <name>`.

### Common Variants

| Component | Useful Variants | Notes |
|-----------|----------------|-------|
| button | `size="icon"`, `variant="ghost"` | Icon-only buttons |
| toggle | `pressed`, `onPressedChange` | Styling via `data-[pressed]` |
| input | `startIcon`, `endIcon`, `clearable` | Built-in icon slots |

### Available Components

- accordion: Collapsible sections, FAQs
- alert: Inline messages, banners
- alert-dialog: Destructive confirmations
- aspect-ratio: Fixed ratio containers
- avatar: User profile images
- badge: Status labels, tags
- breadcrumb: Navigation trails
- button: Clickable actions (`size="icon"` for icon-only)
- card: Content containers
- checkbox: Multi-select options
- collapsible: Single expandable section
- combobox: Searchable select
- dialog: Modal overlays
- dropdown-menu: Context menus, action menus
- field: Form field wrapper
- input: Text input (supports startIcon, endIcon, clearable)
- input-group: Input with addons (buttons, text prefixes)
- label: Form labels
- popover: Floating content
- progress: Progress bars
- radio-group: Single-select options
- scroll-area: Custom scrollbars
- select: Dropdown select
- separator: Divider lines
- sheet: Slide-out panels
- skeleton: Loading placeholders
- slider: Range inputs
- switch: Toggle on/off
- table: Data tables
- tabs: Tabbed content
- textarea: Multi-line input
- toast: Toast notifications (success, error, warning, info, promise)
- toggle: Toggle buttons (`pressed` + `onPressedChange`)
- tooltip: Hover hints

**Not installed** (add as needed):
```
npx shadcn@latest add calendar carousel chart command context-menu drawer form hover-card menubar navigation-menu pagination resizable toggle-group
```

---

## core/

Catalyst Core: building blocks for layout, typography, and visual elements. See `core/CORE.md`.

**Layout:**
- Stack: Vertical flex container (forms, card bodies, lists)
- Row: Horizontal flex container (button groups, icon + text)
- Grid: Responsive CSS grid (card grids, feature sections)
- Container: Max-width wrapper (constraining content width)
- Section: Vertical padding (hero, features, CTA areas)

**Typography:**
- Text: Body text with variants (paragraphs, descriptions, labels)
- Title: Headings with semantic HTML (h1-h6, page/section titles)

**Visual:**
- Dot: Status indicator (activity feeds, online status)
- Avatar: User initials with gradient (team members, profiles)
- Count: Numeric badge with tabular-nums (item counts, notifications)

---

## vendor/

External packages wrapped for this project.

- charts: Higher-level chart components (AreaChart, BarChart, LineChart, PieChart) built on recharts
- dnd-kit: Drag-and-drop components (DndContext, SortableContext, SortableItem, DragOverlay)

Classes use semantic prefixes: `chart`, `chart-area`, `sortable-item`, `drag-handle`, `droppable`

---

## shared/

Project-specific components composed from Core. See `shared/README.md`.

- dev-card: Development helper cards with amber styling (respects `isDevToolsEnabled()`)
- label-value: Label-value pairs (inline, fixed, vertical variants)
- stat-card: Dashboard metric cards with trend indicators
- theme-toggle: Theme (light/dark/auto) and density selector
- theme-provider: next-themes wrapper for app

Classes use semantic prefixes: `dev-card`, `stat-card`, `user-menu`, etc.

---

## layout/

Shell building blocks shared across surfaces.

- shell: Base container with sidebar/header slots
- sidebar: Sidebar with header/body/footer
- collapsible-sidebar-nav: Navigation with search and collapsible sections
- header: Top header bar
- logo: Brand logo
- mobile-sidebar: Responsive sheet wrapper

### collapsible-sidebar-nav

Flexible navigation component supporting flat items, grouped sections, and accordion mode.

**Basic usage:**
```tsx
import { CollapsibleSidebarNav } from "@/components/layout/collapsible-sidebar-nav"

// Flat navigation
<CollapsibleSidebarNav items={[
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Settings", href: "/settings", icon: SettingsIcon },
]} />

// Grouped sections (always expanded)
<CollapsibleSidebarNav items={[
  { label: "Getting Started", icon: BookIcon, items: [...] },
  { label: "Components", icon: BoxIcon, items: [...] },
]} />

// Collapsible accordion with search (recommended for docs)
<CollapsibleSidebarNav 
  items={navGroups} 
  showSearch 
  accordion 
  onItemClick={closeMobileSidebar} 
/>
```

**Features when `showSearch` + `accordion` enabled:**
- Search input with `Alt+S` keyboard shortcut
- Expand/collapse all button next to search
- Auto-expand all sections when typing
- Collapse to active section when clearing search
- Click section header while expanded → collapse to just that section
- Animations disabled during search for instant feedback

**Data format:**
```tsx
interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
  disabled?: boolean
}

interface NavGroup {
  label?: string
  icon?: LucideIcon
  items: NavItem[]
}
```

**Note:** Composed shells (WebShell, AppShell, etc.) are colocated with their surfaces in `app/(surface)/_surface/`.

---

## Related Docs

| Doc | When to read |
|-----|--------------|
| `AGENTS.md` | Repo conventions, important callouts |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `design/DESIGN.md` | Styling, animations, color tokens |
| `lib/HELPERS.md` | Utility functions and hooks |
