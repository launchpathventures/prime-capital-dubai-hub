# Content Audit — Scenarios Folder

**Last Audited:** 2026-01-10  
**Audited By:** GitHub Copilot Agent

## Summary

- Files audited: 6
- Issues fixed: 6 (added frontmatter to all files)
- Status: ✅ PASS

## Scenario Mapping

| Scenario | Competencies | Status |
|----------|--------------|--------|
| first-contact | client-discovery, relationship-stewardship | ✅ |
| discovery | client-discovery, market-intelligence, property-matching | ✅ |
| presentation | property-matching, market-intelligence, transaction-management | ✅ |
| objections | objection-navigation, market-intelligence | ✅ |
| closing | transaction-management, objection-navigation, relationship-stewardship | ✅ |
| difficult-situations | relationship-stewardship, transaction-management | ✅ |

## Fixes Applied

### All Scenario Files

Added YAML frontmatter with required schema fields:

| Field | Description | Added |
|-------|-------------|-------|
| `title` | Scenario category title | ✅ All files |
| `slug` | URL-friendly identifier matching filename | ✅ All files |
| `type` | Set to `"scenario"` | ✅ All files |
| `description` | Brief category description | ✅ All files |
| `competencies` | Array of related competency slugs | ✅ All files |
| `difficulty` | Set to `"mixed"` (category contains multiple difficulty levels) | ✅ All files |
| `estimatedDuration` | Estimated time to complete all scenarios | ✅ All files |
| `objectives` | Array of learning objectives | ✅ All files |
| `scenarioCount` | Number of scenarios in category | ✅ All files |
| `createdAt` | Creation date | ✅ All files |
| `updatedAt` | Last update date | ✅ All files |

### File-Specific Details

#### first-contact.md
- **Scenarios:** 10 (FC-01 to FC-10)
- **Difficulty Range:** ⭐ to ⭐⭐⭐
- **Competencies:** client-discovery, relationship-stewardship

#### discovery.md
- **Scenarios:** 15 (DS-01 to DS-15)
- **Difficulty Range:** ⭐ to ⭐⭐⭐
- **Competencies:** client-discovery, market-intelligence, property-matching

#### presentation.md
- **Scenarios:** 10 (PR-01 to PR-10)
- **Difficulty Range:** ⭐ to ⭐⭐⭐
- **Competencies:** property-matching, market-intelligence, transaction-management

#### objections.md
- **Scenarios:** 20 (OB-01 to OB-20)
- **Difficulty Range:** ⭐ to ⭐⭐⭐
- **Competencies:** objection-navigation, market-intelligence

#### closing.md
- **Scenarios:** 10 (CL-01 to CL-10)
- **Difficulty Range:** ⭐ to ⭐⭐⭐
- **Competencies:** transaction-management, objection-navigation, relationship-stewardship

#### difficult-situations.md
- **Scenarios:** 10 (DS-01 to DS-10)
- **Difficulty Range:** ⭐⭐ to ⭐⭐⭐
- **Competencies:** relationship-stewardship, transaction-management

## Notes

- The audit brief referenced different filenames than what exists in the repository. The actual files are category-based scenario collections rather than individual scenario files.
- Each file contains multiple individual scenarios with their own difficulty ratings (⭐, ⭐⭐, ⭐⭐⭐)
- Competency slugs validated against existing competency folder names in `content/lms/`
- The `_index.md` file serves as the scenario bank overview and was not modified (it doesn't require frontmatter changes)
- Total scenario count across all files: **75 scenarios**

## Valid Competency Slugs

The following competency slugs are used and validated:

- `market-intelligence`
- `client-discovery`
- `property-matching`
- `transaction-management`
- `objection-navigation`
- `relationship-stewardship`
