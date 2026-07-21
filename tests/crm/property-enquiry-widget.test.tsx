/**
 * CATALYST - PropertyEnquiryWidget attribution tests
 *
 * The share token must reach the iframe from the `shareRef` prop, never from
 * window.location.search — the PDP scrubs ref/share from the URL on mount.
 */
import { describe, it, expect, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"

import { PropertyEnquiryWidget } from "@/components/shared/property-enquiry-widget/property-enquiry-widget"

const TITLE = "Enquire about this property"

beforeEach(() => {
  window.history.replaceState({}, "", "/")
})

describe("PropertyEnquiryWidget attribution", () => {
  it("forwards the shareRef prop as the iframe's canonical ref", async () => {
    render(<PropertyEnquiryWidget slug="marina-tower" shareRef={{ present: true, value: "tok-abc" }} />)
    const iframe = await screen.findByTitle(TITLE)
    expect(iframe.getAttribute("src")).toContain("ref=tok-abc")
  })

  it("survives URL scrubbing — token comes from the prop, not the address bar", async () => {
    // URL has no token (already scrubbed) but the prop carries it.
    render(<PropertyEnquiryWidget slug="marina-tower" shareRef={{ present: true, value: "tok-xyz" }} />)
    const iframe = await screen.findByTitle(TITLE)
    expect(iframe.getAttribute("src")).toContain("ref=tok-xyz")
  })

  it("does NOT read a ref token from window.location.search", async () => {
    window.history.replaceState({}, "", "/?ref=url-token&utm_source=email")
    render(<PropertyEnquiryWidget slug="marina-tower" />)
    const iframe = await screen.findByTitle(TITLE)
    const src = iframe.getAttribute("src") ?? ""
    expect(src).not.toContain("url-token")
    // UTM is still read from the URL — only the ref token is prop-sourced.
    expect(src).toContain("utm_source=email")
  })

  it("forwards nothing for a present-but-blank ref", async () => {
    render(<PropertyEnquiryWidget slug="marina-tower" shareRef={{ present: true, value: "" }} />)
    const iframe = await screen.findByTitle(TITLE)
    const src = iframe.getAttribute("src") ?? ""
    expect(src).not.toMatch(/[?&]ref=/)
  })

  it("does not copy a property reference into website analytics", async () => {
    window.dataLayer = []
    render(<PropertyEnquiryWidget slug="marina-tower" />)
    const iframe = await screen.findByTitle(TITLE)
    const src = iframe.getAttribute("src") ?? ""

    window.dispatchEvent(
      new MessageEvent("message", {
        origin: new URL(src).origin,
        data: {
          type: "widget.enquiry.submitted",
          payload: {
            leadUuid: "lead-1",
            contactId: "contact-1",
            propertyRef: "REF-APT-1203",
          },
        },
      }),
    )

    expect(window.dataLayer).toEqual([
      {
        event: "generate_lead",
        lead_id: "lead-1",
        contact_id: "contact-1",
      },
    ])
  })
})
