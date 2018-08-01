import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getHocDisplayName } from '../../lib/util'
import { i18nCreated } from '../../store/actions/i18n'

// Make i18next instance available in sagas
const withI18nDispatch = (WrappedComponent) => {
  class WithReduxI18nextSync extends React.Component {
    componentDidMount() {
      // send i18n to saga (CLIENT)
      const { i18n, dispatchI18nCreated } = this.props
      dispatchI18nCreated(i18n)
    }

    static async getInitialProps(ctx) {
      if (ctx.req) {
        // send i18n to saga (SERVER)
        ctx.store.dispatch(i18nCreated(ctx.req.i18n))
      }

      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : {}
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
    dispatchI18nCreated: PropTypes.func.isRequired,
  }

  WithReduxI18nextSync.displayName = getHocDisplayName('WithReduxI18nextSync', WrappedComponent)

  const mapDispatchToProps = {
    dispatchI18nCreated: i18nCreated,
  }
  return connect(null, mapDispatchToProps)(WithReduxI18nextSync)
}

withI18nDispatch.propTypes = {
  WrappedComponent: PropTypes.element,
}

export default withI18nDispatch
