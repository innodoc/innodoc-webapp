import markdownToHast from '@innodoc/content-parser'
import { serializeParserError } from '@innodoc/content-parser/utils'
import { isContentWithHash, isParserError } from '@innodoc/shared-core/typeguards'

// TODO: put into separate package with own tsconfig.json, lib: ["webworker"]

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
