/**
 * CATALYST - TTL Promise Cache
 *
 * Lightweight in-process cache for server runtime and local dev.
 * - Dedupes concurrent requests by storing the Promise
 * - Expires entries by TTL
 * - Does not persist across serverless instances
 */

type CacheEntry<T> = {
  expiresAt: number
  promise: Promise<T>
}

declare global {
  var __catalystTtlCache: Map<string, CacheEntry<unknown>> | undefined
}

function getStore() {
  if (!globalThis.__catalystTtlCache) {
    globalThis.__catalystTtlCache = new Map()
  }
  return globalThis.__catalystTtlCache
}

export function clearTtlCacheKey(key: string): boolean {
  return getStore().delete(key)
}

export function clearTtlCacheByPrefix(prefix: string): number {
  const store = getStore()
  let cleared = 0

  for (const key of store.keys()) {
    if (key.startsWith(prefix)) {
      store.delete(key)
      cleared += 1
    }
  }

  return cleared
}

export async function ttlCache<T>(
  key: string,
  ttlMs: number,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now()
  const store = getStore()

  const existing = store.get(key) as CacheEntry<T> | undefined
  if (existing && existing.expiresAt > now) {
    return existing.promise
  }

  const promise = fn().catch((error) => {
    // Avoid caching failures for the full TTL window.
    store.delete(key)
    throw error
  })

  store.set(key, { expiresAt: now + ttlMs, promise })
  return promise
}
