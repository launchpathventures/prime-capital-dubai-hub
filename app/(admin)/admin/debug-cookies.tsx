/**
 * TEMPORARY - Cookie Debug Component
 * Delete this file after debugging is complete.
 */
"use client"

import { useEffect, useState } from "react"

export function DebugCookies() {
  const [debugInfo, setDebugInfo] = useState<{
    timestamp: string
    sbCookies: string[]
    allCookies: string[]
    location: string
    rawCookie: string
  } | null>(null)

  useEffect(() => {
    const checkCookies = () => {
      const rawCookie = document.cookie
      const allCookies = rawCookie.split(";").map(c => c.trim())
      const sbCookies = allCookies.filter(c => c.startsWith("sb-"))
      
      setDebugInfo({
        timestamp: new Date().toISOString(),
        sbCookies: sbCookies.map(c => {
          const [name, value] = c.split("=")
          return `${name} (${value?.length || 0} chars)`
        }),
        allCookies: allCookies.map(c => c.split("=")[0]).filter(Boolean),
        location: window.location.hostname,
        rawCookie: rawCookie.substring(0, 200) + (rawCookie.length > 200 ? "..." : ""),
      })
    }

    // Check immediately
    checkCookies()

    // Check every 5 seconds
    const interval = setInterval(checkCookies, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!debugInfo) return null

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 rounded-lg shadow-lg text-xs max-w-md z-50 font-mono overflow-auto max-h-80">
      <strong className="text-sm">🍪 Cookie Debug</strong>
      <div className="mt-2 space-y-1">
        <p><strong>Host:</strong> {debugInfo.location}</p>
        <p><strong>Last check:</strong> {debugInfo.timestamp.split("T")[1]}</p>
        <p><strong>Total cookies:</strong> {debugInfo.allCookies.length}</p>
        <p><strong>All cookie names:</strong></p>
        <p className="text-xs opacity-70 break-all">{debugInfo.allCookies.join(", ") || "(none)"}</p>
        <p className="mt-2"><strong>Supabase cookies:</strong> {debugInfo.sbCookies.length}</p>
        {debugInfo.sbCookies.length > 0 ? (
          <ul className="list-disc list-inside">
            {debugInfo.sbCookies.map(c => <li key={c}>{c}</li>)}
          </ul>
        ) : (
          <p className="text-red-600 dark:text-red-400 font-bold">
            ⚠️ NO Supabase cookies in browser!
          </p>
        )}
        <p className="mt-2"><strong>Raw cookie preview:</strong></p>
        <p className="text-xs opacity-70 break-all">{debugInfo.rawCookie}</p>
      </div>
    </div>
  )
}
