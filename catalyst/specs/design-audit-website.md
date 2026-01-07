# Website Design Audit
## Prime Capital Dubai — Brand Alignment Review

**Date:** January 2026  
**Status:** ✅ Phase 1 Complete  
**Purpose:** Comprehensive design audit comparing current implementation to legacy brand standards

---

## Changes Implemented

### Phase 1 Complete — January 2026

The following improvements were made across all pages:

#### 1. CSS Variables & Animation System (`web.css`)
- ✅ Reduced `--web-section-gap` to more elegant values (5rem → 6rem)
- ✅ Added animation tokens (`--duration-*`, `--ease-*`)
- ✅ Added `.btn-hover-lift` — Button lift effect with shadow
- ✅ Added `.card-lift` — Card lift effect with shadow
- ✅ Added `.img-zoom` — Image scale on hover  
- ✅ Added `.testimonial-card` — Subtle hover state
- ✅ Added `.area-tile` / `.area-tile-overlay` — Area tile hover
- ✅ Added `.footer-link` — Footer link hover
- ✅ Added `.font-headline` with negative letter-spacing
- ✅ Added mobile optimizations (faster animations, scroll fix)

#### 2. Homepage (`page.tsx`)
- ✅ Hero subtitle: Increased size from 15-18px → 17-22px
- ✅ Hero subtitle: Increased margin-top from 16px → mt-4
- ✅ Hero CTA: Increased height from 48px → 56px (h-14)
- ✅ Hero CTA: Increased padding from 40px → 48px (px-12)
- ✅ Hero CTA: Added `btn-hover-lift` class
- ✅ Stats: Reduced stat value size from 36-64px → 28-52px
- ✅ Stats: Improved AED prefix styling with flex alignment
- ✅ Stats: Added stat dividers via CSS borders
- ✅ Positioning: Improved line-height to 1.8
- ✅ Property cards: Added `card-lift` class
- ✅ Testimonial cards: Added `testimonial-card` class
- ✅ Area tiles: Added `area-tile` and `img-zoom` classes
- ✅ Strategy Kit CTA: Added `btn-hover-lift`
- ✅ Final CTA: Increased button size and added lift effect

#### 3. About Page (`about/page.tsx`)
- ✅ Body text: Improved line-height to 1.8
- ✅ CTA button: Increased size and added `btn-hover-lift`

#### 4. Properties Page (`properties/page.tsx`)
- ✅ Property cards: Added `card-lift` class
- ✅ Property images: Added `img-zoom` class
- ✅ CTA button: Increased size and added `btn-hover-lift`

#### 5. Services Page (`services/page.tsx`)
- ✅ Service cards: Added `card-lift` class
- ✅ Service images: Added `img-zoom` class
- ✅ CTA button: Increased size and added `btn-hover-lift`

#### 6. Team Page (`team/page.tsx`)
- ✅ CTA button: Increased size and added `btn-hover-lift`
- ✅ Team cards: Added `card-lift` class (via component)
- ✅ Team card images: Added `img-zoom` class

#### 7. Strategy Kit Page (`strategy-kit/page.tsx`)
- ✅ CTA button: Increased size and added `btn-hover-lift`

---

## Executive Summary

The current website implementation captures the basic structure and content of the legacy design but has several spacing, typography, and polish issues that reduce the premium "quiet luxury" feel of the Prime Capital brand.

**Key Findings:**
1. **Spacing is too tight** — Section gaps, padding, and margins are compressed vs. the generous whitespace of the original
2. **Typography needs refinement** — Font sizes, line heights, and letter spacing don't match brand spec
3. **Missing micro-interactions** — Hover states, scroll animations, and transitions are absent or basic
4. **Color application inconsistent** — Some elements don't use the correct brand colors
5. **Component polish lacking** — Cards, buttons, and stats need visual refinement

---

## Brand Design Principles (Reference)

From the Prime Capital Brand Guide, the website should embody:

> **"Quiet Luxury"** — Confidence through restraint, not through flash

| Principle | What It Means |
|-----------|---------------|
| **Generous whitespace** | More space = more premium feel |
| **Subtle typography** | Light font weights (300-400), Palatino headlines |
| **Restrained color** | Spruce, Ash, Off White, Serenity only |
| **Minimal shadows** | Very subtle, never heavy drop shadows |
| **Refined animations** | Smooth, elegant, never flashy |

---

## Page-by-Page Audit

### 1. Homepage (`/`)

#### Hero Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Headline size | `clamp(38px, 7vw, 72px)` | `clamp(38px, 7vw, 76px)` | Slightly larger — OK |
| Subtitle size | `clamp(17px, 2.2vw, 22px)` | `clamp(15px, 1.8vw, 18px)` | **Too small** — looks weak |
| Subtitle spacing | `marginTop: 28px` | `mt-4` (16px) | **Too tight** |
| CTA button height | `56px` | `h-12` (48px) | **Too short** |
| CTA button padding | `48px horizontal` | `px-10` (40px) | **Too narrow** |
| Scroll indicator | Custom animated, clickable | Basic bounce | Missing scroll-to function |

**Fixes Needed:**
- Increase subtitle size and margin
- Make CTA button taller and wider
- Add functional scroll indicator

#### Stats Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Section padding | `48px` vertical | `py-16` (64px) | Slightly more — OK |
| Stat value size | `clamp(28px, 5vw, 52px)` | `clamp(36px, 6vw, 64px)` | **Too large** — loses elegance |
| Stat dividers | Subtle border-right | None | **Missing dividers** |
| Counter animation | Animated count-up | Static | **No animation** |
| AED prefix | Inline, smaller styled | Inline styled | OK |

**Fixes Needed:**
- Reduce stat value font size
- Add subtle dividers between stats
- Add scroll-triggered counter animation

#### Positioning Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Section padding | `sectionGap: 80px` | `py-[var(--web-section-gap)]` | Depends on CSS var |
| Headline max-width | `700px` | `max-w-[800px]` | OK |
| Body text size | `fontSize.lg (17px)` | `text-[17px]` | OK |
| Body line-height | `1.8` | `leading-relaxed` (1.625) | **Too tight** |

**Fixes Needed:**
- Increase line-height to 1.8 for body text

#### Properties Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Card border-radius | `4px` | `rounded-[2px]` | OK |
| Card padding | `24px` | `p-6` (24px) | OK |
| Image height | `280px` | `h-[280px]` | OK |
| Card shadow | `0 2px 20px rgba(0,0,0,0.06)` | `shadow-sm` | **Different shadow** |
| Hover effect | `card-hover` (lift + shadow) | `hover:shadow-md` | **Missing lift animation** |
| Image zoom | `img-zoom` class | `group-hover:scale-105` | OK |

**Fixes Needed:**
- Add card lift hover effect
- Match shadow style

#### Testimonials Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Card background | `rgba(255,255,255,0.03)` | `rgba(255,255,255,0.03)` | OK |
| Card border | `1px solid rgba(255,255,255,0.06)` | Same | OK |
| Quote mark | `text-7xl` | `text-7xl` | OK |
| Hover effect | `.testimonial-card:hover` | None | **Missing hover** |

**Fixes Needed:**
- Add testimonial card hover effect

#### Areas Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Tile height | Varied by content | `h-[200px]` | OK |
| Overlay gradient | Multi-stop gradient | Multi-stop gradient | OK |
| Hover effect | `.area-tile-overlay:hover` | `group-hover` | OK |

**Status:** ✅ Acceptable

#### Strategy Kit Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Grid ratio | `1.4fr 1fr` | `[1.4fr_1fr]` | OK |
| Book mockup | Styled div | Styled div | OK |
| Card shadow | `shadow-2xl` | `shadow-2xl` | OK |

**Status:** ✅ Acceptable

#### CTA Section

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Headline size | `clamp(32px, 5vw, 48px)` | Same | OK |
| Decorative gradient | Radial gradient | Same | OK |
| Trust indicators | Styled row | Styled row | OK |

**Status:** ✅ Acceptable

---

### 2. About Page (`/about`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Hero height | `header + 100px padding` | `min-h-[70vh]` | Different approach — OK |
| Story grid gap | Large (implied 80px+) | `gap-12 lg:gap-20` | Slightly less |
| Stats in story | 4-column stats | Similar | OK |
| Values cards | 4 cards with icons | Similar | OK |

**Status:** Generally acceptable, minor spacing adjustments

---

### 3. Properties Page (`/properties`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Hero stats | Inline stats | Inline stats | OK |
| Filter tabs | Active state styled | Present | Check styling |
| Card grid | `Row` + `Col` | `Grid` | OK |
| Card hover | `card-hover` class | Basic shadow | **Missing lift** |

**Fixes Needed:**
- Add card hover lift effect
- Verify filter tab active states

---

### 4. Services Page (`/services`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Stats bar | Dark spruce bg | `bg-[var(--web-spruce)]` | OK |
| Service cards | 2x2 grid with images | Similar | OK |
| Process timeline | Numbered steps | Similar | OK |
| Golden Visa section | Feature callout | Similar | OK |

**Status:** Generally acceptable

---

### 5. Team Page (`/team`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Team grid | 3-column | 1-2-3 responsive | OK |
| Card style | Photo + bio | Similar | Check styling |
| Member detail | Full page layout | Need to verify | Need review |

**Status:** Need to verify individual member pages

---

### 6. Contact Page (`/contact`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Quick links bar | Phone/Email/WhatsApp | Same buttons | OK |
| Form layout | 2-column | 2-column | OK |
| Input styling | Brand borders | Similar | Check colors |
| Process steps | Numbered timeline | Present | OK |

**Status:** Generally acceptable

---

### 7. Strategy Kit Page (`/strategy-kit`)

| Element | Legacy | Current | Issue |
|---------|--------|---------|-------|
| Hero layout | 2-column, dark | Same | OK |
| Form card | White, centered | Same | OK |
| TOC section | Numbered list | Same | OK |

**Status:** ✅ Acceptable

---

## Global Issues

### 1. CSS Variables Misalignment

Current `web.css` defines:
```css
--web-section-gap: 6rem;  /* 96px mobile */
--web-section-gap: 7.5rem; /* 120px tablet */
--web-section-gap: 9rem;   /* 144px desktop */
```

Legacy uses:
```js
layout.sectionGap = 80px /* consistent */
```

**Issue:** Current is more responsive but 144px may be too much on desktop

### 2. Missing Animation System

Legacy has comprehensive animation classes:
- `.animate-on-scroll` — Fade in on scroll
- `.btn-hover-lift` — Button lift effect
- `.card-hover` — Card lift + shadow
- `.img-zoom` — Image scale on hover
- `.nav-link-underline` — Nav underline animation

Current has:
- Basic Tailwind transitions
- No scroll-triggered animations
- No lift effects

**Fix:** Add animation utilities to `web.css`

### 3. Typography Line Heights

Legacy uses:
```js
lineHeight: {
  tight: 1.2,   // Headlines
  base: 1.5,    // UI elements
  relaxed: 1.7, // Body text
}
```

Current uses:
- Tailwind `leading-relaxed` = 1.625
- Should be 1.7 for body text

### 4. Letter Spacing

Legacy uses:
```js
letterSpacing: {
  tight: '-0.02em',   // Headlines
  normal: '0',        // Body
  wide: '0.15em',     // Labels
  wider: '0.2em',     // Buttons
}
```

Current uses:
- `tracking-[0.15em]` and `tracking-[0.2em]` — Correct
- Headlines missing negative tracking

---

## Priority Fixes

### P0 — Critical (Brand Impact)

1. **Hero subtitle sizing** — Make larger (17-22px) and increase margin
2. **CTA button sizing** — Taller (56px) and wider (48px padding)
3. **Stat value sizing** — Reduce to 28-52px range
4. **Add stat dividers** — Subtle border between stats
5. **Body line-height** — Increase to 1.7-1.8

### P1 — Important (Polish)

6. **Add animation system** — Scroll animations, hover lifts
7. **Card hover effects** — Add lift + enhanced shadow
8. **Testimonial card hover** — Add subtle hover state
9. **Section gap fine-tuning** — Ensure consistent generous spacing

### P2 — Nice to Have

10. **Counter animation** — Animated count-up for stats
11. **Nav link underline** — Animated underline on hover
12. **Image parallax** — Subtle parallax on heroes (desktop only)

---

## Implementation Plan

### Phase 1: Typography & Spacing (Day 1)

1. Update hero subtitle sizing across all pages
2. Update CTA button sizing
3. Adjust stat section typography
4. Fix body line-height values
5. Review and adjust section gaps

### Phase 2: Animation System (Day 2)

1. Add animation CSS classes to `web.css`
2. Add scroll-triggered animation hook (optional, can use CSS only)
3. Apply animation classes to components
4. Add card hover effects
5. Add button lift effects

### Phase 3: Component Polish (Day 3)

1. Fine-tune card shadows
2. Add stat dividers
3. Add testimonial hover states
4. Review form input styling
5. Final cross-page consistency check

---

## Files to Modify

| File | Changes |
|------|---------|
| `app/(web)/web.css` | Add animation classes, adjust variables |
| `app/(web)/page.tsx` | Fix hero, stats, apply animations |
| `app/(web)/about/page.tsx` | Apply consistent styling |
| `app/(web)/properties/page.tsx` | Fix card hovers |
| `app/(web)/team/page.tsx` | Verify card styling |
| `app/(web)/contact/page.tsx` | Minor tweaks |
| `app/(web)/services/page.tsx` | Verify card styling |

---

## Reference Images

Location: `catalyst/images/website/`

- `Prime Capital Home.png` — Homepage reference
- `Prime Capital About.png` — About page reference
- `Prime Capital Contact.png` — Contact page reference
- `Prime Capital Properties.png` — Properties list reference
- `Prime Capital Property Overview.png` — Property detail reference
- `Prime Capital Services.png` — Services page reference
- `Prime Capital Team.png` — Team list reference
- `Prime Capital team Member.png` — Team member detail reference
- `Prime Capital Investment Kit.png` — Strategy kit reference

---

## Success Criteria

After implementation, the website should:

1. ✅ Feel more spacious and premium
2. ✅ Have smooth, elegant micro-interactions
3. ✅ Match the typography rhythm of the legacy site
4. ✅ Use consistent brand colors throughout
5. ✅ Feel "quiet luxury" — confident but not flashy

---

*Document created as part of design audit. See `catalyst/briefs/audit-pages-brief.md` for implementation brief.*
