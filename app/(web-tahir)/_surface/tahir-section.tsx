/**
 * CATALYST - Tahir Section Wrapper
 *
 * Vertical rhythm container for the Tahir brand surface. Wraps a tone
 * variant (`default`, `elevated`, `dark`) and an optional section header
 * (eyebrow + headline + lead) so individual pages can stay declarative.
 */

import type { ReactNode } from "react"

type Tone = "default" | "elevated" | "dark"

interface TahirSectionProps {
  id?: string
  tone?: Tone
  eyebrow?: string
  headline?: string
  lead?: string
  align?: "start" | "center"
  children?: ReactNode
}

const toneClass: Record<Tone, string> = {
  default: "tahir-section",
  elevated: "tahir-section tahir-section--elevated",
  dark: "tahir-section tahir-section--dark",
}

export function TahirSection({
  id,
  tone = "default",
  eyebrow,
  headline,
  lead,
  align = "start",
  children,
}: TahirSectionProps) {
  const hasHeader = Boolean(eyebrow || headline || lead)
  const headerClass =
    "tahir-section__header" + (align === "center" ? " tahir-section__header--center" : "")

  return (
    <section id={id} className={toneClass[tone]}>
      <div className="tahir-container">
        {hasHeader ? (
          <div className={headerClass}>
            {eyebrow ? <p className="tahir-eyebrow">{eyebrow}</p> : null}
            {headline ? <h2 className="tahir-h2">{headline}</h2> : null}
            {lead ? <p className="tahir-lead">{lead}</p> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
