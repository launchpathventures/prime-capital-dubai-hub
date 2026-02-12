# Learning: Button render prop causes runtime errors in Next.js 16

**Date:** 2026-02-11
**Severity:** Breaking
**Environment:** Next.js 16.0.10 with Turbopack

## Summary

Using the Button component's `render` prop pattern with Next.js `<Link>` causes "Element type is invalid" runtime errors.

## The Pattern That Failed

```tsx
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This causes runtime errors
<Button
  className="..."
  render={<Link href="/contact" />}
>
  Get In Touch
</Button>
```

## Error Message

```
Error: Element type is invalid: expected a string (for built-in components)
or a class/function (for composite components) but got: undefined.
```

Stack trace pointed to `updateForwardRef` and `createFiberFromElement` in React DOM.

## Root Cause

The Button component uses `React.cloneElement()` to merge props into the render element:

```tsx
if (render) {
  return React.cloneElement(render, {
    ...props,
    className: cn(buttonClassName, render.props?.className),
    children,
  })
}
```

This pattern has compatibility issues with:
1. Next.js 16's Link component
2. Turbopack's hot module replacement
3. Server Components / Client Component boundaries

The `cloneElement` call appears to produce an invalid element type under certain conditions during development hot reloading.

## The Fix

Replace `Button render={<Link>}` with direct `<Link>` elements styled inline:

```tsx
// Before (broken)
<Button
  className="h-12 px-8 bg-transparent text-white border border-white"
  render={<Link href="/contact" />}
>
  Get In Touch
</Button>

// After (working)
<Link
  href="/contact"
  className="inline-flex items-center justify-center h-12 px-8 bg-transparent text-white border border-white transition-colors"
>
  Get In Touch
</Link>
```

## Key Differences

| Aspect | Button + render | Direct Link |
|--------|-----------------|-------------|
| Uses cloneElement | Yes | No |
| Works with Turbopack | Unreliable | Yes |
| Requires Button import | Yes | No |
| Styling | Via Button variants | Inline classes |

## When to Use Each Approach

**Use direct `<Link>` with inline styles when:**
- Linking to internal routes
- The styling is custom/one-off anyway
- You're in a Server Component

**Use `<Button>` (without render prop) when:**
- You need an actual `<button>` element
- Form submissions
- onClick handlers
- Modal triggers

## Files Changed

- `app/(web)/team/[slug]/page.tsx` - Replaced 3 Button+render patterns with direct Links

## Prevention

1. Avoid the `render` prop pattern with Next.js Link in new code
2. Consider deprecating the `render` prop in the Button component
3. If polymorphic buttons are needed, consider using `asChild` pattern from Radix instead of `cloneElement`

## Related

- Next.js 16 release notes
- React.cloneElement documentation
- Base UI composition patterns
