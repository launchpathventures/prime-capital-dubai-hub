# CATALYST - Layout & CSS Patterns

Common patterns for building pages and layouts. This file captures lessons learned and prevents repeated mistakes.

**Who this is for:** Developers building with the Catalyst kit. If you're focused on delivery methodology, you don't need this — see `CATALYST.md` for the overview.

---

## ⚠️ Use Core Components First

Before writing raw flex/grid divs, use Core components from `components/core/`:

```tsx
import { Stack, Row, Grid, Container, Text, Title } from "@/components/core"

// Layout
<Stack gap="md">         // vertical flex
<Row gap="sm">           // horizontal flex  
<Grid cols={3} gap="lg"> // responsive grid
<Container size="xl">    // max-width wrapper

// Typography
<Title size="h2">        // semantic heading
<Text variant="muted">   // body text
```

Only use raw `<div>` with Tailwind for:
- One-off structural needs not covered by Core components
- Absolute positioning containers
- Complex responsive patterns that need className overrides

---

## ⚠️ Common Mistakes

1. **Using `justify-center` on scrollable containers** — Content gets clipped. Use `my-auto` on content instead.
2. **Using `min-h-screen` for sidebar layouts** — Page grows infinitely. Use `h-screen` or `h-dvh` with `overflow-hidden`.
3. **Forgetting `min-h-0` on flex children** — Overflow won't work. Add `min-h-0` to enable scrolling.
4. **Fixed-width decorative elements** — Cause horizontal scroll. Use `overflow-x-hidden` on container.

---

## Layout Patterns

### Fixed Viewport Layouts (Sidebars + Content)

When building layouts with sidebars that scroll independently from main content:

```tsx
// ✅ Correct: Fixed height + overflow control
<div className="flex h-screen overflow-hidden">
  <aside className="h-full min-h-0 w-64 flex-col overflow-hidden">
    <div className="flex-1 overflow-auto">...</div>  {/* Scrollable body */}
  </aside>
  <main className="min-h-0 flex-1 overflow-auto">...</main>
</div>

// ❌ Wrong: min-h-screen allows unlimited growth
<div className="flex min-h-screen">
  <aside className="w-64">...</aside>
  <main>...</main>
</div>
```

**Key classes for independent scroll contexts:**
- `h-screen` or `h-dvh` on root — fixed viewport height
- `overflow-hidden` on root — prevent page-level scroll
- `min-h-0` on flex children — enables overflow to work (flex items default to `min-height: auto`)
- `overflow-auto` on scrollable areas — each area scrolls independently

---

## Centering Patterns

### Centered Content in Scrollable Containers

**Problem:** Using `justify-center` on a scrollable flex container cuts off content when it overflows.

```tsx
// ❌ Wrong: Content cut off at top when overflowing
<main className="flex flex-col items-center justify-center overflow-auto">
  <div className="...">Tall content here</div>
</main>

// ✅ Correct: Use margin auto on content, not justify-center on container
<main className="flex flex-col items-center overflow-auto">
  <div className="my-auto ...">Tall content here</div>
</main>
```

**Why this works:**
- `justify-center` centers by distributing overflow equally above and below — clipping the top
- `my-auto` pushes content to center when there's space, but allows it to start at top when it overflows

---

## Overflow Patterns

### Preventing Horizontal Scroll

When absolute-positioned decorative elements (blurs, gradients) extend beyond viewport:

```tsx
// ✅ Correct: Hide horizontal overflow, allow vertical
<main className="overflow-x-hidden overflow-y-auto">
  <div className="absolute w-[800px] ...">Decorative blur</div>
  <div>Content</div>
</main>

// ❌ Wrong: overflow-auto allows horizontal scroll from decorative elements
<main className="overflow-auto">
  <div className="absolute w-[800px] ...">Decorative blur</div>
</main>
```

---

## Responsive Patterns

### Mobile-First Approach

Always ensure content is accessible on small screens:

1. **Test at 320px width** — minimum supported viewport
2. **Avoid fixed widths** — use `max-w-*` with `w-full`
3. **Stack on mobile** — use `flex-col sm:flex-row`
4. **Reduce padding** — use `p-4 md:p-6 lg:p-8`

### Content That Must Not Be Cut Off

Critical content (headings, CTAs) should never be clipped:

```tsx
// ✅ Correct: Content scrolls into view
<main className="flex flex-col overflow-y-auto p-8">
  <div className="my-auto">
    <h1>Always visible when scrolled to top</h1>
  </div>
</main>

// ❌ Wrong: justify-center may clip heading
<main className="flex flex-col justify-center overflow-auto">
  <h1>May be clipped on small screens</h1>
</main>
```

---

## Quick Reference: Flex Overflow Fix

When a flex child with `overflow-auto` isn't scrolling:

```tsx
// The fix: add min-h-0 (or min-w-0 for horizontal)
<div className="flex flex-col h-screen">
  <header className="h-14 shrink-0">...</header>
  <main className="min-h-0 flex-1 overflow-auto">  {/* min-h-0 is key */}
    ...scrollable content...
  </main>
</div>
```

**Why:** Flex items have `min-height: auto` by default, preventing them from shrinking below content size. `min-h-0` allows shrinking so overflow can work.

---

## Grid Height Matching Pattern

When you want a sidebar to match the height of adjacent content (shrink when content is shorter, scroll internally):

```tsx
// ✅ Correct: Wrapper with absolute-positioned child
<div className="grid grid-cols-[300px_1fr] gap-6">
  {/* Wrapper participates in grid, sets the height */}
  <div className="relative min-h-[400px]">
    {/* Card fills wrapper via absolute positioning */}
    <Card className="lg:absolute lg:inset-0 flex flex-col overflow-hidden">
      <div className="shrink-0">Header</div>
      <ScrollArea className="flex-1 min-h-0">...list...</ScrollArea>
    </Card>
  </div>
  <div>Content that determines row height</div>
</div>

// ❌ Wrong: Card height is determined by its content, not the grid
<div className="grid grid-cols-[300px_1fr] gap-6">
  <Card className="min-h-[400px]">...</Card>  {/* Won't shrink to match */}
  <div>Content</div>
</div>
```

**Key points:**
- Grid rows take the height of the tallest cell
- Absolute positioning removes the card from flow, so it fills the wrapper
- `min-h-0` on ScrollArea allows it to shrink below content size
- `shrink-0` on header prevents it from compressing

---

## Card Padding

Cards already have generous internal padding. **Do not add extra padding on top.**

### Common Mistake: Doubling Card Padding

```tsx
// ❌ Wrong: Extra padding inside Card sections
<Card>
  <div className="p-6">                    {/* Don't add padding here */}
    <CardHeader className="pt-6">          {/* Or here */}
      <CardTitle>Title</CardTitle>
    </CardHeader>
  </div>
</Card>

// ✅ Correct: Let Card and CardContent handle padding
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    ...content...
  </CardContent>
</Card>
```

### Custom Card Sections (without CardHeader/CardContent)

When building custom card layouts, use `px-6 py-3` or `px-6 py-4` for sections:

```tsx
// ✅ Custom card with header, content, and footer sections
<Card>
  <div className="px-6 py-3 border-b">Header</div>     {/* py-3 or py-4 */}
  <div className="px-6 py-4">Content</div>
  <div className="px-6 py-4 border-t">Footer</div>
</Card>

// ❌ Wrong: Too much padding
<Card>
  <div className="p-6">Header</div>                     {/* p-6 is too heavy */}
  <div className="p-6">Content</div>                    {/* Especially stacked */}
</Card>
```

**Rule of thumb:**
- `px-6` for horizontal padding (matches Card's internal rhythm)
- `py-3` for compact headers/footers
- `py-4` for content sections
- Never `p-6` for stacked sections — creates too much vertical space

---

## Related Docs

| Doc | When to read |
|-----|--------------|
| `catalyst/CATALYST.md` | Framework overview and philosophy |
| `components/COMPONENTS.md` | Before creating components |
| `design/DESIGN.md` | For styling, animations, color tokens |

---

## UI Component Patterns

### Base UI vs Radix Patterns

Catalyst uses Base UI (not Radix). Key differences:

```tsx
// ❌ Radix pattern (asChild)
<DropdownMenuTrigger asChild>
  <Button>Open</Button>
</DropdownMenuTrigger>

// ✅ Base UI pattern (render prop)
<DropdownMenuTrigger render={<Button />}>
  Open
</DropdownMenuTrigger>
```

### DropdownMenuItem Variants

Use built-in variants, not custom classes:

```tsx
// ❌ Wrong: Custom destructive styling
<DropdownMenuItem className="text-destructive">
  Delete
</DropdownMenuItem>

// ✅ Correct: Use variant prop
<DropdownMenuItem variant="destructive">
  Delete
</DropdownMenuItem>
```

### Badge Sizes

Badge has three sizes for visual hierarchy:

```tsx
<Badge size="sm">Small</Badge>   // h-5, text-[10px] — secondary info
<Badge>Default</Badge>            // h-6, text-xs — standard
<Badge size="lg">Large</Badge>   // h-7, text-xs — prominent
```

**Visual hierarchy tip:** When pairing Avatar + Badge, ensure Avatar is visually dominant:
- Avatar `size="sm"` (28px) pairs well with Badge `size="sm"` (20px)
- Avatar `size="xs"` (24px) is too small to pair with default Badge

### Select with Labels (not raw values)

Base UI's SelectValue renders the raw `value` by default (e.g., "7d").
Our Select component is customised to display **labels** instead (e.g., "Last 7 days").

**Pass `items` prop to Select for automatic label lookup:**

```tsx
const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
]

// ✅ Correct: Pass items prop — SelectValue auto-displays labels
<Select items={dateRanges} value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select range..." />
  </SelectTrigger>
  <SelectContent>
    {dateRanges.map((item) => (
      <SelectItem key={item.value} value={item.value}>
        {item.label}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

// ❌ Wrong: Without items, SelectValue shows raw value ("7d")
<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue />  {/* Shows "7d" instead of "Last 7 days" */}
  </SelectTrigger>
  ...
</Select>
```

**Alternative:** Use render function for custom formatting:

```tsx
<SelectValue>
  {(value) => items.find((i) => i.value === value)?.label ?? value}
</SelectValue>
```

