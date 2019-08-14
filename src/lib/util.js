const astToString = (ast) => {
  if (typeof ast === 'string') {
    return ast
  }

  return ast.map((node) => {
    switch (node.t) {
      case 'Str':
        return node.c
      case 'Space':
        return ' '
      default:
        return undefined
    }
  }).join('')
}

// Convert [[key, val], [key, val], ...] style attribute list to object.
const attributesToObject = (attrs) => (
  attrs
    ? attrs.reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
    : {}
)

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

const getDisplayName = (Component) => Component.displayName || Component.name || 'Component'

const getHocDisplayName = (HocName, ComposedComponent) => `${HocName}(${getDisplayName(ComposedComponent)})`

const parseContentId = (contentId) => contentId.split('#')

// Normalize language code to 2 letters (e.g. 'en-US' -> 'en').
const toTwoLetterCode = (lang) => (lang.length > 2 ? lang.substring(0, 2) : lang)

const unwrapPara = (content) => (
  content && content[0].t === 'Para'
    ? content[0].c
    : content
)

export {
  astToString,
  attributesToObject,
  getClassNameToComponentMapper,
  getDisplayName,
  getHocDisplayName,
  parseContentId,
  toTwoLetterCode,
  unwrapPara,
}
