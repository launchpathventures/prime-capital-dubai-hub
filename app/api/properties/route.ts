/**
 * CATALYST - Property Browse Pagination Endpoint
 *
 * Load-more source for the /properties grid. The CRM caps every list request
 * at 50 rows, so the client walks the cursor through this route to reveal the
 * full inventory (~1.1k rows) under the active filters.
 *
 * Mirrors the /properties page filter parsing exactly (parseBrowseFilters) so
 * page 1 (server-rendered) and pages 2+ (fetched here) agree on the result set.
 */

import { NextResponse } from "next/server"

import { getCrmProperties } from "@/lib/crm/client"
import { parseBrowseFilters } from "@/lib/crm/browse-filters"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filters = parseBrowseFilters(searchParams)
  const cursor = searchParams.get("cursor")?.trim() || undefined

  const { properties, nextCursor, hasMore, total } = await getCrmProperties({
    ...filters,
    cursor,
  })

  return NextResponse.json({ properties, nextCursor, hasMore, total })
}
