# Catalyst Testing

Testing with Vitest and React Testing Library.

## Commands

```bash
pnpm test              # Watch mode (re-runs on changes)
pnpm test:run          # Single run (CI mode)
pnpm test:coverage     # Run with coverage report

# Run specific tests
pnpm vitest run modules/crm           # All CRM module tests
pnpm vitest run modules/diagrams      # All Diagrams module tests
pnpm vitest run path/to/file.test.ts  # Single file
pnpm vitest run -t "test name"        # Filter by test name
```

## File Structure

Place test files next to the code they test:
```
modules/crm/
├── validators/
│   ├── contact-validators.ts
│   └── contact-validators.test.ts    # ← Test file
├── lib/
│   ├── mappers.ts
│   └── mappers.test.ts
```

## Writing Tests

### Backend (Logic, Validators, Utils)

```typescript
import { describe, it, expect } from "vitest"
import { myFunction } from "./my-module"

describe("myFunction", () => {
  it("should return expected result", () => {
    expect(myFunction("input")).toBe("output")
  })

  it("should throw on invalid input", () => {
    expect(() => myFunction(null)).toThrow()
  })
})
```

### Frontend (React Components)

```tsx
import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { MyComponent } from "./my-component"

describe("MyComponent", () => {
  it("should render", () => {
    render(<MyComponent />)
    expect(screen.getByText("Hello")).toBeInTheDocument()
  })

  it("should call onClick", () => {
    const onClick = vi.fn()
    render(<MyComponent onClick={onClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalled()
  })
})
```

### Testing with Refs

```tsx
import * as React from "react"

it("should expose methods via ref", () => {
  const ref = React.createRef<MyComponentRef>()
  render(<MyComponent ref={ref} />)
  
  ref.current?.doSomething()
  expect(ref.current?.getData()).toEqual({ ... })
})
```

### Testing with Context Providers

```tsx
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <SomeProvider>{children}</SomeProvider>
}

it("should work with provider", () => {
  render(
    <TestWrapper>
      <MyComponent />
    </TestWrapper>
  )
})
```

## Key APIs

| Import | Use |
|--------|-----|
| `describe, it, expect` | Test structure |
| `vi.fn()` | Mock functions |
| `vi.mock()` | Mock modules |
| `render()` | Mount component |
| `screen.getByText()` | Query by text |
| `screen.getByRole()` | Query by role |
| `fireEvent.click()` | Simulate events |
| `waitFor()` | Async assertions |

## Tips

- **Keep tests focused** — one behavior per test
- **Use `vi.fn()`** to mock callbacks and verify calls
- **Async state?** Use `await waitFor(() => expect(...))` or `await new Promise(r => setTimeout(r, 100))`
- **Mock browser APIs** in `vitest.setup.ts` (ResizeObserver, IntersectionObserver already mocked)
