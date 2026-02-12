---
description: Scan for reusable skill patterns
argument-hint:
---

Analyze this repository for repeatable patterns that could become reusable skills.

## Process

### 1. Gather Context

```bash
git log --oneline -15
git diff --name-only HEAD~10
```

Review project structure, recent changes, and repeated patterns.

### 2. Pattern Types to Find

- **Setup patterns**: Project init, config, environment
- **Code patterns**: Repeated components, API routes, hooks
- **Auth patterns**: Login flows, session handling, RLS
- **Database patterns**: Schema patterns, queries, migrations
- **Deployment patterns**: Build, deploy, CI/CD

### 3. Output Format

```
## 🔍 Skills Scan Results

### Detected Patterns:

**1. [Pattern Name]**
- What: [Description]
- Files: [Where seen]
- Reuse potential: High/Medium/Low

**2. [Pattern Name]**
- What: [Description]
- Files: [Where seen]
- Reuse potential: High/Medium/Low

### Recommendations:
[Which patterns are worth extracting]

---
Reply with a number to create that skill.
```

### 4. When User Selects

Create skill file using `/skill` command format and save to:
`/Users/thg/code/launchpath-skills/proposed/[skill-name].md`
