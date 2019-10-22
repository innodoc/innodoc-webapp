import React from 'react'

export default class MockNextI18Next {
  constructor() {
    this.appWithTranslation = () => (WrappedComponent) => WrappedComponent
    this.useTranslation = () => ({ t: (key) => key })
    this.withTranslation = () => (
      (WrappedComponent) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        (props) => <WrappedComponent t={() => ''} {...props} />
      )
    )
    this.Trans = ({ children }) => ( // eslint-disable-line react/prop-types
      <>
        {children}
      </>
    )
  }
}
