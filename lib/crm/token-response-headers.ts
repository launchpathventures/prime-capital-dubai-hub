/**
 * CATALYST - Share-token response headers (edge-safe, no imports)
 *
 * Token-bearing property pages must carry hard HTTP response headers — not just
 * force-dynamic rendering and a <meta name="referrer"> tag:
 *   - Cache-Control: private, no-store  → the unlocked full detail is never
 *     cached by any shared/CDN/browser layer.
 *   - Referrer-Policy: no-referrer       → the token in the URL never leaks via
 *     the Referer header.
 *
 * Applied in proxy.ts (edge middleware). Returns null for anonymous requests so
 * the caller leaves their headers untouched.
 */

export function shareTokenResponseHeaders(
  searchParams: URLSearchParams,
): Record<string, string> | null {
  if (searchParams.has("ref") || searchParams.has("share")) {
    return {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    }
  }
  return null
}
