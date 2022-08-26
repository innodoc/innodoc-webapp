import type { Section } from '@/types/api'

/** Format section number */
function formatSectionTitle(section: Section, preferShort = false) {
  const num = section.number.map((num) => `${num + 1}.`).join('')
  const title = preferShort && section.shortTitle !== undefined ? section.shortTitle : section.title
  return `${num} ${title}`
}

/** Get section path from `Section` */
function getSectionPath(section: Section) {
  return [...section.parents, section.id].join('/')
}

/** Generate page URL */
function pageUrl(pageId: string) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageId}`
}

/** Generate section URL */
function sectionUrl(sectionPath: string) {
  return `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/${sectionPath}`
}

/** Replace generic with custom path prefixes */
function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

export { formatSectionTitle, getSectionPath, pageUrl, sectionUrl, replacePathPrefixes }
