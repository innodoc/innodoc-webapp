import '@testing-library/jest-dom'

import { makeServer } from '../mocks/node'

// Mock client router as it doesn't work in Node.js
vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: vi.fn(),
}))

// window.match is not implemented in jsdom
// https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// API mocking
const server = makeServer(import.meta.env.INNODOC_APP_ROOT)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
