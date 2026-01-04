/**
 * CATALYST - Examples Surface Layout
 *
 * Wraps all /examples/* routes with the ExamplesShell.
 * Note: shared.css is already imported in root layout — don't duplicate.
 */

import "./examples.css"
import { ExamplesShell } from "./_surface/examples-shell"

export default function ExamplesLayout({ children }: { children: React.ReactNode }) {
  return <ExamplesShell>{children}</ExamplesShell>
}
