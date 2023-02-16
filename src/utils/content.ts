import { FRAGMENT_TYPES } from '#constants'
import type { FragmentType } from '#types/entities/base'
import type { TranslatedSection } from '#types/entities/section'

/** Format section number (e.g. "1.2.1") */
export function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

/** Format section title */
export function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Type guard for FragmentType */
export function isFragmentType(t: string): t is FragmentType {
  return FRAGMENT_TYPES.includes(t as FragmentType)
}
