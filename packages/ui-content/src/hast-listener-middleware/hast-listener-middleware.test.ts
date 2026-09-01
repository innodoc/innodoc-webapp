import { beforeAll, expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import { isHastRootDivElement } from '@innodoc/shared-core/typeguards'
import type { ContentWithHash } from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store'
import { changeRouteTransitionInfo } from '@innodoc/shared-store/slices/app'
import { selectHast, selectHastResultByHash } from '@innodoc/shared-store/slices/hast'
import { waitFor } from '@innodoc/ui-test-utils'
import hastListenerMiddleware, { setupHastListeners } from './hast-listener-middleware.js'

type WorkerMessageHandler = (event: { data: unknown }) => void

let workerMessageHandler: WorkerMessageHandler | null = null

/** Appended to authored content to simulate a Markdown syntax error in the document */
const BROKEN_MDX_TAIL = '\n\n<Info title="unclosed>'

/**
 * Web worker double: the middleware talks to this instance, and its `postMessage` (middleware ->
 * worker direction) feeds the job to the REAL worker module's message handler, so the actual
 * parse runs and the actual post comes back over the `self` stub below.
 */
class FakeWorker {
  static instances: FakeWorker[] = []
  /** Corrupt the content handed to the real worker, simulating authored content with a parse error */
  breakContent = false
  readonly posted: unknown[] = []
  private readonly messageListeners = new Set<WorkerMessageHandler>()

  constructor() {
    FakeWorker.instances.push(this)
  }

  addEventListener(type: string, listener: WorkerMessageHandler): void {
    if (type === 'message') {
      this.messageListeners.add(listener)
    }
  }

  removeEventListener(type: string, listener: WorkerMessageHandler): void {
    if (type === 'message') {
      this.messageListeners.delete(listener)
    }
  }

  postMessage(data: unknown): void {
    this.posted.push(data)
    if (!workerMessageHandler) {
      return
    }
    const job = data as ContentWithHash
    const content = this.breakContent ? job.content + BROKEN_MDX_TAIL : job.content
    workerMessageHandler({ data: { ...job, content } })
  }

  /** Worker -> main thread direction: deliver a post from the real worker to the middleware */
  receiveFromWorker(data: unknown): void {
    for (const listener of this.messageListeners) {
      listener({ data })
    }
  }
}

/**
 * Worker -> main thread direction: the real worker module posts to this stub. `location` is
 * required because vite's worker plugin resolves the worker URL against `self.location` in test
 * environments, where jsdom's window would otherwise be bypassed by the stub; a real Location
 * stringifies to its href, so the stub does the same.
 */
vi.stubGlobal('self', {
  location: 'http://localhost:3000/',
  postMessage: (data: unknown) => {
    FakeWorker.instances.at(-1)?.receiveFromWorker(data)
  },
})

vi.stubGlobal('Worker', FakeWorker)

beforeAll(async () => {
  // Capture the handler the real worker module registers on import
  const addEventListener = vi.fn<(type: string, listener: WorkerMessageHandler) => void>()
  vi.stubGlobal('addEventListener', addEventListener)
  await import('./markdown-to-hast-worker.js')
  const register = addEventListener.mock.calls.find(([type]) => type === 'message')
  if (!register) {
    throw new Error('the worker module did not register a message listener')
  }
  workerMessageHandler = register[1]
})

function makeRouteManager(): RouteManager {
  return new RouteManager({
    config: {
      courseSlugMode: 'SINGLE',
      defaultCourseSlug: 'test-course',
      pagePathPrefix: 'page',
      sectionPathPrefix: 'section',
    },
  })
}

function makeStoreWithMiddleware() {
  return makeStore({ extraMiddlewares: [hastListenerMiddleware.middleware] })
}

function workerFromLatestSetup(): FakeWorker {
  const worker = FakeWorker.instances.at(-1)
  if (!worker) {
    throw new Error('setupHastListeners did not create a worker')
  }
  return worker
}

test('page transition with parseable content stores the hast and clears the processing state', async () => {
  const store = makeStoreWithMiddleware()
  setupHastListeners(makeRouteManager())
  const worker = workerFromLatestSetup()

  store.dispatch(
    changeRouteTransitionInfo({ name: 'app:course:page', courseSlug: 'test-course', locale: 'en', pageSlug: 'home' }),
  )

  await waitFor(() => {
    const job = worker.posted[0] as ContentWithHash
    expect(job).toBeDefined()
    const result = selectHastResultByHash(store.getState(), job.hash)
    expect(isHastRootDivElement(result?.root)).toBe(true)
  })

  expect(selectHast(store.getState()).isProcessing).toBe(false)
})

test('a parse error in authored content surfaces as an error result and clears the processing state', async () => {
  const store = makeStoreWithMiddleware()
  setupHastListeners(makeRouteManager())
  const worker = workerFromLatestSetup()
  worker.breakContent = true

  store.dispatch(
    changeRouteTransitionInfo({ name: 'app:course:page', courseSlug: 'test-course', locale: 'en', pageSlug: 'home' }),
  )

  // The broken document must end in the error state (no spinner), not a hang: the parse error
  // the real worker posts for the corrupted content is stored for its hash and processing clears.
  await waitFor(() => {
    const job = worker.posted[0] as ContentWithHash
    expect(job).toBeDefined()
    const result = selectHastResultByHash(store.getState(), job.hash)
    expect(result?.root).toBeUndefined()
    expect(result?.error).toMatchObject({
      ruleId: 'unexpected-eof',
      source: 'micromark-extension-mdx-jsx',
    })
    expect(result?.error?.reason).toContain('Unexpected end of file in attribute value')
  })

  expect(selectHast(store.getState()).isProcessing).toBe(false)
})
