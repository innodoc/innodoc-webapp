import type { TranslatedSection } from '@innodoc/shared-core/types'

/** Format section title */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Format section number (e.g. "1.2.1") */
function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

export { formatSectionTitle, getSectionNumberFromOrder }
