import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getHocDisplayName } from '../../lib/util'
import { i18nInstanceAvailable } from '../../store/actions/i18n'

// Make i18next instance available in sagas
const withI18nDispatch = (WrappedComponent) => {
  class WithI18nDispatch extends React.Component {
    componentDidMount() {
      this.dispatchI18nInstance()
    }

    static async getInitialProps(ctx) {
      if (ctx.req) {
        // make i18n instance available to sagas (on server)
        ctx.store.dispatch(i18nInstanceAvailable(ctx.req.i18n))
      }

      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : {}
    }

    // make i18n instance available to sagas (on client)
    dispatchI18nInstance() {
      const { i18n, dispatchI18nInstance } = this.props
      dispatchI18nInstance(i18n)
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }

  WithI18nDispatch.propTypes = {
    i18n: PropTypes.shape({
      on: PropTypes.func.isRequired,
      off: PropTypes.func.isRequired,
    }).isRequired,
    dispatchI18nInstance: PropTypes.func.isRequired,
  }

  WithI18nDispatch.displayName = getHocDisplayName('WithI18nDispatch', WrappedComponent)

  const mapDispatchToProps = { dispatchI18nInstance: i18nInstanceAvailable }
  return connect(null, mapDispatchToProps)(WithI18nDispatch)
}

export default withI18nDispatch
