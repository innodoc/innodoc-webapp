import type { Element } from 'hast'
import { beforeAll, expect, test, vi } from 'vitest'
import { isHastRootDivElement } from '@innodoc/shared-core/typeguards'

/** The unclosed-attribute document pinned in packages/content-parser/src/utils.test.ts */
const unclosedMdx = '<Info title="unclosed>'

type WorkerMessageHandler = (event: { data: unknown }) => void

let handleMessage: WorkerMessageHandler

beforeAll(async () => {
  // Capture the handler the worker module registers on import, instead of driving jsdom's
  // message-event loop
  const addEventListener = vi.fn<(type: string, listener: WorkerMessageHandler) => void>()
  vi.stubGlobal('addEventListener', addEventListener)
  await import('./markdown-to-hast-worker.js')
  const register = addEventListener.mock.calls.find(([type]) => type === 'message')
  if (!register) {
    throw new Error('the worker module did not register a message listener')
  }
  handleMessage = register[1]
})

test('posts the annotated root element for valid content', async () => {
  const postMessage = vi.fn<(data: unknown) => void>()
  vi.stubGlobal('self', { postMessage })

  handleMessage({ data: { content: 'hello *world*', hash: 'abcdef01' } })
  // The transform phase is async; wait for the worker's post
  await vi.waitFor(() => {
    expect(postMessage).toHaveBeenCalledTimes(1)
  })

  const posted = postMessage.mock.calls[0]?.[0] as { hash: string; root?: unknown; error?: unknown }
  expect(posted.hash).toBe('abcdef01')
  // The main thread only accepts posts whose root satisfies this guard
  expect(isHastRootDivElement(posted.root)).toBe(true)
  // The Markdown was transformed: the root div holds a paragraph with emphasis
  const root = posted.root as Element
  expect(root.tagName).toBe('div')
  expect(root.children[0]).toMatchObject({ type: 'element', tagName: 'p' })
  const emphasis = (root.children[0] as Element).children[1]
  expect(emphasis).toMatchObject({ type: 'element', tagName: 'em' })
  expect(posted.error).toBeUndefined()
})

test('posts the serialized parser error when an unclosed MDX attribute quote throws synchronously', async () => {
  const postMessage = vi.fn<(data: unknown) => void>()
  vi.stubGlobal('self', { postMessage })

  handleMessage({ data: { content: unclosedMdx, hash: 'deadbeef' } })
  await vi.waitFor(() => {
    expect(postMessage).toHaveBeenCalledTimes(1)
  })

  // The parse error throws synchronously out of markdownToHast; the worker's try/await/catch
  // must still turn it into the exact wire-shaped post the store consumes.
  expect(postMessage).toHaveBeenCalledWith({
    hash: 'deadbeef',
    error: {
      column: 23,
      line: 1,
      reason: 'Unexpected end of file in attribute value, expected a corresponding closing quote `"`',
      ruleId: 'unexpected-eof',
      source: 'micromark-extension-mdx-jsx',
    },
  })
})
