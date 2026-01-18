---
description: Catalyst: Create brief (PRD)
argument-hint: [feature-name]
---

Create a new Brief (PRD) following Catalyst conventions.

@.catalyst/prompts/loop-1-brief.md
@.catalyst/BRIEFS.md

## Repo Context

- Check `@catalyst/project-state.md` for current stage
- Check existing briefs in `/catalyst/briefs/` for context

## Process

1. **Gather Requirements**
   - If `$ARGUMENTS` provided, use as the feature/phase name
   - Ask clarifying questions about scope, users, and success criteria
   - Understand which phase this brief is for (POC/MVP/MMP/PROD)

2. **Draft the Brief**
   - Follow the required structure from BRIEFS.md
   - Include YAML frontmatter with title, assignee, stage, tags
   - Be specific about in-scope and out-of-scope
   - Include acceptance checklist

3. **Save the Brief**
   - Use naming convention: `backlog-YYYYMMDD_{brief-name}.md`
   - Save to `/catalyst/briefs/`
   - Include the required callout linking to AGENTS.md and BRIEFS.md

Keep requirements implementable without guessing. Another AI should be able to build from this brief without re-reading the conversation.
