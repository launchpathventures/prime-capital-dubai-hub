/**
 * CATALYST - Events: Prime's upcoming events, each linking to its page in the CRM (TopStreet AI Events, serviceos#1970, S9)
 */

import type { Metadata } from "next"
import { ArrowRightIcon } from "lucide-react"
import { Container, Grid, Text, Title } from "@/components/core"
import { publishedEvents } from "@/lib/events/agentcrm-events"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Events",
  description: "Meet Prime Capital Dubai in person: upcoming events and roadshows.",
  alternates: { canonical: "/events" },
}

const dayMonth = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })

export default async function EventsPage() {
  const events = await publishedEvents()
  return (
    <div className="london-page">
      <section className="london-section london-section--paper">
        <Container size="lg">
          <div className="london-section-heading">
            <Text align="center" className="london-section-kicker">Events</Text>
            <Title as="h2" align="center" className="london-section-title">Meet us in person.</Title>
          </div>
          {events.length === 0 ? (
            <Text align="center" className="london-prose-text">No events are open for registration right now.</Text>
          ) : (
            <Grid cols={1} className="md:grid-cols-3 roadshow-stop-grid">
              {events.map((page) => {
                const dates = page.events.map((e) => e.date).sort()
                return (
                  <a key={page.url} href={page.url} className="roadshow-stop">
                    <Text className="roadshow-stop__number">
                      {page.events.length > 1 ? `${page.events.length} events · ` : ""}
                      {dates.length ? (dates[0] === dates[dates.length - 1] ? dayMonth(dates[0]) : `${dayMonth(dates[0])} to ${dayMonth(dates[dates.length - 1])}`) : ""}
                    </Text>
                    <Title as="h3" className="roadshow-stop__city">{page.title}</Title>
                    <Text className="roadshow-stop__note">{page.events.map((e) => e.name).join(" · ")}</Text>
                    <Text className="roadshow-stop__note">Register <ArrowRightIcon aria-hidden className="inline h-4 w-4" /></Text>
                  </a>
                )
              })}
            </Grid>
          )}
        </Container>
      </section>
    </div>
  )
}
