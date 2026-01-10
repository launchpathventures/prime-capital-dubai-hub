# LMS Content Audit — Quizzes Folder

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 25-30 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all quiz files in `content/lms/quizzes/`:

| File | Competency |
|------|------------|
| `foundations-1.md` | 0-foundations |
| `foundations-2.md` | 0-foundations |
| `market-intelligence-1.md` | 1-market-intelligence |
| `market-intelligence-2.md` | 1-market-intelligence |
| `market-intelligence-3.md` | 1-market-intelligence |
| `market-intelligence-4.md` | 1-market-intelligence |
| `client-discovery-1.md` | 2-client-discovery |
| `client-discovery-2.md` | 2-client-discovery |
| `sales-mastery-1.md` | 3-sales-mastery |
| `sales-mastery-2.md` | 3-sales-mastery |
| `sales-mastery-3.md` | 3-sales-mastery |
| `property-matching-1.md` | 4-property-matching |
| `property-matching-2.md` | 4-property-matching |
| `objection-navigation-1.md` | 6-objection-navigation |
| `objection-navigation-2.md` | 6-objection-navigation |
| `objection-navigation-3.md` | 6-objection-navigation |
| `relationship-stewardship-1.md` | 7-relationship-stewardship |

**Note:** Competency 5 (Transaction Management) has no quizzes. Competency 8 (RERA) has embedded quizzes.

---

## Instructions

### Step 1: Read All Quiz Files

```bash
content/lms/quizzes/foundations-1.md
content/lms/quizzes/foundations-2.md
content/lms/quizzes/market-intelligence-1.md
content/lms/quizzes/market-intelligence-2.md
content/lms/quizzes/market-intelligence-3.md
content/lms/quizzes/market-intelligence-4.md
content/lms/quizzes/client-discovery-1.md
content/lms/quizzes/client-discovery-2.md
content/lms/quizzes/sales-mastery-1.md
content/lms/quizzes/sales-mastery-2.md
content/lms/quizzes/sales-mastery-3.md
content/lms/quizzes/property-matching-1.md
content/lms/quizzes/property-matching-2.md
content/lms/quizzes/objection-navigation-1.md
content/lms/quizzes/objection-navigation-2.md
content/lms/quizzes/objection-navigation-3.md
content/lms/quizzes/relationship-stewardship-1.md
```

### Step 2: Validate Each Quiz

Required frontmatter for quizzes:

```yaml
---
title: "Quiz Title"                     # Required
slug: "competency-N"                    # Required: must match filename
quizNumber: 1                           # Required: integer
competency: "competency-slug"           # Required: parent competency
relatedModule: "X.Y-module-slug"        # Required: linked module
description: "Brief description..."     # Required
passingScore: 80                        # Required: integer 0-100
questionCount: 5                        # Required: integer
estimatedDuration: "10 minutes"         # Required: string with unit
createdAt: "2026-01-07"                 # Optional
updatedAt: "2026-01-07"                 # Optional
---
```

### Step 3: Validate Cross-References

For each quiz, verify:

1. **`competency`** matches an existing competency slug
2. **`relatedModule`** references an existing module file

| Quiz | Expected Competency | Valid Modules |
|------|---------------------|---------------|
| `foundations-1.md` | `foundations` | 0.1 - 0.5 |
| `market-intelligence-1.md` | `market-intelligence` | 1.1 - 1.10 |
| `client-discovery-1.md` | `client-discovery` | 2.1 - 2.7 |
| `sales-mastery-1.md` | `sales-mastery` | 3.1 - 3.8 |
| `property-matching-1.md` | `property-matching` | 4.1 - 4.7 |
| `objection-navigation-1.md` | `objection-navigation` | 6.1 - 6.7 |
| `relationship-stewardship-1.md` | `relationship-stewardship` | 7.1 - 7.4 |

### Step 4: Fix Issues

| Issue | Action |
|-------|--------|
| Missing `quizNumber` | Derive from filename |
| Missing `competency` | Derive from filename prefix |
| Invalid `relatedModule` | Find nearest module or remove |
| Missing `passingScore` | Default to `80` |
| Missing `questionCount` | Count questions in content |
| Missing `description` | Add from first paragraph |

### Step 5: Record Fixes

Create `content/lms/quizzes/AUDIT.md`:

```markdown
# Content Audit — Quizzes Folder

**Last Audited:** [DATE]
**Audited By:** GitHub Copilot Agent

## Summary
- Files audited: 17
- Issues fixed: X
- Status: ✅ PASS / ⚠️ NEEDS REVIEW

## Quiz Coverage
| Competency | Quizzes | Status |
|------------|---------|--------|
| 0-foundations | 2 | ✅ |
| 1-market-intelligence | 4 | ✅ |
| 2-client-discovery | 2 | ✅ |
| 3-sales-mastery | 3 | ✅ |
| 4-property-matching | 2 | ✅ |
| 5-transaction-management | 0 | ⚠️ Missing |
| 6-objection-navigation | 3 | ✅ |
| 7-relationship-stewardship | 1 | ✅ |
| 8-rera-exam-prep | (embedded) | ✅ |

## Fixes Applied
[Document each fix]

## Cross-Reference Validation
[List any broken relatedModule references]
```

---

## Success Criteria

- [ ] All 17 quiz files have all required fields
- [ ] All `competency` values reference valid competencies
- [ ] All `relatedModule` values reference valid modules
- [ ] All slugs match filenames
- [ ] Quiz numbers are sequential within each competency
- [ ] AUDIT.md created with results
