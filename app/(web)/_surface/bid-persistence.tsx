/**
 * CATALYST - Bid Persistence (Global)
 *
 * Captures the Bitrix Lead ID (?bid=12345) from the URL on ANY page
 * and stores it in sessionStorage. This ensures the bid survives
 * navigation around the site regardless of which page the visitor
 * lands on (e.g. /properties?bid=123 or /properties/slug?bid=123).
 */

"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

const BID_STORAGE_KEY = "pcd_bid"

export function BidPersistence() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const bid = searchParams.get("bid")
    if (bid) {
      sessionStorage.setItem(BID_STORAGE_KEY, bid)
    }
  }, [searchParams])

  return null
}

/**
 * Retrieve the stored bid from sessionStorage.
 * Use this on the contact page to recover the bid
 * even if the visitor navigated away and back.
 */
export function getStoredBid(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(BID_STORAGE_KEY)
}
