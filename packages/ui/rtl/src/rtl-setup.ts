import '@testing-library/jest-dom/vitest'

import { cleanup as rtlCleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import server from './msw.js'

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

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => {
  server.close()
  vi.unstubAllGlobals()
})

afterEach(() => {
  server.resetHandlers()
  rtlCleanup()
})
