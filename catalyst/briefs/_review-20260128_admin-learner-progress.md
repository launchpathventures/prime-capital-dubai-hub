# Admin Learner Progress Dashboard

**Phase:** MVP  
**Priority:** High  
**Estimated Effort:** Medium (2-3 days)

---

## 1. Summary

Build a real-data admin dashboard that provides founders/admins with clear visibility into individual learner progress across the LMS. Currently, the admin progress pages display mock data, making it impossible to track actual learner advancement.

**Primary Users:** Founders, Admins  
**Core Outcome:** Admins can quickly assess learner readiness and identify those needing support without manual check-ins.

---

## 2. Objectives & Success Criteria

### Objective 1: Real-Time Learner Overview
**Success Criteria:**
- Admin sees a list of all learners with real data from database
- Each learner shows: name, email, overall progress %, last activity date, certification status
- List is sortable by progress, last activity, and name
- "At risk" learners (inactive >7 days with <100% progress) are visually flagged

### Objective 2: Detailed Individual Progress View
**Success Criteria:**
- Clicking a learner opens a detailed progress view
- View shows quiz scores for each module (score, max score, pass/fail, attempt count)
- View shows scenario completion status (completed/not started, reflections submitted)
- View shows module completion by competency (visual progress per competency)
- All data pulled from real database tables

### Objective 3: Quick Assessment of Team Readiness
**Success Criteria:**
- Summary stats show: total learners, certified count, ready for certification count, at-risk count
- Admin can identify who is ready for certification session at a glance
- No more reliance on mock/dummy data

---

## 3. Users, Roles & Permissions

### Admin / Founder
- **Goals:** Monitor team learning progress, identify readiness for certification, spot struggling learners
- **Must be able to:**
  - View all learners and their progress
  - See detailed breakdown for any individual learner
  - Filter/sort learners by various criteria
- **Not required for this phase:**
  - Edit learner progress
  - Reset quiz attempts
  - Send messages to learners

### Learner
- **Not affected by this work** — this is admin-only functionality
- Learners cannot see other learners' progress

---

## 4. Scope Definition

### In Scope (Must Deliver)

**Data Layer:**
- Database query functions to aggregate learner progress
- Query for quiz attempts by user (grouped by module/competency)
- Query for scenario completion by user
- Query for module progress by user
- RPC or server function for admin to fetch all learners with progress summary

**Admin Progress List Page:**
- Replace mock data with real database queries
- Learner cards showing: name, email, overall %, last activity, certification status, trend indicator
- Sort controls (by progress, last activity, name)
- Visual indicator for "at risk" learners
- Summary stat cards with real counts

**Learner Detail View:**
- New page or modal: `/admin/progress/[userId]`
- Competency breakdown with progress bars
- Quiz results table: module name, score, max score, passed, attempts, last attempt date
- Scenario completion table: scenario name, status, reflection submitted, completion date
- Back navigation to list

### Out of Scope (Must NOT Deliver)

- Editing or resetting learner progress
- Exporting progress reports to CSV/PDF
- Email notifications to learners
- Comparison views (learner vs learner)
- Historical progress charts/trends over time
- Learner messaging or nudges
- Bulk actions on learners

---

## 5. Requirements

### Data Requirements

**Learner Summary Query:**
```
For each user with role='learner':
- Full name, email
- Certification status (from user_profiles)
- Overall progress % (completed modules / total modules)
- Last activity date (most recent of: quiz attempt, module completion, scenario completion)
- Quiz pass rate (passed quizzes / total attempted)
```

**Quiz Details Query (per user):**
```
For each quiz_attempt by user:
- Quiz/module name
- Score and max_score
- Passed (boolean)
- Attempt date
- Group by module, show best score and attempt count
```

**Scenario Details Query (per user):**
```
For each scenario in scenarios table:
- Scenario title
- Whether user has entry in scenario_progress
- Reflection text (if completed)
- Completion date
```

**Module Progress Query (per user):**
```
For each competency:
- Competency name
- Modules in competency
- User's completion status per module
- Calculate % complete per competency
```

### UI Requirements

**Progress List Page:**
- Page header with title and description
- 4 summary stat cards: Average Progress, Ready for Certification, Certified, At Risk
- Search/filter input (by name)
- Sortable learner list
- Learner cards with: Avatar, name, email, progress bar, last active, certification badge, trend arrow
- Click card → navigate to detail view
- Empty state if no learners

**Learner Detail Page:**
- Back button to list
- Header: learner name, email, avatar, certification status badge
- Overall progress summary
- Competency progress section: grid of competency cards with progress bars
- Quiz results section: table with sortable columns
- Scenario progress section: table showing completion status
- Empty states for sections with no data

### Technical Requirements

- Use existing Supabase client patterns
- Admin-only access (check role in page/layout)
- Server components for data fetching
- Revalidation on navigation (no stale data)
- Follow existing component patterns (Card, Table, Badge, Progress, Avatar)

---

## 6. Acceptance Criteria

### Progress List Page
- [ ] Page loads with real data from database (no mock data)
- [ ] Summary stats reflect actual counts from database
- [ ] All learners with role='learner' appear in list
- [ ] Each learner shows correct: name, email, progress %, last activity
- [ ] Learners can be sorted by progress (ascending/descending)
- [ ] Learners can be sorted by last activity
- [ ] "At risk" learners (inactive >7 days, progress <100%) show warning indicator
- [ ] Clicking a learner navigates to detail view
- [ ] Page is admin-only (non-admins redirected or see 403)

### Learner Detail Page
- [ ] Shows correct learner info in header
- [ ] Competency section shows all 9 competencies with accurate progress %
- [ ] Quiz section shows all quiz attempts for this user
- [ ] Quiz table shows: module name, best score, attempts count, pass/fail, last attempt date
- [ ] Scenario section shows all scenarios with completion status
- [ ] Completed scenarios show reflection submitted indicator
- [ ] Back button returns to progress list
- [ ] Page handles learner with no progress gracefully (empty states)

### Data Accuracy
- [ ] Progress % matches: (completed modules / total modules) × 100
- [ ] Quiz scores match data in quiz_attempts table
- [ ] Scenario completion matches data in scenario_progress table
- [ ] Last activity is most recent timestamp across all activity tables

---

## 7. Technical Notes

### Relevant Database Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `user_profiles` | User info | id, full_name, role, certification_status |
| `learning_progress` | Module completion | user_id, module_id, status, completed_at |
| `quiz_attempts` | Quiz scores | user_id, quiz_slug, score, max_score, passed, attempted_at |
| `scenario_progress` | Scenario completion | user_id, scenario_id, reflection_*, completed_at |
| `competencies` | Competency list | slug, name, display_order |
| `learning_modules` | Module list | id, competency_id, slug, title |

### Existing Code to Reference

| File | Why |
|------|-----|
| `app/learn/admin/users/page.tsx` | Has working Supabase integration for user management |
| `app/(admin)/admin/progress/page.tsx` | Current mock implementation to replace |
| `lib/supabase/server.ts` | Server client creation |
| `lib/auth/require-auth.ts` | Admin requirement pattern |

### Suggested File Structure

```
app/(admin)/admin/progress/
├── page.tsx              # List view (refactor)
├── [userId]/
│   └── page.tsx          # Detail view (new)
└── _components/
    ├── learner-card.tsx      # Learner summary card
    ├── competency-grid.tsx   # Competency progress display
    ├── quiz-results.tsx      # Quiz attempts table
    └── scenario-status.tsx   # Scenario completion table

lib/lms/
├── admin-queries.ts      # New: admin-specific data queries
```

---

## 8. Dependencies

- Supabase tables exist and have data ✅
- User authentication and admin role check working ✅
- Core UI components available ✅

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Large number of learners could slow page | Implement pagination if >50 learners |
| Quiz data structure varies by module | Normalize query to handle missing fields |
| No scenario progress data yet | Show empty state, system will populate as users complete |

---

*Created: 2026-01-28*
