#!/usr/bin/env npx tsx
/**
 * CATALYST - LMS Content Sync CLI
 *
 * Syncs markdown content from content/lms/ to Supabase tables.
 *
 * Usage:
 *   npx tsx scripts/sync-lms-content.ts
 *   pnpm sync:lms
 *
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv"

// Load environment variables from .env.local
config({ path: ".env.local" })

import { syncLmsContent } from "../lib/lms/sync"

// Run sync
syncLmsContent()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Sync failed:", error.message)
    process.exit(1)
  })
