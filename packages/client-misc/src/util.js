const astToString = (ast) => {
  if (typeof ast === 'string') {
    return ast
  }

  return ast
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
}

// Convert [[key, val], [key, val], ...] style attribute list to object.
const attributesToObject = (attrs) =>
  attrs ? attrs.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {}) : {}

// Return a function that maps classNames to Components, used by AST components
// like Div that render different components according to the className.
const getClassNameToComponentMapper = (classNameComponentMap) => {
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
const getNumberedTitle = (title, attributes) => {
  const attrsObj = attributesToObject(attributes)
  const number = attrsObj['data-number']
  return number ? `${title} ${number}` : title
}

// Sort an obejct (using name key) in an alphanumerical way considering umlauts/accents etc.
const intSortArray = (lang) => {
  const { compare } = new Intl.Collator(lang)
  // Remove special characters in front, case-insensitive
  const normalize = (string) => string.replace(/^[$\\]+/g, '').toUpperCase()
  return (a, b) => compare(normalize(a.name), normalize(b.name))
}

const parseContentId = (contentId) => contentId.split('#')

const parseLink = (href) => {
  if (href.startsWith('/page/')) {
    return ['page', href.slice(6)]
  }
  if (href.startsWith('/section/')) {
    return ['section', href.slice(9)]
  }
  throw new Error(`Malformed link encountered: ${href}`)
}

// Normalize language code to 2 letters (e.g. 'en-US' -> 'en').
const toTwoLetterCode = (lang) =>
  lang.length > 2 ? lang.substring(0, 2) : lang

const unwrapPara = (content) =>
  content && content[0].t === 'Para' ? content[0].c : content

export {
  astToString,
  attributesToObject,
  getClassNameToComponentMapper,
  getNumberedTitle,
  intSortArray,
  parseContentId,
  parseLink,
  toTwoLetterCode,
  unwrapPara,
}
