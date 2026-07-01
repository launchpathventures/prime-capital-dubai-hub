/**
 * CATALYST - Event Kiosk
 *
 * Three phases on one screen:
 *   1. setup    — staff name the event, then tap Start to lock into kiosk mode
 *   2. form      — the guest registers (name, email/WhatsApp, interests, comment)
 *   3. thank-you — confirmation, then auto-reset to a fresh form for the next guest
 *
 * Reuses the lead framework by POSTing to /api/leads with formMode "event" —
 * identical validation + AgentCRM forwarding as the website forms.
 *
 * Kiosk-specific attribution: we deliberately do NOT use useAttribution. Its
 * sessionId / first-touch live in device cookies, so on a shared iPad every
 * guest would collapse into one CRM "session". Instead we mint a fresh UUID
 * per guest and tag the source as utmSource=event / utmMedium=kiosk.
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CheckIcon, ArrowRightIcon, XIcon } from "lucide-react"
import { PhoneInput, isValidPhoneNumber } from "@/components/ui/phone-input/phone-input"
import { generateSubmissionId } from "@/lib/hooks/use-attribution"
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// Interest options
//
// Values are sent to AgentCRM as `goals` and drive seller/investor routing
// server-side: a "sell"-only selection routes to "seller" (never "vendor" —
// AgentCRM reserves that for partners). "sell" combined with any buy/investment
// interest routes to "investor". The rest are tags carried as metadata.
// -----------------------------------------------------------------------------

const INTERESTS: { value: string; label: string }[] = [
  { value: "buy-ready", label: "Buying property" },
  { value: "build-wealth", label: "Building an investment portfolio" },
  { value: "advice-only", label: "Strategic investment advice" },
  { value: "golden-visa-wills", label: "Golden Visa & Wills" },
  { value: "business-setup", label: "Setting up a business in Dubai" },
  { value: "development", label: "Building / developing in Dubai" },
  { value: "sell", label: "Selling property" },
  { value: "commercial", label: "Commercial property" },
  { value: "residential", label: "Residential property" },
]

const SESSION_KEY = "pc_kiosk_session"
// Recent events persist across sessions (localStorage) so an accidental trip to
// /register offers one-tap access to events this iPad has run before.
const RECENT_KEY = "pc_kiosk_recent"
const RECENT_SHOWN = 3
const THANKS_RESET_MS = 5000
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Phase = "setup" | "form" | "thanks"

// Who the event's leads are released to in AgentCRM:
//   - "team":     available to all agents for pickup
//   - "managers": held for manager / admin distribution only
type LeadDistribution = "team" | "managers"

const DISTRIBUTION_OPTIONS: {
  value: LeadDistribution
  label: string
  hint: string
}[] = [
  { value: "team", label: "Available to team", hint: "Any agent can pick these up" },
  { value: "managers", label: "Managers only", hint: "Held for manager / admin distribution" },
]

interface KioskSession {
  eventName: string
  eventTag: string
  distribution: LeadDistribution
}

/** Read the recent-events list from localStorage (newest first), tolerating junk. */
function readRecent(): KioskSession[] {
  try {
    const list = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]")
    return Array.isArray(list)
      ? (list as KioskSession[]).filter((e) => e?.eventName && e?.eventTag)
      : []
  } catch {
    return []
  }
}

/** Record an event as most-recently-used (front of the list), deduped by tag. Returns the new list. */
function recordRecent(session: KioskSession): KioskSession[] {
  const others = readRecent().filter((e) => e.eventTag !== session.eventTag)
  const next = [session, ...others].slice(0, RECENT_SHOWN)
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  } catch {
    /* non-fatal — recents just won't persist */
  }
  return next
}

interface EventKioskProps {
  initialEventName?: string
  initialDistribution?: LeadDistribution
}

/** Slugify an event name into a stable, CRM-friendly tag, e.g. "event-cityscape-2026". */
function toEventTag(eventName: string): string {
  const slug = eventName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return slug ? `event-${slug}` : "event"
}

/** Fresh UUID per guest — keeps each registration independent in the CRM. */
function freshId(): string {
  return generateSubmissionId()
}

export function EventKiosk({
  initialEventName = "",
  initialDistribution = "team",
}: EventKioskProps) {
  // A pre-configured link (event supplied in the URL) is a "preregistered" event:
  // staff never see the setup screen, they land straight on the guest form.
  const presetName = initialEventName.trim()
  const preconfigured = presetName.length > 0

  const [phase, setPhase] = useState<Phase>(preconfigured ? "form" : "setup")
  const [eventName, setEventName] = useState(presetName)
  const [eventTag, setEventTag] = useState(preconfigured ? toEventTag(presetName) : "")
  const [distribution, setDistribution] = useState<LeadDistribution>(initialDistribution)
  const [recent, setRecent] = useState<KioskSession[]>([])

  // Guest form state
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [interests, setInterests] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const nameInputRef = useRef<HTMLInputElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Stable identifiers for the guest currently filling the form. Reused across
  // retries so AgentCRM dedupes a re-submit instead of creating duplicates;
  // cleared on reset so the next guest is a brand-new lead.
  const guestIdsRef = useRef<{ submissionId: string; sessionId: string } | null>(null)

  const ensureGuestIds = () => {
    if (!guestIdsRef.current) {
      guestIdsRef.current = { submissionId: freshId(), sessionId: freshId() }
    }
    return guestIdsRef.current
  }

  // Resume an active kiosk after an accidental refresh — staff shouldn't have
  // to re-enter the event name if the iPad reloads mid-event.
  useEffect(() => {
    // A pre-configured link is authoritative: persist its event so a refresh
    // keeps it, and ignore any leftover session from a different event. Also
    // remember it as a recent event for future one-tap access.
    if (preconfigured) {
      const session = { eventName: presetName, eventTag, distribution } satisfies KioskSession
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } catch {
        /* non-fatal — link still works, just won't survive a refresh */
      }
      // Hydrate recents too, so tapping Exit lands on a populated setup screen.
      setRecent(recordRecent(session))
      return
    }
    // Offer this iPad's recent events on the setup screen.
    setRecent(readRecent())
    try {
      const raw = window.sessionStorage.getItem(SESSION_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as KioskSession
      if (saved?.eventName) {
        setEventName(saved.eventName)
        setEventTag(saved.eventTag || toEventTag(saved.eventName))
        if (saved.distribution === "managers" || saved.distribution === "team") {
          setDistribution(saved.distribution)
        }
        setPhase("form")
      }
    } catch {
      /* ignore malformed session */
    }
    // Mount-only: reads the initial link config / stored session exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Focus the first field whenever the blank form is shown.
  useEffect(() => {
    if (phase === "form") nameInputRef.current?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const resetGuestForm = useCallback(() => {
    setFullName("")
    setEmail("")
    setWhatsapp("")
    setInterests([])
    setComment("")
    setError(null)
    // Next guest is a new lead — drop the previous guest's ids.
    guestIdsRef.current = null
  }, [])

  // ---- Setup phase ----------------------------------------------------------

  // Lock into kiosk mode for a given event: persist the session, record it as a
  // recent event, clear the form, and show the guest form. Shared by the setup
  // form and the one-tap "recent events" buttons.
  const beginSession = useCallback(
    (session: KioskSession) => {
      setEventName(session.eventName)
      setEventTag(session.eventTag)
      setDistribution(session.distribution)
      setError(null)
      try {
        window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } catch {
        /* non-fatal — kiosk still works, just won't survive a refresh */
      }
      setRecent(recordRecent(session))
      resetGuestForm()
      setPhase("form")
    },
    [resetGuestForm],
  )

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    const name = eventName.trim()
    if (!name) {
      setError("Enter the event name to start")
      return
    }
    beginSession({ eventName: name, eventTag: toEventTag(name), distribution })
  }

  const handleExit = () => {
    if (!window.confirm("End this kiosk session and return to setup?")) return
    if (resetTimer.current) clearTimeout(resetTimer.current)
    try {
      window.sessionStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
    resetGuestForm()
    setPhase("setup")
  }

  // ---- Guest submission -----------------------------------------------------

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    const name = fullName.trim().replace(/\s+/g, " ")
    const trimmedEmail = email.trim()
    const phone = whatsapp.trim()

    if (!name) {
      setError("Please enter a name")
      return
    }

    const hasEmail = trimmedEmail.length > 0
    const hasPhone = phone.length > 0
    if (!hasEmail && !hasPhone) {
      setError("Add an email or a WhatsApp number")
      return
    }
    if (hasEmail && !EMAIL_REGEX.test(trimmedEmail)) {
      setError("That email doesn't look right")
      return
    }
    if (hasPhone && !isValidPhoneNumber(phone)) {
      setError("That WhatsApp number doesn't look right")
      return
    }

    const [firstName, ...rest] = name.split(" ")
    const lastName = rest.join(" ")

    // Same ids for every retry of this guest; fresh per guest (see resetGuestForm).
    const ids = ensureGuestIds()

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Identity
          firstName,
          lastName: lastName || undefined,
          email: hasEmail ? trimmedEmail : undefined,
          whatsapp: hasPhone ? phone : undefined,

          // Form context — event name lives in leadMagnet, event slug in leadTag
          formMode: "event",
          leadMagnet: eventName,
          leadTag: eventTag,
          // Who these leads are released to: "team" (all agents) or "managers" only
          leadDistribution: distribution,

          // What they're interested in + their note
          goals: interests.length ? interests : undefined,
          enquiryNotes: comment.trim() || undefined,

          // Source attribution — these came from a live event kiosk
          utmSource: "event",
          utmMedium: "kiosk",
          utmCampaign: eventTag,

          // Per-guest identity (fresh so a shared iPad doesn't merge people;
          // stable across retries so AgentCRM dedupes a re-submit)
          submissionId: ids.submissionId,
          sessionId: ids.sessionId,

          submittedAt: new Date().toISOString(),
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || "Could not save — please try again")
      }

      setPhase("thanks")
      resetTimer.current = setTimeout(() => {
        resetGuestForm()
        setPhase("form")
      }, THANKS_RESET_MS)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegisterNext = () => {
    if (resetTimer.current) clearTimeout(resetTimer.current)
    resetGuestForm()
    setPhase("form")
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (phase === "setup") {
    return (
      <div className="kiosk">
        <div className="kiosk__setup">
          <h1 className="kiosk__setup-title">Event Registration</h1>
          <p className="kiosk__setup-sub">
            Name this event, then start the kiosk. Guests register on the next screen.
          </p>
          <form className="kiosk__setup-form" onSubmit={handleStart}>
            <div className="kiosk__field">
              <label htmlFor="event-name" className="kiosk__label">
                Event name
              </label>
              <input
                id="event-name"
                type="text"
                className={cn("kiosk__input", error && "kiosk__input--error")}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Cityscape Global 2026"
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className="kiosk__field">
              <span className="kiosk__label">Lead distribution</span>
              <div className="kiosk__seg" role="group" aria-label="Lead distribution">
                {DISTRIBUTION_OPTIONS.map((opt) => {
                  const selected = distribution === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={cn(
                        "kiosk__seg-option",
                        selected && "kiosk__seg-option--selected",
                      )}
                      aria-pressed={selected}
                      onClick={() => setDistribution(opt.value)}
                    >
                      <span className="kiosk__seg-title">{opt.label}</span>
                      <span className="kiosk__seg-hint">{opt.hint}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            {error && <span className="kiosk__error">{error}</span>}
            <button type="submit" className="kiosk__submit kiosk__submit--block">
              Start Registration
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </form>

          {recent.length > 0 && (
            <div className="kiosk__recent">
              <span className="kiosk__recent-label">Recent events</span>
              <div className="kiosk__recent-list">
                {recent.map((item) => (
                  <button
                    key={item.eventTag}
                    type="button"
                    className="kiosk__recent-item"
                    onClick={() => beginSession(item)}
                  >
                    <span className="kiosk__recent-name">{item.eventName}</span>
                    {item.distribution === "managers" && (
                      <span className="kiosk__recent-tag">Managers only</span>
                    )}
                    <ArrowRightIcon className="kiosk__recent-arrow h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (phase === "thanks") {
    return (
      <div className="kiosk">
        <div className="kiosk__card">
          <div className="kiosk__thanks">
            <div className="kiosk__thanks-mark">
              <CheckIcon className="h-11 w-11" strokeWidth={1.5} />
            </div>
            <h2 className="kiosk__thanks-title">Thank you</h2>
            <p className="kiosk__thanks-sub">
              You&apos;re registered. A member of the Prime Capital team will be in touch shortly.
            </p>
            <button
              type="button"
              className="kiosk__submit kiosk__thanks-next"
              onClick={handleRegisterNext}
            >
              Register next guest
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // phase === "form"
  return (
    <div className="kiosk">
      <form className="kiosk__card" onSubmit={handleSubmit}>
        {/* Staff-facing cue that this session is restricted distribution */}
        {distribution === "managers" && (
          <span className="kiosk__mode-badge">Managers only</span>
        )}
        <button
          type="button"
          className="kiosk__exit"
          onClick={handleExit}
          aria-label="End kiosk session"
          title="End kiosk session"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>

        <header className="kiosk__header">
          <span className="kiosk__eyebrow">Register your interest</span>
          <h1 className="kiosk__event-name">{eventName}</h1>
          <p className="kiosk__subtitle">
            Leave your details and we&apos;ll follow up after the event.
          </p>
        </header>

        <div className="kiosk__body">
          <div className="kiosk__grid">
            {/* Left column — contact */}
            <div>
              <div className="kiosk__field">
                <label htmlFor="full-name" className="kiosk__label">
                  Name
                </label>
                <input
                  ref={nameInputRef}
                  id="full-name"
                  type="text"
                  className="kiosk__input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  autoComplete="off"
                />
              </div>

              <div className="kiosk__field">
                <label htmlFor="email" className="kiosk__label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="kiosk__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="off"
                  inputMode="email"
                />
              </div>

              <div className="kiosk__field">
                <label htmlFor="whatsapp" className="kiosk__label">
                  WhatsApp / Mobile
                </label>
                <PhoneInput
                  id="whatsapp"
                  className="kiosk-phone"
                  value={whatsapp}
                  onChange={(v) => setWhatsapp(v ?? "")}
                  placeholder="50 123 4567"
                  autoComplete="off"
                />
                <span className="kiosk__hint">Email or WhatsApp — either is fine.</span>
              </div>
            </div>

            {/* Right column — interests + comment */}
            <div>
              <div className="kiosk__field">
                <span className="kiosk__label">What are you interested in?</span>
                <div className="kiosk__chips" role="group" aria-label="Interests">
                  {INTERESTS.map((interest) => {
                    const selected = interests.includes(interest.value)
                    return (
                      <button
                        key={interest.value}
                        type="button"
                        className={cn(
                          "kiosk__chip",
                          selected && "kiosk__chip--selected",
                        )}
                        aria-pressed={selected}
                        onClick={() => toggleInterest(interest.value)}
                      >
                        <span className="kiosk__chip-check">
                          {selected && <CheckIcon className="h-3 w-3" strokeWidth={2.5} />}
                        </span>
                        {interest.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="kiosk__field">
                <label htmlFor="comment" className="kiosk__label">
                  Anything else? <span className="kiosk__hint">(optional)</span>
                </label>
                <textarea
                  id="comment"
                  className="kiosk__input"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="A quick note about what you're looking for…"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="kiosk__footer">
          {error ? (
            <span className="kiosk__error" role="alert">
              {error}
            </span>
          ) : (
            <span className="kiosk__hint">Takes 30 seconds.</span>
          )}
          <button
            type="submit"
            className="kiosk__submit"
            style={{ marginLeft: "auto" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="kiosk__spinner" />
                Saving…
              </>
            ) : (
              <>
                Register
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  )
}
