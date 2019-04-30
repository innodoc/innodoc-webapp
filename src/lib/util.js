import Router from 'next/router'

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

const getDisplayName = Component => Component.displayName || Component.name || 'Component'

const getHocDisplayName = (HocName, ComposedComponent) => `${HocName}(${getDisplayName(ComposedComponent)})`

const parseSectionId = sectionId => sectionId.split('#')

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const unwrapPara = content => (
  content && content[0].t === 'Para'
    ? content[0].c
    : content
)

export {
  astToString,
  getClassNameToComponentMapper,
  getDisplayName,
  getHocDisplayName,
  parseSectionId,
  scrollToHash,
  unwrapPara,
}
