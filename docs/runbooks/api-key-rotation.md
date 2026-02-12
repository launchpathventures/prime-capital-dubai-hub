# API Key Rotation Runbook

## Overview

This runbook covers how to rotate API keys and secrets for the application.

## Key Inventory

| Key | Service | Location | Rotation Frequency |
|-----|---------|----------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Vercel + .env | On compromise only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Vercel + .env | On compromise only |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Vercel only | 90 days or on compromise |
| `AUTH_PASSWORD` | App Auth | Vercel only | 90 days or on compromise |
| `AUTH_DEFAULT_PASSWORD` | App Auth | Vercel only | 90 days or on compromise |
| `ZAPIER_LEAD_WEBHOOK_URL` | Zapier | Vercel only | On compromise only |
| `ANTHROPIC_API_KEY` | Anthropic | Vercel only | 90 days or on compromise |

## Rotation Procedures

### 1. Supabase Service Role Key

**When to rotate**: Every 90 days or immediately on suspected compromise.

1. **Generate New Key in Supabase**
   - Go to https://app.supabase.com
   - Select project `ebirxyrjwaulyqizcbcs`
   - Navigate to Settings > API
   - Note: Service role key cannot be rotated directly
   - If compromised, contact Supabase support

2. **Update Vercel**
   - Go to Vercel project settings
   - Environment Variables section
   - Update `SUPABASE_SERVICE_ROLE_KEY`
   - Apply to all environments (Production, Preview, Development)

3. **Redeploy**
   ```bash
   vercel --prod
   ```

4. **Verify**
   - Test admin functionality
   - Test user creation flow
   - Monitor error logs

### 2. Supabase Anon Key

**Note**: Anon keys are designed to be public. Only rotate if RLS policies are compromised.

1. **Contact Supabase Support**
   - Open ticket at https://supabase.com/support
   - Request key rotation
   - They will provide new keys

2. **Update All Locations**
   - Vercel environment variables
   - `.env.local` for local development
   - Update `.env.example` documentation

3. **Coordinate Deployment**
   - This will break the site until deployment completes
   - Schedule during low-traffic period

### 3. Auth Password (AUTH_PASSWORD)

1. **Generate New Password**
   ```bash
   openssl rand -base64 32
   ```

2. **Update Vercel**
   - Go to Vercel project settings
   - Update `AUTH_PASSWORD`

3. **Notify Users**
   - If this is a shared password, notify all users
   - Consider switching to Supabase auth if sharing is problematic

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### 4. Default User Password (AUTH_DEFAULT_PASSWORD)

1. **Generate New Password**
   ```bash
   openssl rand -base64 16
   ```

2. **Update Vercel**
   - Update `AUTH_DEFAULT_PASSWORD` in Vercel

3. **Update Documentation**
   - Update any internal docs with the new default password
   - Notify admins who create new users

4. **Redeploy**
   ```bash
   vercel --prod
   ```

### 5. Zapier Webhook URL

1. **Create New Zap**
   - In Zapier, create a new webhook trigger
   - Configure same workflow as existing

2. **Update Vercel**
   - Update `ZAPIER_LEAD_WEBHOOK_URL` in Vercel

3. **Test**
   - Submit test lead form
   - Verify Zapier receives the data

4. **Disable Old Zap**
   - Only after confirming new one works
   - Turn off the old Zap

### 6. Anthropic API Key

1. **Generate New Key**
   - Go to https://console.anthropic.com
   - API Keys section
   - Create new key

2. **Update Vercel**
   - Update `ANTHROPIC_API_KEY` in Vercel

3. **Redeploy**
   ```bash
   vercel --prod
   ```

4. **Test**
   - Test AI Coach chat functionality
   - Test roleplay scenarios

5. **Delete Old Key**
   - In Anthropic console, delete the old key

## Emergency Rotation (Compromised Key)

If a key is known or suspected to be compromised:

1. **Immediately**
   - Rotate the key following procedures above
   - Do NOT wait for scheduled maintenance

2. **Audit**
   - Check logs for unauthorized access
   - Review Supabase audit logs
   - Check Vercel deployment logs

3. **Document**
   - Record when compromise was detected
   - Record what actions were taken
   - Create incident report

4. **Review**
   - How was the key exposed?
   - Update processes to prevent recurrence
   - Consider additional security measures

## Rotation Checklist

Before rotating any key:

- [ ] Identify all services using the key
- [ ] Have new key ready before revoking old one
- [ ] Schedule rotation during low-traffic period
- [ ] Notify team members
- [ ] Have rollback plan ready

After rotation:

- [ ] Verify all affected services work
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Delete/revoke old key (if applicable)
- [ ] Update rotation log/documentation
