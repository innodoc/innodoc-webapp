const getDisplayName = (name, WrappedComponent) => {
  const wrappedDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  return `${name}(${wrappedDisplayName})`
}

const getWrappedComponentProps = (WrappedComponent, context) =>
  WrappedComponent.getInitialProps
    ? WrappedComponent.getInitialProps(context)
    : { pageProps: {} }

export { getDisplayName, getWrappedComponentProps }
