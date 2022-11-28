// TODO check if functions here are needed

import type { AnyElt, AttrList, Tree } from 'pandoc-filter'
import type { ComponentType } from 'react'

import { CONTENT_FRAGMENT_TYPES } from '#constants'
import type { ContentFragmentType } from '#types/entities/base'
import type { TranslatedPage } from '#types/entities/page'
import type { TranslatedSection } from '#types/entities/section'

/* Convert AST to string */
function astToString(ast: string | Tree) {
  if (typeof ast === 'string') {
    return ast
  }

  return ast
    .map((node) => {
      switch (node.t) {
        case 'Code':
          return node.c[1]
        case 'Str':
          return node.c
        case 'LineBreak':
        case 'SoftBreak':
        case 'Space':
          return ' '
        default:
          return undefined
      }
    })
    .join('')
}

/* Convert `[[key, val], [key, val], ...]` style attribute list to object */
// function attributesToObject(attrs: AttrList | null): AttrObj {
//   return attrs ? attrs.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}) : {}
// }

/* Format numbered title for `Elt` from attributes (e.g. "Example 1.2.1") */
function formatNumberedTitleElt(title: string, attributes: AttrList) {
  const attrsObj = attributesToObject(attributes)
  const number = attrsObj['data-number']
  return number ? `${title} ${number}` : title
}

/** Format section number */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const num = section.order.map((n) => (n + 1).toString()).join('.')
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${num} ${title}`
}

/* Return a function that maps classNames to Components, used by AST components */
function getClassNameToComponentMapper<P>(classNameComponentMap: Record<string, ComponentType<P>>) {
  const availableClassNames = Object.keys(classNameComponentMap)
  return (classNames: string[]) => {
    for (let i = 0; i < availableClassNames.length; i += 1) {
      const className = availableClassNames[i]
      if (classNames.includes(className)) {
        return classNameComponentMap[className]
      }
    }
    return undefined
  }
}

/** Generate page URL */
function getPageUrl(pageSlug: TranslatedPage['slug']) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageSlug}`
}

/** Generate section URL */
function getSectionUrl(sectionPath: string) {
  return `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/${sectionPath}`
}

/** Type guard for ContentFragmentType */
function isContentFragmentType(t: string): t is ContentFragmentType {
  return CONTENT_FRAGMENT_TYPES.includes(t as ContentFragmentType)
}

/** Replace generic with custom path prefixes */
function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

export {
  astToString,
  formatNumberedTitleElt,
  formatSectionTitle,
  getClassNameToComponentMapper,
  getPageUrl,
  getSectionUrl,
  isContentFragmentType,
  replacePathPrefixes,
}
