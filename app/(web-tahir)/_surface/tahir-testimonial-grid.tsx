/**
 * CATALYST - Tahir Testimonial Grid
 *
 * Quote cards in a responsive grid. Optional `limit` prop lets the home
 * page render a teaser subset; the testimonials page renders all entries.
 */

interface TestimonialItem {
  id: string
  quote: string
  author: string
  date?: string
  location?: string
}

interface TahirTestimonialGridProps {
  testimonials: TestimonialItem[]
  limit?: number
  columns?: 2 | 3
}

export function TahirTestimonialGrid({
  testimonials,
  limit,
  columns = 3,
}: TahirTestimonialGridProps) {
  const list = limit ? testimonials.slice(0, limit) : testimonials
  const gridClass = `tahir-grid tahir-grid--${columns}`

  return (
    <div className={gridClass}>
      {list.map((t) => (
        <figure key={t.id} className="tahir-quote">
          <span className="tahir-quote__mark" aria-hidden="true">
            &ldquo;
          </span>
          <blockquote className="tahir-quote__text">{t.quote}</blockquote>
          <figcaption className="tahir-quote__attribution">
            <span className="tahir-quote__author">{t.author}</span>
            {t.date ? <span className="tahir-quote__meta">{t.date}</span> : null}
            {!t.date && t.location ? (
              <span className="tahir-quote__meta">{t.location}</span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
