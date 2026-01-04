# LMS Migration Prompt
## Phase 1: Consolidate Learning System into Unified Platform

**Context**: You are migrating the Prime Capital Learning prototype into the unified Prime Capital platform. The LMS prototype is in `/legacy/lms/` (or the base repo if LMS was used as foundation). The target structure is the current repository root.

---

## Background

Read these documents first to understand the project:
- `/catalyst/specs/project-vision.md` — Project intent and scope
- `/catalyst/specs/project-architecture.md` — Decisions and rationale

Also review the existing Catalyst documentation:
- `/catalyst/CATALYST.md` — Framework overview
- `/catalyst/PATTERNS.md` — Code patterns
- `/catalyst/SURFACES.md` — Surface definitions

**Key decisions affecting this migration:**
1. Learning routes use `/learn/[competency]/[module]` pattern
2. Client Hub is being preserved as separate surface at `/hub/*`
3. Unified admin panel serves both CMS (website) and LMS (learning) functions
4. Learner accounts created by admin, not self-registration
5. shadcn/ui is the component library (already in use)

**Existing route groups in this repo:**
- `(app)` — Admin/app area
- `(auth)` — Authentication
- `(docs)` — Documentation
- `(present)` — Presentations
- `(web)` — Public website/marketing pages

---

## Source Structure (Legacy LMS)

```
/legacy/lms/
├── app/
│   ├── (lms)/                    # Learning routes — MIGRATE with restructure
│   │   ├── layout.tsx
│   │   ├── lms.css
│   │   └── lms/
│   │       ├── page.tsx
│   │       ├── courses/real-estate/
│   │       └── milestones/
│   ├── (guest)/                  # Hub routes — REMOVE (replaced by unified admin)
│   │   ├── hub.css
│   │   ├── projects-grid.tsx
│   │   ├── admin/
│   │   ├── projects/
│   │   └── login/
│   └── ...
├── components/shared/
│   ├── lms-header.tsx            # MIGRATE
│   ├── lms-header.css            # MIGRATE
│   ├── back-to-hub.tsx           # REMOVE (Hub concept removed)
│   ├── back-to-hub.css           # REMOVE
│   ├── voice-recorder.tsx        # MIGRATE (future use)
│   ├── voice-recorder.css        # MIGRATE
│   └── ...
├── lib/
│   ├── supabase.ts               # COMPARE with target, merge if needed
│   ├── config.ts                 # MERGE configuration values
│   └── navigation.ts             # MERGE navigation items
└── content/
    ├── prime-capital-learning-architecture-v2.md
    ├── prime-capital-training-guide.md
    └── ...                       # MIGRATE to /docs or /content
```

---

## Target Structure

```
/app/
├── (web)/                        # Public website (Phase 2)
├── (app)/                        # Admin/app area — ADD learning sections
│   ├── layout.tsx                # App shell with sidebar
│   ├── page.tsx                  # Dashboard
│   ├── properties/               # CMS: Properties (Phase 2)
│   ├── team/                     # CMS: Team members (Phase 2)
│   ├── learning/                 # LMS: Module management — CREATE
│   │   ├── page.tsx              # Learning content overview
│   │   └── [competency]/
│   │       └── page.tsx          # Competency module editor
│   ├── users/                    # User management — CREATE
│   │   └── page.tsx              # Learner account management
│   ├── progress/                 # Progress visibility — CREATE
│   │   └── page.tsx              # Team progress dashboard
│   └── settings/                 # Site settings
├── learn/                        # Learner-facing portal — CREATE
│   ├── layout.tsx                # Learning layout (minimal header)
│   ├── page.tsx                  # Learning dashboard
│   ├── [competency]/
│   │   ├── page.tsx              # Competency overview
│   │   └── [module]/
│   │       └── page.tsx          # Module content
│   └── quiz/
│       └── [id]/
│           └── page.tsx          # Knowledge check
├── (auth)/
│   └── login/
│       └── page.tsx              # Unified login
└── layout.tsx                    # Root layout
```

---

## Migration Tasks

### 1. Create Learning Route Group (`/learn/*`)

**From:** `/legacy/lms/app/(lms)/`
**To:** `/app/learn/`

Transform the route structure:
- Legacy: `/lms/courses/real-estate/learn/[lesson]`
- Target: `/learn/[competency]/[module]`

Create these files:
```
app/learn/
├── layout.tsx          # Minimal layout with LMSHeader component
├── page.tsx            # Dashboard showing competencies and progress
├── [competency]/
│   ├── page.tsx        # List modules in this competency
│   └── [module]/
│       └── page.tsx    # Module content with knowledge check link
└── quiz/
    └── [id]/
        └── page.tsx    # Quiz interface
```

**Layout requirements:**
- Use LMSHeader component (auto-hiding on scroll)
- Authenticated routes (redirect to login if not authenticated)
- Check user role is 'learner' or 'admin'

### 2. Create Admin Learning Section (`/admin/learning/*`)

**New routes for managing learning content:**

```
app/admin/learning/
├── page.tsx                # Overview: all competencies, module counts
└── [competency]/
    └── page.tsx            # Edit modules in this competency
```

**Features:**
- List all competencies with module counts
- CRUD for modules within each competency
- Markdown editor for module content
- Quiz question management per module

### 3. Create Admin Users Section (`/admin/users/*`)

**New route for learner management:**

```
app/admin/users/
└── page.tsx                # Learner account management
```

**Features:**
- List all learner accounts
- Create new learner (email, name, temporary password)
- Deactivate/reactivate learners
- View individual learner progress (link to /admin/progress)

### 4. Create Admin Progress Section (`/admin/progress/*`)

**New route for progress visibility:**

```
app/admin/progress/
└── page.tsx                # Team progress dashboard
```

**Features:**
- Table: all learners with completion %, last activity, certification status
- Click through to individual learner detail
- Filter by: certification status, completion range

### 5. Migrate Components

**Copy and adapt:**
```
/legacy/lms/components/shared/lms-header.tsx    → /components/lms-header.tsx
/legacy/lms/components/shared/lms-header.css    → /components/lms-header.css
/legacy/lms/components/shared/voice-recorder.*  → /components/voice-recorder.* (keep for future)
```

**Remove (Hub concept eliminated):**
- `back-to-hub.tsx` / `back-to-hub.css`
- `projects-grid.tsx`
- Any Hub-specific components

**Update LMSHeader:**
- Remove "Back to Hub" link
- Add "Dashboard" link to `/learn`
- Add user menu with logout

### 6. Migrate Supabase Schema

**New tables needed:**

```sql
-- Competencies (the 6 core areas)
CREATE TABLE competencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Learning modules within competencies
CREATE TABLE learning_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competency_id UUID REFERENCES competencies(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,  -- Markdown
  duration_minutes INTEGER,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(competency_id, slug)
);

-- Quiz questions per module
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES learning_modules(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,  -- [{text: "", correct: boolean}]
  explanation TEXT,
  display_order INTEGER DEFAULT 0
);

-- Learner progress
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  module_id UUID REFERENCES learning_modules(id),
  status TEXT DEFAULT 'not_started',  -- not_started, in_progress, completed
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- Quiz attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  module_id UUID REFERENCES learning_modules(id),
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB,  -- Record of answers given
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- User profiles (extends auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  role TEXT DEFAULT 'learner',  -- 'admin' or 'learner'
  certification_status TEXT DEFAULT 'in_progress',  -- in_progress, ready, certified
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. Update Configuration

**Merge into `/lib/config.ts`:**
```typescript
export const config = {
  // ... existing config
  learning: {
    quizPassThreshold: 0.8,  // 80%
    competencies: [
      'market-intelligence',
      'client-discovery', 
      'property-matching',
      'transaction-management',
      'objection-navigation',
      'relationship-stewardship'
    ]
  }
}
```

### 8. Migrate Content Files

Move learning documentation:
```
/legacy/lms/content/*.md → /docs/learning/
```

These inform module content but aren't directly displayed.

---

## Do NOT Migrate

- `/legacy/lms/app/(guest)/` — Hub routes (concept removed)
- `/legacy/lms/app/(guest)/admin/` — Replaced by unified `/admin/*`
- `/legacy/lms/app/(guest)/projects/` — Hub-specific
- `/legacy/lms/app/(guest)/login/` — Replaced by unified auth
- `back-to-hub.*` components
- `projects-grid.tsx`
- Any Hub-specific styles

---

## Verification Checklist

After migration, verify:

- [ ] `/learn` — Dashboard loads, shows competencies
- [ ] `/learn/[competency]` — Lists modules in competency
- [ ] `/learn/[competency]/[module]` — Module content displays
- [ ] `/learn/quiz/[id]` — Quiz interface works
- [ ] `/admin/learning` — Lists all competencies and modules
- [ ] `/admin/users` — Can create/list learner accounts
- [ ] `/admin/progress` — Shows team progress table
- [ ] LMSHeader — Auto-hides on scroll, no Hub references
- [ ] Auth — Learners can only access `/learn/*`, admins can access both
- [ ] Supabase — All tables created, RLS policies in place

---

## Notes

- Maintain the "quiet luxury" brand voice in any UI text
- Use existing shadcn/ui components from the repo
- Follow existing patterns in `/components/ui/` for new components
- Quiz pass threshold is 80%
- Progress updates should be real-time via Supabase
