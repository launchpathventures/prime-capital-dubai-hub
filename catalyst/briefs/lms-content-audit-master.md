# LMS Content Audit — Master Brief

**Status:** 📋 READY  
**Priority:** Critical (blocks LMS-002 content sync)  
**Estimated Time:** 2-3 hours total (across all competencies)  
**Dependencies:** None  

---

## Objective

Audit and fix all LMS content files in `content/lms/` to ensure they're ready for the LMS-002 content sync. The agent should **fix issues directly**, not just report them.

---

## Context

The LMS-002 content sync script will parse markdown files and store them in Supabase. For this to work correctly, all files must have:

1. **Consistent frontmatter** — Required fields present with correct types
2. **Valid slugs** — Match folder/file naming conventions
3. **Correct module numbering** — Sequential within competency
4. **No broken references** — Quiz links, related modules exist
5. **Clean markdown** — Parseable without errors

---

## Execution Strategy

This audit is broken into **individual competency briefs** for parallel execution:

| Brief | Competency | Modules | Quizzes |
|-------|------------|---------|---------|
| [content-audit-c0.md](lms-content-audit-c0.md) | 0-foundations | 5 | 2 |
| [content-audit-c1.md](lms-content-audit-c1.md) | 1-market-intelligence | 10 | 4 |
| [content-audit-c2.md](lms-content-audit-c2.md) | 2-client-discovery | 7 | 2 |
| [content-audit-c3.md](lms-content-audit-c3.md) | 3-sales-mastery | 8 | 3 |
| [content-audit-c4.md](lms-content-audit-c4.md) | 4-property-matching | 7 | 2 |
| [content-audit-c5.md](lms-content-audit-c5.md) | 5-transaction-management | 12 | 0 |
| [content-audit-c6.md](lms-content-audit-c6.md) | 6-objection-navigation | 7 | 3 |
| [content-audit-c7.md](lms-content-audit-c7.md) | 7-relationship-stewardship | 4 | 1 |
| [content-audit-c8.md](lms-content-audit-c8.md) | 8-rera-exam-prep | 8 + quizzes | 6 (in folder) |
| [content-audit-quizzes.md](lms-content-audit-quizzes.md) | quizzes/ folder | — | 17 |
| [content-audit-scenarios.md](lms-content-audit-scenarios.md) | scenarios/ folder | 6 | — |

---

## Required Frontmatter Schema

### Competency Index (`_index.md`)

```yaml
---
title: "Competency Name"                    # Required
slug: "competency-slug"                     # Required: lowercase, hyphens
competencyNumber: 1                         # Required: integer 0-8
description: "Brief description..."         # Required
estimatedDuration: "4-5 hours"              # Required: string
moduleCount: 10                             # Required: integer
learningObjectives:                         # Optional but recommended
  - "Objective 1..."
  - "Objective 2..."
prerequisites: []                           # Optional: array of slugs
aiCoach:                                    # Optional
  persona: "Expert Type"
  focusAreas: ["area1", "area2"]
createdAt: "2026-01-07"                     # Optional
updatedAt: "2026-01-07"                     # Optional
---
```

### Module Files (`X.Y-module-name.md`)

```yaml
---
title: "Module Title"                       # Required
slug: "module-slug"                         # Required: matches filename
moduleNumber: "1.2"                         # Required: "X.Y" format
competency: "competency-slug"               # Required: parent competency
competencyNumber: 1                         # Required: integer
type: "knowledge"                           # Required: knowledge | skills | skills-script
description: "Brief description..."         # Required
estimatedDuration: "25 minutes"             # Required: string with unit
order: 2                                    # Required: display order (1-based)
learningObjectives:                         # Optional but recommended
  - "Objective 1..."
aiCoach:                                    # Optional
  enabled: true
  personality: "mentor-type"
  coachingPoints: ["point1", "point2"]
quiz: "quiz-slug"                           # Optional: linked quiz
resources: []                               # Optional
videos: []                                  # Optional
createdAt: "2026-01-07"                     # Optional
updatedAt: "2026-01-07"                     # Optional
---
```

### Quiz Files (`competency-N.md`)

```yaml
---
title: "Quiz Title"                         # Required
slug: "quiz-slug"                           # Required: matches filename
quizNumber: 1                               # Required: integer
competency: "competency-slug"               # Required
relatedModule: "X.Y-module-slug"            # Required: linked module
description: "Brief description..."         # Required
passingScore: 80                            # Required: integer 0-100
questionCount: 5                            # Required: integer
estimatedDuration: "10 minutes"             # Required
createdAt: "2026-01-07"                     # Optional
updatedAt: "2026-01-07"                     # Optional
---
```

---

## Validation Rules

### 1. Slug Consistency
- Competency slug must match folder name (e.g., `0-foundations` → slug: `foundations`)
- Module slug must match filename without number prefix (e.g., `0.1-company-orientation.md` → slug: `company-orientation`)
- Quiz slug must match filename (e.g., `market-intelligence-1.md` → slug: `market-intelligence-1`)

### 2. Module Numbering
- Must follow `X.Y` format where X = competency number, Y = module order
- Must be sequential (no gaps like 1.1, 1.2, 1.5)
- `order` field must match Y value

### 3. Required Field Types
- `competencyNumber`, `moduleCount`, `questionCount`, `passingScore`, `order` = integers
- `estimatedDuration` = string with unit ("25 minutes", "4-5 hours")
- `type` = one of: `knowledge`, `skills`, `skills-script`
- `slug` = lowercase with hyphens, no spaces

### 4. Cross-References
- `relatedModule` in quizzes must reference existing module
- `quiz` in modules must reference existing quiz file
- `prerequisites` must reference existing competency slugs

---

## Fix Actions

When an issue is found, **fix it directly**. Do not just report.

| Issue | Fix Action |
|-------|------------|
| Missing required field | Add with sensible default |
| Wrong type (string vs int) | Convert to correct type |
| Slug mismatch | Update slug to match filename |
| Missing `competency` field | Derive from folder name |
| Missing `moduleNumber` | Derive from filename |
| Invalid `type` | Default to `knowledge` |
| Broken quiz reference | Remove reference or create quiz |

---

## Output Format

Each competency brief will produce a **FIXES.md** file listing all changes made:

```markdown
# Content Audit Fixes — Competency X

## Summary
- Files audited: N
- Issues fixed: N
- No action needed: N

## Fixes Applied

### File: `X.Y-module-name.md`
| Field | Before | After | Reason |
|-------|--------|-------|--------|
| slug | "Module Name" | "module-name" | Slug must be lowercase with hyphens |

### File: `_index.md`
| Field | Before | After | Reason |
|-------|--------|-------|--------|
| competencyNumber | (missing) | 1 | Required field |
```

---

## Success Criteria

After all audits complete:

- [ ] All `_index.md` files have required frontmatter
- [ ] All module files have required frontmatter
- [ ] All quiz files have required frontmatter
- [ ] All slugs match filename conventions
- [ ] All module numbers are sequential
- [ ] All cross-references are valid
- [ ] No TypeScript/parsing errors when running sync script

---

## Running the Audits

Each competency brief can be run independently and in parallel:

```
Parallel execution:
├── Agent 1: content-audit-c0.md (Foundations)
├── Agent 2: content-audit-c1.md (Market Intelligence)
├── Agent 3: content-audit-c2.md (Client Discovery)
└── ... etc
```

After all audits complete, run LMS-002 content sync to verify.
