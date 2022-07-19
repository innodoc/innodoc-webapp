import nextReduxWrapper from '../../store'

// TODO: possible to completely avoid getInitialProps to enable static page
// rendering?

const createHoc = (displayName, getProps) => (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithHoc = (props) => <WrappedComponent {...props} />

  WithHoc.getInitialProps = nextReduxWrapper.getInitialPageProps((store) => async (context) => {
    const props = await getProps(context.ctx, store)
    const wrappedComponentProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps(context)
      : {}
    return props ? { ...wrappedComponentProps, ...props } : wrappedComponentProps
  })

  const wrappedDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithHoc.displayName = `${displayName}(${wrappedDisplayName})`

  return WithHoc
}

export default createHoc
