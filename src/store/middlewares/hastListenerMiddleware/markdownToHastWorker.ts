import markdownToHast from '#markdown/markdownToHast'
import { isParserError, isContentWithHash } from '#types/typeGuards'
import { serializeParserError } from '#utils/content'

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
