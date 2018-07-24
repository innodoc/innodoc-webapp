import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getHocDisplayName } from '../../lib/util'
import { changeLanguage } from '../../store/actions/ui'

const withReduxI18nextSync = (WrappedComponent) => {
  class WithReduxI18nextSync extends React.Component {
    componentDidMount() {
      const { i18n, onLanguageChange } = this.props
      i18n.on('languageChanged', onLanguageChange)
    }

    componentWillUnmount() {
      const { i18n, onLanguageChange } = this.props
      i18n.off('languageChanged', onLanguageChange)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithReduxI18nextSync.getInitialProps = ctx => (
    WrappedComponent.getInitialProps
      ? WrappedComponent.getInitialProps(ctx)
      : {}
  )

  WithReduxI18nextSync.propTypes = {
    i18n: PropTypes.shape({
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
    }).isRequired,
    onLanguageChange: PropTypes.func.isRequired,
  }

  WithReduxI18nextSync.displayName = getHocDisplayName('WithReduxI18nextSync', WrappedComponent)

  const mapDispatchToProps = {
    onLanguageChange: changeLanguage,
  }
  return connect(null, mapDispatchToProps)(WithReduxI18nextSync)
}

withReduxI18nextSync.propTypes = {
  WrappedComponent: PropTypes.element,
}

export default withReduxI18nextSync
