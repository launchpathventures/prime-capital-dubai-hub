/**
 * CATALYST - useHashState Hook
 *
 * Syncs component state with URL hash for shareable deep links.
 * Works with Tabs, Accordions, or any controlled component.
 *
 * FEATURES:
 * - Reads initial value from URL hash on mount
 * - Updates hash when value changes (replaceState to avoid history pollution)
 * - Handles browser back/forward navigation
 * - SSR safe (reads hash only on client)
 * - Optional prefix for multiple hash states on same page
 *
 * @example
 * // Basic usage with Tabs
 * const [tab, setTab] = useHashState("tab", "overview")
 * <Tabs value={tab} onValueChange={setTab}>
 *
 * // With Accordion
 * const [section, setSection] = useHashState("section", "getting-started")
 * <Accordion value={section} onValueChange={setSection}>
 *
 * // Multiple hash states (uses prefix)
 * const [tab, setTab] = useHashState("tab", "overview")      // #tab=overview
 * const [item, setItem] = useHashState("item", "first")       // #tab=overview&item=first
 */

"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * Parse hash string into key-value pairs
 * Supports: #key=value or #key=value&key2=value2
 */
function parseHash(hash: string): Record<string, string> {
  if (!hash || hash === "#") return {}
  
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash
  const params: Record<string, string> = {}
  
  // Handle simple #value case (no key=value format)
  if (!cleanHash.includes("=")) {
    return { _default: cleanHash }
  }
  
  // Parse key=value pairs
  cleanHash.split("&").forEach((pair) => {
    const [key, value] = pair.split("=")
    if (key && value) {
      params[key] = decodeURIComponent(value)
    }
  })
  
  return params
}

/**
 * Build hash string from key-value pairs
 */
function buildHash(params: Record<string, string>): string {
  const entries = Object.entries(params).filter(([, v]) => v)
  if (entries.length === 0) return ""
  
  // If only _default key, use simple format
  if (entries.length === 1 && entries[0][0] === "_default") {
    return `#${entries[0][1]}`
  }
  
  return "#" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
}

/**
 * Sync component state with URL hash
 *
 * @param key - Hash parameter key (use "_default" for simple #value format)
 * @param defaultValue - Default value when hash is empty
 * @returns [value, setValue] - State tuple compatible with controlled components
 */
export function useHashState(
  key: string = "_default",
  defaultValue: string = ""
): [string, (value: string) => void] {
  // Initialize with default, will sync from hash on mount
  const [value, setValue] = useState(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Read initial value from hash on mount (client-side only)
  useEffect(() => {
    if (typeof window === "undefined") return
    
    const params = parseHash(window.location.hash)
    const hashValue = params[key]
    
    if (hashValue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Initializing from URL hash
      setValue(hashValue)
    }
     
    setIsInitialized(true)
  }, [key])

  // Listen for popstate (browser back/forward)
  useEffect(() => {
    if (typeof window === "undefined") return

    const handlePopState = () => {
      const params = parseHash(window.location.hash)
      const hashValue = params[key]
      setValue(hashValue || defaultValue)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [key, defaultValue])

  // Update hash when value changes
  const setValueWithHash = useCallback(
    (newValue: string) => {
      setValue(newValue)

      if (typeof window === "undefined" || !isInitialized) return

      // Get current hash params and update our key
      const params = parseHash(window.location.hash)
      params[key] = newValue

      // Build new hash and update URL (replaceState to avoid history pollution)
      const newHash = buildHash(params)
      const newUrl = window.location.pathname + window.location.search + newHash

      window.history.replaceState(null, "", newUrl)
    },
    [key, isInitialized]
  )

  return [value, setValueWithHash]
}

/**
 * Simple variant for single hash value (no key prefix)
 * URL format: #section-name
 */
export function useSimpleHashState(
  defaultValue: string = ""
): [string, (value: string) => void] {
  return useHashState("_default", defaultValue)
}
