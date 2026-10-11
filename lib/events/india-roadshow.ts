/**
 * CATALYST - India Roadshow Event Config
 *
 * Single source of truth for the roadshow tag and cities. City names are
 * AgentCRM lookup keys (reminder date + venue), so spellings must match the
 * list agreed with the CRM team exactly.
 */

export const INDIA_ROADSHOW_TAG = "event-india-2026-roadshow"

export const INDIA_ROADSHOW_DATES = "30 & 31 October, 1 November 2026"

// TODO: confirm advisors with the Prime team before launch.
export const INDIA_ROADSHOW_STOPS = [
  {
    city: "Ludhiana",
    day: "Friday",
    date: "30 October",
    venue: "Hyatt Regency",
    hours: "9 am – 9 pm",
  },
  {
    city: "Jalandhar",
    day: "Saturday",
    date: "31 October",
    venue: "Park Inn by Radisson",
    hours: "10 am – 10 pm",
  },
  {
    city: "Amritsar",
    day: "Sunday",
    date: "1 November",
    venue: "Taj Swarna",
    hours: "10 am – 10 pm",
  },
] as const

export const INDIA_ROADSHOW_CITIES = INDIA_ROADSHOW_STOPS.map((s) => s.city) as [
  (typeof INDIA_ROADSHOW_STOPS)[number]["city"],
  ...(typeof INDIA_ROADSHOW_STOPS)[number]["city"][],
]
