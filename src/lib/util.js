const getDisplayName = Component => Component.displayName || Component.name || 'Component'
const getHocDisplayName = (HocName, ComposedComponent) => `${HocName}(${getDisplayName(ComposedComponent)})`

export { getDisplayName, getHocDisplayName }
