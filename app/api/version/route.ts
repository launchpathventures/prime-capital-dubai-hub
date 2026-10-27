/**
 * CATALYST - Deploy version endpoint
 *
 * Returns the Git SHA of the deployment that is serving this request.
 * Post-deploy smoke waits for this to match the new commit before it judges
 * /api/health. It does not call Supabase, so it still answers when health is 503.
 */

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID || null,
      env: process.env.VERCEL_ENV || "development",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  )
}
