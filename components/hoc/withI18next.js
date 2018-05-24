import { translate, loadNamespaces } from 'react-i18next'
import { getInitialProps, I18n } from '../../i18n'

import { getHocDisplayName } from '../../lib/util'

const withI18next = (namespaces = ['common']) => (ComposedComponent) => {
  const WithI18next = translate(namespaces, { i18n: I18n, wait: process.browser })(
    ComposedComponent
  )

  WithI18next.getInitialProps = async (ctx) => {
    const composedInitialProps = ComposedComponent.getInitialProps
      ? await ComposedComponent.getInitialProps(ctx)
      : {}

    const i18nInitialProps = ctx.req
      ? getInitialProps(ctx.req, namespaces)
      : await loadNamespaces({
        components: [{ props: { namespaces } }],
        i18n: I18n,
      })

    return {
      ...composedInitialProps,
      ...i18nInitialProps,
    }
  }

  WithI18next.displayName = getHocDisplayName('WithI18next', ComposedComponent)
  return WithI18next
}

export default withI18next
