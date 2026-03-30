import '@testing-library/jest-dom/vitest'
import './stub-globals.js'

import { cleanup as rtlCleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import parseConfig from '@innodoc/server-env'
import makeServer from '@innodoc/shared-fixtures/node'

const config = parseConfig()
const server = makeServer(config)

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
