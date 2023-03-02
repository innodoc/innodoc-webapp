import type { PreloadedState } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import type { ComponentType } from 'react'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

import type { PASS_TO_CLIENT_PROPS } from '#constants'
import type { RouteName } from '#routes/routes'
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
  routeInfo: RouteInfo

  /** Indicate a redirect should happen */
  redirectTo?: string

  /** Course ID */
  courseId: ApiCourse['id']

  /** Preloaded store state to be passed to the client */
  preloadedState: PreloadedState<RootState>

  /** Application redux store */
  store: Store

  /** Redirect needed because of parameter parsing? */
  needRedirect: boolean
}

/** Page context passed into `onBeforeRoute` */
export type PageContextOnBeforeRoute = Pick<
  PageContextServer,
  'host' | 'requestLocale' | 'urlOriginal'
>

/** Page context passed into `onBeforeRender` */
export type PageContextOnBeforeRender = Pick<
  PageContextServer,
  'needRedirect' | 'routeInfo' | 'routeParams' | 'urlOriginal'
>

/** Page context passed into `render` */
export type PageContextRender = Pick<
  PageContextServer,
  'courseId' | 'Page' | 'redirectTo' | 'routeInfo' | 'store'
>

/** Page context update (SSR context) */
export interface PageContextUpdate {
  pageContext: Partial<Omit<PageContextServer, 'routeInfo'>> & { routeInfo?: Partial<RouteInfo> }
}

/** Page context (Browser context) */
export type PageContextClient = PageContextBuiltInClient<ComponentType> &
  Pick<PageContextServer, (typeof PASS_TO_CLIENT_PROPS)[number]>
