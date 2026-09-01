import { beforeEach, expect, test, vi } from 'vitest'

type WorkerMessageHandler = (event: { data: unknown }) => void

// The fallback branch is only reachable for errors that do NOT satisfy isParserError (an
// unexpected crash inside a transform, not a Markdown syntax error), so stub the parser with a
// function that throws a plain Error. `vi.hoisted` + re-implementation in `beforeEach` keeps the
// stub alive under the `mockReset: true` config of this package.
const { throwingParser } = vi.hoisted(() => ({
  throwingParser: vi.fn<(code: string) => unknown>(),
}))

vi.mock('@innodoc/content-parser', () => ({
  default: throwingParser,
}))

beforeEach(() => {
  throwingParser.mockImplementation(() => {
    throw new Error('kaboom')
  })
})

test('posts a synthesized wire-shaped error for a non-parser throw so the main thread never hangs', async () => {
  const postMessage = vi.fn<(data: unknown) => void>()
  // Capture the handler the worker module registers on import
  const addEventListener = vi.fn<(type: string, listener: WorkerMessageHandler) => void>()
  vi.stubGlobal('addEventListener', addEventListener)
  vi.stubGlobal('self', { postMessage })

  await import('./markdown-to-hast-worker.js')
  const register = addEventListener.mock.calls.find(([type]) => type === 'message')
  if (!register) {
    throw new Error('the worker module did not register a message listener')
  }
  const handleMessage = register[1]

  handleMessage({ data: { content: 'anything at all', hash: 'cafebabe' } })
  await vi.waitFor(() => {
    expect(postMessage).toHaveBeenCalledTimes(1)
  })

  // The thrown Error does not satisfy isParserError, so the worker must still post a result —
  // this post is what keeps the main thread's take() from blocking forever.
  expect(postMessage).toHaveBeenCalledWith({
    hash: 'cafebabe',
    error: {
      column: 0,
      line: 0,
      reason: 'kaboom',
      ruleId: 'worker-unknown-error',
      source: 'worker',
    },
  })
})
