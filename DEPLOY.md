# Deploying

## Canonical Vercel project

| Field | Value |
|-------|-------|
| Project name | `prime-capital-dubai-hub` |
| Project ID | `prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x` |
| Org ID | `team_HshsUsC6U4lidrM07nzJLx1n` |
| Production domain | `https://primecapitaldubai.com/` (set as `NEXT_PUBLIC_APP_URL` in prod) |
| GitHub repo | `launchpathventures/prime-capital-dubai-hub` |

Production deploys happen via the Vercel ↔ GitHub integration on pushes to `master`. Vercel CLI is used mainly for env pulls and preview deploys.

## Pre-deploy check (mandatory before any `vercel` CLI command)

Vercel CLI auto-links by directory name. Across Conductor workspaces that share the repo name, it can silently link to the wrong project and push code to the wrong domain.

Before running `vercel deploy`, `vercel env pull`, or any other CLI command, run:

```bash
./scripts/check-vercel-link.sh
```

The script reads `.vercel/project.json` and halts with a non-zero exit if `projectId` doesn't match the canonical ID above.

### If the check fails

- **CLI deploys:** re-link against the correct project:
  ```bash
  rm -rf .vercel && vercel link --project prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x
  ```
- **GitHub-integration deploys:** the canonical project is whichever Vercel project is connected to `launchpathventures/prime-capital-dubai-hub` in the dashboard. Master pushes always flow through that integration regardless of any local `.vercel/` link — but a stray local link will still mis-route CLI commands. Clear or re-link before running any `vercel` CLI.

Do **not** run `vercel deploy` or `vercel --prod` until the script passes.
