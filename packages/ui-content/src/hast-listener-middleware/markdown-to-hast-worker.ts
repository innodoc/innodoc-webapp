import markdownToHast from '@innodoc/content-parser'
import { serializeParserError } from '@innodoc/content-parser/utils'
import { isContentWithHash, isParserError } from '@innodoc/shared-core/typeguards'
import type { ParserError } from '@innodoc/shared-core/types'

/**
 * Wire-shaped fallback for failures that are not Markdown parser errors. The main thread blocks
 * on a `take()` for a `postMessage` that is only satisfied by one of the posts in `handleMessage`;
 * a failure path that posts nothing hangs the page on the processing spinner forever, so every
 * branch of `handleMessage` must post.
 */
function unknownError(error: unknown): ParserError {
  return {
    column: 0,
    line: 0,
    reason: error instanceof Error ? error.message : String(error),
    ruleId: 'worker-unknown-error',
    source: 'worker',
  }
}

async function handleMessage({ data }: MessageEvent<unknown>) {
  if (!isContentWithHash(data)) {
    return
  }

  const { content, hash } = data

  // `markdownToHast` throws synchronously for parse-phase errors (the micromark parse rejects
  // inside `processor.parse`, before the returned promise exists), so a bare
  // `markdownToHast(…).then(…).catch(…)` chain never sees that throw. Wrapping the call in
  // `try`/`await` routes both the synchronous parse throw and any async rejection through the
  // error branch below, which always posts a result.
  try {
    const root = await markdownToHast(content)
    self.postMessage({ hash, root })
  } catch (error: unknown) {
    if (isParserError(error)) {
      self.postMessage({ hash, error: serializeParserError(error) })
    } else {
      console.error('markdownToHastWorker: Unable to handle error object', error)
      self.postMessage({ hash, error: unknownError(error) })
    }
  }
}

globalThis.addEventListener('message', (event) => {
  void handleMessage(event)
})
