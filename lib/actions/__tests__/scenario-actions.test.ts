/**
 * CATALYST - Scenario Actions Tests
 * 
 * Tests for scenario completion and reflection validation.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Supabase client before importing the action
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Import after mocking
import { completeScenario } from '@/lib/actions/scenario-actions'
import { createClient } from '@/lib/supabase/server'

describe('completeScenario', () => {
  const mockUpsert = vi.fn()
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpsert.mockReset()
  })

  function mockSupabase(user: { id: string } | null, upsertError: Error | null = null) {
    vi.mocked(createClient).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        upsert: mockUpsert.mockResolvedValue({ error: upsertError }),
      }),
    } as unknown as Awaited<ReturnType<typeof createClient>>)
  }

  it('returns error if not authenticated', async () => {
    mockSupabase(null)

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics and how to respond to objections.',
      improve: 'I would listen more carefully and ask better questions.',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Not authenticated')
  })

  it('validates reflection learned minimum length', async () => {
    mockSupabase({ id: 'user-123' })

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'Short',
      improve: 'I would listen more carefully next time.',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('at least 20 characters')
  })

  it('validates reflection improve minimum length', async () => {
    mockSupabase({ id: 'user-123' })

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics and responses.',
      improve: 'Listen more',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('at least 20 characters')
  })

  it('saves valid reflection successfully', async () => {
    mockSupabase({ id: 'user-123' })

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics and how to respond.',
      improve: 'I would listen more carefully and ask better questions.',
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        scenario_category: 'category',
        scenario_id: 'scenario-1',
        reflection_learned: 'I learned about negotiation tactics and how to respond.',
        reflection_improve: 'I would listen more carefully and ask better questions.',
      }),
      expect.any(Object)
    )
  })

  it('returns error when database save fails', async () => {
    mockSupabase({ id: 'user-123' }, new Error('Database error'))

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics and how to respond.',
      improve: 'I would listen more carefully and ask better questions.',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Failed to save reflection')
  })
})
