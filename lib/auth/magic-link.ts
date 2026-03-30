/**
 * CATALYST - Magic Link Helpers
 *
 * Supabase admin.generateLink returns an action_link that goes through
 * Supabase's /auth/v1/verify endpoint. After verification, Supabase
 * redirects to the project's configured site URL + /api/auth/callback.
 *
 * The problem: the redirect_to inside that link points to production.
 * We rewrite it to point to the current app origin so links work in
 * any environment (localhost, preview, production).
 */

/**
 * Rewrite the redirect_to inside a Supabase magic link.
 *
 * Input:  https://<ref>.supabase.co/auth/v1/verify?token=xxx&type=magiclink&redirect_to=https://primecapitaldubai.com/api/auth/callback
 * Output: https://<ref>.supabase.co/auth/v1/verify?token=xxx&type=magiclink&redirect_to=http://localhost:3002/api/auth/callback?next=/auth/redirect
 */
export function rewriteMagicLink(supabaseLink: string, requestUrl: string): string {
  const url = new URL(supabaseLink)
  const { origin } = new URL(requestUrl)

  // Build our callback URL with the /auth/redirect path
  const callbackUrl = new URL("/api/auth/callback", origin)
  callbackUrl.searchParams.set("next", "/auth/redirect")

  // Replace the redirect_to param so Supabase sends the user back to us
  url.searchParams.set("redirect_to", callbackUrl.toString())

  return url.toString()
}
