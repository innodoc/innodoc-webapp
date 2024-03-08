import type { ContentType } from '@innodoc/types/common'
import type { TranslatedSection } from '@innodoc/types/entities'

/** Format section title */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Format section number (e.g. "1.2.1") */
function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

/** Get string ID field for content type */
function getStringIdField(type: ContentType) {
  return type === 'page' ? 'pageSlug' : 'sectionPath'
}

export { formatSectionTitle, getSectionNumberFromOrder, getStringIdField }
