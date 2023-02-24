import type { LanguageCode } from 'iso-639-1'
import type { ElementType } from 'react'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

import type { passToClientProps } from '#constants'
import type { Store } from '#store/makeStore'

import type { RouteInfo } from './common'
import type { ApiCourse } from './entities/course'
import type { ApiPage } from './entities/page'

/** Custom client-side page context */
export type PageContextClient = Omit<PageContextBuiltInClient, 'Page'> &
  Pick<PageContextServer, 'Page' | (typeof passToClientProps)[number]>

/** Custom server-side page context */
export interface PageContextServer extends Omit<PageContextBuiltIn, 'routeParams' | 'Page'> {
  /** Course ID */
  courseId: ApiCourse['id']

  /** Course slug */
  courseSlug: ApiCourse['slug']

  /** Current locale */
  locale: LanguageCode

  /** Page component */
  Page: ElementType

  /** Language code from request header */
  requestLocale: LanguageCode

  /** URL host */
  host?: string

  /** Request URL */
  urlOriginal: string

  /** Instruct server to perform a redirect */
  redirectTo?: string

  /** Route params */
  routeParams: RouteInfo

  /** Application redux store */
  store: Store
}

/** Props to render a page */
export interface PageProps {
  /** Page Id */
  pageSlug?: ApiPage['slug']

  /** Section path */
  sectionPath?: string
}
