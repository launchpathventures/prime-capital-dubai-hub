# Catalyst Learnings

Patterns that AI agents frequently get wrong. Captured via `/learn` command.

Format: Each entry has a date, priority (low/medium/high/tbc), and clear before/after.

---

## Layout & CSS

### Don't center scrollable content (2026-01-14, high)

**Problem:** Using `justify-center` on containers with overflow causes content to clip on small screens — users can't scroll to see the top.

**Instead:** Use `justify-start` for scrollable containers. Center content using padding or margin if needed.

---

### Use h-screen not min-h-screen for sidebar layouts (2026-01-14, high)

**Problem:** `min-h-screen` allows the container to grow, breaking fixed sidebar layouts.

**Instead:** Use `h-screen` + `overflow-hidden` on the parent, with `overflow-auto` on scrollable children.

---

## CSS Variables

### Always use --color- prefix (2026-01-14, high)

**Problem:** Writing `var(--background)` instead of `var(--color-background)`.

**Instead:** All color variables use the `--color-` prefix: `var(--color-background)`, `var(--color-primary)`, etc.

---

### Use oklch for transparency (2026-01-14, medium)

**Problem:** Using `hsl()` or `rgba()` for transparent colors doesn't work with CSS custom properties.

**Instead:** Use `oklch(from var(--color-primary) l c h / 0.1)` for transparency.

---

## Components

### Check components/ui/ before creating (2026-01-14, high)

**Problem:** Creating inline button/input components when shadcn components exist.

**Instead:** Always check `components/ui/` first. Install shadcn components if needed: `pnpm dlx shadcn@latest add [component]`

---

### Don't wrap single elements in Stack/Row (2026-01-14, medium)

**Problem:** Using `<Stack><SingleChild /></Stack>` for positioning.

**Instead:** Use `<div className="...">` or `Center` for single elements. Stack/Row are for multiple children.

---

## Next.js

### Link prefetches by default (2026-01-14, high)

**Problem:** Using `<Link href="/api/logout">` triggers a GET request when the link becomes visible (prefetch).

**Instead:**
- API routes with side effects should only accept POST/DELETE
- Use form POST or fetch() for actions, not Link
- Add `prefetch={false}` to Links in dropdowns/modals

---

## Package Management

### Always use pnpm (2026-01-14, high)

**Problem:** Using npm, yarn, or bun in a pnpm project.

**Instead:** Use `pnpm add`, `pnpm dev`, `pnpm build`. Commit `pnpm-lock.yaml`.

---

### Center titles directly, not via parent (2026-01-14, medium)

**Problem:** Applying `center` or `text-center` to a parent expecting Title to center. Titles are block-level elements, so parent centering doesn't affect them.

**Instead:** Apply `center` or `className="text-center"` directly to the `<Title>` component.

---

### Use Label's required prop for required fields (2026-01-14, medium)

**Problem:** Manually adding a red asterisk or "(required)" text for required form fields.

**Instead:** Use the `required` prop on the `<Label>` component — it automatically adds a styled red asterisk.

```tsx
<Label required>Email</Label>  // Adds red * automatically
```

---

<!--
Add new learnings above this line.
Format:

## Category

### Title (YYYY-MM-DD, priority)

**Problem:** What goes wrong.

**Instead:** What to do.

---
-->
