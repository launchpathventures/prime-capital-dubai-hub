---
description: Catalyst: Capture a learning
---

Capture feedback about patterns AI agents get wrong. Appends to `.catalyst/LEARNINGS.md`.

## How It Works

1. If `$ARGUMENTS` provided, use as the learning description
2. Otherwise, ask for:
   - What went wrong? (the problem/mistake)
   - What should happen instead? (the correct pattern)
   - Category (Layout, CSS, Components, Next.js, etc.)

3. Ask for priority:
   - **high** — Causes bugs or broken UX
   - **medium** — Suboptimal but works
   - **low** — Style/convention preference
   - **tbc** — Needs validation before finalizing

4. Append to `.catalyst/LEARNINGS.md` using this format:

```markdown
### Title (YYYY-MM-DD, priority)

**Problem:** What goes wrong.

**Instead:** What to do.

---
```

5. Place under the appropriate category heading, or create a new one if needed.

## Example

User: `/learn Using raw div for layout instead of Stack`

Output added to LEARNINGS.md:
```markdown
### Use Stack/Row for multi-child layout (2026-01-14, medium)

**Problem:** Using raw `<div>` with flex classes for layout with multiple children.

**Instead:** Use `Stack` (vertical) or `Row` (horizontal) for layout primitives. They handle gap, alignment, and responsive patterns consistently.
```

## Notes

- Keep entries concise — one clear problem, one clear solution
- Link to relevant docs if helpful (e.g., "See `components/core/CORE.md`")
- High priority items should also be added to AGENTS.md "Important Callouts" section
