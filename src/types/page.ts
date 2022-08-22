import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import type { BaseQueryFn, QueryDefinition } from '@reduxjs/toolkit/dist/query'
import type { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import type { ElementType } from 'react'
import type { HelmetServerState } from 'react-helmet-async'
import type { PageContextBuiltIn } from 'vite-plugin-ssr'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client/router'

import type { RootState } from '@/store/makeStore'

import type { Page } from './api'
import type { Locale } from './common'

/** Custom client-side page context */
export type PageContextClient = Omit<PageContextBuiltInClient, 'Page'> &
  Pick<PageContextServer, 'locale' | 'Page' | 'pageProps' | 'preloadedState'>

/** Custom server-side page context */
export type PageContextServer = Omit<PageContextBuiltIn, 'Page'> & {
  /** Styles generated by Emotion */
  emotionStyleTags: string

  /** Document head tags */
  helmet: HelmetServerState

  /** Current locale */
  locale: Locale

  /** Page component */
  Page: ElementType

  /** Rendered page HTML */
  pageHtml: string

  /** Props to pass to page component */
  pageProps: PageProps

  /** Queries specific to current page */
  pageQueryFactories: QueryFactory[]

  /** Preloaded store state */
  preloadedState: RootState

  /** Instruct server to perform a redirect */
  redirectTo?: string
}

/** Props to render a page */
export type PageProps = {
  /** Page Id */
  pageId?: Page['id']

  /** Section path */
  sectionPath?: string
}

/** Query action factory function */
export type QueryFactory = (
  locale: Locale
) => ThunkAction<
  QueryActionCreatorResult<QueryDefinition<unknown, BaseQueryFn, never, unknown>>,
  unknown,
  unknown,
  AnyAction
>
