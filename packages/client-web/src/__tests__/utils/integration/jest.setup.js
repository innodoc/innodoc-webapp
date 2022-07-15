import '@testing-library/jest-dom' // RTL-specific matchers

import server from './api-mock/server.js'

// Mock window.matchMedia (used by antd)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/router as page navigation is not implemented in jsdom
jest.mock('next/router', () => require('next-router-mock'))
// For next/link to work
jest.mock('next/dist/client/router', () => require('next-router-mock'))

// Disable annoying warnings coming from async-validator
// https://github.com/yiminghe/async-validator#how-to-avoid-global-warning
globalThis.ASYNC_VALIDATOR_NO_WARNING = 1

// Mock api
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers()) // reset handlers added during test
afterAll(() => server.close())
