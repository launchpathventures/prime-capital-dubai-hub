---
description: Create a reusable skill
argument-hint: [skill-name or description]
---

Create a detailed skill document for the specified pattern.

## Arguments

If `$ARGUMENTS` provided, use as skill name/description.
Otherwise, ask what pattern to capture.

## Skill Template

```markdown
# [Skill Name]

> [One-line description]

## When to Use

- [Scenario 1]
- [Scenario 2]
- [Scenario 3]

## Prerequisites

- [ ] [Requirement 1]
- [ ] [Requirement 2]

## Steps

### 1. [First Step]

[Explanation]

\`\`\`[language]
[Code or commands]
\`\`\`

### 2. [Second Step]

[Explanation]

\`\`\`[language]
[Code]
\`\`\`

## Complete Example

\`\`\`[language]
[Full working example]
\`\`\`

## Verification

- [ ] [How to confirm it worked]
- [ ] [What to check]

## Troubleshooting

### [Common Issue]
**Problem:** [What happens]
**Fix:** [How to resolve]

## Related Skills

- [Related skill if any]

---
*Created: [Date]*
*Source: [Project name]*
*Client: public*
```

## Save Location

Save to: `/Users/thg/code/launchpath-skills/proposed/[skill-name].md`

Use kebab-case: `supabase-auth.md`, `nextjs-api-routes.md`

## Confirm

```
✅ Skill created: [name]
📁 Saved to: /Users/thg/code/launchpath-skills/proposed/[filename].md
```
