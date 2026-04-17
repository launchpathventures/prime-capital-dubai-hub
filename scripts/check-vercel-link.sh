#!/usr/bin/env bash
# Verify .vercel/project.json matches the canonical Vercel project for this repo.
# Run before any `vercel` CLI command (deploy, env pull, link, etc.).
#
# Exits 0 if linked project matches, non-zero otherwise.

set -euo pipefail

EXPECTED_PROJECT_ID="prj_3XrkSo2JCGR2WTC5wcFUAgMBUB9x"
EXPECTED_ORG_ID="team_HshsUsC6U4lidrM07nzJLx1n"
EXPECTED_PROJECT_NAME="prime-capital-dubai-hub"
LINK_FILE=".vercel/project.json"

if [[ ! -f "$LINK_FILE" ]]; then
  echo "✗ No $LINK_FILE found."
  echo "  Run: vercel link --project $EXPECTED_PROJECT_ID"
  exit 1
fi

ACTUAL_PROJECT_ID=$(node -e "process.stdout.write(require('./$LINK_FILE').projectId || '')")
ACTUAL_ORG_ID=$(node -e "process.stdout.write(require('./$LINK_FILE').orgId || '')")

if [[ "$ACTUAL_PROJECT_ID" != "$EXPECTED_PROJECT_ID" ]]; then
  echo "✗ Linked Vercel project does NOT match canonical project for this repo."
  echo "  Expected projectId: $EXPECTED_PROJECT_ID ($EXPECTED_PROJECT_NAME)"
  echo "  Found projectId:    $ACTUAL_PROJECT_ID"
  echo ""
  echo "  Halt. Do not deploy. Fix with:"
  echo "    rm -rf .vercel && vercel link --project $EXPECTED_PROJECT_ID"
  echo ""
  echo "  (For GitHub-integration deploys, the canonical project is the one"
  echo "   connected to launchpathventures/prime-capital-dubai-hub in the Vercel"
  echo "   dashboard. A stray local link can still mis-route CLI commands like"
  echo "   'vercel env pull' — clear it before running any vercel CLI.)"
  exit 1
fi

if [[ "$ACTUAL_ORG_ID" != "$EXPECTED_ORG_ID" ]]; then
  echo "✗ Linked Vercel org does NOT match canonical org."
  echo "  Expected orgId: $EXPECTED_ORG_ID"
  echo "  Found orgId:    $ACTUAL_ORG_ID"
  exit 1
fi

echo "✓ Linked to $EXPECTED_PROJECT_NAME ($EXPECTED_PROJECT_ID)"
