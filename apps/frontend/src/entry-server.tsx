import type { RenderFunction } from './types.js'
import createCache from '@emotion/cache'
import { createStreamableHead, prepareStreamingTemplate, UnheadProvider } from '@unhead/react/stream/server'
import { PassThrough } from 'node:stream'
import { renderToPipeableStream } from 'react-dom/server'
import App from './App.js'

const render: RenderFunction = function render({ htmlTemplate, store, ...otherProps }) {
  // Use 'css' key to match @emotion/react's default SSR cache.
  // The SSR build of @emotion/react falls back to a default cache with key 'css'
  // when CacheProvider context isn't resolved (which happens for some MUI v9
  // styled components during streaming SSR). Using the same key ensures
  // server and client generate matching class names.
  const emotionCache = createCache({ key: 'css' })
  const { head } = createStreamableHead()
  const state = {
    preloadedState: store.getState(),
    locale: otherProps.i18n.language,
  }
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
