/**
 * CATALYST - Admin User Invite Tests
 *
 * Tests for admin user creation/invite flow including authorization,
 * validation, and profile creation.
 */

import { describe, it, expect, vi, beforeEach, afterAll } from "vitest"

// Mock Supabase server client
const mockServerClient = {
  auth: {
    getUser: vi.fn(),
  },
  rpc: vi.fn(),
}

// Mock Supabase admin client
const mockAdminClient = {
  auth: {
    admin: {
      createUser: vi.fn(),
    },
  },
  from: vi.fn(),
}

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => Promise.resolve(mockServerClient)),
}))

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockAdminClient),
}))

describe("Admin User Invite API", () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset environment
    process.env = {
      ...originalEnv,
      AUTH_DEFAULT_PASSWORD: "test-password-123",
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "test-service-role-key",
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  // =============================================================================
  // AUTHORIZATION TESTS
  // =============================================================================

  describe("Authorization", () => {
    it("should reject requests from unauthenticated users", async () => {
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "newuser@example.com")
      formData.append("full_name", "New User")
      formData.append("role", "learner")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(401)

      const data = await response.json()
      expect(data.error).toBe("Unauthorized")
    })

    it("should reject requests from non-admin users", async () => {
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
      })
      mockServerClient.rpc.mockResolvedValue({
        data: false, // Not an admin
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "newuser@example.com")
      formData.append("full_name", "New User")
      formData.append("role", "learner")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(403)

      const data = await response.json()
      expect(data.error).toBe("Access denied: Admin only")
    })
  })

  // =============================================================================
  // VALIDATION TESTS
  // =============================================================================

  describe("Validation", () => {
    beforeEach(() => {
      // Setup authenticated admin user
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "admin-123" } },
      })
      mockServerClient.rpc.mockResolvedValue({
        data: true, // Is admin
      })
    })

    it("should reject requests without email", async () => {
      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("full_name", "New User")
      formData.append("role", "learner")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe("Email is required")
    })

    it("should use default role when not provided", async () => {
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: "new-user-123" } },
        error: null,
      })
      mockAdminClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "newuser@example.com")
      formData.append("full_name", "New User")
      // No role provided - should default to "learner"

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)

      // Verify createUser was called with default role
      expect(mockAdminClient.auth.admin.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          user_metadata: expect.objectContaining({
            role: "learner",
          }),
        })
      )
    })
  })

  // =============================================================================
  // USER CREATION TESTS
  // =============================================================================

  describe("User Creation", () => {
    beforeEach(() => {
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "admin-123" } },
      })
      mockServerClient.rpc.mockResolvedValue({
        data: true,
      })
    })

    it("should create user with auto-confirmed email", async () => {
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: "new-user-123" } },
        error: null,
      })
      mockAdminClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "newuser@example.com")
      formData.append("full_name", "New User")
      formData.append("role", "learner")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      await POST(request)

      expect(mockAdminClient.auth.admin.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "newuser@example.com",
          email_confirm: true,
          user_metadata: {
            full_name: "New User",
            role: "learner",
          },
        })
      )
    })

    it("should return success with user ID on successful creation", async () => {
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: "new-user-456" } },
        error: null,
      })
      mockAdminClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "success@example.com")
      formData.append("full_name", "Success User")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.userId).toBe("new-user-456")
    })

    it("should handle user creation errors", async () => {
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: null },
        error: { message: "User already exists" },
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "existing@example.com")
      formData.append("full_name", "Existing User")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(400)

      const data = await response.json()
      expect(data.error).toBe("User already exists")
    })
  })

  // =============================================================================
  // PROFILE CREATION TESTS
  // =============================================================================

  describe("Profile Creation", () => {
    beforeEach(() => {
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "admin-123" } },
      })
      mockServerClient.rpc.mockResolvedValue({
        data: true,
      })
    })

    it("should create user profile after successful user creation", async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null })
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: "new-user-789" } },
        error: null,
      })
      mockAdminClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "profile@example.com")
      formData.append("full_name", "Profile User")
      formData.append("role", "admin")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      await POST(request)

      expect(mockAdminClient.from).toHaveBeenCalledWith("user_profiles")
      expect(mockInsert).toHaveBeenCalledWith({
        id: "new-user-789",
        full_name: "Profile User",
        role: "admin",
        certification_status: "in_progress",
      })
    })

    it("should still return success even if profile creation fails", async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        error: { message: "Profile creation failed" }
      })
      mockAdminClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: "new-user-999" } },
        error: null,
      })
      mockAdminClient.from.mockReturnValue({
        insert: mockInsert,
      })

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "profile-fail@example.com")
      formData.append("full_name", "Profile Fail User")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      // User was created successfully, even though profile failed
      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })

  // =============================================================================
  // CONFIGURATION TESTS
  // =============================================================================

  describe("Configuration", () => {
    beforeEach(() => {
      mockServerClient.auth.getUser.mockResolvedValue({
        data: { user: { id: "admin-123" } },
      })
      mockServerClient.rpc.mockResolvedValue({
        data: true,
      })
    })

    it("should return 500 when default password is not configured", async () => {
      // Remove default password
      delete process.env.AUTH_DEFAULT_PASSWORD

      // Need to re-import to pick up changed env
      vi.resetModules()

      const { POST } = await import("@/app/api/admin/invite-user/route")

      const formData = new FormData()
      formData.append("email", "test@example.com")
      formData.append("full_name", "Test User")

      const request = new Request("http://localhost/api/admin/invite-user", {
        method: "POST",
        body: formData,
      })

      const response = await POST(request)
      expect(response.status).toBe(500)

      const data = await response.json()
      expect(data.error).toContain("configuration error")
    })
  })
})
