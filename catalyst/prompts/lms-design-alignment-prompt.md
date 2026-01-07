# LMS Design Alignment Task
## Prime Capital Learning Portal — Fix All Pages to Match Screenshots

**Objective:** Make every LMS page match its design screenshot exactly. Don't document — fix.

---

## Your Role

You are a world-class UI designer. Your job is to compare each LMS page against its screenshot and immediately fix any deviations. No reports, no documentation — just make the changes.

---

## Reference Materials

### Design Screenshots (Source of Truth)
```
catalyst/images/lms/
├── Prime Capital Learning Dashboard.png    → /learn
├── Prime Capital Learning Competency.png   → /learn/[competency]
├── Prime Capital Learning Module.png       → /learn/[competency]/[module]
├── Prime Capital Course Home.png           → Course overview
├── Prime Capital Knowledge Check.png       → /learn/quiz/[id]
├── Prime Capital Knowledge Complete.png    → Quiz completion state
├── Prime Capital AI Sim.png                → AI simulation interface
├── Prime Capital AI Call Sim.png           → AI call simulation
```

### Pages to Align
```
app/learn/
├── page.tsx                    # Dashboard
├── learn.css                   # LMS styles
├── layout.tsx                  # LMS layout
├── _surface/                   # Shell components
│   ├── learn-shell.tsx
│   └── index.ts
├── [competency]/
│   ├── page.tsx               # Competency page (module list)
│   └── [module]/
│       └── page.tsx           # Module content page
└── quiz/
    └── [id]/                  # Quiz pages
```

### Components
```
components/lms/                 # LMS-specific components
```

### Legacy Reference (if needed)
```
legacy/lms/
```

---

## Instructions

1. **Look at each screenshot** in `catalyst/images/lms/`
2. **Open the corresponding page** implementation
3. **Compare visually** — check typography, spacing, colors, layout
4. **Fix immediately** — edit the file to match the screenshot
5. **Move to the next page**

### What to Check & Fix

- **Typography:** Font size, weight, color, spacing
- **Layout:** Card arrangement, grid columns, sidebar width
- **Spacing:** Padding, margins, gaps between elements
- **Colors:** Backgrounds, text, borders, progress indicators
- **Components:** Cards, badges, progress bars, buttons
- **Icons:** Correct icons, sizing, colors

---

## Design System Reference

### Colors (from website — maintain consistency)
```css
--web-spruce: #576C75;     /* Primary accent */
--web-ash: #3F4142;        /* Dark text */
--web-off-white: #F2EFEA;  /* Light backgrounds */
--web-serenity: #A6B5B0;   /* Muted elements */
```

### Typography
- Headlines: Palatino/Georgia serif
- Body: System font stack
- Module titles: Medium weight
- Descriptions: Regular weight, muted color

### Component Patterns
```tsx
// Card pattern
<Card className="rounded-[2px] border hover:border-primary/50 transition-colors">

// Badge pattern
<Badge variant="outline">Status</Badge>

// Progress bar
<Progress value={progress} className="h-1.5" />

// Button pattern
<Button className="rounded-[2px]">Continue</Button>
```

---

## Workflow

For each page:

1. View the screenshot
2. Run the dev server (`pnpm dev`) and navigate to the page
3. Identify what's different
4. Edit the code to fix it
5. Verify the fix
6. Move to the next page

---

## Priority Order

1. **Learning Dashboard** (`/learn`) — Main landing page
2. **Competency Page** (`/learn/[competency]`) — Module list
3. **Module Page** (`/learn/[competency]/[module]`) — Content view
4. **Quiz Interface** (`/learn/quiz/[id]`) — Knowledge check
5. **Quiz Complete** — Completion state
6. **AI Simulations** — If implemented

---

## Key Areas to Focus

### Dashboard Page
- Progress overview cards layout
- Competency grid cards
- "Continue Learning" section styling
- Overall spacing and hierarchy

### Competency Page  
- Module list styling
- Progress indicators
- Status badges (completed, in-progress, not-started)
- Breadcrumb navigation

### Module Page
- Content area width and typography
- Sidebar/navigation styling
- Key takeaways section
- Quiz CTA button

### Quiz Interface
- Question card styling
- Answer option styling
- Progress indicator
- Navigation buttons

---

## Success Criteria

When you're done, every LMS page should be indistinguishable from its design screenshot. Same fonts, same colors, same spacing, same card layouts, same everything.

**Start now. Fix everything.**
