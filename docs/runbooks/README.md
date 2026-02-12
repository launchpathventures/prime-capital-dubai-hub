# Operational Runbooks

This directory contains runbooks for common operational tasks and incident response procedures.

## Available Runbooks

| Runbook | Description |
|---------|-------------|
| [Deployment Rollback](./deployment-rollback.md) | Steps to rollback a failed deployment |
| [API Key Rotation](./api-key-rotation.md) | How to rotate API keys and secrets |
| [Auth Incident Response](./auth-incident-response.md) | Responding to authentication incidents |
| [Backup & Retention Policy](./backup-retention-policy.md) | Data backup strategy and retention |
| [Smoke Test Checklist](./smoke-test-checklist.md) | Pre-deploy validation checklist |

## Quick Reference

### Emergency Contacts

- **Technical Lead**: Refer to internal contacts
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support

### Key URLs

| Environment | URL |
|-------------|-----|
| Production | `https://primecapitaldubai.com` |
| Staging | `https://staging.primecapitaldubai.com` |
| Vercel Dashboard | `https://vercel.com/dashboard` |
| Supabase Dashboard | `https://app.supabase.com` |

## When to Use Runbooks

1. **Before any deployment**: Run the smoke test checklist
2. **After failed deployment**: Use deployment rollback
3. **Security incident**: Follow auth incident response
4. **Key compromise**: Use API key rotation
5. **Regular maintenance**: Review backup & retention policy
