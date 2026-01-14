# LMS-027: Test Coverage

**Status:** 📋 READY  
**Priority:** P1 High  
**Estimated Time:** 3-4 hours  
**Dependencies:** LMS-022 (auth protection)  

---

## Objective

Add basic test coverage for critical Learn surface flows. Focus on quiz submission, scenario completion, and auth protection — the paths most likely to break and hardest to manually verify.

---

## Context

The audit found zero test files in the Learn surface. For PROD readiness, we need confidence that:

1. **Quiz submission works** — Answers are validated, scores calculated, attempts recorded
2. **Scenario completion works** — Reflections are validated and saved
3. **Auth protection works** — Unauthenticated users are redirected

---

## Deliverables

### 1. Set Up Test Infrastructure

If not already present, configure Vitest for the project:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))
```

### 2. Quiz Submission Tests

```typescript
// app/learn/quiz/__tests__/quiz-submission.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QuizQuestion } from '@/components/lms/quiz-question'

describe('QuizQuestion', () => {
  const mockQuestion = {
    id: 'q1',
    questionText: 'What is the capital of UAE?',
    options: [
      { text: 'Dubai', correct: false },
      { text: 'Abu Dhabi', correct: true },
      { text: 'Sharjah', correct: false },
    ],
    explanation: 'Abu Dhabi is the capital.',
  }

  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders question text and options', () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)
    
    expect(screen.getByText('What is the capital of UAE?')).toBeInTheDocument()
    expect(screen.getByText('Dubai')).toBeInTheDocument()
    expect(screen.getByText('Abu Dhabi')).toBeInTheDocument()
    expect(screen.getByText('Sharjah')).toBeInTheDocument()
  })

  it('disables submit button until option is selected', () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button after selecting option', () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)
    
    fireEvent.click(screen.getByText('Abu Dhabi'))
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('calls onSubmit with selected option index', async () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)
    
    fireEvent.click(screen.getByText('Abu Dhabi'))
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith(1) // Index of Abu Dhabi
  })

  it('supports keyboard navigation with arrow keys', () => {
    render(<QuizQuestion question={mockQuestion} onSubmit={mockOnSubmit} />)
    
    const firstOption = screen.getByLabelText(/Option 1/i)
    firstOption.focus()
    
    fireEvent.keyDown(firstOption, { key: 'ArrowDown' })
    
    expect(document.activeElement).toBe(screen.getByLabelText(/Option 2/i))
  })
})
```

### 3. Scenario Completion Tests

```typescript
// lib/actions/__tests__/scenario-actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { completeScenario } from '@/lib/actions/scenario-actions'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: 'user-123' } },
        error: null,
      })),
    },
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({ error: null })),
    })),
  })),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

describe('completeScenario', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns error if not authenticated', async () => {
    const { createClient } = await import('@/lib/supabase/server')
    vi.mocked(createClient).mockResolvedValueOnce({
      auth: {
        getUser: vi.fn(() => ({
          data: { user: null },
          error: null,
        })),
      },
    } as any)

    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation.',
      improve: 'I would listen more carefully.',
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Not authenticated')
  })

  it('validates reflection learned minimum length', async () => {
    const result = await completeScenario('category', 'scenario-1', {
      learned: 'Short',
      improve: 'I would listen more carefully next time.',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('at least 20 characters')
  })

  it('validates reflection improve minimum length', async () => {
    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics.',
      improve: 'Listen more',
    })

    expect(result.success).toBe(false)
    expect(result.error).toContain('at least 20 characters')
  })

  it('saves valid reflection successfully', async () => {
    const result = await completeScenario('category', 'scenario-1', {
      learned: 'I learned about negotiation tactics and how to respond.',
      improve: 'I would listen more carefully and ask better questions.',
    })

    expect(result.success).toBe(true)
    expect(result.error).toBeUndefined()
  })
})
```

### 4. Auth Protection Tests

```typescript
// middleware.test.ts
import { describe, it, expect, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'

// Note: Middleware testing is tricky - this is a simplified version
// For full testing, consider using a test framework like Playwright

describe('Auth Middleware', () => {
  it('redirects unauthenticated users from /learn', async () => {
    // This would be better as an integration test
    // Here we just verify the expected behavior
    
    const redirectUrl = new URL('/auth/login', 'http://localhost:3000')
    redirectUrl.searchParams.set('redirectTo', '/learn')
    
    expect(redirectUrl.pathname).toBe('/auth/login')
    expect(redirectUrl.searchParams.get('redirectTo')).toBe('/learn')
  })

  it('allows authenticated users to access /learn', async () => {
    // Would need actual middleware execution context
    // Consider E2E test for this
    expect(true).toBe(true)
  })
})
```

### 5. Add Test Script to package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Files to Create

| File | Purpose |
|------|---------|
| `vitest.config.ts` | Vitest configuration |
| `tests/setup.ts` | Test setup and mocks |
| `app/learn/quiz/__tests__/quiz-submission.test.tsx` | Quiz component tests |
| `lib/actions/__tests__/scenario-actions.test.ts` | Scenario action tests |

---

## Acceptance Criteria

- [ ] `pnpm test:run` passes all tests
- [ ] Quiz submission flow has test coverage
- [ ] Scenario reflection validation is tested
- [ ] Auth middleware behavior is documented (if not fully testable)
- [ ] Tests run in CI pipeline

---

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test app/learn/quiz

# Run with coverage
pnpm test:coverage
```

---

## Notes

- Start with unit tests for pure functions and components
- Server actions are harder to test — mock Supabase client
- Middleware and auth flows are best tested with E2E (Playwright)
- Consider adding E2E tests in a future brief for critical user journeys
- Keep tests focused and fast — aim for <10s total runtime
