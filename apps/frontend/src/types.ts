import type { i18n } from 'i18next'
import type { Readable } from 'node:stream'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { RootState, Store } from '@innodoc/shared-store/types'

interface RenderContext {
  htmlTemplate: string
  i18n: i18n
  routeManager: RouteManager
  store: Store
  url: string
}

type RenderFunction = (ctx: RenderContext) => Readable

interface ServerEntryModule {
  default: RenderFunction
}

interface InitialState {
  locale: string
  preloadedState: RootState
  supportedLocales: string[]
}

export type { InitialState, RenderFunction, ServerEntryModule }
