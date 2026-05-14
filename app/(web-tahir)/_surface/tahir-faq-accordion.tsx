/**
 * CATALYST - Tahir FAQ Accordion
 *
 * Grouped FAQ accordion. Each group renders its own title + items; items
 * are independent disclosures that share a single open state per group.
 * Keyboard accessible via native <button>; the rotating "+" icon
 * communicates state visually.
 */

"use client"

import { useState } from "react"

interface FaqItem {
  q: string
  a: string
}

interface FaqGroup {
  id: string
  title: string
  items: FaqItem[]
}

interface TahirFaqAccordionProps {
  groups: FaqGroup[]
}

export function TahirFaqAccordion({ groups }: TahirFaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  return (
    <div className="tahir-accordion">
      {groups.map((group) => (
        <div key={group.id} className="tahir-accordion__group">
          <h3 className="tahir-accordion__group-title">{group.title}</h3>
          {group.items.map((item, index) => {
            const itemId = `${group.id}-${index}`
            const isOpen = openId === itemId
            return (
              <div
                key={itemId}
                className="tahir-accordion__item"
                data-open={isOpen ? "true" : "false"}
              >
                <button
                  type="button"
                  className="tahir-accordion__trigger"
                  aria-expanded={isOpen}
                  onClick={() => toggle(itemId)}
                >
                  <span>{item.q}</span>
                  <svg
                    className="tahir-accordion__icon"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 4v12M4 10h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="tahir-accordion__panel">
                  <div className="tahir-accordion__panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}
