# LMS-003: Learn Shell Redesign

**Status:** 📋 READY  
**Priority:** High (blocks LMS-004, 005, 006, 008)  
**Estimated Time:** 2 days  
**Dependencies:** None (can run parallel to LMS-001, LMS-002)  

---

## Objective

Redesign the Learn surface shell (header, sidebar, layout) to match the provided mockups exactly. The new shell provides the visual foundation for all LMS pages.

---

## Reference Mockups

| Component | Reference |
|-----------|-----------|
| Header | All mockups — dark slate header with logo, subtitle, HUB button |
| Sidebar | Mockups 1, 2, 4, 5, 6, 8 — competency list with progress |
| Content area | All mockups — warm off-white background |

---

## Design Specifications

### Color Palette

```css
/* Learn surface tokens — add to learn.css */
:root {
  --learn-header-bg: #4a5a6a;
  --learn-sidebar-bg: #4a5a6a;
  --learn-content-bg: #f5f5f0;
  --learn-text-primary: #1a1a1a;
  --learn-text-secondary: #6b7280;
  --learn-text-inverse: #ffffff;
  --learn-border: #e5e5e5;
  
  /* Badge states */
  --learn-badge-current: #4a5a6a;
  --learn-badge-locked: #9ca3af;
  --learn-badge-complete: #22c55e;
  
  /* Callouts */
  --learn-risk-bg: #fef2f2;
  --learn-risk-border: #ef4444;
  --learn-risk-text: #dc2626;
  --learn-reward-bg: #f0fdf4;
  --learn-reward-border: #22c55e;
  --learn-reward-text: #16a34a;
  
  /* CTAs */
  --learn-cta-bg: #4a5a6a;
  --learn-cta-hover: #3a4a5a;
}
```

### Typography

| Element | Style |
|---------|-------|
| Header title | "Prime Capital Learning" — 14px semibold white |
| Header subtitle | "Real Estate Consultant Training" — 12px white/70% |
| Sidebar competency | 14px semibold white |
| Sidebar module | 13px regular white/90% |
| Content headings | Use existing Title component |
| Body text | Use existing Text component |

### Spacing

| Element | Value |
|---------|-------|
| Header height | 56px (h-14) |
| Sidebar width | 256px (w-64) |
| Content padding | 32px (p-8) on desktop, 16px (p-4) on mobile |

---

## Deliverables

### 1. Update `app/learn/learn.css`

```css
/**
 * CATALYST - Learn Surface Styles
 */

@import "tailwindcss/theme" layer(theme);

/* =============================================================================
   CSS CUSTOM PROPERTIES
   ============================================================================= */

:root {
  --learn-header-bg: #4a5a6a;
  --learn-sidebar-bg: #4a5a6a;
  --learn-sidebar-width: 16rem;
  --learn-header-height: 3.5rem;
  --learn-content-bg: #f5f5f0;
  
  /* Badge states */
  --learn-badge-current: #4a5a6a;
  --learn-badge-locked: #9ca3af;
  --learn-badge-complete: #22c55e;
  
  /* Callouts */
  --learn-risk-bg: #fef2f2;
  --learn-risk-border: #ef4444;
  --learn-risk-text: #dc2626;
  --learn-reward-bg: #f0fdf4;
  --learn-reward-border: #22c55e;
  --learn-reward-text: #16a34a;
}

/* =============================================================================
   LEARN SHELL LAYOUT
   ============================================================================= */

.learn-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--learn-content-bg);
}

.learn-shell[data-has-sidebar="true"] {
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: var(--learn-sidebar-width) 1fr;
    grid-template-rows: var(--learn-header-height) 1fr;
    grid-template-areas:
      "header header"
      "sidebar content";
  }
}

/* =============================================================================
   HEADER
   ============================================================================= */

.learn-header {
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--learn-header-height);
  background: var(--learn-header-bg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline: 1rem;
}

.learn-header__brand {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.learn-header__title {
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  line-height: 1.25;
}

.learn-header__subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.25;
}

.learn-header__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* =============================================================================
   SIDEBAR
   ============================================================================= */

.learn-sidebar {
  grid-area: sidebar;
  background: var(--learn-sidebar-bg);
  color: white;
  display: none;
  flex-direction: column;
  height: calc(100vh - var(--learn-header-height));
  position: sticky;
  top: var(--learn-header-height);
  overflow: hidden;
  
  @media (min-width: 1024px) {
    display: flex;
  }
}

.learn-sidebar__header {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.learn-sidebar__label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.learn-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.learn-sidebar__footer {
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.learn-sidebar__progress {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Competency item */
.learn-competency {
  padding: 0;
}

.learn-competency__trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: background 0.15s;
}

.learn-competency__trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.learn-competency__trigger[data-active="true"] {
  background: rgba(255, 255, 255, 0.15);
}

.learn-competency__number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.learn-competency__number[data-locked="true"] {
  background: var(--learn-badge-locked);
}

.learn-competency__info {
  flex: 1;
  min-width: 0;
}

.learn-competency__name {
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25;
}

.learn-competency__meta {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.learn-competency__chevron {
  width: 1rem;
  height: 1rem;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s;
}

.learn-competency[data-expanded="true"] .learn-competency__chevron {
  transform: rotate(180deg);
}

/* Module list */
.learn-modules {
  padding: 0.25rem 0 0.5rem 2.25rem;
}

.learn-module {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-radius: 0.25rem;
  transition: background 0.15s;
}

.learn-module:hover {
  background: rgba(255, 255, 255, 0.1);
}

.learn-module[data-active="true"] {
  background: rgba(255, 255, 255, 0.15);
  font-weight: 500;
}

.learn-module__icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.learn-module__icon[data-status="complete"] {
  color: var(--learn-badge-complete);
}

.learn-module__icon[data-status="current"] {
  color: white;
}

.learn-module__icon[data-status="locked"] {
  color: var(--learn-badge-locked);
}

/* =============================================================================
   CONTENT AREA
   ============================================================================= */

.learn-content {
  grid-area: content;
  padding: 2rem;
  background: var(--learn-content-bg);
  min-height: calc(100vh - var(--learn-header-height));
  
  @media (max-width: 1023px) {
    padding: 1rem;
  }
}

.learn-content__inner {
  max-width: 48rem;
  margin: 0 auto;
}

/* =============================================================================
   MOBILE DRAWER
   ============================================================================= */

.learn-drawer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: none;
}

.learn-drawer[data-open="true"] {
  display: block;
}

.learn-drawer__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.learn-drawer__panel {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: var(--learn-sidebar-bg);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.learn-drawer[data-open="true"] .learn-drawer__panel {
  transform: translateX(0);
}

/* =============================================================================
   BADGES
   ============================================================================= */

.learn-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 0.25rem;
}

.learn-badge--current {
  background: var(--learn-badge-current);
  color: white;
}

.learn-badge--locked {
  background: transparent;
  border: 1px solid var(--learn-badge-locked);
  color: var(--learn-badge-locked);
}

.learn-badge--complete {
  background: var(--learn-badge-complete);
  color: white;
}

/* =============================================================================
   CALLOUT BOXES
   ============================================================================= */

.learn-callout {
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
}

.learn-callout--risk {
  background: var(--learn-risk-bg);
  border-color: var(--learn-risk-border);
}

.learn-callout--risk .learn-callout__label {
  color: var(--learn-risk-text);
}

.learn-callout--reward {
  background: var(--learn-reward-bg);
  border-color: var(--learn-reward-border);
}

.learn-callout--reward .learn-callout__label {
  color: var(--learn-reward-text);
}

.learn-callout__label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.learn-callout__text {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--learn-text-primary);
}
```

### 2. Update `app/learn/_surface/learn-shell.tsx`

```tsx
/**
 * CATALYST - Learn Shell
 *
 * Shell for the learning portal with header, sidebar, and content area.
 * Matches the mockup designs exactly.
 */

"use client"

import * as React from "react"
import { LMSHeader } from "./lms-header"
import { LearnSidebar } from "./learn-sidebar"
import { cn } from "@/lib/utils"

interface LearnUser {
  name: string
  email: string
  role: string
  avatarUrl?: string
}

interface LearnShellProps {
  children: React.ReactNode
  user: LearnUser
  /** Show sidebar navigation (false for dashboard/course overview) */
  showSidebar?: boolean
  /** Current competency slug for sidebar highlighting */
  currentCompetency?: string
  /** Current module slug for sidebar highlighting */
  currentModule?: string
}

export function LearnShell({ 
  children, 
  user,
  showSidebar = false,
  currentCompetency,
  currentModule,
}: LearnShellProps) {
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  
  return (
    <div 
      className="learn-shell"
      data-has-sidebar={showSidebar}
    >
      <LMSHeader 
        user={user} 
        onMenuClick={() => setDrawerOpen(true)}
        showMenuButton={showSidebar}
      />
      
      {showSidebar && (
        <>
          {/* Desktop sidebar */}
          <LearnSidebar 
            currentCompetency={currentCompetency}
            currentModule={currentModule}
          />
          
          {/* Mobile drawer */}
          <div 
            className="learn-drawer lg:hidden"
            data-open={drawerOpen}
          >
            <div 
              className="learn-drawer__backdrop"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="learn-drawer__panel">
              <LearnSidebar 
                currentCompetency={currentCompetency}
                currentModule={currentModule}
                onNavigate={() => setDrawerOpen(false)}
              />
            </div>
          </div>
        </>
      )}
      
      <main className="learn-content">
        <div className="learn-content__inner">
          {children}
        </div>
      </main>
    </div>
  )
}
```

### 3. Create `app/learn/_surface/lms-header.tsx`

```tsx
/**
 * CATALYST - LMS Header
 *
 * Fixed header for the learning portal.
 * Dark slate background with logo, subtitle, and HUB link.
 */

"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MenuIcon, HomeIcon } from "lucide-react"

interface LMSHeaderProps {
  user: {
    name: string
    email: string
  }
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function LMSHeader({ 
  user, 
  onMenuClick,
  showMenuButton = false,
}: LMSHeaderProps) {
  return (
    <header className="learn-header">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden text-white hover:bg-white/10"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
        
        {/* Brand */}
        <Link href="/learn" className="learn-header__brand hover:opacity-80 transition-opacity">
          <span className="learn-header__title">Prime Capital Learning</span>
          <span className="learn-header__subtitle">Real Estate Consultant Training</span>
        </Link>
      </div>
      
      {/* Actions */}
      <div className="learn-header__actions">
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white gap-2"
          asChild
        >
          <Link href="/hub">
            <HomeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">HUB</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
```

### 4. Create `app/learn/_surface/learn-sidebar.tsx`

```tsx
/**
 * CATALYST - Learn Sidebar
 *
 * Navigation sidebar showing competencies and modules.
 * Collapsible competency sections with progress indicators.
 */

"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChevronDownIcon, 
  ChevronLeftIcon,
  CheckCircleIcon, 
  CircleIcon,
  LockIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

// TODO: Replace with data from getCompetenciesWithProgress()
const competencies = [
  {
    slug: "prime-capital-identity",
    name: "Prime Capital Identity",
    number: 1,
    locked: false,
    modules: [
      { slug: "our-story", title: "Our Story", status: "current" },
      { slug: "boutique-positioning", title: "Boutique Positioning", status: "current" },
      { slug: "service-model", title: "Service Model", status: "current" },
      { slug: "founders-vision", title: "Founders' Vision", status: "current" },
      { slug: "brand-voice", title: "Brand Voice", status: "locked" },
    ],
  },
  {
    slug: "market-intelligence",
    name: "Market Intelligence",
    number: 2,
    locked: true,
    modules: [],
  },
  // ... more competencies
]

interface LearnSidebarProps {
  currentCompetency?: string
  currentModule?: string
  onNavigate?: () => void
}

export function LearnSidebar({ 
  currentCompetency,
  currentModule,
  onNavigate,
}: LearnSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(currentCompetency ? [currentCompetency] : [competencies[0]?.slug])
  )
  
  const toggleExpanded = (slug: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }
  
  return (
    <aside className="learn-sidebar">
      {/* Header */}
      <div className="learn-sidebar__header">
        <div className="learn-sidebar__label">Consultant Training</div>
        <Link 
          href="/learn/course"
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
          onClick={onNavigate}
        >
          <ChevronLeftIcon className="h-4 w-4" />
          Exit to Course Overview
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="learn-sidebar__nav">
        {competencies.map((comp) => {
          const isExpanded = expanded.has(comp.slug)
          const isActive = currentCompetency === comp.slug
          
          return (
            <div 
              key={comp.slug} 
              className="learn-competency"
              data-expanded={isExpanded}
            >
              <button
                className="learn-competency__trigger"
                data-active={isActive}
                onClick={() => !comp.locked && toggleExpanded(comp.slug)}
                disabled={comp.locked}
              >
                <span 
                  className="learn-competency__number"
                  data-locked={comp.locked}
                >
                  {comp.number}
                </span>
                <div className="learn-competency__info">
                  <div className="learn-competency__name">{comp.name}</div>
                  {comp.locked ? (
                    <span className="learn-badge learn-badge--locked">
                      <LockIcon className="h-2.5 w-2.5 mr-1" />
                      Coming Soon
                    </span>
                  ) : (
                    <div className="learn-competency__meta">
                      0/{comp.modules.length} behaviours
                    </div>
                  )}
                </div>
                {!comp.locked && (
                  <ChevronDownIcon className="learn-competency__chevron" />
                )}
              </button>
              
              {/* Module list */}
              {isExpanded && !comp.locked && (
                <div className="learn-modules">
                  {comp.modules.map((mod) => (
                    <Link
                      key={mod.slug}
                      href={`/learn/${comp.slug}/${mod.slug}`}
                      className="learn-module"
                      data-active={currentModule === mod.slug}
                      onClick={onNavigate}
                    >
                      <ModuleIcon status={mod.status} />
                      <span>{mod.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      
      {/* Footer */}
      <div className="learn-sidebar__footer">
        <div className="learn-sidebar__progress">
          Overall Progress: 0 / 35
        </div>
      </div>
    </aside>
  )
}

function ModuleIcon({ status }: { status: string }) {
  switch (status) {
    case "complete":
      return <CheckCircleIcon className="learn-module__icon" data-status="complete" />
    case "current":
      return <CircleIcon className="learn-module__icon" data-status="current" />
    case "locked":
      return <LockIcon className="learn-module__icon" data-status="locked" />
    default:
      return <CircleIcon className="learn-module__icon" />
  }
}
```

### 5. Update `app/learn/_surface/index.ts`

```typescript
/**
 * CATALYST - Learn Surface Exports
 */

export { LearnShell } from "./learn-shell"
export { LMSHeader } from "./lms-header"
export { LearnSidebar } from "./learn-sidebar"
```

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/learn/learn.css` | UPDATE — Complete rewrite |
| `app/learn/_surface/learn-shell.tsx` | UPDATE — New layout system |
| `app/learn/_surface/lms-header.tsx` | CREATE — Replace `components/lms/lms-header.tsx` |
| `app/learn/_surface/learn-sidebar.tsx` | CREATE — Replace `competency-sidebar.tsx` |
| `app/learn/_surface/index.ts` | UPDATE — New exports |
| `components/lms/lms-header.tsx` | DELETE — Moved to surface |
| `app/learn/_surface/competency-sidebar.tsx` | DELETE — Replaced |

---

## Acceptance Criteria

- [ ] Header matches mockup exactly (dark slate, logo/subtitle, HUB button)
- [ ] Sidebar matches mockup (competency list, expand/collapse, module list)
- [ ] Content area has warm off-white background
- [ ] Sidebar is hidden on mobile, accessible via drawer
- [ ] Mobile drawer opens/closes smoothly
- [ ] Competency sections expand/collapse
- [ ] Current module is highlighted in sidebar
- [ ] Locked competencies show "Coming Soon" badge
- [ ] All CSS uses custom properties (no hardcoded colors)
- [ ] Works correctly with and without sidebar (dashboard vs module pages)

---

## Visual Reference

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] Prime Capital Learning                              [🏠 HUB] │
│     Real Estate Consultant Training                              │
├──────────────────┬──────────────────────────────────────────────┤
│ CONSULTANT       │                                               │
│ TRAINING         │                                               │
│                  │                                               │
│ ← Exit to Course │          Content Area                        │
│                  │          (warm off-white)                     │
│ ┌─┐              │                                               │
│ │1│ Prime Capital│                                               │
│ └─┘ Identity     │                                               │
│   0/5 behaviours │                                               │
│     ○ Our Story  │                                               │
│     ○ Boutique.. │                                               │
│     ○ Service... │                                               │
│                  │                                               │
│ ┌─┐              │                                               │
│ │2│ Market Intel │                                               │
│ └─┘ 🔒 COMING... │                                               │
│                  │                                               │
├──────────────────┤                                               │
│ OVERALL: 0/35    │                                               │
└──────────────────┴──────────────────────────────────────────────┘
```

---

## Notes

- Sidebar data is currently hardcoded — LMS-004+ will connect to real data
- Mobile drawer uses CSS transitions, not Framer Motion
- The shell supports both sidebar and no-sidebar modes
- Color palette intentionally different from main app (focused learning environment)
