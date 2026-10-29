/**
 * CATALYST - Deploy version endpoint
 *
 * Returns the Git SHA of the deployment that is serving this request.
 * Post-deploy smoke waits for this to match the new commit before it judges
 * /api/health. Only the SHA is returned; that is all the job reads.
 * It does not call Supabase, so it still answers when health is 503.
 *
 * VERCEL_GIT_COMMIT_SHA exists only while the Vercel project setting "Automatically
 * expose System Environment Variables" is on (Settings > Environment Variables).
 * With it off the SHA is null, smoke never sees the new commit, and the post-deploy
 * job fails with "new deploy is not live". See docs/runbooks/deployment-rollback.md.
 */

import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export function GET() {
  return NextResponse.json(
    {
      sha: process.env.VERCEL_GIT_COMMIT_SHA || null,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  )
}
