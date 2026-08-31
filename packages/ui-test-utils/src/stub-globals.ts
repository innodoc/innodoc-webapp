import { vi } from 'vitest'
import parseConfig from '@innodoc/server-env'

// https://github.com/vitest-dev/vitest/issues/4043#issuecomment-1905172846
class ESBuildAndJSDOMCompatibleTextEncoder extends TextEncoder {
  encode(input: string) {
    if (typeof input !== 'string') {
      throw new TypeError('`input` must be a string')
    }

    const decodedURI = decodeURIComponent(encodeURIComponent(input))
    const arr = new Uint8Array(decodedURI.length)
    // oxlint-disable-next-line @typescript-eslint/no-misused-spread
    const chars = [...decodedURI]
    for (let i = 0; i < chars.length; i++) {
      arr[i] = decodedURI[i]?.codePointAt(0) ?? 0
    }
    return arr
  }
}

vi.stubGlobal('TextEncoder', ESBuildAndJSDOMCompatibleTextEncoder)

// The store asks for API paths relative to the app root, which a browser resolves against the page's
// own origin. Node has no such context - `new Request('/api/...')` fails there as an invalid URL -
// so relative request URLs are resolved against the configured root, which is the origin the mock
// server registers its handlers under.
const { appRoot } = parseConfig()
const NodeRequest = globalThis.Request

class TestRequest extends NodeRequest {
  constructor(input: RequestInfo | URL, init?: RequestInit) {
    // `new URL` leaves absolute URLs as they are
    super(typeof input === 'string' ? new URL(input, appRoot).href : input, init)
  }
}

vi.stubGlobal('Request', TestRequest)

vi.stubGlobal(
  'Worker',
  vi.fn((path, opts) => {
    console.log('Worker mock: markdownToHastWorker.js', path, opts)
  }),
)

// https://github.com/jsdom/jsdom/issues/3522
vi.stubGlobal('matchMedia', (query: unknown) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn<() => void>(), // deprecated
  removeListener: vi.fn<() => void>(), // deprecated
  addEventListener: vi.fn<() => void>(),
  removeEventListener: vi.fn<() => void>(),
  dispatchEvent: vi.fn<() => void>(),
}))
