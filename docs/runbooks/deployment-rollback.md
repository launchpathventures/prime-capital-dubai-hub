# Deployment Rollback Runbook

## Overview

This runbook covers how to rollback a failed deployment to a previous known-good state.

## Prerequisites

- Access to Vercel dashboard
- Git access to the repository
- Knowledge of the last known-good deployment

## Rollback Procedures

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
