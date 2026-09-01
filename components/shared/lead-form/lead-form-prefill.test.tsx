/**
 * CATALYST - Lead Form Prefill Journey Tests
 */

import { beforeEach, describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"

import { SecondOpinionForm } from "@/components/shared/lead-magnet"

const PREFILL_KEY = "test:second-opinion-prefill"

function renderSecondOpinionForm() {
  return render(
    <SecondOpinionForm
      consentLabel="Consent copy"
      submitLabel="Send request"
      confirmationUrl="/project-second-opinion/thank-you"
      prefillKey={PREFILL_KEY}
      skipPrefilledContact
    />,
  )
}

beforeEach(() => {
  window.sessionStorage.clear()
})

describe("Second Opinion contact prefill", () => {
  it("starts with the property when framework contact details are available", async () => {
    window.sessionStorage.setItem(
      PREFILL_KEY,
      JSON.stringify({
        firstName: "Sam",
        lastName: "Investor",
        email: "sam@example.com",
        whatsapp: "+971501234567",
        consent: true,
      }),
    )

    renderSecondOpinionForm()

    expect(
      await screen.findByRole("heading", { name: "Show us the property." }),
    ).toBeInTheDocument()
    expect(screen.getByText("Step 1 of 2")).toBeInTheDocument()
    expect(screen.queryByText("Who should the adviser contact?")).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /back/i })).not.toBeInTheDocument()
  })

  it("falls back to identity capture when the browser has no saved details", () => {
    renderSecondOpinionForm()

    expect(
      screen.getByRole("heading", { name: "Who should the adviser contact?" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Step 1 of 4")).toBeInTheDocument()
  })
})
