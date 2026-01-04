# Prime Capital Migration — Setup & Execution Guide

## Overview

This guide explains how to set up and execute the migration of two legacy repositories into a unified Prime Capital platform with four surfaces:

| Surface | Route | Users | Purpose |
|---------|-------|-------|---------|
| Public Website | `(marketing)/` | Investors, referrers | Trust building, lead capture |
| Admin Panel | `admin/` | Founders, marketing, Tim | CMS + LMS + Hub management |
| Learning Portal | `learn/` | Consultants | Agent training |
| Client Hub | `hub/` | Tim + client team | Project/engagement management |

---

## Repository Setup

### Step 1: Prepare the Base Repository

Start with the LMS prototype as the base (it's already on shadcn/ui):

```bash
# Clone the LMS prototype as the new unified repo
git clone [lms-prototype-url] prime-capital-platform
cd prime-capital-platform

# Or if starting fresh with the Catalyst base
git clone [catalyst-repo-url] prime-capital-platform
cd prime-capital-platform
```

### Step 2: Add Legacy Folders

Create a `/legacy` directory and copy both source repositories:

```bash
mkdir legacy

# Copy website (Ant Design version)
cp -r /path/to/prime-capital-website legacy/website

# Copy LMS prototype (if not using as base)
cp -r /path/to/prime-capital-learning legacy/lms
```

### Step 3: Add Documentation

Replace the existing specs with Prime Capital versions:

```bash
# Replace existing specs in /catalyst/specs
cp prime-capital-project-vision.md catalyst/specs/project-vision.md
cp prime-capital-architecture.md catalyst/specs/project-architecture.md

# Add migration prompts to /catalyst/prompts
cp 00-migration-setup-guide.md catalyst/prompts/
cp 01-lms-migration-prompt.md catalyst/prompts/
cp 02-website-migration-prompt.md catalyst/prompts/
cp 03-hub-migration-prompt.md catalyst/prompts/
```

### Step 4: Verify Structure

Your repository should look like:

```
prime-capital-dubai-hub/
├── app/
│   ├── (app)/              # Admin/app area
│   ├── (auth)/             # Authentication
│   ├── (docs)/             # Documentation
│   ├── (present)/          # Presentations
│   ├── (web)/              # Public website (marketing)
│   └── api/
├── catalyst/
│   ├── specs/
│   │   ├── project-vision.md           # REPLACE with Prime Capital
│   │   ├── project-architecture.md     # REPLACE with Prime Capital
│   │   └── project-voice.md            # Keep existing
│   ├── prompts/
│   │   ├── 00-migration-setup-guide.md        # ADD
│   │   ├── 01-lms-migration-prompt.md         # ADD
│   │   ├── 02-website-migration-prompt.md     # ADD
│   │   └── 03-hub-migration-prompt.md         # ADD
│   ├── CATALYST.md
│   ├── PATTERNS.md
│   ├── GLOSSARY.md
│   └── SURFACES.md
├── components/
├── design/
├── legacy/                 # Legacy repos already here
│   ├── website/            # Ant Design website source
│   └── lms/                # LMS prototype source (if separate)
├── lib/
└── ...
```

---

## Execution Sequence

### Phase 1: LMS Migration

**Goal:** Establish learning routes, admin learning section, and user management.

**Run Claude Code with:**

```bash
claude
```

**Then provide:**

```
Read /catalyst/prompts/01-lms-migration-prompt.md and execute the migration.

The legacy LMS code is in /legacy/lms/ (or /legacy/ if LMS is the base).
The target is the current repository root.

Start by:
1. Reading the project vision and architecture in /catalyst/specs/
2. Creating the /learn route group
3. Adding learning management to the admin area

Work through the migration tasks in order. Verify each section works before moving to the next.
```

**Expected outcome:**
- `/learn/*` routes functional
- `/admin/learning/*` routes functional  
- `/admin/users/*` routes functional
- `/admin/progress/*` routes functional
- Supabase schema extended with learning tables
- LMS Header component migrated

---

### Phase 2: Website Migration

**Goal:** Migrate marketing pages and CMS admin from Ant Design to shadcn/ui.

**Run Claude Code with:**

```bash
claude
```

**Then provide:**

```
Read /catalyst/prompts/02-website-migration-prompt.md and execute the migration.

The legacy website code is in /legacy/website/.
The target is the current repository root.
Phase 1 (LMS migration) is complete.

Start by:
1. Reading the project vision and architecture in /catalyst/specs/
2. Migrating brand tokens to CSS variables
3. Rebuilding marketing components in shadcn/ui
4. Adding CMS routes to the existing admin area

Work through the migration tasks in order. Verify each section works before moving to the next.
```

**Expected outcome:**
- `(marketing)/*` routes functional with shadcn components
- `/admin/properties/*`, `/admin/team/*`, etc. functional
- No Ant Design dependencies remaining
- Brand colours and typography correct
- Dual-source data layer working

---

### Phase 3: Hub Migration

**Goal:** Migrate Client Hub for project/engagement management. Build as reusable pattern.

**Run Claude Code with:**

```bash
claude
```

**Then provide:**

```
Read /catalyst/prompts/03-hub-migration-prompt.md and execute the migration.

The legacy hub code is in /legacy/lms/app/(guest)/ (or similar).
The target is the current repository root.
Phase 1 and Phase 2 are complete.

Start by:
1. Reading the project vision and architecture in /catalyst/specs/
2. Creating the /hub route group
3. Migrating voice recorder and response components
4. Adding hub management to the admin area

Work through the migration tasks in order. Verify each section works before moving to the next.
Build for reusability — this pattern will be used for future clients.
```

**Expected outcome:**
- `/hub/*` routes functional
- `/admin/hub/*` routes functional
- Voice recorder component working
- Question/response system functional
- Activity feed working
- Supabase schema for hub tables
- Reusable configuration pattern in place

---

## Verification

After all phases, run full verification:

```bash
# Build check
npm run build

# Type check
npx tsc --noEmit

# Start dev server
npm run dev
```

**Test these flows:**

1. **Public website:**
   - Visit `/` — Homepage loads
   - Scroll — Header changes from transparent to solid
   - Navigate to `/properties`, `/team`, `/about`, `/services`, `/contact`
   - Mobile — Open hamburger menu, navigate

2. **Learning portal:**
   - Login as learner
   - Visit `/learn` — Dashboard shows competencies
   - Navigate to `/learn/[competency]/[module]`
   - Complete a quiz

3. **Admin panel:**
   - Login as admin
   - Visit `/admin` — Dashboard loads
   - Test CRUD on properties, team, testimonials
   - Test learning module management
   - Test user creation
   - View team progress
   - Manage hub projects, tasks, questions

4. **Client hub:**
   - Login as admin
   - Visit `/hub` — Dashboard shows projects
   - View project detail with tasks
   - Open a question, submit text response
   - Record and submit voice response
   - Check activity feed updates

---

## Post-Migration Cleanup

Once verified:

```bash
# Remove legacy folders
rm -rf legacy/

# Remove migration prompts from docs (optional, or move to /docs/archive)
mkdir -p docs/archive
mv docs/01-lms-migration-prompt.md docs/archive/
mv docs/02-website-migration-prompt.md docs/archive/
mv docs/03-hub-migration-prompt.md docs/archive/

# Commit
git add .
git commit -m "Complete platform consolidation"
```

---

## Troubleshooting

### "Component X not found"

Check if the shadcn component is installed:
```bash
npx shadcn@latest add [component-name]
```

### Ant Design styles leaking through

Search for any remaining Ant imports:
```bash
grep -r "antd" app/ components/ lib/
grep -r "@ant-design" app/ components/ lib/
```

### Supabase connection issues

Verify environment variables:
```bash
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Brand fonts not loading

Check `/app/layout.tsx` has font imports:
```tsx
import { Lato } from 'next/font/google'
// Palatino is a system font, no import needed
```

### Voice recorder not working

Check:
- Browser permissions for microphone
- Supabase Storage bucket exists (`voice-recordings`)
- Storage policies allow upload

---

## Timeline Estimate

| Phase | Estimated Time |
|-------|----------------|
| Setup & preparation | 1-2 hours |
| Phase 1: LMS migration | 4-8 hours |
| Phase 2: Website migration | 8-16 hours |
| Phase 3: Hub migration | 4-8 hours |
| Testing & fixes | 4-8 hours |
| **Total** | **21-42 hours** |

The website migration takes longest due to component rebuilding (Ant → shadcn).

---

## Files Reference

| Document | Location | Purpose |
|----------|----------|---------|
| `project-vision.md` | `/catalyst/specs/` | Why we're building this, what success looks like |
| `project-architecture.md` | `/catalyst/specs/` | Decisions and rationale |
| `00-migration-setup-guide.md` | `/catalyst/prompts/` | This guide |
| `01-lms-migration-prompt.md` | `/catalyst/prompts/` | Phase 1 execution instructions |
| `02-website-migration-prompt.md` | `/catalyst/prompts/` | Phase 2 execution instructions |
| `03-hub-migration-prompt.md` | `/catalyst/prompts/` | Phase 3 execution instructions |
