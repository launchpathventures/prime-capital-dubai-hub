# LMS-019: Unified Sidebar Navigation

**Status:** 📋 READY  
**Priority:** High  
**Estimated Time:** 1 day  
**Dependencies:** None  

---

## Objective

Add a persistent sidebar to all `/learn` pages with links to scenarios, RERA exam, certification, and admin where appropriate.

---

## Problem Statement

1. **Sidebar only on some pages** — Dashboard and certification pages lack navigation
2. **No links to practice tools** — Scenarios and RERA exam not in sidebar
3. **Admin access hidden** — No easy access to admin pages

---

## Sidebar Structure

```
┌─────────────────────────────────┐
│ LEARN                           │
│ ▸ Course Overview               │
│ ▸ My Progress                   │
├─────────────────────────────────┤
│ COURSE CONTENT                  │  (collapsible)
│ ├─ 1. Client Discovery          │
│ ├─ 2. Market Intelligence       │
│ └─ ...                          │
├─────────────────────────────────┤
│ PRACTICE                        │
│ ▸ AI Scenarios                  │
│ ▸ RERA Essentials               │
├─────────────────────────────────┤
│ CERTIFICATION                   │
│ ▸ Certification Prep            │
├─────────────────────────────────┤
│ ADMIN                           │  (admin only)
│ ▸ Certification Admin           │
└─────────────────────────────────┘
```

### Navigation Items

| Section | Items | Notes |
|---------|-------|-------|
| **Learn** | Course Overview, My Progress | Progress = simple completion view |
| **Course** | Competencies (collapsible) | Shows modules when expanded |
| **Practice** | AI Scenarios, RERA Essentials | Direct links |
| **Certification** | Certification Prep | Links to `/learn/certification` |
| **Admin** | Certification Admin | Admin role only |

---

## Completion Tracking Model

### Module Completion
- **Completion = passing the associated quiz**
- Module marked complete when user passes quiz with required score
- Users can review modules anytime (doesn't affect completion status)
- Progress page shows which modules are complete

### Scenario Completion
- **Completion = user reflection**
- After practicing a scenario, user can mark it as "completed"
- Simple checkbox/button: "I've practiced this scenario"
- No automated tracking of AI conversation quality

---

## Implementation Tasks

### Task 1: Update LearnSidebar

Modify `app/learn/_surface/learn-sidebar.tsx`:
- Add navigation sections (Learn, Practice, Certification, Admin)
- Keep existing competency/module tree in Course section
- Add role check for Admin section
- Add active state highlighting

### Task 2: Create Progress Page

Create `/learn/progress/page.tsx` — simple completion overview:
- Competency progress (X/Y modules complete per competency)
- Overall completion percentage
- List of completed modules (with completion date)
- Link to resume where user left off

### Task 3: Update LearnShell

Modify `app/learn/_surface/learn-shell.tsx`:
- Always show sidebar (remove `showSidebar` conditional)
- Pass `activeSection` prop for highlighting
- Pass `userRole` for admin visibility

### Task 4: Update All Learn Pages

Add `LearnShell` with appropriate `activeSection` to:
- `/learn` → `activeSection="overview"`
- `/learn/progress` → `activeSection="progress"`
- `/learn/[competency]` → `activeSection="course"`
- `/learn/scenarios` → `activeSection="scenarios"`
- `/learn/quiz/*` → `activeSection="rera"`
- `/learn/certification` → `activeSection="certification"`
- `/learn/admin/*` → `activeSection="admin"`

### Task 5: Add CSS for Sections

Add section styles to `app/learn/learn.css`

---

## File Changes

| File | Action |
|------|--------|
| `app/learn/_surface/learn-sidebar.tsx` | **MODIFY** — Add sections |
| `app/learn/_surface/learn-shell.tsx` | **MODIFY** — Always show sidebar |
| `app/learn/progress/page.tsx` | **CREATE** — Progress page |
| `app/learn/page.tsx` | **MODIFY** — Use LearnShell |
| `app/learn/scenarios/page.tsx` | **MODIFY** — Use LearnShell |
| `app/learn/certification/page.tsx` | **MODIFY** — Use LearnShell |
| `app/learn/learn.css` | **MODIFY** — Section styles |

---

## Testing Checklist

- [ ] Sidebar visible on all `/learn/*` pages
- [ ] Active section highlighted correctly
- [ ] Admin section only visible to admins
- [ ] Mobile drawer works
- [ ] Progress page shows completion status
- [ ] All navigation links work

---

## Success Criteria

1. Sidebar visible everywhere in `/learn`
2. All LMS features accessible from sidebar
3. Admin links only for admins
4. Simple progress tracking based on quiz completion

---

## Related Briefs

- `lms-003-shell-redesign.md` — Original shell design
- `lms-007-quiz-system.md` — Quiz completion tracking

