# Deployment Rollback Runbook

## Overview

This runbook covers how to rollback a failed deployment to a previous known-good state.

> **One deployment serves two sites.** `primecapitaldubai.com` and `tahirmajithia.com` (each apex redirects to `www`) are domains of the same Vercel project and the same deployment; `proxy.ts` picks the brand from the host. Any rollback or promote, automatic or manual, moves **both** sites. Check both after one.

## Prerequisites

- Access to Vercel dashboard
- Git access to the repository
- Knowledge of the last known-good deployment

## Rollback Procedures

### Option 0: Automatic instant rollback (opt-in, off by default)

A successful Vercel **Production** deployment runs `.github/workflows/post-deploy-smoke.yml`. The job waits until `https://primecapitaldubai.com/api/version` (which redirects to `www`) serves the new commit SHA, then probes `/api/health` and the public checklist routes on the apex and `www` host of **both** brands: `primecapitaldubai.com` (`/`, `/contact`, `/properties`, `/team`, `/auth/login`) and `tahirmajithia.com` (`/`, `/about`, `/contact`, `/services`). A Tahir failure counts the same as a primary failure. `/api/health` must be HTTP 200 with `"status": "healthy"` — the route returns 503 when Supabase is down.

If any check fails, the job waits 45 seconds, confirms the new SHA is still the one live, and probes only the failing checks once more. Both attempts are written to the job summary. A single failure, including a brief Supabase 503, does not move production. The job calls the Vercel instant-rollback API only when the second attempt still fails, rollback is turned on, and the target is verified:

`POST /v1/projects/{projectId}/rollback/{deploymentId}`

The target is the deployment that was serving production before this one: **READY**, reported by Vercel as a rollback candidate, is not the same commit as the failing deploy, has served the production domains, is not itself a rollback, and has a git SHA. Its own post-deploy smoke run (looked up through the GitHub Actions API for its SHA) must also have passed, so a deploy that failed smoke and was rolled away from is never chosen even if Vercel does not refresh its timestamps; no run on record means no rollback. The job summary records the target's id, SHA, and first line of its commit message. Just before calling the API the job checks `/api/version` once more; if the live SHA is no longer the one it judged, it does not roll back.

After the call it waits for `/api/version` to show the previous SHA, probes both brands again, and **fails the job** even when the restore worked.

**Rollback is off unless `AUTO_ROLLBACK` is `true`, `1`, `on`, `yes`, or `enabled`.** With it off, a failed smoke still fails the job and the summary logs the rollback target it would have used, so the logic can be watched on real deploys first. Do not put the token in a variable.

The job fails without rolling back when:

- the new SHA never appears on the alias (the previous deployment is still serving; rolling back could move the alias anyway)
- a different SHA is live by the time it would act (a newer deploy superseded this one), or the live SHA cannot be re-read (logged separately as "unknown")
- the response looks like a bot challenge rather than the app
- only `/api/health` fails and every page probe passes (usually a dependency outage; rolling back healthy code would not help and stops later deploys going live)
- the deployment is already a rollback
- there is no eligible previous production deployment, or it cannot be verified (for example the order of recent deployments is ambiguous because one was rolled away from, the best candidate is not a rollback candidate, or it has no git SHA)
- `VERCEL_TOKEN` is missing
- `AUTO_ROLLBACK` is not enabled

| Name | Kind | Required | Purpose |
|------|------|----------|---------|
| `VERCEL_TOKEN` | Secret in the GitHub Environment `production-smoke` (not a repository secret) | Yes, for rollback | Team-scoped Vercel token with the least access that can list deployments and roll back `prime-capital-dubai-hub` |
| `AUTO_ROLLBACK` | Repository variable | No | Opt-in switch. Unset = off |
| `VERCEL_TEAM_ID` | Repository variable | No | Overrides `team_HshsUsC6U4lidrM07nzJLx1n` |
| `VERCEL_PROJECT_ID` | Repository variable | No | Overrides `prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x` |

#### Who is told when smoke fails

The `notify` job in the same workflow runs only when the smoke job itself fails (not for skipped previews, and not for a queued run cancelled by a newer deploy). It uses the job's own `GITHUB_TOKEN` with `issues: write` and nothing else, and no environment, so it cannot read `VERCEL_TOKEN`. It opens an issue titled **Post-deploy smoke failed on production**, or adds a comment to the one that is already open, and mentions the repository owner (`@launchpathventures`) so GitHub emails or notifies them. The body holds only GitHub-generated values: commit SHA, run link, deployment link. The probes, decision and rollback target are in the linked run summary. Close the issue once production is healthy. No new secret is involved. GitHub's own workflow-failure email depends on who triggered the run and is not relied on; the issue is the path that always names the owner.

Anyone who should be told as well can watch the repository (Custom > Issues) or be added to the issue.

#### After a manual rollback or promote

A rollback or promote done in the dashboard or CLI leaves no trace in GitHub: no deployment event, no smoke run, no issue. Keep it traceable by hand:

1. Open (or comment on) an issue "Manual production rollback" with the date, who did it, the SHA moved from and to, and why.
2. Leave `AUTO_ROLLBACK` **off** (unset or false). Do not turn it on while production is on a hand-picked deployment: the automatic target is chosen from Vercel's ordering and the recorded smoke runs, and a manual move can leave both misleading.
3. Turn it on again only after a fresh deploy from `master` has gone live on its own, passed this smoke job, and `https://primecapitaldubai.com/api/version` shows that SHA. See "restoring auto-assignment" below.

A deployment promoted or rolled back by hand is never smoke-tested by the workflow, because Vercel does not send a new Production success event for it. Probe it yourself with [the smoke checklist](./smoke-test-checklist.md), on both domains.

The workflow runs from the deployed commit, so the `if` on the job is not a security boundary. The token is protected by the Environment `production-smoke` being limited to `master`. It is separate from Vercel's own `Production` environment on purpose.

#### After an instant rollback: restoring auto-assignment

After an instant rollback, Vercel stops assigning the production domains to new deployments from `master`. Later pushes still build, but they do not go live, and the post-deploy job fails with "new deploy is not live". Production stays on the rolled-back deployment until someone promotes a deployment:

1. Fix the problem and push to `master`; wait for that deployment to be **READY**.
2. Promote that specific fixed deployment: in the Vercel dashboard open **Deployments**, pick the fixed deployment, and use **Promote to Production**, or run `vercel promote <deployment-url-or-id>`. This restores auto-assignment of the production domains.
3. Confirm `https://primecapitaldubai.com/api/version` shows the SHA of the fixed deployment, and that the next push to `master` goes live on its own.

Do **not** use **Undo Rollback** for this. It is not documented to do what is needed, and it can put the deployment that was rolled away from (the bad one) back live. Only use it if someone has confirmed on a non-production project exactly what it does.

Instant rollback does not undo SQL. See [Migration expand/contract guard](./migration-expand-contract.md). On a Hobby plan, Vercel only allows rolling back to the immediately previous production deployment; the script asks for the deployment that was serving before and surfaces the API error if Vercel rejects it.

Manual options below stay available when the workflow cannot reach the API.

### Option 1: Vercel Dashboard Rollback (Fastest)

1. **Navigate to Vercel Dashboard**
   - Go to https://vercel.com/dashboard
   - Select the `prime-capital-dubai-hub` project

2. **Access Deployments**
   - Click on "Deployments" tab
   - Find the last successful deployment (marked with green checkmark)

3. **Promote Previous Deployment**
   - Click on the successful deployment
   - Click "Promote to Production" button
   - Confirm the action

4. **Verify Rollback**
   - Wait for promotion to complete (usually 30-60 seconds)
   - Verify the site is working at production URL
   - Check critical paths (homepage, contact form, login)

### Option 2: Git Revert

1. **Identify the Bad Commit**
   ```bash
   git log --oneline -10
   ```

2. **Revert the Commit**
   ```bash
   git revert <commit-hash>
   git push origin master
   ```

3. **Monitor Deployment**
   - Vercel will automatically deploy the revert
   - Monitor deployment progress in Vercel dashboard
   - Verify once deployment completes

### Option 3: Force Deploy Specific Commit

1. **Find Known-Good Commit**
   ```bash
   git log --oneline -20
   # Find the last good commit hash
   ```

2. **Create Hotfix Branch and Deploy**
   ```bash
   git checkout -b hotfix/rollback <good-commit-hash>
   git push origin hotfix/rollback
   ```

3. **Deploy via Vercel CLI**
   ```bash
   vercel --prod
   ```

## Settings for Tim

The pull request deliberately changes none of these. Each needs a person with admin rights on GitHub or Vercel. The workflow and docs are written to cope until they are done.

| # | Where | Setting | Why |
|---|-------|---------|-----|
| 1 | GitHub > Settings > Branches (or Rules) | Protect `master`: require a pull request, require the `CI / lint, typecheck, unit tests, build` check, and tick **Require review from Code Owners** (`.github/CODEOWNERS` exists) | A merge to `master` is a production deploy. Without this nothing makes CI or review mandatory. Finding M2 |
| 2 | GitHub > Settings > Environments | Create `production-smoke`, restrict deployment branches to `master`, and put `VERCEL_TOKEN` in it (never a repository secret). Do this before merging: GitHub auto-creates a missing environment with no rules | The token is only readable by runs that pass the branch rule |
| 3 | GitHub > Settings > Environments > `production-smoke` | After the first Production deploy, confirm the run was not blocked by the branch rule. `deployment_status` runs carry the deployed commit, and Vercel sets `deployment.ref` to a SHA, so a rule written for the branch name `master` may not match. If it blocks, the job fails before it can roll back, with no token exposed | Finding M4. This is unconfirmed and can only be seen on a real deploy |
| 4 | Vercel > project > Settings > Environment Variables | Keep **Automatically expose System Environment Variables** on for Production | `/api/version` reads `VERCEL_GIT_COMMIT_SHA`; with it off the SHA is null and the job fails with "new deploy is not live" |
| 5 | Vercel > Account Settings > Tokens | Create a team-scoped token for `prime-capital-dubai-hub` with the least access, and store it as in row 2. Needed only for rollback | Absent token = job probes and notifies but never rolls back |
| 6 | GitHub > Settings > Secrets and variables > Actions > Variables | `AUTO_ROLLBACK`: leave unset. Turn on only after several clean Production runs of the dry-run log, and not after a manual rollback (see above) | Rollback is opt-in |
| 7 | GitHub > Settings > General | Issues must be enabled for the failure notification (they were on when this was written) | `notify` opens an issue |
| 8 | Vercel > project > Domains | Confirm `tahirmajithia.com` and `www.tahirmajithia.com` stay attached to this project. The smoke job probes both | Read from the Vercel API on the day of writing: apex redirects to `www`, both verified |

## Post-Rollback Actions

### Immediate (within 15 minutes)

- [ ] Verify production site is accessible
- [ ] Test critical user flows (homepage, contact form, login)
- [ ] Check error monitoring (if configured)
- [ ] Notify team of rollback

### Short-term (within 1 hour)

- [ ] Document what went wrong
- [ ] Create incident report if severe
- [ ] Plan fix for the issue
- [ ] Schedule follow-up deployment

### Follow-up (within 24 hours)

- [ ] Root cause analysis
- [ ] Update tests to catch the issue
- [ ] Review deployment checklist
- [ ] Apply fix and redeploy

## Database Rollback (if needed)

### Supabase Point-in-Time Recovery

If the deployment included database migrations that need to be rolled back:

1. **Contact Supabase Support**
   - For production databases, PITR may be available
   - Open support ticket at https://supabase.com/support

2. **Manual Data Fixes**
   - If PITR is not available, prepare SQL scripts to fix data
   - Test scripts in staging first
   - Execute during low-traffic period

## Common Issues and Solutions

### Issue: Site shows 500 errors after deployment
- **Cause**: Usually environment variable mismatch
- **Solution**: Check Vercel environment variables match `.env.example`

### Issue: API routes failing
- **Cause**: Missing or incorrect API keys
- **Solution**: Verify all API keys in Vercel settings

### Issue: Database connection errors
- **Cause**: Supabase URL/key mismatch
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and keys

## Escalation

If rollback fails or issues persist:

1. **Check Vercel Status**: https://www.vercel-status.com/
2. **Check Supabase Status**: https://status.supabase.com/
3. **Contact support** if platform issues suspected
