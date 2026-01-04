/**
 * CATALYST - Integrations Overview
 */

import Link from "next/link"

export default function IntegrationsOverviewPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-medium text-primary">2-minute summary</p>
        <h1 className="text-3xl font-semibold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Integrations extend Catalyst without breaking the staged pathway.
          Start with Supabase for auth and data; add others intentionally as the
          project matures.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Principles</h2>
        <ul className="text-muted-foreground list-disc list-inside space-y-2">
          <li>Add integrations only when a decision checkpoint requires them.</li>
          <li>Prefer managed services that keep operational load low.</li>
          <li>Document contracts and failure modes in the State of Play.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Supported today</h2>
        <ul className="text-muted-foreground list-disc list-inside space-y-2">
          <li>
            <Link href="/docs/integrations/supabase-auth" className="text-primary hover:underline">
              Supabase
            </Link>{" "}
            — auth + data patterns aligned to Catalyst stages.
          </li>
        </ul>
      </section>
    </article>
  )
}
