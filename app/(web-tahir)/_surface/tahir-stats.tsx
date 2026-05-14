/**
 * CATALYST - Tahir Stats Row
 *
 * Editorial stat row used on the home page and about page. Each stat is
 * label + value, separated by hairlines, no decorative chrome.
 */

interface StatItem {
  label: string
  value: string
}

interface TahirStatsProps {
  stats: StatItem[]
}

export function TahirStats({ stats }: TahirStatsProps) {
  return (
    <div className="tahir-stats">
      {stats.map((stat) => (
        <div key={stat.label} className="tahir-stat">
          <span className="tahir-stat__value">{stat.value}</span>
          <span className="tahir-stat__label">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
