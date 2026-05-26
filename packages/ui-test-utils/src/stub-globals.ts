import { vi } from 'vitest'

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
  addListener: vi.fn(), // deprecated
  removeListener: vi.fn(), // deprecated
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}))
