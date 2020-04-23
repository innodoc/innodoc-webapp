import React from 'react'

export default class MockNextI18Next {
  constructor() {
    const t = (key) => (Array.isArray(key) ? key.join('_') : key)
    this.appWithTranslation = () => (WrappedComponent) => WrappedComponent
    this.useTranslation = () => ({ t })
    this.withTranslation = () => (WrappedComponent) =>
      // eslint-disable-next-line react/jsx-props-no-spreading
      (props) => <WrappedComponent t={t} {...props} />
    this.Trans = (
      { children } // eslint-disable-line react/prop-types
    ) => <>{children}</>
  }
}
