/**
 * CATALYST - Tahir Values Grid
 *
 * Five-up value-proposition grid used in the "Your success is our
 * success" section. Reads naturally on dark or elevated tones.
 */

interface ValueItem {
  label: string
  description: string
}

interface TahirValuesProps {
  values: ValueItem[]
}

export function TahirValues({ values }: TahirValuesProps) {
  return (
    <div className="tahir-values">
      {values.map((value) => (
        <div key={value.label} className="tahir-value">
          <span className="tahir-value__label">{value.label}</span>
          <p className="tahir-value__description">{value.description}</p>
        </div>
      ))}
    </div>
  )
}
