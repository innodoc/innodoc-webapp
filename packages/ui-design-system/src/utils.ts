import type { TranslatedSection } from '@innodoc/shared-core/schema/types'
import type { ContentType } from '@innodoc/shared-core/types'

/** Format section title */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${getSectionNumberFromOrder(section)} ${title ?? ''}`
}

/** Format section number (e.g. "1.2.1") */
function getSectionNumberFromOrder(section: TranslatedSection) {
  return section.order.map((n) => (n + 1).toString()).join('.')
}

/** Get content ID field for content type */
function getContentIdField(type: ContentType) {
  return type === 'page' ? 'slug' : 'path'
}

export { formatSectionTitle, getContentIdField, getSectionNumberFromOrder }
