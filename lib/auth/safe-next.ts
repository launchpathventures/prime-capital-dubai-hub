/**
 * CATALYST - Where sign-in may send a person next
 *
 * `next` arrives from a URL anyone can write, so it is only ever a path on this site: it starts with one "/", has no
 * backslash (browsers read "/\evil.example" as "//evil.example"), no control character or whitespace, and resolves to
 * this origin. Anything else falls back. The query and hash are kept. No imports: the proxy runs this at the edge.
 *
 * Ported from steven-leckie-hub's safeNextPath (serviceos#2347).
 */

const PROBE_ORIGIN = "https://next.invalid"

export function safeNextPath(raw: string | null | undefined, fallback: string): string {
  if (!raw || !isSafePath(raw)) return fallback
  const url = new URL(raw, PROBE_ORIGIN)
  if (url.origin !== PROBE_ORIGIN) return fallback
  // Check what is returned, not only what came in: the parser resolves dot segments, so "/.//evil.example" or
  // "/%2e%2e//evil.example" pass the input check and only then become "//evil.example".
  const path = `${url.pathname}${url.search}${url.hash}`
  return isSafePath(path) ? path : fallback
}

/** safeNextPath, but never a sign-in page: for where an already-signed-in person is bounced from /auth/*. */
export function safeNextOutsideAuth(raw: string | null | undefined, fallback: string): string {
  const path = safeNextPath(raw, fallback)
  // Decoded too, so "/%61uth/login" is caught; safeNextPath has already checked that the path decodes
  return /^\/auth(?:[/?#]|$)/i.test(decodeURIComponent(path)) ? fallback : path
}

/**
 * A single "/" then something other than "/" or "\\", with no backslash, whitespace or control character: as written,
 * decoded, and decoded then normalised (so "/.%2F/evil.example", which a server that decodes "%2F" would read as
 * "/.//evil.example" and then "//evil.example", is refused too).
 */
function isSafePath(path: string): boolean {
  let decoded: string
  try {
    decoded = decodeURIComponent(path)
  } catch {
    return false
  }
  if (!isSafeText(path) || !isSafeText(decoded)) return false
  const normalised = new URL(decoded, PROBE_ORIGIN)
  return normalised.origin === PROBE_ORIGIN && isSafeText(normalised.pathname)
}

function isSafeText(path: string): boolean {
  return /^\/(?![/\\])/.test(path) && !/[\\\s\x00-\x1f\x7f]/.test(path)
}
