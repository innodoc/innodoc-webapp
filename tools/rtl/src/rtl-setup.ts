import '@testing-library/jest-dom/vitest'
import './stubGlobals.js'

import { cleanup as rtlCleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import config from '../../config/src/parseConfig.js'
import makeServer from '@innodoc/mock-content/msw/node'

const server = makeServer(config.appRoot)

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
