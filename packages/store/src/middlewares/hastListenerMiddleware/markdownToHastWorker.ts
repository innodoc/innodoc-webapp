import markdownToHast from '@innodoc/markdown'
import { serializeParserError } from '@innodoc/markdown/utils'
import { isContentWithHash } from '@innodoc/typeguards/content'
import { isParserError } from '@innodoc/typeguards/errors'

self.onmessage = ({ data }: MessageEvent<unknown>) => {
  if (isContentWithHash(data)) {
    const { content, hash } = data

    void markdownToHast(content)
      .then((root) => {
        self.postMessage({ hash, root })
        return
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
