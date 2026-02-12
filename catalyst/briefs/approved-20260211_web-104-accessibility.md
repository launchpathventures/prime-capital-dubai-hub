# Brief: Web Accessibility (WCAG 2.1 AA)

**ID:** WEB-104
**Status:** Approved
**Priority:** P1 — Pre-Launch
**Surface:** Web
**Estimate:** 1 day
**Tags:** accessibility, a11y, forms, wcag

---

## Objective

Bring the web surface to WCAG 2.1 AA compliance. The primary failures are in the lead capture form (unlabeled inputs, disconnected errors), the mobile navigation (no focus trap), and missing active state indicators. The shell and navigation already have solid accessibility foundations.

---

## Background

The audit found strong accessibility basics (skip link, ARIA attributes on mobile menu, escape key handling, reduced motion queries) but critical gaps in form accessibility and interaction patterns.

### What's Already Good
- ✅ Skip link to `#main-content`
- ✅ `<main>` landmark with tabIndex
- ✅ Mobile menu: `aria-label`, `aria-expanded`, `aria-controls`
- ✅ Escape key closes mobile menu
- ✅ Body scroll lock when menu open
- ✅ 3 `prefers-reduced-motion` blocks in CSS
- ✅ All `<Image>` components have descriptive alt text
- ✅ Footer uses semantic `<footer>` element with proper `tel:` and `mailto:` links

---

## Tasks

### 1. Fix Lead Form Input Labels (Critical)

**Files:** All step components in `components/shared/lead-form/steps/`

**Problem:** Inputs use `placeholder` as the only label. Screen readers announce these as unlabeled inputs. `<label>` elements exist in some steps but lack `htmlFor` attributes, and inputs lack `id` attributes.

**Fix for every input field:**

```tsx
// Before:
<input placeholder="First Name" ... />

// After:
<label htmlFor="firstName" className="sr-only">First Name</label>
<input id="firstName" placeholder="First Name" aria-required="true" ... />
```

Alternatively, use `aria-label` if a visible label isn't wanted:
```tsx
<input aria-label="First Name" placeholder="First Name" aria-required="true" ... />
```

**Fields to fix across all steps:**
- `firstName`, `lastName` (name step)
- `email`, `whatsapp` (contact step)
- `propertyLocation`, `propertyType` (seller step)
- `questionsText` (questions step)
- Any other text inputs

### 2. Connect Error Messages to Inputs

**Files:** All step components in `components/shared/lead-form/steps/`

**Problem:** Error messages render as `<Text>` below inputs but aren't linked via `aria-describedby`. Screen readers won't announce the error when the input is focused.

**Fix:**
```tsx
<input
  id="email"
  aria-describedby={errors.email ? "email-error" : undefined}
  aria-invalid={!!errors.email}
  ...
/>
{errors.email && (
  <Text id="email-error" role="alert" variant="error">
    {errors.email}
  </Text>
)}
```

Apply to every input that has an associated error state.

### 3. Add `aria-live` Region for Form Submission Errors

**File:** `components/shared/lead-form/lead-form.tsx` (or the component that shows global submission errors)

**Fix:**
```tsx
<div aria-live="polite" aria-atomic="true">
  {submitError && <Text variant="error">{submitError}</Text>}
</div>
```

### 4. Fix Goal Selection Accessibility

**File:** `components/shared/lead-form/steps/goals-step.tsx`

**Problem:** Multi-select goal buttons have no `role="group"`, no group label, and no `aria-pressed` state.

**Fix:**
```tsx
<div role="group" aria-label="Select your goals">
  {goals.map((goal) => (
    <button
      key={goal.value}
      role="checkbox"
      aria-checked={selectedGoals.includes(goal.value)}
      aria-label={goal.label}
      onClick={() => toggleGoal(goal.value)}
    >
      {goal.label}
    </button>
  ))}
</div>
```

### 5. Fix Global Keyboard Shortcut Conflicts

**Files:** `components/shared/lead-form/steps/goals-step.tsx`, `components/shared/lead-form/steps/questions-step.tsx`

**Problem:** Number keys and Y/N keys are captured globally via `useEffect` keyboard listeners. If a user is typing "N" in the questions textarea, it triggers the "No" option in the questions step.

**Fix:**
- Check `document.activeElement` — if it's an `<input>` or `<textarea>`, don't intercept:
```tsx
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
    
    // ... existing keyboard handling
  }
  window.addEventListener('keydown', handler)
  return () => window.removeEventListener('keydown', handler)
}, [])
```

### 6. Add Focus Trap to Mobile Menu

**File:** `app/(web)/_surface/web-nav.tsx`

**Problem:** When the mobile menu is open, pressing Tab can move focus behind the overlay to page content that's visually obscured.

**Fix:**
- Install or create a focus trap utility
- When the mobile menu opens, trap focus within the menu container
- When it closes, return focus to the hamburger button
- Consider using the `focus-trap-react` package or a custom implementation:

```tsx
// Simple implementation:
useEffect(() => {
  if (!isOpen) return
  const menuEl = menuRef.current
  if (!menuEl) return
  
  const focusableEls = menuEl.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')
  const firstEl = focusableEls[0] as HTMLElement
  const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement
  
  const trapFocus = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return
    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault()
      lastEl.focus()
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault()
      firstEl.focus()
    }
  }
  
  firstEl?.focus()
  menuEl.addEventListener('keydown', trapFocus)
  return () => menuEl.removeEventListener('keydown', trapFocus)
}, [isOpen])
```

### 7. Add `aria-current="page"` to Active Nav Link

**File:** `app/(web)/_surface/web-nav.tsx`

**Fix:** Add `aria-current="page"` to the nav link matching the current pathname:

```tsx
<Link
  href={item.href}
  aria-current={pathname === item.href ? "page" : undefined}
>
```

This helps screen readers announce "current page" and can be used for CSS styling of the active state.

### 8. Add `aria-hidden` to Decorative Area Images

**File:** `app/(web)/page.tsx` (areas section, ~line 366)

**Problem:** Area tile images have `alt={area.name}` but the name is also shown in text below, creating duplicate announcements.

**Fix:**
```tsx
<Image alt="" aria-hidden="true" ... />
```

Since the area name is in a separate text element, the image is decorative.

---

## Acceptance Criteria

- [ ] All form inputs have accessible labels (visible or `aria-label`)
- [ ] All form inputs with errors have `aria-describedby` linking to the error message
- [ ] Error messages use `role="alert"` or sit in an `aria-live` region
- [ ] Goal selection has `role="group"` with `aria-checked` states
- [ ] Keyboard shortcuts don't fire when typing in inputs/textareas
- [ ] Mobile menu traps focus when open
- [ ] Active nav link has `aria-current="page"`
- [ ] Decorative images have `alt=""` and `aria-hidden="true"`
- [ ] Run a screen reader (VoiceOver on Mac) through the full lead form flow — all steps are navigable
- [ ] `pnpm lint` passes

---

## Files to Modify

| File | Change |
|------|--------|
| `components/shared/lead-form/steps/*.tsx` | Labels, aria-describedby, aria-invalid |
| `components/shared/lead-form/lead-form.tsx` | aria-live for submission errors |
| `app/(web)/_surface/web-nav.tsx` | Focus trap, aria-current |
| `app/(web)/page.tsx` | Decorative image aria-hidden |

---

## Testing Notes

- **Manual testing:** Use VoiceOver (Cmd+F5 on Mac) to navigate the entire lead form flow
- **Automated:** Consider adding `axe-core` or `jest-axe` to the test suite for regression
- **Keyboard-only:** Navigate the entire site using only Tab, Shift+Tab, Enter, Escape, Arrow keys
