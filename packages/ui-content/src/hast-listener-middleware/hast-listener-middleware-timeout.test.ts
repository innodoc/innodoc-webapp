import { expect, test, vi } from 'vitest'
import { RouteManager } from '@innodoc/shared-core/routes'
import type { ContentWithHash } from '@innodoc/shared-core/types'
import makeStore from '@innodoc/shared-store'
import { changeRouteTransitionInfo } from '@innodoc/shared-store/slices/app'
import { selectHast, selectHastResultByHash } from '@innodoc/shared-store/slices/hast'
import hastListenerMiddleware, { setupHastListeners } from './hast-listener-middleware.js'

/** Content the mocked fetch hands to the worker; its 8-char hash is the store key */
const content = { content: 'some content', hash: 'deadbeef' }

// Only the outer HTTP boundary is mocked: `fetchContent` resolves immediately with a
// hash-keyed payload, so no RTKQ/MSW network or timers are involved. `vi.hoisted` +
// re-implementation in the test keeps the stub alive under the `mockReset: true` config.
const { mockFetchContent } = vi.hoisted(() => ({
  mockFetchContent: vi.fn<() => Promise<{ isSuccess: boolean; data: ContentWithHash }>>(),
}))

vi.mock('@innodoc/shared-store/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@innodoc/shared-store/utils')>()
  return {
    ...actual,
    fetchContent: mockFetchContent,
  }
})

/**
 * Worker double that accepts the job but never posts a result back - the post-less path that
 * previously hung the page forever.
 */
class SilentWorker {
  static instances: SilentWorker[] = []
  readonly posted: unknown[] = []

  constructor() {
    SilentWorker.instances.push(this)
  }

  addEventListener(): void {
    // The double never posts a result, so no listener would ever be delivered anything
  }

  removeEventListener(): void {
    // Nothing was ever added, see addEventListener
  }

  postMessage(data: unknown): void {
    this.posted.push(data)
  }
}

vi.stubGlobal('Worker', SilentWorker)

test('a worker that never posts degrades to an error state instead of hanging', async () => {
  mockFetchContent.mockResolvedValue({ isSuccess: true, data: content })
  vi.useFakeTimers()
  try {
    const store = makeStore({ extraMiddlewares: [hastListenerMiddleware.middleware] })
    setupHastListeners(
      new RouteManager({
        config: {
          courseSlugMode: 'SINGLE',
          defaultCourseSlug: 'test-course',
          pagePathPrefix: 'page',
          sectionPathPrefix: 'section',
        },
      }),
    )
    const worker = SilentWorker.instances.at(-1)
    if (!worker) {
      throw new Error('setupHastListeners did not create a worker')
    }

    store.dispatch(
      changeRouteTransitionInfo({ name: 'app:course:page', courseSlug: 'test-course', locale: 'en', pageSlug: 'home' }),
    )

    // The job reaches the worker, but it never posts a result
    await vi.advanceTimersByTimeAsync(0)
    expect(worker.posted).toHaveLength(1)

    // Advance past the worker-result timeout: take() resolves null and the middleware must
    // surface an error for the hash instead of blocking on the processing spinner.
    await vi.advanceTimersByTimeAsync(31_000)

    const result = selectHastResultByHash(store.getState(), content.hash)
    expect(result?.root).toBeUndefined()
    expect(result?.error).toMatchObject({
      ruleId: 'worker-timeout',
      source: 'worker',
    })
    expect(selectHast(store.getState()).isProcessing).toBe(false)
  } finally {
    vi.useRealTimers()
  }
})
