import markdownToHast from '@innodoc/markdown'
import { serializeParserError } from '@innodoc/utils/content'
import { isContentWithHash, isParserError } from '@innodoc/utils/type-guards'

self.onmessage = ({ data }: MessageEvent<unknown>) => {
  if (isContentWithHash(data)) {
    const { content, hash } = data

    void markdownToHast(content)
      .then((root) => {
        self.postMessage({ hash, root })
      })
      .catch((error) => {
        if (isParserError(error)) {
          self.postMessage({ hash, error: serializeParserError(error) })
        } else {
          console.error('markdownToHastWorker: Unable to handle error object', error)
        }
      })
  }
}
