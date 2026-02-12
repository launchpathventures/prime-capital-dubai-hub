# Auth Incident Response Runbook

## Overview

This runbook covers how to respond to authentication-related security incidents.

## Incident Types

1. **Unauthorized Access** - Someone accessed accounts they shouldn't have
2. **Credential Leak** - Passwords or API keys exposed
3. **Session Hijacking** - User sessions compromised
4. **Brute Force Attack** - Multiple failed login attempts
5. **Account Takeover** - Attacker gained control of user account

## Immediate Response (First 15 minutes)

### Step 1: Assess Severity

| Severity | Criteria | Response Time |
|----------|----------|---------------|
| Critical | Admin access compromised, data breach | Immediate |
| High | Multiple user accounts affected | Within 1 hour |
| Medium | Single user account affected | Within 4 hours |
| Low | Failed attack (no breach) | Within 24 hours |

### Step 2: Contain the Incident

#### For Credential Leaks

1. **Rotate affected keys immediately**
   - Follow [API Key Rotation](./api-key-rotation.md) runbook
   - Don't wait to confirm breach

2. **Revoke compromised sessions**
   - In Supabase dashboard:
     - Go to Authentication > Users
     - Find affected user(s)
     - Click "Force Sign Out All Sessions"

3. **Enable additional rate limiting** (if not already)
   - Rate limiting is already implemented in `/lib/rate-limit.ts`
   - Consider reducing limits temporarily

#### For Unauthorized Access

1. **Identify compromised accounts**
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM auth.users
   WHERE last_sign_in_at > NOW() - INTERVAL '24 hours'
   ORDER BY last_sign_in_at DESC;
   ```

2. **Force password reset**
   - Use Supabase admin API to trigger password reset
   - Or manually reset through dashboard

3. **Review access logs**
   ```sql
   -- Check recent auth events
   SELECT * FROM auth.audit_log_entries
   WHERE created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   ```

## Investigation

### Gather Information

1. **Check Vercel Logs**
   - Go to Vercel dashboard > Logs
   - Filter for authentication-related routes:
     - `/api/auth/*`
     - `/api/admin/*`

2. **Check Supabase Logs**
   - Go to Supabase dashboard > Database > Logs
   - Look for unusual patterns

3. **Check Rate Limit Logs**
   - Search for "429" responses in logs
   - Check for IP addresses hitting rate limits

### Common Attack Patterns

#### Brute Force Detection
```sql
-- Find IPs with multiple failed attempts
-- (if logging is implemented)
SELECT ip_address, COUNT(*) as attempts
FROM auth_logs
WHERE success = false
AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY ip_address
HAVING COUNT(*) > 5;
```

#### Session Anomalies
- Same user from multiple IPs simultaneously
- Unusual geographic locations
- Access at unusual times

## Recovery Procedures

### For Compromised User Accounts

1. **Notify the user**
   - Email or phone
   - Explain what happened
   - Provide instructions for securing account

2. **Reset credentials**
   ```sql
   -- Force password reset (Supabase)
   -- User will need to use "Forgot Password"
   UPDATE auth.users
   SET encrypted_password = NULL
   WHERE id = 'user-id-here';
   ```

3. **Review account activity**
   - Check what data was accessed
   - Determine if any data was modified

### For Admin Account Compromise

1. **Immediately disable the account**
   ```sql
   UPDATE auth.users
   SET banned_until = NOW() + INTERVAL '999 years'
   WHERE id = 'admin-user-id';
   ```

2. **Rotate all service keys**
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_DEFAULT_PASSWORD`
   - Any other admin-accessible keys

3. **Audit admin actions**
   ```sql
   -- Check recent user creations
   SELECT * FROM user_profiles
   WHERE created_at > NOW() - INTERVAL '7 days'
   ORDER BY created_at DESC;

   -- Check for permission changes
   SELECT * FROM user_profiles
   WHERE updated_at > NOW() - INTERVAL '7 days'
   AND role = 'admin';
   ```

## Post-Incident

### Documentation

Create incident report including:
- Timeline of events
- What was compromised
- How it was detected
- Actions taken
- Root cause analysis
- Preventive measures

### Communication

1. **Internal notification**
   - Notify team members
   - Document lessons learned

2. **User notification** (if required)
   - If user data was accessed, notify affected users
   - Comply with data protection regulations

### Preventive Measures

1. **Review and update**
   - Rate limiting thresholds
   - Password policies
   - Session timeout settings

2. **Consider implementing**
   - Two-factor authentication
   - IP allowlisting for admin access
   - Enhanced logging

3. **Update monitoring**
   - Add alerts for suspicious patterns
   - Review regularly

## Emergency Contacts

| Role | Contact |
|------|---------|
| Supabase Support | https://supabase.com/support |
| Vercel Support | https://vercel.com/support |
| Technical Lead | (Internal contact) |

## Related Runbooks

- [API Key Rotation](./api-key-rotation.md)
- [Deployment Rollback](./deployment-rollback.md)
