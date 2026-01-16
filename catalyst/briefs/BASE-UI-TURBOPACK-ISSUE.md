# Base-UI Button + Turbopack Compatibility Issue

**Date:** 17 January 2026  
**Environment:** Next.js 16.0.10 with Turbopack, @base-ui/react v1.0.0  
**Severity:** Breaking — pages fail to render

---

## Summary

The `@base-ui/react` Button component fails at runtime when using Next.js with Turbopack. The import returns `undefined`, causing a React error that crashes page rendering.

---

## Error Message

```
Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: undefined.

You likely forgot to export your component from the file it's defined in, 
or you might have mixed up default and named imports.
```

Stack trace points to:
```
at ButtonPrimitive (<anonymous>)
```

---

## Root Cause

The `@base-ui/react` package has ESM export resolution issues with Turbopack. When Turbopack bundles the application, the named export from `@base-ui/react/button` resolves to `undefined` at runtime.

### Technical Details

- **Import that fails:**
  ```tsx
  import { Button as ButtonPrimitive } from "@base-ui/react/button"
  ```

- **Runtime value:** `ButtonPrimitive` is `undefined`

- **Works with:** Webpack (standard Next.js bundler)
- **Fails with:** Turbopack (experimental Rust bundler in Next.js 15+)

The issue appears to be related to how Turbopack resolves the package's `exports` field or handles its ESM module structure differently than Webpack.

---

## Affected Pattern

The Catalyst starter uses base-ui's polymorphic component pattern:

```tsx
// This pattern fails under Turbopack
<Button nativeButton={false} render={<Link href="/path" />}>
  Click me
</Button>
```

This pattern is documented at https://base-ui.com/react/components/button and works correctly with Webpack, but the underlying import fails with Turbopack.

---

## Solution

Replace the base-ui Button with Radix Slot — the standard shadcn/ui pattern that's compatible with all bundlers.

### Before (base-ui)

```tsx
// components/ui/button.tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"

function Button({ className, variant, size, ...props }) {
  return (
    <ButtonPrimitive
      className={cn("ui-button", buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

Usage:
```tsx
<Button nativeButton={false} render={<Link href="/path" />}>
  Click me
</Button>
```

### After (Radix Slot)

```tsx
// components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot"

function Button({ className, variant, size, asChild, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn("ui-button", buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

Usage:
```tsx
<Button asChild>
  <Link href="/path">Click me</Link>
</Button>
```

---

## Migration Required

All usages of the base-ui pattern need updating:

| Old Pattern | New Pattern |
|-------------|-------------|
| `nativeButton={false}` | Remove |
| `render={<Link href="..." />}` | `asChild` + Link as child |
| `render={<Component />}` | `asChild` + Component as child |

### Example Migration

```tsx
// Before
<Button 
  variant="outline" 
  size="lg" 
  nativeButton={false} 
  render={<Link href="/about" />}
>
  Learn More
  <ArrowRight />
</Button>

// After
<Button variant="outline" size="lg" asChild>
  <Link href="/about">
    Learn More
    <ArrowRight />
  </Link>
</Button>
```

---

## Recommendation for Catalyst

Consider switching the default Button implementation from base-ui to Radix Slot to ensure compatibility with Turbopack, which is becoming the default bundler in Next.js.

**Options:**

1. **Replace base-ui Button with Radix Slot** (recommended)
   - Matches standard shadcn/ui implementation
   - Battle-tested with all Next.js bundlers
   - Minimal API change (`asChild` vs `render` + `nativeButton`)

2. **Add Turbopack to known limitations**
   - Document that Catalyst requires `--webpack` flag
   - Not ideal as Turbopack is the future default

3. **Wait for base-ui fix**
   - Track issue with base-ui team
   - May take time as Turbopack is still experimental

---

## Files Changed in Our Fix

- `components/ui/button.tsx` — Rewrote to use Radix Slot
- 48 files across the codebase — Updated from `nativeButton`/`render` to `asChild` pattern

---

## References

- [Base UI Button Documentation](https://base-ui.com/react/components/button)
- [shadcn/ui Button](https://ui.shadcn.com/docs/components/button)
- [Radix Slot](https://www.radix-ui.com/primitives/docs/utilities/slot)
- [Next.js Turbopack](https://nextjs.org/docs/architecture/turbopack)
