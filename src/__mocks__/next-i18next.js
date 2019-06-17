import React from 'react'

export default class MockNextI18Next {
  constructor() {
    this.appWithTranslation = () => (
      WrappedComponent => (
        props => <WrappedComponent {...props} />
      )
    )
    this.useTranslation = () => ({ t: () => '' })
    this.withTranslation = () => (
      WrappedComponent => (
        props => <WrappedComponent t={() => ''} {...props} />
      )
    )
    this.Trans = ({ children }) => (
      <React.Fragment>
        {children}
      </React.Fragment>
    )
  }
}
