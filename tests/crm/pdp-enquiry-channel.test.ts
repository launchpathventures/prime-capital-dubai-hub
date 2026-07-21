/**
 * CATALYST - PDP enquiry-channel guard
 *
 * The property detail page must keep the CRM iframe widget as the single owner
 * of PDP enquiries. It must NOT also submit through the server /api/leads route
 * (that route is for native, non-widget forms only). This is a structural guard
 * — the async server component can't be imported under jsdom because it pulls in
 * server-only modules.
 */
import { describe, it, expect } from "vitest"
import { readFileSync } from "node:fs"
import path from "node:path"

const pageSource = readFileSync(
  path.join(process.cwd(), "app/(web)/properties/[slug]/page.tsx"),
  "utf8",
)

describe("PDP enquiry channel", () => {
  it("renders the iframe enquiry widget", () => {
    expect(pageSource).toContain("PropertyEnquiryWidget")
  })

  it("does not submit through /api/leads", () => {
    expect(pageSource).not.toContain("/api/leads")
  })

  it("exposes an #enquiry anchor as the CTA target", () => {
    expect(pageSource).toContain('id="enquiry"')
  })

  it("scrubs the share token from the URL when present", () => {
    expect(pageSource).toContain("StripShareToken")
  })

  it("shows the API-provided agent without passing it into the widget", () => {
    expect(pageSource).toContain("<PropertyAgentCard agent={property.agent} />")
    const widgetStart = pageSource.indexOf("<PropertyEnquiryWidget")
    const widgetEnd = pageSource.indexOf("/>", widgetStart)
    expect(pageSource.slice(widgetStart, widgetEnd)).not.toContain("agent=")
  })

  it("never renders a secondary unit number", () => {
    expect(pageSource).not.toContain("property.unitNumber")
  })
})
