# LMS-026: Accessibility Improvements

**Status:** 📋 READY  
**Priority:** P1 High  
**Estimated Time:** 1-2 hours  
**Dependencies:** None  

---

## Objective

Improve keyboard accessibility in the Learn surface. Add a skip link to bypass navigation, and implement focus trapping in the mobile drawer to prevent focus from escaping.

---

## Context

The audit identified two accessibility gaps:

1. **No skip link** — Screen reader and keyboard users must tab through the entire sidebar before reaching main content
2. **Mobile drawer lacks focus trap** — When the sidebar drawer is open on mobile, keyboard focus can escape to content behind it

---

## Deliverables

### 1. Add Skip Link to Learn Shell

Add a visually hidden skip link that becomes visible on focus:

```tsx
// app/learn/_surface/learn-shell.tsx

export function LearnShell({ /* props */ }) {
  return (
    <CoachProvider initialContext={coachContext}>
      <div className="learn-shell learn-shell--with-sidebar">
        {/* Skip Link - first focusable element */}
        <a 
          href="#learn-main-content" 
          className="skip-link"
        >
          Skip to main content
        </a>
        
        <LMSHeader /* ... */ />
        
        <main className="learn-main">
          {/* Sidebar */}
          <LearnSidebar /* ... */ />
          
          {/* Mobile drawer */}
          {/* ... */}
          
          {/* Content area with landmark */}
          <div id="learn-main-content" tabIndex={-1}>
            {children}
          </div>
        </main>
        
        {/* Coach */}
      </div>
    </CoachProvider>
  )
}
```

Add CSS for skip link:

```css
/* app/learn/learn.css */

.skip-link {
  position: absolute;
  top: -100%;
  left: 1rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: var(--color-background);
  color: var(--color-foreground);
  border: 2px solid var(--color-primary);
  border-radius: var(--lms-radius-md);
  font-weight: 500;
  text-decoration: none;
  transition: top 0.2s ease;
}

.skip-link:focus {
  top: 1rem;
  outline: none;
}
```

### 2. Implement Focus Trap in Mobile Drawer

Use a focus trap to keep keyboard focus within the drawer when open:

```tsx
// app/learn/_surface/learn-shell.tsx

import { useEffect, useRef } from "react"

export function LearnShell({ /* props */ }) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Focus trap for mobile drawer
  useEffect(() => {
    if (!drawerOpen || !drawerRef.current) return

    const drawer = drawerRef.current
    const focusableElements = drawer.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when drawer opens
    firstElement?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setDrawerOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (e.key !== "Tab") return

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    drawer.addEventListener("keydown", handleKeyDown)
    return () => drawer.removeEventListener("keydown", handleKeyDown)
  }, [drawerOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [drawerOpen])

  return (
    <CoachProvider initialContext={coachContext}>
      <div className="learn-shell learn-shell--with-sidebar">
        {/* ... */}
        
        <LMSHeader 
          onMenuClick={() => setDrawerOpen(true)}
          menuButtonRef={triggerRef}
        />
        
        {/* Mobile drawer with focus trap */}
        <div 
          ref={drawerRef}
          className="learn-drawer"
          data-open={drawerOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div 
            className="learn-drawer__backdrop"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="learn-drawer__panel">
            {/* Close button as first focusable element */}
            <button
              className="learn-drawer__close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
            
            <LearnSidebar 
              /* ... */
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
        
        {/* ... */}
      </div>
    </CoachProvider>
  )
}
```

### 3. Update LMSHeader to Accept Ref

```tsx
// app/learn/_surface/lms-header.tsx

interface LMSHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
  menuButtonRef?: React.RefObject<HTMLButtonElement>
}

export function LMSHeader({ onMenuClick, showMenuButton, menuButtonRef }: LMSHeaderProps) {
  return (
    <header className="learn-header">
      <div className="learn-header__inner">
        <div className="learn-header__left">
          {showMenuButton && (
            <button
              ref={menuButtonRef}
              className="learn-header__menu"
              onClick={onMenuClick}
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          )}
          {/* ... */}
        </div>
      </div>
    </header>
  )
}
```

### 4. Add Drawer Close Button CSS

```css
/* app/learn/learn.css */

.learn-drawer__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: none;
  background: transparent;
  border-radius: var(--lms-radius-sm);
  color: var(--gray-600);
  cursor: pointer;
  transition: background var(--lms-transition-fast), color var(--lms-transition-fast);
}

.learn-drawer__close:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.learn-drawer__close:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

---

## Files to Modify

| File | Change |
|------|--------|
| `app/learn/_surface/learn-shell.tsx` | Add skip link, focus trap, drawer ARIA |
| `app/learn/_surface/lms-header.tsx` | Accept menuButtonRef prop |
| `app/learn/learn.css` | Add skip-link and drawer close styles |

---

## Acceptance Criteria

- [ ] Skip link appears when pressing Tab from page top
- [ ] Skip link navigates to main content when activated
- [ ] Mobile drawer traps focus (Tab cycles within drawer)
- [ ] Escape key closes drawer and returns focus to menu button
- [ ] Drawer has proper ARIA attributes (role, aria-modal, aria-label)
- [ ] Body scroll is prevented when drawer is open

---

## Testing

```bash
# Manual keyboard testing:
1. Load /learn
2. Press Tab - skip link should appear
3. Press Enter - focus should move to main content
4. Click menu button (mobile view)
5. Tab through drawer - focus should not escape
6. Press Escape - drawer closes, focus returns to menu button
```

### Screen Reader Testing
- VoiceOver (macOS): Cmd+F5 to enable
- Test skip link announcement
- Test drawer announcement as dialog

---

## Notes

- Consider using a library like `focus-trap-react` for production robustness
- The manual implementation above is lightweight but covers core cases
- Test on actual mobile devices, not just browser dev tools
