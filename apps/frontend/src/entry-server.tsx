import type { RenderFunction } from './types.js'
import createCache from '@emotion/cache'
import { createStreamableHead, prepareStreamingTemplate, UnheadProvider } from '@unhead/react/stream/server'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import { DEFAULT_LOCALES } from '@innodoc/shared-core/constants'
import App from './App.js'

const render: RenderFunction = function render({ htmlTemplate, store, ...otherProps }) {
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

  const reactNode = (
    <div id="root">
      <UnheadProvider value={head}>
        <App emotionCache={emotionCache} store={store} {...otherProps} />
      </UnheadProvider>
    </div>
  )

  const { pipe, abort } = renderToPipeableStream(reactNode, {
    bootstrapModules: ['/entry-client.tsx'],
    bootstrapScriptContent: `window.__initial_state__=${JSON.stringify(state)}`,
    onShellReady() {
      try {
        // Write the template with head content injected
        const { shell, end } = prepareStreamingTemplate(head, htmlTemplate)
        stream.write(shell)

        // Pipe React's HTML stream
        const passthrough = new PassThrough()
        passthrough.on('data', (chunk) => stream.write(chunk))

        // Flush any remaining head state (e.g., from resolved Suspense boundaries)
        passthrough.on('end', () => {
          stream.write(end)
          stream.end()
        })

        passthrough.on('error', (err) => stream.destroy(err))
        pipe(passthrough)
      } catch (error) {
        stream.destroy(error instanceof Error ? error : new Error(String(error)))
      }
    },
    onError(error) {
      console.error('[SSR] onError:', error)
      abort()
      stream.destroy(error instanceof Error ? error : new Error(String(error)))
    },
  })

  return stream
}

export default render
