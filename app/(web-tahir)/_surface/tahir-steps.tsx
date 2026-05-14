/**
 * CATALYST - Tahir Process Steps
 *
 * The six-step "how we work" grid used on the services page. Steps are
 * numbered using the data in `data/tahir/services.json` so order stays
 * declarative.
 */

interface StepItem {
  step: number
  title: string
  description: string
}

interface TahirStepsProps {
  steps: StepItem[]
}

export function TahirSteps({ steps }: TahirStepsProps) {
  return (
    <div className="tahir-steps">
      {steps.map((step) => (
        <article key={step.step} className="tahir-step">
          <span className="tahir-step__index">
            {String(step.step).padStart(2, "0")}
          </span>
          <h3 className="tahir-step__title">{step.title}</h3>
          <p className="tahir-step__body">{step.description}</p>
        </article>
      ))}
    </div>
  )
}
