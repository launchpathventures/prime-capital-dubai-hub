/**
 * CATALYST - Share-Token Resolution (Client-safe)
 *
 * A signed share link minted by AgentCRM unlocks the full off-plan detail for
 * the holder. It lands on the PDP as either `?ref=<token>` or `?share=<token>`.
 *
 * Precedence rule (from the CRM handoff): if both keys are present, `ref` wins
 * — even when it is present-but-blank. A blank `ref` must NOT fall back to
 * `share`; it means "explicitly no attribution token". We preserve the key the
 * visitor landed with when forwarding to the CRM detail request, and
 * canonicalise to `ref` only when building the enquiry-widget iframe URL.
 *
 * No server-only imports here — safe for both the server page and the client
 * widget.
 */

/** A minimal read surface satisfied by URLSearchParams. */
interface ParamReader {
  has(key: string): boolean
  get(key: string): string | null
}

export type SelectedShareToken =
  | { present: true; key: "ref" | "share"; value: string }
  | { present: false }

/**
 * Resolve the share token from URL params with ref-wins-even-if-blank
 * precedence. Returns which key won so the caller can forward it unchanged.
 */
export function selectShareToken(params: ParamReader): SelectedShareToken {
  if (params.has("ref")) {
    return { present: true, key: "ref", value: params.get("ref") ?? "" }
  }
  if (params.has("share")) {
    return { present: true, key: "share", value: params.get("share") ?? "" }
  }
  return { present: false }
}

/**
 * Build a param reader from a Next.js `searchParams` record. Only the first
 * value of a repeated key is considered (matching URLSearchParams.get).
 */
export function paramReaderFromRecord(
  record: Record<string, string | string[] | undefined>,
): ParamReader {
  const usp = new URLSearchParams()
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string") usp.set(key, value)
    else if (Array.isArray(value) && value.length > 0) usp.set(key, value[0])
  }
  return usp
}
