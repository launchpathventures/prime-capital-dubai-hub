# Backup & Retention Policy

## Overview

This document outlines the backup strategy and data retention policies for Prime Capital Dubai Hub.

## Infrastructure Overview

| Component | Service | Backup Method |
|-----------|---------|---------------|
| Database | Supabase PostgreSQL | Automatic daily snapshots |
| File Storage | Supabase Storage | Replicated storage |
| Application Code | GitHub + Vercel | Git history |
| Environment Config | Vercel | Manual backup required |

## Supabase Backup Strategy

### Automatic Backups (Pro Plan)

Supabase Pro plan includes:

- **Daily automated backups** retained for 7 days
- **Point-in-Time Recovery (PITR)** - restore to any point in the last 7 days
- **Backups stored in separate region** from primary database

### Backup Schedule

| Backup Type | Frequency | Retention |
|-------------|-----------|-----------|
| Daily Snapshot | Every 24 hours | 7 days |
| PITR (if enabled) | Continuous | 7 days |
| Manual Export | As needed | Indefinite |

### Checking Backup Status

1. Go to Supabase Dashboard
2. Select project `ebirxyrjwaulyqizcbcs`
3. Navigate to Database > Backups
4. Verify latest backup timestamp

### Manual Database Export

For long-term retention or migration:

```bash
# Using pg_dump (requires direct database connection)
pg_dump -h db.ebirxyrjwaulyqizcbcs.supabase.co \
  -U postgres \
  -d postgres \
  -F c \
  -f backup_$(date +%Y%m%d).dump

# Using Supabase CLI
supabase db dump --project-ref ebirxyrjwaulyqizcbcs > backup.sql
```

## Data Retention Policies

### LMS Data

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| User Profiles | Account lifetime + 2 years | Business requirement |
| Learning Progress | Account lifetime + 2 years | Certification records |
| Quiz Attempts | Account lifetime + 2 years | Audit trail |
| Scenario Completions | Account lifetime + 2 years | Performance tracking |
| Certifications | Indefinite | Legal/compliance |

### Lead Data

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| Form Submissions | 3 years | Sales cycle + legal |
| Contact Information | 3 years or until opt-out | GDPR compliance |
| Marketing Preferences | Until opt-out | User control |

### System Data

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| Application Logs | 30 days | Debugging |
| Error Logs | 90 days | Issue tracking |
| Auth Audit Logs | 1 year | Security compliance |

## Restoration Procedures

### Restore from Daily Backup (Supabase)

1. Go to Supabase Dashboard > Database > Backups
2. Select the backup to restore
3. Click "Restore"
4. Confirm (this will replace current database)

**Warning**: Restoration replaces the entire database. Consider PITR for partial recovery.

### Point-in-Time Recovery

1. Go to Supabase Dashboard > Database > Backups
2. Select "Point-in-Time Recovery"
3. Choose specific timestamp
4. Confirm restoration

### Restore to Staging Environment

For testing restoration without affecting production:

1. Create new Supabase project for staging
2. Restore backup to staging project
3. Update staging environment variables
4. Test the restoration

## Environment Configuration Backup

### Manual Backup Procedure

1. **Export Vercel Environment Variables**
   ```bash
   # Using Vercel CLI
   vercel env pull .env.backup
   ```

2. **Secure Storage**
   - Store in password manager or secure vault
   - Never commit to git
   - Update after any key rotation

3. **Frequency**: After any environment variable change

### Recovery Procedure

1. Go to Vercel project settings
2. Navigate to Environment Variables
3. Manually restore each variable from backup
4. Redeploy application

## Code and Configuration

### Git Repository

- **Full history** retained indefinitely in GitHub
- **Branches** protected: `master` requires PR review
- **Tags** created for each production release

### Vercel Deployments

- **All deployments** retained for 30 days
- **Production deployments** can be promoted instantly
- **Build artifacts** stored for quick rollback

## Disaster Recovery

### Recovery Time Objectives (RTO)

| Scenario | Target RTO |
|----------|------------|
| Application code rollback | 5 minutes |
| Environment variable restore | 15 minutes |
| Database restore (daily backup) | 1 hour |
| Full infrastructure rebuild | 4 hours |

### Recovery Point Objectives (RPO)

| Data Type | Target RPO |
|-----------|------------|
| Database (with PITR) | 0-5 minutes |
| Database (daily backup) | 24 hours |
| User uploads | Real-time (replicated) |
| Configuration | Last backup |

### Disaster Recovery Checklist

If full recovery is needed:

1. [ ] Verify Supabase service status
2. [ ] Verify Vercel service status
3. [ ] Restore database from backup
4. [ ] Restore environment variables
5. [ ] Deploy application
6. [ ] Run smoke tests
7. [ ] Notify stakeholders

## Compliance Notes

### GDPR Requirements

- Users can request data export (right to portability)
- Users can request data deletion (right to erasure)
- Deletion must propagate to backups within 30 days

### Data Export for Users

```sql
-- Export all data for a specific user
SELECT * FROM user_profiles WHERE id = 'user-id';
SELECT * FROM learning_progress WHERE user_id = 'user-id';
SELECT * FROM quiz_attempts WHERE user_id = 'user-id';
SELECT * FROM scenario_completions WHERE user_id = 'user-id';
SELECT * FROM certifications WHERE user_id = 'user-id';
```

### Data Deletion

```sql
-- Delete all data for a specific user (GDPR request)
-- Run in order due to foreign key constraints
DELETE FROM certifications WHERE user_id = 'user-id';
DELETE FROM scenario_completions WHERE user_id = 'user-id';
DELETE FROM quiz_attempts WHERE user_id = 'user-id';
DELETE FROM learning_progress WHERE user_id = 'user-id';
DELETE FROM user_profiles WHERE id = 'user-id';
-- Also delete from auth.users via Supabase dashboard
```

## Monitoring and Alerts

### Backup Monitoring

- [ ] Weekly check of Supabase backup status
- [ ] Quarterly test restore to staging
- [ ] Annual disaster recovery drill

### Recommended Alerts

1. Backup failure notification (configure in Supabase)
2. Database size approaching limits
3. Unusual data growth patterns

## Review Schedule

This policy should be reviewed:
- Quarterly for retention periods
- After any data breach or incident
- When compliance requirements change
- When infrastructure changes
