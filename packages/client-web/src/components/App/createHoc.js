import React from 'react'

const createHoc = (displayName, getInitialProps) => (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithHoc = (props) => <WrappedComponent {...props} />

  WithHoc.getInitialProps = async (context) => {
    const { ctx } = context
    const wrappedComponentProps = WrappedComponent.getInitialProps
      ? WrappedComponent.getInitialProps(context)
      : { pageProps: {} }
    const props = await getInitialProps(ctx)
    return props
      ? { ...wrappedComponentProps, ...props }
      : wrappedComponentProps
  }

  const wrappedDisplayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  WithHoc.displayName = `${displayName}(${wrappedDisplayName})`

  return WithHoc
}

export default createHoc
