/**
 * CATALYST - Livestream Event Content
 *
 * Source of truth for livestream landing pages at /live/[slug].
 * Add a new entry here to publish a new event — no new code needed.
 *
 * Each event gets its own CRM tag so registrants can be segmented
 * and nurtured per-event in Bitrix.
 */

export type LivestreamStatus = "upcoming" | "live" | "replay"
export type LivestreamPlatform = "YouTube Live" | "Instagram Live"

export type LivestreamTopicIcon =
  | "globe"
  | "trending-down"
  | "trending-up"
  | "compass"
  | "shield"
  | "building"
  | "landmark"

export interface LivestreamTopic {
  icon: LivestreamTopicIcon
  title: string
  description: string
}

export interface LivestreamFAQ {
  question: string
  answer: string
}

export interface LivestreamHost {
  name: string
  role: string
  bio: string
  /** Path to host photo — e.g. "/images/team/tahir-majithia.png" */
  imageUrl?: string
  /** Pull-quote from the host about this event's topic */
  quote?: string
  /** Optional team slug — links to /team/[slug] */
  teamSlug?: string
}

export interface Livestream {
  /** URL slug — used in /live/[slug] */
  slug: string

  /** Status controls what the page shows (upcoming form / live embed / replay link) */
  status: LivestreamStatus

  /** ISO date string for the event start */
  startsAt: string

  /** Human-readable date — e.g. "Saturday, 2 May 2026" */
  dateLabel: string

  /** Human-readable time with primary timezone — e.g. "7:00 PM GST" */
  timeLabel: string

  /** Secondary timezones for international viewers — e.g. "11am EST · 4pm BST" */
  timeSecondary?: string

  /** Duration copy — e.g. "45 min + live Q&A" */
  durationLabel: string

  /** Where the livestream will be hosted */
  platform: LivestreamPlatform

  /** YouTube live/replay URL — optional until the stream is scheduled */
  youtubeUrl?: string

  /** CRM tag — sent to Bitrix as leadTag for segmentation */
  leadTag: string

  /** ─── Hero content ─── */
  eyebrow: string
  headline: string
  subtitle: string
  /** Optional hero bullet list — leave off for a tighter hero */
  benefits?: string[]
  trustLine?: string

  /** ─── Form copy ─── */
  formHeadline: string
  formSubtitle: string
  successMessage: string

  /** ─── Topics section (3 cards) ─── */
  topicsEyebrow: string
  topicsHeadline: string
  topics: LivestreamTopic[]

  /** ─── Who this is for ─── */
  audienceEyebrow: string
  audienceHeadline: string
  audience: string[]

  /** ─── Host ─── */
  host: LivestreamHost

  /** ─── FAQ ─── */
  faq: LivestreamFAQ[]

  /** ─── SEO / OG ─── */
  metaTitle: string
  metaDescription: string
  ogImage?: string
}

/**
 * Registered livestreams. Add new events here.
 *
 * Convention:
 * - slug: short, URL-friendly, reusable in bios and WhatsApp
 * - leadTag: `livestream-{topic}-{YYYY-MM-DD}` — date-versioned for CRM
 * - status: flip to "live" on the day, "replay" after
 */
export const LIVESTREAMS: Livestream[] = [
  {
    slug: "may-2",
    status: "upcoming",
    startsAt: "2026-05-02T15:00:00Z", // 7pm GST = 3pm UTC
    dateLabel: "Saturday, 2 May 2026",
    timeLabel: "7:00 PM GST",
    timeSecondary: "11am EST · 4pm BST · 8:30pm IST",
    durationLabel: "45 min + live Q&A",
    platform: "YouTube Live",
    youtubeUrl: undefined,
    leadTag: "livestream-market-update-2026-05-02",

    eyebrow: "Live · Saturday 2 May · 7pm GST",
    headline: "Dubai Real Estate: What's Actually Happening",
    subtitle:
      "The geopolitics, the 'crash' that isn't coming, and where the smart money is positioning.",
    benefits: [
      "Why the discounts everyone's waiting for aren't coming",
      "What the news is getting wrong about the region",
      "Where capital is quietly positioning right now",
    ],
    trustLine: "Hosted by Tahir Majithia · Prime Capital Dubai · RERA Licensed",

    formHeadline: "Reserve Your Seat",
    formSubtitle: "Free · 45 minutes · Replay included",
    successMessage:
      "You're in. Check your email and WhatsApp — we've sent the calendar invite and the live link.",

    topicsEyebrow: "What We'll Cover",
    topicsHeadline: "Three things you won't hear on the news",
    topics: [
      {
        icon: "globe",
        title: "The geopolitical picture",
        description:
          "What Iran, Israel, the Red Sea, and sanctions actually mean for Dubai property. Signal vs. noise, with ground-level evidence from current transactions.",
      },
      {
        icon: "trending-down",
        title: "The discount delusion",
        description:
          "Why sellers aren't budging, what 2026 sales data actually shows, and where waiting for a 'crash' is already costing buyers their best options.",
      },
      {
        icon: "trending-up",
        title: "Positioning for what's next",
        description:
          "Which areas are absorbing capital, which are softening, and how to structure a move that's ready for the next leg of the cycle.",
      },
    ],

    audienceEyebrow: "Who this is for",
    audienceHeadline: "If any of these sound familiar, this session is for you",
    audience: [
      "Investors sitting on cash, waiting for the 'right moment' that keeps not arriving",
      "Owners weighing whether to sell based on what they've seen in the news",
      "First-time buyers trying to separate signal from noise",
      "Anyone curious what's actually happening beyond the headline cycle",
    ],

    host: {
      name: "Tahir Majithia",
      role: "Founder, Prime Capital Dubai",
      bio: "Tahir advises international investors on Dubai property — apartments, villas, branded residences, and off-plan. He's on the ground every day, transacting through every market condition, and known for straight-talk analysis over narrative.",
      imageUrl: "/images/team/tahir-majithia.png",
      teamSlug: "tahir-majithia",
      quote:
        "The story on the news isn't the story on the ground. People are waiting for a crash that isn't coming — and the gap between what they're seeing and what's actually happening is costing them their best moves.",
    },

    faq: [
      {
        question: "Is this really free?",
        answer: "Yes. No ticket, no paywall, no card required.",
      },
      {
        question: "Is this a sales pitch?",
        answer:
          "No. Education first. If you want to talk privately afterwards, we're easy to reach — but nothing will be pushed during the stream.",
      },
      {
        question: "I can't make it live — should I still register?",
        answer:
          "Yes. The replay link goes to registrants first, before the video goes public on YouTube. You'll get it in your inbox.",
      },
      {
        question: "Can I ask questions?",
        answer:
          "Yes — there's a live Q&A at the end. You can also send questions in advance when you register and we'll try to cover them.",
      },
      {
        question: "I'm outside Dubai — is this relevant?",
        answer:
          "Perfect — that's who this is built for. Most of our investor audience is international. We'll cover what matters from wherever you're sitting.",
      },
    ],

    metaTitle: "Dubai Real Estate Market Update — Live 2 May 2026",
    metaDescription:
      "Free 45-minute livestream with Tahir Majithia: the real picture on Dubai property, geopolitics, and positioning in 2026. Live Q&A included.",
  },
]

export function getLivestream(slug: string): Livestream | undefined {
  return LIVESTREAMS.find((l) => l.slug === slug)
}

export function getLivestreamSlugs(): string[] {
  return LIVESTREAMS.map((l) => l.slug)
}
