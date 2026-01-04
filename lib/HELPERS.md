# Helpers Reference

Quick reference for AI agents. Check here first before creating new helpers.

## Process

- **Before creating anything:** Check if it exists below
- **Client-side helper?** Add to `components/shared/` with clear docs
- **Utility function?** Add to `lib/utils.ts` or create new `lib/` file
- **Extending existing helper?** Update the source file and this reference

---

## components/shared/

- **ThemeProvider**: Wraps app with `next-themes` for dark mode support (used in root layout)
- **ThemeToggle**: Cycling button for Light → Auto → Dark theme switching
- **url-toast**: URL-based toast notifications — handles `?toast=` query params and Supabase hash fragment errors. Toast types: `signed-in`, `signed-out`, `password-updated`, `email-updated`, `email-verified`, `error`

---

## Theme System

**How it works:**
1. `ThemeProvider` wraps the app in root layout, uses class-based theming
2. `ThemeToggle` cycles through `light → system → dark` on click
3. CSS variables in `globals.css` swap via `.dark` class
4. Preference persists in localStorage automatically

**Files involved:**
- `app/globals.css` — `:root` (light) and `.dark` color scales
- `components/shared/theme-provider.tsx` — next-themes wrapper
- `components/shared/theme-toggle.tsx` — cycling toggle button
- All layout files import and use `ThemeToggle` in Header.Actions

**To add theme-aware styles:**
```css
/* In any CSS file */
.my-element {
  background: var(--gray-100);
}
.dark .my-element {
  background: var(--gray-800);
}

/* Or use Tailwind */
<div className="bg-gray-100 dark:bg-gray-800" />
```

---

## lib/utils.ts

### cn
Merge Tailwind classes (from shadcn).
```tsx
import { cn } from "@/lib/utils"
cn("px-4 py-2", condition && "bg-primary", className)
```

---

## lib/hooks/

### useHashState
Sync component state with URL hash for shareable deep links.
Works with Tabs, Accordions, or any controlled component.

```tsx
import { useHashState } from "@/lib/hooks"

// Basic usage - creates URL like #overview
const [tab, setTab] = useHashState("_default", "overview")

// With key prefix - creates URL like #tab=overview
const [tab, setTab] = useHashState("tab", "overview")

// Use with Tabs
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
</Tabs>

// Use with Accordion
<Accordion value={section} onValueChange={setSection}>
```

**Features:**
- Reads initial value from URL hash on mount
- Updates hash when value changes (replaceState to avoid history pollution)
- Handles browser back/forward navigation
- SSR safe

### useSimpleHashState
Shorthand for `useHashState("_default", ...)` — uses simple `#value` format.

```tsx
import { useSimpleHashState } from "@/lib/hooks"

const [section, setSection] = useSimpleHashState("overview")
// URL: /page#overview
```

### Comment
Renders real HTML comments visible in DevTools (green text).
```tsx
import { Comment } from "@/lib/utils"
<Comment text="Section: Hero" /> // → <!-- Section: Hero -->
```

### Scroll Utilities

**WHY custom scroll?** Native `scroll-behavior: smooth` doesn't work reliably in nested layouts, certain browsers, or scroll containers. We use JS-based `requestAnimationFrame` animation for consistent, cross-browser smooth scrolling.

**ONE API: `scrollToElement(id)`** — The single function for smooth scrolling.

```tsx
import { scrollToElement } from "@/lib/utils"

// Programmatic scroll (e.g., keyboard shortcut)
scrollToElement("features")
scrollToElement("#features")  // hash prefix also works
```

**Declarative: `useScrollToTarget()`** — Hook for `data-scroll-target` pattern.

Uses `scrollToElement()` internally. Add to page/layout once, then use attribute on elements.

```tsx
// 1. Enable in page or layout
import { useScrollToTarget } from "@/lib/utils"

export default function Page() {
  useScrollToTarget()
  return (
    <>
      {/* 2. Add data attribute to trigger */}
      <Button data-scroll-target="features">Learn More</Button>
      
      {/* 3. Target element needs matching id */}
      <section id="features">...</section>
    </>
  )
}
```

**Keyboard shortcut example:**

```tsx
import { scrollToElement } from "@/lib/utils"

useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.altKey && e.key.toLowerCase() === "m") {
      e.preventDefault()
      scrollToElement("section-id")
    }
  }
  window.addEventListener("keydown", handleKeyDown)
  return () => window.removeEventListener("keydown", handleKeyDown)
}, [])
```

---

## UX Patterns

### Minimum Loading Delay

For fast operations (< 200ms), showing a loading spinner can feel "flashy". Use a minimum delay to ensure loading states are visible long enough to feel intentional.

```tsx
/** Run async function with minimum delay (prevents loading flash) */
async function withMinDelay<T>(fn: () => Promise<T>, minMs = 1000): Promise<T> {
  const start = Date.now()
  const result = await fn()
  const elapsed = Date.now() - start
  if (elapsed < minMs) {
    await new Promise((resolve) => setTimeout(resolve, minMs - elapsed))
  }
  return result
}

// Usage: wraps auth/API calls to ensure loading is visible
const result = await withMinDelay(() => signIn(email, password))
```

**When to use:** Sign in forms, critical actions, animations that should complete.

---

## (Future)

- useLocalStorage: Persist state to localStorage with SSR safety
- useDebounce: Debounce rapidly changing values
- formatDate: Consistent date formatting
- formatCurrency: Locale-aware currency formatting
- copyToClipboard: Copy text with toast feedback

---

## Supabase Integration (Stack B)

See `lib/supabase/SUPABASE.md` for setup, CRUD utilities, and repository patterns.

---

## Auth Helpers

### getURL()
Returns the app's base URL for auth redirects. Handles localhost vs production automatically.

```tsx
import { getURL } from "@/lib/auth"

// In browser: returns window.location.origin
// On server: uses NEXT_PUBLIC_APP_URL or VERCEL_URL or localhost
const redirectTo = `${getURL()}api/auth/callback`
```

### getAuthConfig()
Returns current auth configuration (mode, redirectTo, etc.).

```tsx
import { getAuthConfig } from "@/lib/auth"

const { mode, redirectTo } = getAuthConfig()
// mode: "demo" | "password" | "supabase" | "custom"
```

See `app/(auth)/AUTH.md` for full auth documentation.

---

## Related Docs

| Doc | When to read |
|-----|--------------|
| `AGENTS.md` | Repo conventions, important callouts |
| `catalyst/PATTERNS.md` | Layout patterns, CSS fixes |
| `design/DESIGN.md` | Styling, animations, color tokens |
| `components/COMPONENTS.md` | Before creating components |
| `lib/supabase/SUPABASE.md` | Supabase setup and data access (Stack B) |
