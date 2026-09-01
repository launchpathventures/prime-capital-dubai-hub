/**
 * CATALYST - YouTube Lead Magnet Review Copy
 *
 * Drafted for Prime review on 1 September 2026. This is the single source of
 * truth for the Framework page and the walkthrough captions.
 */

export const EDUCATIONAL_DISCLAIMER =
  "Educational content only. It is not a valuation, legal advice, financial advice or a recommendation to buy a particular property."

export const FRAMEWORK_CHECKS = [
  {
    number: "01",
    shortLabel: "Objective fit",
    title: "Does the property fit your objective",
    establish:
      "Name the outcome first: income, capital growth, a home, or another specific use. Then test the property, payment timing and intended holding period against that outcome.",
    evidence: [
      "A one-sentence objective with the required outcome",
      "The intended use and holding period",
      "Any condition that would make the property unsuitable",
    ],
    questions: [
      "What must this property do for the decision to work?",
      "Which feature would make it unsuitable for that objective?",
      "Does the proposed holding period match the reason for buying?",
    ],
    missing:
      "Without a defined objective, you can compare the property only with the sales claim, not with the result you require.",
    record:
      "Write: objective / intended holding period / one disqualifying condition.",
  },
  {
    number: "02",
    shortLabel: "Cost",
    title: "The full financial commitment",
    establish:
      "Put the purchase price beside every other commitment: transaction charges, finance costs, service charges, furnishing or fit-out, and each payment due before and after handover.",
    evidence: [
      "The sale price and dated payment schedule",
      "Transaction, finance and registration cost quotations",
      "Service charges, fit-out, furnishing and continuing-cost assumptions",
    ],
    questions: [
      "What cash is due, on which date, and to whom?",
      "Which costs are fixed and which are estimates?",
      "What must still be funded after the purchase price is paid?",
    ],
    missing:
      "A quoted price is not a complete basis for a decision when the remaining commitments are unclear.",
    record:
      "Write: cash required now / cash required later / costs still estimated.",
  },
  {
    number: "03",
    shortLabel: "Evidence",
    title: "Which claims have evidence",
    establish:
      "List each claim that affects your decision. Record the source, date and evidence for it. Keep projected rent, demand, price movement, completion and scarcity claims separate.",
    evidence: [
      "A written list of every claim affecting the decision",
      "The source and date attached to each claim",
      "The document, dataset or comparable used as support",
    ],
    questions: [
      "What document or source supports this claim?",
      "Is the evidence about this property or a different reference?",
      "What remains an estimate, projection or opinion?",
    ],
    missing:
      "A repeated statement is still a claim. Until its source and relevance are clear, mark it unproven.",
    record:
      "Write: claim / source / date / supported, projected or still unproven.",
  },
  {
    number: "04",
    shortLabel: "Competition",
    title: "The real competition and supply",
    establish:
      "Identify the properties competing for the same buyer or tenant: available alternatives, similar completed stock and relevant future supply in the same catchment and price range.",
    evidence: [
      "Current alternatives available to the same audience",
      "Relevant completed stock in the same catchment and price range",
      "Future supply expected during the intended holding period",
    ],
    questions: [
      "What else can the same buyer or tenant choose?",
      "How does this property differ on price, use, location and delivery?",
      "What relevant supply may be available during your holding period?",
    ],
    missing:
      "Without the alternatives and supply picture, scarcity and differentiation cannot be tested.",
    record:
      "Write: three credible alternatives / the material differences / relevant future supply.",
  },
  {
    number: "05",
    shortLabel: "Exit",
    title: "Who may buy or rent it later",
    establish:
      "Describe the future buyer or tenant in practical terms: why they would choose this property, what they can afford, and what competing stock they will see at that point.",
    evidence: [
      "A defined future buyer or tenant profile",
      "The reason this property would remain relevant to them",
      "The alternatives and affordability constraints they may face",
    ],
    questions: [
      "Who is the next credible buyer or tenant?",
      "What reason would make this property relevant to them?",
      "What could make the resale or letting decision harder?",
    ],
    missing:
      "If the future audience is undefined, the exit rests on the assumption that a buyer or tenant will appear.",
    record:
      "Write: future audience / reason to choose / strongest competing alternative.",
  },
] as const

export const FRAMEWORK_WALKTHROUGH_CAPTIONS = [
  "Start with one property and one objective. Keep your own notes beside this page.",
  "First, define what the property must do. A property is not suitable simply because the sales case is persuasive.",
  "Second, write down the full financial commitment, not only the quoted price. Record every payment, charge and continuing cost you can establish.",
  "Third, separate each claim from its evidence. Note the source, date and whether it relates to this property or a different reference.",
  "Fourth, identify the real competition and supply. Compare the alternatives available to the same buyer or tenant, including relevant future supply.",
  "Fifth, describe who may buy or rent the property later, why they would choose it and what else they could choose instead.",
  "Finish with three lines: what appears supported, what remains unproven, and the next decision you need to make.",
] as const
