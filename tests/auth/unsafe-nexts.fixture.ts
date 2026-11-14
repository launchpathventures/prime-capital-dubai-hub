/**
 * CATALYST - `next` values that must never be followed (test fixture, serviceos#2347)
 *
 * Shared by the helper, callback and proxy tests so all three refuse the same list.
 */

// Each must fall back. The dot-segment and encoded forms pass a check of the raw input and only become "//evil.example"
// once decoded or normalised, so the helper checks the normalised value too.
export const UNSAFE_NEXTS = [
  "//evil.example", "https://evil.example", "/\\evil.example", "\\\\evil.example", "/%5Cevil.example",
  "javascript:alert(1)", "http:/evil.example", " //evil.example", "/\t/evil.example",
  "/.//evil.example", "/app/..//evil.example", "/%2e%2e//evil.example", "/%2E%2E//evil.example",
  "/%2e//evil.example", "/%2E//evil.example", "/./%2F/evil.example", "/.%2F/evil.example",
  "/%2e%2F/evil.example", "/app/%2e%2E//evil.example", "/app/.%2e//evil.example",
  "/a/b/../..//evil.example", "/..//evil.example", "/././/evil.example", "/.\\/evil.example",
  "/%2e/%5Cevil.example",
]
