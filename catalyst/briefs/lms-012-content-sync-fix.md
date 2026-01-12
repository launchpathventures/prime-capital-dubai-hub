# LMS-012: Content Sync Fix

**Status:** 📋 READY  
**Priority:** Critical (data layer broken)  
**Estimated Time:** 2-3 hours  
**Dependencies:** None  

---

## Problem Statement

The Supabase database has **incomplete and mismatched LMS content**:

| Issue | Current State | Expected |
|-------|---------------|----------|
| Competencies | 7 with wrong slugs | 9 matching folder structure |
| Modules | 10 (brief descriptions only) | 66+ with full markdown content |
| Quizzes | 0 rows | 21 quizzes parsed into questions |
| Scenarios | No table | 7 scenario files with 50+ scenarios |
| Quiz questions | 0 rows | ~100 questions across all quizzes |

### Content Inventory (Local Files)

```
content/lms/
├── 0-foundations/           # 5 modules
├── 1-market-intelligence/   # 10 modules
├── 2-client-discovery/      # 7 modules
├── 3-sales-mastery/         # 8 modules
├── 4-property-matching/     # 7 modules
├── 5-transaction-management/# 12 modules
├── 6-objection-navigation/  # 7 modules
├── 7-relationship-stewardship/# 4 modules
├── 8-rera-exam-prep/        # 8 modules + 6 quizzes
├── quizzes/                 # 21 quiz files
└── scenarios/               # 7 scenario files
```

---

## Deliverables

### 1. Database Schema Updates

**Alter `competencies` table:**
```sql
ALTER TABLE competencies 
  ADD COLUMN IF NOT EXISTS content TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB;
```

**Alter `learning_modules` table:**
```sql
ALTER TABLE learning_modules 
  ADD COLUMN IF NOT EXISTS module_number TEXT,
  ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'knowledge',
  ADD COLUMN IF NOT EXISTS frontmatter JSONB;
-- Expand 'content' to store full markdown (already TEXT)
```

**Create `quizzes` table:**
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  competency_slug TEXT NOT NULL,
  related_module TEXT,
  title TEXT NOT NULL,
  description TEXT,
  passing_score INT DEFAULT 80,
  question_count INT,
  estimated_duration TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Alter `quiz_questions` table:**
```sql
ALTER TABLE quiz_questions
  ADD COLUMN IF NOT EXISTS quiz_slug TEXT,
  DROP COLUMN IF EXISTS module_id;
-- Change to reference quiz by slug, not module
```

**Create `scenarios` table:**
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  competencies TEXT[],
  difficulty TEXT,
  estimated_duration TEXT,
  scenario_count INT,
  frontmatter JSONB,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 2. Sync Script (`scripts/sync-lms-content.ts`)

A TypeScript script that:

1. **Parses markdown files** using `gray-matter`
2. **Syncs competencies** from `{n}-{slug}/_index.md` files
3. **Syncs modules** from `{n}.{m}-{slug}.md` files
4. **Syncs quizzes** from `quizzes/*.md` files
5. **Parses quiz questions** from markdown into structured JSON
6. **Syncs scenarios** from `scenarios/*.md` files

**Key Features:**
- Upserts (insert or update on conflict)
- Preserves all frontmatter as JSONB
- Stores full markdown content after frontmatter
- Maps module_number for ordering (e.g., "1.2" → display_order: 2)
- Handles competency slug mapping (folder name → slug)

### 3. Quiz Question Parser

Parse markdown quiz format:
```markdown
### Question 1
**What was the total value...**
- [ ] A) AED 227 billion
- [x] B) AED 427 billion
- [ ] C) AED 627 billion
**Explanation**: ...
```

Into structured JSON:
```json
{
  "question": "What was the total value...",
  "options": [
    { "text": "AED 227 billion", "correct": false },
    { "text": "AED 427 billion", "correct": true },
    { "text": "AED 627 billion", "correct": false }
  ],
  "explanation": "..."
}
```

---

## Implementation Plan

### Phase 1: Schema Migration (15 min)
- [ ] Create migration file
- [ ] Add new columns to existing tables
- [ ] Create `quizzes` and `scenarios` tables
- [ ] Apply migration

### Phase 2: Sync Script (1.5 hours)
- [ ] Set up script structure with gray-matter
- [ ] Implement competency sync
- [ ] Implement module sync
- [ ] Implement quiz metadata sync
- [ ] Implement quiz question parser
- [ ] Implement scenario sync
- [ ] Add CLI runner with progress output

### Phase 3: Execute & Verify (30 min)
- [ ] Clear existing stale data
- [ ] Run sync script
- [ ] Verify counts match local files
- [ ] Spot-check content integrity

---

## Competency Mapping

| Folder | Expected Slug | Current DB Slug |
|--------|---------------|-----------------|
| `0-foundations` | `foundations` | `prime-capital-identity` ❌ |
| `1-market-intelligence` | `market-intelligence` | `market-intelligence` ✓ |
| `2-client-discovery` | `client-discovery` | `client-discovery` ✓ |
| `3-sales-mastery` | `sales-mastery` | — (missing) |
| `4-property-matching` | `property-matching` | `property-matching` ✓ |
| `5-transaction-management` | `transaction-management` | `transaction-excellence` ❌ |
| `6-objection-navigation` | `objection-navigation` | `objection-navigation` ✓ |
| `7-relationship-stewardship` | `relationship-stewardship` | `relationship-building` ❌ |
| `8-rera-exam-prep` | `rera-exam-prep` | — (missing) |

---

## Success Criteria

- [ ] 9 competencies with correct slugs
- [ ] 66+ modules with full markdown content
- [ ] 21+ quizzes with metadata
- [ ] 100+ quiz questions parsed from markdown
- [ ] 7 scenario files synced
- [ ] All frontmatter preserved as JSONB
- [ ] Display order matches file numbering

---

## Files to Create/Modify

| File | Action |
|------|--------|
| `supabase/migrations/YYYYMMDD_lms_schema_update.sql` | Create |
| `scripts/sync-lms-content.ts` | Update (exists, needs rewrite) |
| `package.json` | Add sync script command |

---

## Questions Before Proceeding

1. **Delete existing data?** Should the sync script truncate existing competencies/modules, or preserve any existing data and only upsert?

2. **Audio transcripts?** The brief mentions `.audio.md` files for TTS. I don't see these in the current folder structure — should we skip the `audio_transcripts` table for now?

3. **Quiz linking:** Quizzes reference modules by `relatedModule` slug (e.g., "1.1-dubai-overview"). Should we enforce a foreign key or keep it as text for flexibility?

---

## Notes

- Existing `scripts/sync-lms-content.ts` file exists but appears incomplete
- The `gray-matter` package is already available
- Service role key needed for upserts (bypasses RLS)
