# Design Alignment Task
## Prime Capital Dubai Website — Fix All Pages to Match Screenshots

**Objective:** Make every page match its design screenshot exactly. Don't document — fix.

---

## Your Role

You are a world-class UI designer. Your job is to compare each page against its screenshot and immediately fix any deviations. No reports, no documentation — just make the changes.

---

## Reference Materials

### Design Screenshots (Source of Truth)
```
catalyst/images/website/
```

### Pages to Align
```
app/(web)/
├── page.tsx              # Homepage (ALREADY ALIGNED - use as reference)
├── about/page.tsx        
├── contact/page.tsx      
├── properties/           
├── services/page.tsx     
├── team/page.tsx         
├── terms/                
├── strategy-kit/page.tsx 
├── web.css               # Website styles
└── _surface/             # Nav, footer, shell
```

### Design System (Already Implemented)
```css
/* Brand colors */
--web-spruce: #576C75;
--web-ash: #3F4142;
--web-off-white: #F2EFEA;
--web-serenity: #A6B5B0;

/* Typography */
font-headline: Palatino, Georgia, serif  /* Headlines */
font-normal                              /* Body text */

/* Corner radius */
rounded-[2px]                            /* All buttons and cards */

/* Spacing */
--web-section-gap: 6rem (mobile) / 7.5rem (tablet) / 9rem (desktop)
```

### Legacy Reference (if needed)
```
legacy/website/
```

---

## Instructions

1. **Look at each screenshot** in `catalyst/images/website/`
2. **Open the corresponding page** implementation
3. **Compare visually** — check typography, spacing, colors, layout
4. **Fix immediately** — edit the file to match the screenshot
5. **Move to the next page**

### What to Check & Fix

- **Typography:** Font size, weight, color, spacing
- **Layout:** Alignment, grid columns, section order
- **Spacing:** Padding, margins, gaps between elements
- **Colors:** Backgrounds, text, borders, overlays
- **Components:** Buttons, cards, badges, inputs
- **Images:** Correct images, sizing, positioning

### Already Established Patterns (from Homepage)

Use these as reference for consistency:

```tsx
// Section header pattern
<span className="text-[var(--web-spruce)] text-[11px] font-normal uppercase tracking-[0.15em]">
  Section Label
</span>
<Title className="font-headline text-[var(--web-ash)] text-[clamp(28px,4vw,40px)] font-normal">

// Button pattern  
className="h-12 px-10 bg-[var(--web-spruce)] text-[var(--web-off-white)] hover:bg-[var(--web-ash)] rounded-[2px] text-[11px] font-normal uppercase tracking-[0.2em]"

// Card pattern
className="bg-white rounded-[2px] overflow-hidden shadow-sm"
```

---

## Workflow

For each page:

1. View the screenshot
2. Run the dev server and view the implemented page
3. Identify what's different
4. Edit the code to fix it
5. Verify the fix
6. Commit when the page matches

**Don't overthink it.** If something looks different from the screenshot, change it to match.

---

## Priority Order

1. About page
2. Services page  
3. Contact page
4. Properties pages
5. Strategy Kit page
6. Team page
7. Terms pages

---

## Success Criteria

When you're done, every page should be indistinguishable from its design screenshot. Same fonts, same colors, same spacing, same everything.

**Start now. Fix everything.**

