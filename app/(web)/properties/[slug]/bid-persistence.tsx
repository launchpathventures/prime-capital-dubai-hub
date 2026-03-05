/**
 * CATALYST - Bid Persistence
 *
 * Stores the Bitrix Lead ID in sessionStorage when a visitor
 * arrives via an agent-shared link (?bid=12345). This ensures
 * the bid survives navigation around the site.
 */

"use client"

import { useEffect } from "react"

const BID_STORAGE_KEY = "pcd_bid"

interface BidPersistenceProps {
  bid: string
}

export function BidPersistence({ bid }: BidPersistenceProps) {
  useEffect(() => {
    sessionStorage.setItem(BID_STORAGE_KEY, bid)
  }, [bid])

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
