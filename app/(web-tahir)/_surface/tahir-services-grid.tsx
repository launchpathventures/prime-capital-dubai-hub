/**
 * CATALYST - Tahir Services Grid
 *
 * Renders a responsive grid of service cards. Used on the home page and
 * the services page. Index numbers (01, 02, …) give the card stack a
 * deliberate, advisory tone — no decorative icons.
 */

interface ServiceItem {
  id: string
  title: string
  description: string
}

interface TahirServicesGridProps {
  services: ServiceItem[]
  columns?: 2 | 3
}

export function TahirServicesGrid({ services, columns = 3 }: TahirServicesGridProps) {
  const gridClass = `tahir-grid tahir-grid--${columns}`

  return (
    <div className={gridClass}>
      {services.map((service, index) => (
        <article key={service.id} className="tahir-card">
          <span className="tahir-card__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="tahir-card__title">{service.title}</h3>
          <p className="tahir-card__body">{service.description}</p>
        </article>
      ))}
    </div>
  )
}
