import type { ComponentType } from 'react'

import type { AppRouteInfo } from '@innodoc/shared-core/types'
import type { RootState, Store } from '@innodoc/ui-store/types'

declare global {
  namespace Vike {
    interface Config {
      /** Hook called before the page is rendered (server) */
      onInit?(this: void, pageContext: Pick<PageContext, 'routeInfo' | 'store'>): void | Promise<void>
    }

    interface PageContext {
      // Refine type of pageContext.Page (it's `unknown` by default)
      Page?: ComponentType

      /** Request host */
      host?: string

      /** Browser locales */
      requestLocales?: readonly string[]

      /** Route info of current page */
      routeInfo: AppRouteInfo

      /** Application redux store */
      store: Store

      /** Preloaded store state */
      preloadedState: RootState
    }
  }
}
