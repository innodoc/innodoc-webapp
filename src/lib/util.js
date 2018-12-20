import Router from 'next/router'

const getDisplayName = Component => Component.displayName || Component.name || 'Component'
const getHocDisplayName = (HocName, ComposedComponent) => `${HocName}(${getDisplayName(ComposedComponent)})`

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

const unwrapPara = content => (
  content && content[0].t === 'Para'
    ? content[0].c
    : content
)

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const parseSectionId = sectionId => sectionId.split('#')

export {
  astToString,
  getDisplayName,
  getHocDisplayName,
  unwrapPara,
  scrollToHash,
  parseSectionId,
}
