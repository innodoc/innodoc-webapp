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

const getSectionHref = sectionPath => ({
  href: { pathname: '/page', query: { sectionPath } },
  as: `/page/${sectionPath}`,
})

export {
  astToString,
  getDisplayName,
  getHocDisplayName,
  getSectionHref,
}
