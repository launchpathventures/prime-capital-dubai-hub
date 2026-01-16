/**
 * CATALYST - Learn Auth Tests
 *
 * Tests for authentication helpers used by the Learn surface.
 * Covers requireAuth, requireAdmin, and getUserRole functions.
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
      })),
    })),
  })),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabase)),
}))

// Mock redirect
const mockRedirect = vi.fn()
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    mockRedirect(url)
    throw new Error(`REDIRECT: ${url}`)
  },
}))

describe("Auth Helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("requireAuth", () => {
    it("should redirect to login when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const { requireAuth } = await import("@/lib/auth/require-auth")

      await expect(requireAuth()).rejects.toThrow("REDIRECT")
      expect(mockRedirect).toHaveBeenCalledWith("/auth/login")
    })

    it("should return user when authenticated", async () => {
      const mockUser = { id: "123", email: "test@example.com" }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const { requireAuth } = await import("@/lib/auth/require-auth")
      const result = await requireAuth()

      expect(result).toEqual(mockUser)
    })
  })

  describe("getUserRole", () => {
    it("should return 'learner' when user is not authenticated", async () => {
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const { getUserRole } = await import("@/lib/auth/require-auth")
      const role = await getUserRole()

      expect(role).toBe("learner")
    })

    it("should return 'admin' for admin users", async () => {
      const mockUser = { id: "123" }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { role: "admin" },
            }),
          })),
        })),
      })

      const { getUserRole } = await import("@/lib/auth/require-auth")
      const role = await getUserRole()

      expect(role).toBe("admin")
    })

    it("should return 'learner' for non-admin users", async () => {
      const mockUser = { id: "123" }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { role: "learner" },
            }),
          })),
        })),
      })

      const { getUserRole } = await import("@/lib/auth/require-auth")
      const role = await getUserRole()

      expect(role).toBe("learner")
    })
  })

  describe("requireAdmin", () => {
    it("should redirect non-admin users to /learn", async () => {
      const mockUser = { id: "123" }
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      mockSupabase.from.mockReturnValue({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn().mockResolvedValue({
              data: { role: "learner" },
            }),
          })),
        })),
      })

      const { requireAdmin } = await import("@/lib/auth/require-auth")

      await expect(requireAdmin()).rejects.toThrow("REDIRECT")
      expect(mockRedirect).toHaveBeenCalledWith("/learn")
    })
  })
})
