import { FRAGMENT_TYPES } from '#constants'
import type { FragmentType } from '#types/entities/base'
import type { TranslatedSection } from '#types/entities/section'

/** Format section number (e.g. "1.2.1") */
export function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

/** Format numbered title for (e.g. "Example 1.2.1") */
// TODO Delete
function formatNumberedTitle(section: TranslatedSection, number: number, title: string) {
  return number ? `${title} ${getSectionNumberFromOrder(section)}.${number + 1}` : title
}

/** Format section title */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Type guard for FragmentType */
function isFragmentType(t: string): t is FragmentType {
  return FRAGMENT_TYPES.includes(t as FragmentType)
}

export { formatNumberedTitle, formatSectionTitle, isFragmentType }
