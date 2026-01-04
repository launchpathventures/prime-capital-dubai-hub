# Catalyst Core

Catalyst's foundational building blocks for layout, typography, and visual elements.

These components form the base layer that everything else composes from. Use Core components instead of raw `<div>` + Tailwind for consistent, semantic, scalable code.

---

## When to Use Core Components

✓ **Use Core when:**
- Layout with multiple children (`Stack`, `Row`, `Grid`)
- Centering icons with styling (`Center`)
- Consistent typography (`Text`, `Title`, `Prose`)
- Page structure (`Container`, `Section`)
- Common visual patterns (`Dot`, `Avatar`, `Count`)
- Explicit spacing (`Spacer`)

✗ **Don't use Core when:**
- Simple positioning — use `<div>` with utility classes
- A better UI component exists — use `Badge` not styled `Text`
- Adding complexity without clarity

**Rule of thumb:** If Core makes intent clearer, use it. If it adds indirection, don't.

---

## Architecture

All components extend `Box`, the universal base:

```
Box (base)
├── Stack, Row, Grid, Center, Container, Section, Spacer (layout)
├── Text, Title, Prose (typography)
└── Dot, Avatar, Count (visual)
```

### Box — The Universal Base

`Box` handles polymorphic rendering so you don't repeat this logic everywhere:

```tsx
import { Box } from "@/components/core"

// Block element (default: div)
<Box>Content</Box>

// Inline element (span)
<Box inline>Inline content</Box>

// Custom element
<Box as="article">Article content</Box>

// Merge onto child (no wrapper)
<Box asChild><a href="#">Link</a></Box>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `as` | `React.ElementType` | `div` | Render as different element |
| `inline` | `boolean` | `false` | Render as `span` instead of `div` |
| `asChild` | `boolean` | `false` | Merge props onto child element |

---

## Minimal Defaults Philosophy

Core components follow a **minimal defaults** principle:

- **Child-level components** (Stack, Row, Grid, Text, List) have **no defaults** — you specify exactly what you need
- **Block-level components** (Container, Section, Title) have **sensible defaults** — they serve a clear purpose
- **Visual components** (Dot, Avatar, Spacer) have **necessary defaults** — they need size/color to render

**Why?**
- Explicit is better than implicit — you see exactly what styling is applied
- CSS inheritance works naturally — omit `variant` and text inherits parent color
- Less debugging — no mysterious spacing or colors appearing
- Composable — parent containers can set defaults for children via CSS

```tsx
// ✓ Explicit - you see what you get
<Stack gap="md">
  <Text size="sm" variant="muted">Description</Text>
</Stack>

// ✓ Inheritance - Text inherits color from parent
<div className="text-sm text-muted-foreground">
  <Text>Inherits size and color</Text>
  <List gap="xs"><li>Also inherits</li></List>
</div>
```

---

### Layout

| Component | Purpose | Example use |
|-----------|---------|-------------|
| `Stack` | Vertical flex + gap | Form fields, card content, lists |
| `Row` | Horizontal flex + gap | Button groups, icon + text, inline items |
| `Grid` | Responsive CSS grid | Card grids, feature sections, galleries |
| `Center` | Center content | Icon containers, centered callouts |
| `Container` | Max-width wrapper | Constraining content on wide screens |
| `Section` | Vertical padding | Major page divisions (hero, features, CTA) |
| `Spacer` | Fixed or flexible space | Between sections, visual breathing room |

### Typography

| Component | Purpose | Example use |
|-----------|---------|-------------|
| `Text` | Body text | Paragraphs, descriptions, labels |
| `Title` | Headings | Page titles, section headings, card titles |
| `List` | Bullet/numbered lists | Feature lists, requirements, steps |
| `Prose` | Long-form content | Markdown, articles, documentation |

### Visual

| Component | Purpose | Example use |
|-----------|---------|-------------|
| `Dot` | Status indicator | Activity feeds, online status, timeline |
| `Avatar` | User initials | Team members, comments, profiles |
| `Count` | Numeric badge | Item counts, notifications, progress |

---

## Props Reference

### Stack
| Prop | Values | Default |
|------|--------|---------|
| `gap` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | — |
| `align` | `start`, `center`, `end`, `stretch` | — |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | — |

### Row
| Prop | Values | Default |
|------|--------|---------|
| `gap` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | — |
| `align` | `start`, `center`, `end`, `stretch`, `baseline` | — |
| `justify` | `start`, `center`, `end`, `between`, `around`, `evenly` | — |
| `wrap` | `true`, `false` | — |

### Grid
| Prop | Values | Default |
|------|--------|---------|
| `cols` | `1`, `2`, `3`, `4`, `5`, `6` (responsive) | — |
| `gap` | `none`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | — |
| `align` | `start`, `center`, `end`, `stretch` | — |

### Container
| Prop | Values | Default |
|------|--------|---------|
| `size` | `sm`, `md`, `lg`, `xl`, `2xl`, `full` | `xl` |

### Section
| Prop | Values | Default |
|------|--------|---------|
| `padding` | `none`, `sm`, `md`, `lg`, `xl` | `lg` |

### Center
| Prop | Values | Default |
|------|--------|---------|
| `inline` | `true`, `false` | `false` |

*Note: Center is intentionally simple — just `flex items-center justify-center`. Add sizing/styling via className.*

### Spacer
| Prop | Values | Default |
|------|--------|---------|
| `size` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | `md` |
| `flex` | `true`, `false` | `false` |

*Note: When `flex` is true, Spacer expands to fill available space (useful in Row/Stack).*

### Text
| Prop | Values | Default |
|------|--------|---------|
| `size` | `xs`, `sm`, `base`, `lg`, `xl`, `2xl` | — |
| `weight` | `normal`, `medium`, `semibold`, `bold` | — |
| `variant` | `default`, `muted`, `primary`, `secondary`, `success`, `warning`, `danger`, `info` | — |
| `leading` | `none`, `tight`, `normal`, `relaxed` | — |
| `align` | `left`, `center`, `right` | — |
| `mono` | `true` | — |
| `truncate` | `true` | — |
| `inline` | `boolean` | `false` |
| `as` | `p`, `span`, `div`, `label` | `p` (or `span` if inline) |

*Note: Omit `variant` to inherit color from parent. Omit `size` to inherit font-size.*

### List
| Prop | Values | Default |
|------|--------|--------|
| `ol` | `true`, `false` | `false` (renders as `ul`) |
| `size` | `xs`, `sm`, `base`, `lg` | — |
| `gap` | `none`, `xs`, `sm`, `md`, `lg` | — |
| `variant` | `default`, `muted` | — |

*Note: Use native `<li>` elements as children. Omit props to inherit from parent.*

### Title
| Prop | Values | Default |
|------|--------|---------|
| `size` | `h1`, `h2`, `h3`, `h4`, `h5`, `h6` | `h2` |
| `variant` | `default`, `muted`, `primary`, `secondary`, `success`, `warning`, `danger`, `info` | `default` |
| `align` | `left`, `center`, `right` | `left` |
| `as` | `h1`-`h6`, `div`, `span` | matches `size` |

**Centering titles:** Title is a block element, so `text-center` on a parent won't work. Use the `align` prop instead:

```tsx
// ✗ Wrong - Title is block, won't inherit text-center
<div className="text-center">
  <Title>Heading</Title>
</div>

// ✓ Correct - use align prop
<Title align="center">Heading</Title>
```

### Prose
| Prop | Values | Default |
|------|--------|---------|
| `size` | `sm`, `base`, `lg` | `base` |
| `invert` | `true`, `false` | `false` |

*Note: Prose applies Tailwind Typography prose classes for rich markdown/article content.*

### Dot
| Prop | Values | Default |
|------|--------|---------|
| `size` | `xs`, `sm`, `md`, `lg` | `sm` |
| `color` | `default`, `muted`, `primary`, `success`, `warning`, `danger`, `info`, `violet` | `primary` |
| `pulse` | `true`, `false` | `false` |

### Avatar
| Prop | Values | Default |
|------|--------|---------|
| `size` | `xs`, `sm`, `md`, `lg`, `xl` | `md` |
| `name` | string | - |
| `initials` | string (override) | derived from name |
| `gradient` | `rose`, `emerald`, `violet`, `amber`, `cyan`, `blue`, `slate` | derived from name |
| `gradientClass` | string (custom gradient) | - |

### Count
| Prop | Values | Default |
|------|--------|---------|
| `value` | number \| string | required |
| `suffix` | string (e.g., "tasks") | - |
| `total` | number (shows as "3/5") | - |
| `max` | number (shows as "99+") | - |
| `variant` | Badge variants | `secondary` |

---

## Usage Examples

```tsx
import { Stack, Row, Grid, Text, Title, Dot, Avatar, Count, Center, Spacer, List, Prose } from "@/components/core"

// Layout - explicit gap and alignment
<Stack gap="md">
  <Title size="h2">Section Title</Title>
  <Text size="sm" variant="muted">Description text here</Text>
</Stack>

// Row with explicit props
<Row gap="sm" align="center">
  <Avatar name="Sarah Chen" size="sm" />
  <Text size="sm" weight="medium">Sarah Chen</Text>
</Row>

// Grid with explicit columns and gap
<Grid cols={4} gap="md">
  <Card>...</Card>
  <Card>...</Card>
</Grid>

// Centered icon container
<Center className="h-12 w-12 rounded-full bg-primary/10 text-primary">
  <ZapIcon className="h-6 w-6" />
</Center>

// Push content apart in a row
<Row justify="between" align="center">
  <Text size="sm">Left content</Text>
  <Button>Right button</Button>
</Row>

// List with explicit gap
<List gap="xs">
  <li>First item</li>
  <li>Second item</li>
</List>

// Inheritance - children inherit parent styles
<div className="text-sm text-muted-foreground">
  <Text>Inherits size and color from parent</Text>
  <List gap="xs"><li>Also inherits</li></List>
</div>

// Activity item
<Row gap="sm" align="start">
  <Dot color="success" />
  <Stack gap="xs">
    <Text size="sm" weight="medium">New user registered</Text>
    <Text size="xs" variant="muted">Sarah Chen • 2 min ago</Text>
  </Stack>
</Row>

// Team member
<Row gap="sm" align="center">
  <Avatar name="Sarah Chen" />
  <Stack gap="none">
    <Text size="sm" weight="medium">Sarah Chen</Text>
    <Text size="xs" variant="muted">Product Lead</Text>
  </Stack>
  <Count value={12} suffix="tasks" />
</Row>
```

---

## Gap Scale

All layout components use the same gap scale for consistency:

| Value | Tailwind | Pixels |
|-------|----------|--------|
| `none` | gap-0 | 0 |
| `xs` | gap-1 | 4px |
| `sm` | gap-2 | 8px |
| `md` | gap-4 | 16px |
| `lg` | gap-6 | 24px |
| `xl` | gap-8 | 32px |
| `2xl` | gap-12 | 48px |

---

## Shared Variants

All components use shared variant definitions from `_base/variants.ts`. This ensures consistency and makes it easy to update scales globally:

```tsx
import { gapVariants, alignVariants, colorVariants } from "@/components/core"

// Use in custom CVA definitions
const myVariants = cva("...", {
  variants: {
    gap: gapVariants,      // none, xs, sm, md, lg, xl, 2xl
    align: alignVariants,  // start, center, end, stretch, baseline
    color: colorVariants,  // default, muted, primary, success, etc.
  }
})
```

---

## Helper Functions

```tsx
import { getAvatarGradient, getInitials } from "@/components/core"

getAvatarGradient("Sarah Chen")  // "rose" (consistent per name)
getInitials("Sarah Chen")         // "SC"
getInitials("Mike")               // "M"
```

---

## When to Use

✓ Building UI with consistent spacing  
✓ Want semantic typography with proper HTML  
✓ Need status indicators or user avatars  
✓ Replacing repetitive flex/spacing patterns  

## When NOT to Use

✗ One-off custom layout — just use Tailwind directly  
✗ Page-level structure — use `layout/` components (Shell, Sidebar, Header)  
✗ Complex data display — use `shared/` composed components
