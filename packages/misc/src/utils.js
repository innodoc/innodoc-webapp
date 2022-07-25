export const astToString = (ast) =>
  typeof ast === 'string'
    ? ast
    : ast
        .map((node) => {
          switch (node.t) {
            case 'Str':
              return node.c
            case 'Space':
              return ' '
            default:
              return undefined
          }
        })
        .join('')

// Convert [[key, val], [key, val], ...] style attribute list to object.
export const attributesToObject = (attrs) =>
  attrs ? attrs.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}) : {}

// Return a function that maps classNames to Components, used by AST components
// like Div that render different components according to the className.
export const getClassNameToComponentMapper = (classNameComponentMap) => {
  const availableClassNames = Object.keys(classNameComponentMap)
  return (classNames) => {
    for (let i = 0; i < availableClassNames.length; i += 1) {
      const className = availableClassNames[i]
      if (classNames.includes(className)) {
        return classNameComponentMap[className]
      }
    }
    return null
  }
}

// Generate numbered title from attributes (e.g. "Example 1.2.1")
export const getNumberedTitle = (title, attributes) => {
  const attrsObj = attributesToObject(attributes)
  const number = attrsObj['data-number']
  return number ? `${title} ${number}` : title
}

// Sort an obejct (using name key) in an alphanumerical way considering umlauts/accents etc.
export const intSortArray = (lang) => {
  const { compare } = new Intl.Collator(lang)
  // Remove special characters in front, case-insensitive
  const normalize = (string) => string.replace(/^[$\\]+/g, '').toUpperCase()
  return (a, b) => compare(normalize(a.name), normalize(b.name))
}

// Create an object of symbols, protecting it from code manglers
// (e.g. { SYMBOL: "SYMBOL" })
export const makeSymbolObj = (symbolList = []) =>
  symbolList.reduce((acc, symbol) => ({ ...acc, [symbol]: symbol }), {})

export const parseContentId = (contentId) => contentId.split('#')

export const parseLink = (href) => {
  if (href.startsWith('/page/')) {
    return ['page', href.slice(6)]
  }
  if (href.startsWith('/section/')) {
    return ['section', href.slice(9)]
  }
  throw new Error(`Malformed link encountered: ${href}`)
}

// Normalize language code to 2 letters (e.g. 'en-US' -> 'en').
export const toTwoLetterCode = (lang) => (lang.length > 2 ? lang.substring(0, 2) : lang)

// Unwraps all Paras in a list of content elements
export const unwrapPara = (content) => {
  if (content.length === 1) {
    return content[0].t === 'Para' ? content[0].c : content
  }
  return content.map((item) => (item.t === 'Para' ? item.c : item))
}

// Generate URL info for use with <Link /> or 'next/router'
export const getLinkInfo = (pathPrefix, contentId, hash = undefined) => {
  const href = {
    pathname: '/[contentPrefix]/[...fragments]',
    query: {
      contentPrefix: pathPrefix,
      fragments: contentId.split('/'),
    },
  }
  const as = { pathname: `/${pathPrefix}/${contentId}` }
  if (hash) {
    as.hash = `#${hash}`
  }
  return { href, as }
}
