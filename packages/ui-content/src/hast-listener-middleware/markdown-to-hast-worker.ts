import markdownToHast from '@innodoc/content-parser'
import { serializeParserError } from '@innodoc/content-parser/utils'
import { isContentWithHash, isParserError } from '@innodoc/shared-core/typeguards'

function handleMessage({ data }: MessageEvent<unknown>) {
  if (isContentWithHash(data)) {
    const { content, hash } = data

    markdownToHast(content)
      .then((root) => {
        self.postMessage({ hash, root })
        return
      })
      .catch((error: unknown) => {
        if (isParserError(error)) {
          self.postMessage({ hash, error: serializeParserError(error) })
        } else {
          console.error('markdownToHastWorker: Unable to handle error object', error)
        }
      })
  }
}

globalThis.addEventListener('message', handleMessage)
