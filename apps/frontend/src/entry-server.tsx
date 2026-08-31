import type { RenderFunction } from './types.js'
import createCache from '@emotion/cache'
import { createStreamableHead, prepareStreamingTemplate, UnheadProvider } from '@unhead/react/stream/server'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import App from './App.js'
import renderErrorShell, { makeErrorDetail } from './error-shell.js'

/**
 * How long the app shell may stay unrenderable before the request is answered with the error page.
 * A shell that never becomes ready would otherwise hold the connection open forever.
 */
const SHELL_TIMEOUT = 10_000

/** Transition of the render, drives the HTTP status: only the first one counts */
type Phase = 'failed' | 'pending' | 'streaming'

const render: RenderFunction = function render({ htmlTemplate, store, url, ...otherProps }) {
  // Use 'css' key to match @emotion/react's default SSR cache.
  // The SSR build of @emotion/react falls back to a default cache with key 'css'
  // when CacheProvider context isn't resolved (which happens for some MUI v9
  // styled components during streaming SSR). Using the same key ensures
  // server and client generate matching class names.
  const emotionCache = createCache({ key: 'css' })
  const { head } = createStreamableHead()

  // The client mirrors the server's supported locales so that i18next's default
  // 'dev' fallback is never added to the list of languages to load (which would
  // cause a spurious 404 request for a 'dev' locale file).
  const supportedLocales = Array.isArray(otherProps.i18n.options.supportedLngs)
    ? otherProps.i18n.options.supportedLngs
    : []

  // Seed the client i18next with the route's locale (the URL is the source of
  // truth) instead of the request-detected language, so the client's language
  // matches the redux app slice. Fall back to the default locale for URLs with
  // an unsupported locale prefix (e.g., /fr/... when only 'en' and 'de' exist).
  const preloadedState = store.getState()
  const routeLocale = preloadedState.app.routeInfo.locale
  const locale = supportedLocales.includes(routeLocale) ? routeLocale : (DEFAULT_LOCALES[0] ?? 'en')

  const state = { preloadedState, locale, supportedLocales }
  const stream = new PassThrough()

  // The status must be known before the first byte leaves the server, so the handler awaits
  // `status` rather than sending blindly: 'pending' until React produces the shell ('streaming',
  // 200) or proves that it cannot ('failed', 500 and a minimal error page). An unrenderable page
  // must never reach the browser as an empty 200 - that is a white screen with no explanation.
  let phase: Phase = 'pending'
  let abortRender: (() => void) | undefined
  let shellTimer: ReturnType<typeof setTimeout> | undefined
  let resolveStatus!: (statusCode: number) => void
  const status = new Promise<number>((resolve) => {
    resolveStatus = resolve
  })

  const settle = (statusCode: number) => {
    if (shellTimer) {
      clearTimeout(shellTimer)
      shellTimer = undefined
    }

    phase = statusCode === 200 ? 'streaming' : 'failed'
    resolveStatus(statusCode)
  }

  const fail = (error: unknown, context: string) => {
    console.error(`[SSR] ${context}:`, error)

    if (phase === 'streaming') {
      // The status is already on the wire, all that is left is to stop the response hanging.
      stream.destroy(error instanceof Error ? error : new Error(makeErrorDetail(error)))
      return
    }

    if (phase === 'failed') {
      return
    }

    settle(500)
    stream.write(renderErrorShell({ detail: import.meta.env.DEV ? makeErrorDetail(error) : undefined, locale, url }))
    stream.end()
    abortRender?.()
  }

  shellTimer = setTimeout(() => {
    fail(new Error(`App shell was not ready within ${String(SHELL_TIMEOUT)} ms`), 'Timeout')
  }, SHELL_TIMEOUT)
  shellTimer.unref()

  const reactNode = (
    <div id="root">
      <UnheadProvider value={head}>
        <App emotionCache={emotionCache} store={store} url={url} {...otherProps} />
      </UnheadProvider>
    </div>
  )

  try {
    const { pipe, abort } = renderToPipeableStream(reactNode, {
      bootstrapScriptContent: `window.__initial_state__=${JSON.stringify(state)}`,
      onShellReady() {
        if (phase !== 'pending') {
          abort()
          return
        }

        try {
          // Write the template with head content injected
          const { shell, end } = prepareStreamingTemplate(head, htmlTemplate)

          // From here on the status cannot change anymore: the shell is on its way to the client
          settle(200)
          stream.write(shell)

          // Pipe React's HTML stream
          const passthrough = new PassThrough()
          passthrough.on('data', (chunk) => stream.write(chunk))

          // Flush any remaining head state (e.g., from resolved Suspense boundaries)
          passthrough.on('end', () => {
            stream.write(end)
            stream.end()
          })

          passthrough.on('error', (error) => stream.destroy(error instanceof Error ? error : new Error(String(error))))
          pipe(passthrough)
        } catch (error) {
          fail(error, 'Unable to write the app shell')
        }
      },
      onShellError(error) {
        fail(error, 'App shell could not be rendered')
      },
      // Errors in a Suspense boundary after the shell left the server can only be logged: the
      // status is already sent, and React hands the error to the client to recover the boundary.
      // Recoverable boundary errors therefore no longer take the whole page down.
      onError(error) {
        console.error('[SSR] onError:', error)
      },
    })

    abortRender = abort
  } catch (error) {
    fail(error, 'Unable to start rendering')
  }

  return { status, stream }
}

export default render
