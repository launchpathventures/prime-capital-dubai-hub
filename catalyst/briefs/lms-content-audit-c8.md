# LMS Content Audit — Competency 8: RERA Exam Prep

**Status:** 📋 READY  
**Priority:** Critical  
**Estimated Time:** 25-30 minutes  
**Parent Brief:** [lms-content-audit-master.md](lms-content-audit-master.md)  

---

## Scope

Audit and fix all content files in `content/lms/8-rera-exam-prep/`:

| File | Type |
|------|------|
| `_index.md` | Competency Index |
| `8.1-exam-overview.md` | Module |
| `8.2-regulatory-framework.md` | Module |
| `8.3-licensing-requirements.md` | Module |
| `8.4-code-of-ethics.md` | Module |
| `8.5-escrow-accounts.md` | Module |
| `8.6-contract-law.md` | Module |
| `8.7-exam-strategies.md` | Module |
| `8.8-practice-tests.md` | Module |

**Special:** This folder also contains embedded quizzes:
| `rera-quiz-1.md` | Quiz |
| `rera-quiz-2.md` | Quiz |
| `rera-quiz-3.md` | Quiz |
| `rera-quiz-4.md` | Quiz |
| `rera-quiz-5.md` | Quiz |
| `rera-quiz-6.md` | Quiz |

---

## Instructions

### Step 1: Read All Files

```bash
# Modules
content/lms/8-rera-exam-prep/_index.md
content/lms/8-rera-exam-prep/8.1-exam-overview.md
content/lms/8-rera-exam-prep/8.2-regulatory-framework.md
content/lms/8-rera-exam-prep/8.3-licensing-requirements.md
content/lms/8-rera-exam-prep/8.4-code-of-ethics.md
content/lms/8-rera-exam-prep/8.5-escrow-accounts.md
content/lms/8-rera-exam-prep/8.6-contract-law.md
content/lms/8-rera-exam-prep/8.7-exam-strategies.md
content/lms/8-rera-exam-prep/8.8-practice-tests.md

# Embedded Quizzes
content/lms/8-rera-exam-prep/rera-quiz-1.md
content/lms/8-rera-exam-prep/rera-quiz-2.md
content/lms/8-rera-exam-prep/rera-quiz-3.md
content/lms/8-rera-exam-prep/rera-quiz-4.md
content/lms/8-rera-exam-prep/rera-quiz-5.md
content/lms/8-rera-exam-prep/rera-quiz-6.md
```

### Step 2: Validate Competency Index

```yaml
---
title: "RERA Exam Prep"         # Required
slug: "rera-exam-prep"          # Required
competencyNumber: 8             # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
moduleCount: 8                  # Required: modules only, not quizzes
---
```

### Step 3: Validate Each Module

```yaml
---
title: "..."                    # Required
slug: "..."                     # Required
moduleNumber: "8.1"             # Required
competency: "rera-exam-prep"    # Required
competencyNumber: 8             # Required
type: "knowledge"               # Required
description: "..."              # Required
estimatedDuration: "..."        # Required
order: 1                        # Required: 1-8
---
```

### Step 4: Validate Embedded Quizzes

The RERA quizzes are **embedded in the competency folder** rather than in `content/lms/quizzes/`. Validate them with quiz schema:

```yaml
---
title: "RERA Quiz 1"            # Required
slug: "rera-quiz-1"             # Required
quizNumber: 1                   # Required
competency: "rera-exam-prep"    # Required
relatedModule: "8.1-exam-overview" # Required
description: "..."              # Required
passingScore: 80                # Required
questionCount: 10               # Required
estimatedDuration: "15 minutes" # Required
---
```

### Step 5: Fix Issues

Apply standard fixes per master brief.

### Step 6: Record Fixes

Update `content/lms/8-rera-exam-prep/AUDIT.md`.

---

## Success Criteria

- [ ] `_index.md` has all required fields
- [ ] All 8 module files have all required fields
- [ ] All 6 embedded quiz files have all required fields
- [ ] `moduleCount: 8` is accurate (excludes quizzes)
- [ ] Module numbers sequential: 8.1 through 8.8
- [ ] Order values sequential: 1 through 8
- [ ] Quiz numbers sequential: 1 through 6
- [ ] All slugs match filenames
- [ ] All quiz `relatedModule` references are valid
- [ ] AUDIT.md updated

---

## Notes

- This competency has embedded quizzes, unlike others
- RERA quizzes test regulatory knowledge, so `passingScore` may be higher (85-90%)
- Verify quiz `relatedModule` maps correctly to module files
