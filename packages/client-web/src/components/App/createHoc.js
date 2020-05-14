import React from 'react'

const createHoc = (displayName, getProps) => (WrappedComponent) => {
  // eslint-disable-next-line react/jsx-props-no-spreading
  const WithHoc = (props) => <WrappedComponent {...props} />

  WithHoc.getInitialProps = async (context) => {
    const props = await getProps(context.ctx)
    const wrappedComponentProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps(context)
      : { pageProps: {} }
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
