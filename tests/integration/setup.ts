import '@testing-library/jest-dom'

import { makeServer } from '../mocks/node'

// Mock client router as it doesn't work in Node.js
vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: vi.fn(),
}))

// API mocking
const server = makeServer(import.meta.env.INNODOC_APP_ROOT)
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
