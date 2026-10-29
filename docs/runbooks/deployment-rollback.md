# Deployment Rollback Runbook

## Overview

This runbook covers how to rollback a failed deployment to a previous known-good state.

## Prerequisites

- Access to Vercel dashboard
- Git access to the repository
- Knowledge of the last known-good deployment

## Rollback Procedures

### Option 0: Automatic instant rollback (opt-in, off by default)

A successful Vercel **Production** deployment runs `.github/workflows/post-deploy-smoke.yml`. The job waits until `https://primecapitaldubai.com/api/version` (which redirects to `www`) serves the new commit SHA, then probes `/api/health` and the public checklist routes on both the apex and `www` host. `/api/health` must be HTTP 200 with `"status": "healthy"` — the route returns 503 when Supabase is down.

If any check fails, the job waits 45 seconds, confirms the new SHA is still the one live, and probes only the failing checks once more. Both attempts are written to the job summary. A single failure, including a brief Supabase 503, does not move production. The job calls the Vercel instant-rollback API only when the second attempt still fails, rollback is turned on, and the target is verified:

`POST /v1/projects/{projectId}/rollback/{deploymentId}`

The target is the deployment that was serving production before this one: **READY**, reported by Vercel as a rollback candidate, is not the same commit as the failing deploy, has served the production domains, is not itself a rollback, and has a git SHA. The job summary records the target's id, SHA, and first line of its commit message. Just before calling the API the job checks `/api/version` once more; if the live SHA is no longer the one it judged, it does not roll back.

After the call it waits for `/api/version` to show the previous SHA, probes again, and **fails the job** even when the restore worked.

**Rollback is off unless `AUTO_ROLLBACK` is `true`, `1`, `on`, `yes`, or `enabled`.** With it off, a failed smoke still fails the job and the summary logs the rollback target it would have used, so the logic can be watched on real deploys first. Do not put the token in a variable.

The job fails without rolling back when:

- the new SHA never appears on the alias (the previous deployment is still serving; rolling back could move the alias anyway)
- a different SHA is live by the time it would act (a newer deploy superseded this one)
- the response looks like a bot challenge rather than the app
- only `/api/health` fails and every page probe passes (usually a dependency outage; rolling back healthy code would not help and stops later deploys going live)
- the deployment is already a rollback
- there is no eligible previous production deployment, or it cannot be verified (for example the order of recent deployments is ambiguous because one was rolled away from, the best candidate is not a rollback candidate, or it has no git SHA)
- `VERCEL_TOKEN` is missing
- `AUTO_ROLLBACK` is not enabled

| Name | Kind | Required | Purpose |
|------|------|----------|---------|
| `VERCEL_TOKEN` | Secret in the GitHub Environment `production` (not a repository secret) | Yes, for rollback | Team-scoped Vercel token with the least access that can list deployments and roll back `prime-capital-dubai-hub` |
| `AUTO_ROLLBACK` | Repository variable | No | Opt-in switch. Unset = off |
| `VERCEL_TEAM_ID` | Repository variable | No | Overrides `team_HshsUsC6U4lidrM07nzJLx1n` |
| `VERCEL_PROJECT_ID` | Repository variable | No | Overrides `prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x` |

The workflow runs from the deployed commit, so the `if` on the job is not a security boundary. The token is protected by the Environment `production` being limited to `master`.

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
