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

const getSectionHref = sectionId => ({
  href: { pathname: '/page', query: { sectionId } },
  as: `/page/${sectionId}`,
})

const unwrapPara = content => (
  content && content[0].t === 'Para'
    ? content[0].c
    : content
)

export {
  astToString,
  getDisplayName,
  getHocDisplayName,
  getSectionHref,
  unwrapPara,
}
