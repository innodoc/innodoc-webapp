import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock client router as it doesn't work in Node.js
vi.mock('vite-plugin-ssr/client/router', () => ({
  navigate: vi.fn(),
}))
