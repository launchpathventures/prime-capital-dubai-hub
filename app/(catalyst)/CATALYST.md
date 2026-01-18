# Catalyst Surface

The Catalyst surface (`/catalyst`) provides a dashboard for viewing project status and briefs.

## Routes

| Route | Purpose |
|-------|---------|
| `/catalyst` | Overview page with version, specs status, and quick stats |
| `/catalyst/briefs` | Briefs dashboard showing all project briefs |

## Features

### Overview Page

- Quick stats on active/total briefs
- Project specs status (vision, architecture, voice, requirements)
- Quick links to key resources

### Briefs Dashboard

- Lists all briefs from `/catalyst/briefs/`
- Shows state, title, assignee, stage, and date
- Links to view briefs in GitHub (if configured)
- Tags summary
- Convention help

## Shell

The Catalyst shell (`catalyst-shell.tsx`) is a minimal header-only layout with:

- "Catalyst" title
- Navigation links (Overview, Briefs)
- Theme toggle and surface switcher

No sidebar is needed — the content is simple enough for header-only navigation.

## Route Protection

By default, the Catalyst surface is:

- **Public** — accessible without authentication
- **Noindex** — excluded from search engines

To protect the surface, you can add authentication checks in `layout.tsx`.

## Files

```
app/(catalyst)/
├── CATALYST.md           # This file
├── catalyst.css          # Surface styles
├── layout.tsx            # Route group layout
├── _surface/
│   ├── catalyst-shell.tsx
│   └── index.ts
└── catalyst/
    ├── page.tsx          # Overview page
    └── briefs/
        └── page.tsx      # Briefs dashboard
```

## Dependencies

- `/lib/briefs.ts` — Brief parsing utilities
- `/lib/specs.ts` — Specs status utilities
- `gray-matter` — YAML frontmatter parsing
