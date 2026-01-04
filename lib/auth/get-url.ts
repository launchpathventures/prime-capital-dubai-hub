/**
 * CATALYST - Dynamic URL Helper
 *
 * Returns the base URL for the current environment.
 * Used for auth redirects (Supabase email links, OAuth callbacks, etc.)
 */

/**
 * Get the base URL for the current environment.
 *
 * Priority:
 * 1. NEXT_PUBLIC_APP_URL (explicit override — set in production)
 * 2. NEXT_PUBLIC_VERCEL_URL (auto-set by Vercel for previews)
 * 3. localhost fallback (development)
 */
export function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000"

  // Ensure https:// prefix (except localhost)
  url = url.startsWith("http") ? url : `https://${url}`

  // Ensure trailing slash
  url = url.endsWith("/") ? url : `${url}/`

  return url
}
