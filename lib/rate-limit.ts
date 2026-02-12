/**
 * CATALYST - Rate Limiting Utility
 *
 * In-memory rate limiting for API endpoints.
 * Provides IP-based rate limiting with configurable windows and limits.
 *
 * Note: This is in-memory and will reset on server restart.
 * For production with multiple instances, consider Redis-based rate limiting.
 */

// =============================================================================
// TYPES
// =============================================================================

interface RateLimitEntry {
  count: number
  windowStart: number
}

interface RateLimitStore {
  store: Map<string, RateLimitEntry>
  requestCount: number
}

interface RateLimitResult {
  limited: boolean
  retryAfter?: number
  remaining?: number
}

interface RateLimitOptions {
  windowMs: number
  maxRequests: number
}

// =============================================================================
// DEFAULT CONFIGURATIONS
// =============================================================================

/**
 * Pre-configured rate limit options for common use cases.
 */
export const RATE_LIMITS = {
  /** Auth endpoints: 5 attempts per 15 minutes */
  AUTH: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  /** AI endpoints: 20 requests per hour */
  AI: { windowMs: 60 * 60 * 1000, maxRequests: 20 },
  /** Form submissions: 5 per 15 minutes */
  FORMS: { windowMs: 15 * 60 * 1000, maxRequests: 5 },
  /** General API: 100 per minute */
  GENERAL: { windowMs: 60 * 1000, maxRequests: 100 },
} as const

// =============================================================================
// STORES
// =============================================================================

// Separate stores for different rate limit contexts
const stores: Map<string, RateLimitStore> = new Map()

function getStore(context: string): RateLimitStore {
  if (!stores.has(context)) {
    stores.set(context, { store: new Map(), requestCount: 0 })
  }
  return stores.get(context)!
}

// =============================================================================
// CLEANUP
// =============================================================================

/**
 * Clean up expired entries periodically to prevent memory leaks.
 * Called every 100 requests per store.
 */
function cleanupStore(storeData: RateLimitStore, windowMs: number): void {
  storeData.requestCount++
  if (storeData.requestCount % 100 === 0) {
    const now = Date.now()
    for (const [key, entry] of storeData.store.entries()) {
      if (now - entry.windowStart > windowMs) {
        storeData.store.delete(key)
      }
    }
  }
}

// =============================================================================
// RATE LIMIT CHECK
// =============================================================================

/**
 * Check if a request should be rate limited.
 *
 * @param key - Unique identifier (e.g., IP address)
 * @param context - Rate limit context (e.g., "auth", "ai")
 * @param options - Rate limit configuration
 * @returns Rate limit result with limited status and retry info
 */
export function checkRateLimit(
  key: string,
  context: string,
  options: RateLimitOptions
): RateLimitResult {
  const storeData = getStore(context)
  cleanupStore(storeData, options.windowMs)

  const now = Date.now()
  const entry = storeData.store.get(key)

  // New window or expired entry
  if (!entry || now - entry.windowStart > options.windowMs) {
    storeData.store.set(key, { count: 1, windowStart: now })
    return { limited: false, remaining: options.maxRequests - 1 }
  }

  // Check if rate limited
  if (entry.count >= options.maxRequests) {
    const retryAfter = Math.ceil(
      (entry.windowStart + options.windowMs - now) / 1000
    )
    return { limited: true, retryAfter, remaining: 0 }
  }

  // Increment count
  entry.count++
  return { limited: false, remaining: options.maxRequests - entry.count }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Extract client IP from request headers.
 * Handles proxied requests (x-forwarded-for) and direct connections.
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }

  if (realIP) {
    return realIP.trim()
  }

  return "unknown"
}

/**
 * Create a rate limit response with proper headers.
 */
export function createRateLimitResponse(retryAfter: number): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
      },
    }
  )
}
