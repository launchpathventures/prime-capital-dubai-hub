/**
 * CATALYST - Strip Share Token From URL
 *
 * After the server has rendered the (full) detail using the token, remove the
 * `ref`/`share` param from the visible address bar so it isn't shared onward,
 * bookmarked, or copied. The token has already been passed into the enquiry
 * widget as a prop, so scrubbing the URL cannot break attribution.
 *
 * UTM params are intentionally left intact.
 */

"use client"

import { useEffect } from "react"

export function StripShareToken() {
  useEffect(() => {
    const url = new URL(window.location.href)
    let changed = false
    for (const key of ["ref", "share"]) {
      if (url.searchParams.has(key)) {
        url.searchParams.delete(key)
        changed = true
      }
    }
    if (changed) {
      window.history.replaceState(
        window.history.state,
        "",
        url.pathname + url.search + url.hash,
      )
    }
  }, [])

  return null
}
