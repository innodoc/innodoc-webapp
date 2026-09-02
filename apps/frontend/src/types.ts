import type { i18n } from 'i18next'
import type { Readable } from 'node:stream'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { LanguageCode } from '@innodoc/shared-core/types'
import type { RootState, Store } from '@innodoc/shared-store/types'

interface RenderContext {
  htmlTemplate: string
  i18n: i18n
  /**
   * Locale the document is rendered in, resolved from the URL by the request handler. Passed in so
   * that the server markup and the client seed cannot disagree on it, which is what makes hydration
   * possible.
   */
  locale: LanguageCode
  routeManager: RouteManager
  store: Store
  url: string
}

/** Server render outcome: the HTML to send, and the status it must be sent with */
interface RenderResult {
  /**
   * HTTP status of the response, resolved when the app shell is ready (200) or when the render
   * proved unable to produce one (500, with a minimal error page on {@link RenderResult.stream}).
   * It always resolves before the first byte is written, so awaiting it costs no time to first
   * byte and never rejects.
   */
  status: Promise<number>
  /** HTML stream, piped to the response once `status` resolved */
  stream: Readable
}

type RenderFunction = (ctx: RenderContext) => RenderResult

interface ServerEntryModule {
  default: RenderFunction
}

interface InitialState {
  locale: string
  preloadedState: RootState
  supportedLocales: string[]
}

export type { InitialState, RenderFunction, RenderResult, ServerEntryModule }
