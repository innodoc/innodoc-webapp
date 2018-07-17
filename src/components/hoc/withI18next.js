import { translate, loadNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'

import { getInitialProps, I18n } from '../../lib/i18n'
import { getHocDisplayName } from '../../lib/util'

const withI18next = (namespaces = ['common']) => (WrappedComponent) => {
  const translateEnhance = translate(namespaces, { i18n: I18n, wait: process.browser })
  const WithI18next = translateEnhance(WrappedComponent)

  WithI18next.getInitialProps = async (ctx) => {
    const wrappedInitialProps = WrappedComponent.getInitialProps
      ? await WrappedComponent.getInitialProps(ctx)
      : {}

    const i18nInitialProps = ctx.req
      ? getInitialProps(ctx.req, namespaces)
      : await loadNamespaces({
        components: [{ props: { namespaces } }],
        i18n: I18n,
      })

    return {
      ...wrappedInitialProps,
      ...i18nInitialProps,
    }
  }

  WithI18next.displayName = getHocDisplayName('WithI18next', WrappedComponent)
  return WithI18next
}

withI18next.propTypes = {
  WrappedComponent: PropTypes.element,
}

export default withI18next
