import type { AnyElt, AttrList, Tree } from 'pandoc-filter'
import type { ComponentType } from 'react'

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
function getPageUrl(pageName: Page['name']) {
  return `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/${pageName}`
}

/** Generate section URL */
function getSectionUrl(sectionPath: string) {
  return `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/${sectionPath}`
}

/** Replace generic with custom path prefixes */
function replacePathPrefixes(url: string) {
  return url
    .replace('/page/', `/${import.meta.env.INNODOC_PAGE_PATH_PREFIX}/`)
    .replace('/section/', `/${import.meta.env.INNODOC_SECTION_PATH_PREFIX}/`)
}

/* Unwraps all Paras in a list of content elements */
function unwrapPara(content: AnyElt[]) {
  if (content.length === 1) {
    return content[0].t === 'Para' ? content[0].c : content
  }
  return content.map((item) => (item.t === 'Para' ? item.c : item))
}

export {
  astToString,
  attributesToObject,
  formatNumberedTitleElt,
  formatSectionTitle,
  getClassNameToComponentMapper,
  getSectionPath,
  getPageUrl,
  getSectionUrl,
  replacePathPrefixes,
  unwrapPara,
}
