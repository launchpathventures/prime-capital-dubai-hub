/**
 * CATALYST - Paginated Supabase reads
 *
 * WHY: PostgREST caps every response at `db.max_rows` (default 1000). Any query
 * that fetches a whole table and then counts/filters/aggregates in JS is silently
 * truncated once the table grows past that cap, producing wrong totals (e.g. a
 * learner who completed every module reported as only partially done). This helper
 * pages through the full result set so callers get every row regardless of table size.
 *
 * IMPORTANT: the page factory MUST apply a stable, unique ordering (e.g. `.order("id")`)
 * so consecutive pages tile the dataset without overlapping or skipping rows. Range
 * pagination over an unordered query is not safe.
 */

/**
 * Rows requested per page. This is only the request window — the helper advances by
 * the number of rows the server actually returns and stops on the first empty page,
 * so it stays correct even if the server's `db.max_rows` is lower than this value.
 */
const REQUEST_WINDOW = 1000

/**
 * Safety valve: the maximum number of pages to fetch before giving up. At the
 * request window above this bounds a single call to ~1,000,000 rows, which is far
 * beyond any table this helper is used on and guards against an unexpected
 * non-terminating loop (e.g. a server that never returns an empty page).
 */
const MAX_PAGES = 1000

type PageResult<T> = { data: T[] | null; error: { message: string } | null }

/**
 * Fetch every row for a select query, transparently paginating past the row cap.
 *
 * @param makePage builds the query for an inclusive [from, to] range. Must include a
 *                 stable `.order(...)` on a unique column and end with `.range(from, to)`.
 */
export async function fetchAllRows<T>(
  makePage: (from: number, to: number) => PromiseLike<PageResult<T>>,
): Promise<T[]> {
  const rows: T[] = []

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = rows.length
    const { data, error } = await makePage(from, from + REQUEST_WINDOW - 1)
    if (error) throw new Error(error.message)

    // An empty page means we've read past the last row — we're done. We advance by
    // the actual number of rows returned (not a fixed page size), so a server cap
    // smaller than REQUEST_WINDOW just means more, smaller pages — never a silent stop.
    if (!data || data.length === 0) break
    rows.push(...data)
  }

  return rows
}
