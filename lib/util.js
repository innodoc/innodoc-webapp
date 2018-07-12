const getDisplayName = Component => Component.displayName || Component.name || 'Component'
const getHocDisplayName = (HocName, ComposedComponent) => `WithMathJax(${getDisplayName(ComposedComponent)})`

export { getDisplayName, getHocDisplayName }
