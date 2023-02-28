import type { PreloadedState } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import type { ComponentType } from 'react'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

import type { passToClientProps } from '#constants'
import type { RootState, Store } from '#store/makeStore'

import type { RouteInfo } from './common'
import type { ApiCourse } from './entities/course'

/** Properties passed into `renderPage` (Express handler) */
export interface PageContextInit extends Pick<PageContextBuiltIn, 'urlOriginal'> {
  /** Request host */
  host?: string

  /** Browser locale */
  requestLocale: LanguageCode
}

/** Page context (SSR context) */
export interface PageContextServer extends PageContextInit, PageContextBuiltIn<ComponentType> {
  /** Extracted route params */
  routeInfo: Partial<RouteInfo>

  /** Indicate a redirect should happen */
  redirectTo?: string

  /** Course ID */
  courseId: ApiCourse['id']

  /** Preloaded store state to be passed to the client */
  preloadedState: PreloadedState<RootState>

  /** Application redux store */
  store: Store
}

/** Page context update (SSR context) */
export interface PageContextUpdate {
  pageContext: Partial<PageContextServer>
}

/** Page context (Browser context) */
export type PageContextClient = PageContextBuiltInClient<ComponentType> &
  Pick<PageContextServer, (typeof passToClientProps)[number]>
