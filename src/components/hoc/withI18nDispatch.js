import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getHocDisplayName } from '../../lib/util'
import { i18nInstanceAvailable } from '../../store/actions/i18n'

// Make i18next instance available in sagas
const withI18nDispatch = (WrappedComponent) => {
  class WithReduxI18nextSync extends React.Component {
    componentDidMount() {
      this.dispatchI18nInstance()
    }

    static async getInitialProps(ctx) {
      if (ctx.req) {
        // make i18n instance available to sagas (SERVER)
        ctx.store.dispatch(i18nInstanceAvailable(ctx.req.i18n))
      }

      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : {}
    }

    // make i18n instance available to sagas (CLIENT)
    dispatchI18nInstance() {
      const { i18n, dispatchI18nInstance } = this.props
      dispatchI18nInstance(i18n)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithReduxI18nextSync.propTypes = {
    i18n: PropTypes.shape({
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
    }).isRequired,
    dispatchI18nInstance: PropTypes.func.isRequired,
  }

  WithReduxI18nextSync.displayName = getHocDisplayName('WithReduxI18nextSync', WrappedComponent)

  const mapDispatchToProps = { dispatchI18nInstance: i18nInstanceAvailable }
  return connect(null, mapDispatchToProps)(WithReduxI18nextSync)
}

withI18nDispatch.propTypes = {
  WrappedComponent: PropTypes.element,
}

export default withI18nDispatch
