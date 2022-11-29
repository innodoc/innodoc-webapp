// TODO check if functions here are needed

import type { Tree } from 'pandoc-filter'

import { FRAGMENT_TYPES } from '#constants'
import type { FragmentType } from '#types/entities/base'
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

// TODO: how to do numbering?
/* Format numbered title for `Elt` from attributes (e.g. "Example 1.2.1") */
function formatNumberedTitleElt(title: string) {
  // const attrsObj = attributesToObject(attributes)
  // const number = attrsObj['data-number']
  const number = '0'
  return number ? `${title} ${number}` : title
}

/** Format section number */
function formatSectionTitle(section: TranslatedSection, preferShort = false) {
  const num = section.order.map((n) => (n + 1).toString()).join('.')
  const title = preferShort && section.shortTitle !== null ? section.shortTitle : section.title
  return `${num} ${title ?? ''}`
}

/** Type guard for FragmentType */
function isFragmentType(t: string): t is FragmentType {
  return FRAGMENT_TYPES.includes(t as FragmentType)
}

export { astToString, formatNumberedTitleElt, formatSectionTitle, isFragmentType }
