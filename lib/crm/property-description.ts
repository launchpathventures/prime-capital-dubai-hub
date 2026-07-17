/**
 * CATALYST - Legacy CRM Property Description Formatting
 *
 * Secondary listings can arrive as portal-exported plain text with headings
 * and bullet markers embedded mid-line. Convert only that legacy structure to
 * markdown; curator-authored overview fields already contain valid markdown.
 */

const LEGACY_HEADINGS = [
  "Features and Amenities",
  "Community Location Highlights",
  "Community Features",
  "Location Highlights",
  "Location Benefits",
  "Property Details",
  "Property Features",
  "Key Features",
  "Payment Plan",
  "Why Invest Here",
  "Amenities",
  "Features",
  "About Us",
] as const

const HEADING_PATTERN = new RegExp(
  `\\s*(${LEGACY_HEADINGS.join("|")})\\s*(?::|(?=[•*]))\\s*`,
  "gi",
)

const CONCLUSION_PATTERN =
  /\s+(?=(?:Contact us today|Don['’]t miss|This property combines)\b)/gi

/**
 * Give unstructured portal descriptions the same paragraphs, subheadings and
 * lists as properly-authored CRM markdown without rewriting their content.
 */
export function formatLegacyPropertyDescription(content: string): string {
  return content
    .replace(/\r\n?/g, "\n")
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(HEADING_PATTERN, (_match, heading: string) => `\n\n### ${heading.trim()}\n\n`)
    .replace(/[ \t]*[•▪◦][ \t]*/g, "\n- ")
    .replace(/(^|\n)[ \t]*\*(?!\*)[ \t]*/g, "$1- ")
    .replace(/[ \t]+\*(?!\*)[ \t]+(?=\S)/g, "\n- ")
    .replace(CONCLUSION_PATTERN, "\n\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
