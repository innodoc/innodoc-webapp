import markdownToHast from '@innodoc/markdown'
import { isParserError, isContentWithHash } from '@innodoc/types/type-guards'
import { serializeParserError } from '@innodoc/utils/content'

self.onmessage = ({ data }: MessageEvent<unknown>) => {
  if (isContentWithHash(data)) {
    const { content, hash } = data

    void markdownToHast(content)
      .then((root) => self.postMessage({ hash, root }))
      .catch((error) => {
        if (isParserError(error)) {
          self.postMessage({ hash, error: serializeParserError(error) })
        } else {
          console.error('markdownToHastWorker: Unable to handle error object', error)
        }
      })
  }
}
