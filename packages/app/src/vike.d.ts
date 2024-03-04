import type { PreloadedState } from '@reduxjs/toolkit'
import type { ReactNode } from 'react'

import type { AppRouteInfo } from '@innodoc/routes/types'
import type { RootState, Store } from '@innodoc/store/types'

declare global {
  namespace Vike {
    interface Config {
      /** Hook called before the page is rendered (server) */
      onInit?(
        this: void,
        pageContext: Pick<PageContext, 'routeInfo' | 'store'>,
      ): void | Promise<void>
    }

    interface PageContext {
      // Refine type of pageContext.Page (it's `unknown` by default)
      Page?: () => ReactNode

      /** Request host */
      host?: string

      /** Browser locale */
      requestLocale: string

      /** Route info of current page */
      routeInfo: AppRouteInfo

      /** Application redux store */
      store: Store

      /** Preloaded store state */
      preloadedState: PreloadedState<RootState>
    }
  }
}

export {}
