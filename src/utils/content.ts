import { SLUG_RE } from '#constants'
import type { ContentType } from '#types/common'
import type { TranslatedSection } from '#types/entities/section'

const slugRegExp = new RegExp(`^${SLUG_RE}$`)

/** Capitalize string */
export function capitalize(words: string) {
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** Get string ID field for content type */
export function getStringIdField(type: ContentType) {
  return type === 'page' ? 'pageSlug' : 'sectionPath'
}

/** Format section number (e.g. "1.2.1") */
export function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

/** Format section title */
export function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Check if variable is a slug */
export function isSlug(t: unknown) {
  return typeof t === 'string' && slugRegExp.test(t)
}
