import React from 'react'
import PropTypes from 'prop-types'
import { NamespacesConsumer } from 'react-i18next'
import i18nInstance from '../../lib/i18n/instance'

import { getHocDisplayName } from '../../lib/util'

const withI18next = (namespaces = ['common']) => (WrappedComponent) => {
  const reportedNamespaces = typeof namespaces === 'string' ? [namespaces] : namespaces

  const addReportedNamespace = (ns) => {
    if (reportedNamespaces.indexOf(ns) < 0) reportedNamespaces.push(ns)
  }

  const WithI18next = ({ i18n, ...rest }) => {
    // on server we receive the i18n instance as i18n prop
    // on client we instantiate one
    const finalI18n = i18n || i18nInstance
    return (
      <NamespacesConsumer
        i18n={finalI18n}
        reportNS={addReportedNamespace}
        ns={namespaces}
        {...rest}
        wait={process.browser}
      >
        {t => <WrappedComponent t={t} i18n={finalI18n} {...rest} />}
      </NamespacesConsumer>
    )
  }

  WithI18next.getInitialProps = async (ctx) => {
    const composedInitialProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps(ctx)
      : {}

    const i18nInitialProps = i18nInstance.getInitialProps(ctx.req, reportedNamespaces)

    return {
      ...composedInitialProps,
      ...i18nInitialProps,
    }
  }

  WithI18next.defaultProps = { i18n: null }
  WithI18next.propTypes = { i18n: PropTypes.object }
  WithI18next.displayName = getHocDisplayName('WithI18next', WrappedComponent)
  return WithI18next
}

export default withI18next
