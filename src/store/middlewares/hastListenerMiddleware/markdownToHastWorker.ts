import markdownToHast from '#markdown/markdownToHast/markdownToHast'
import { isError, isContentWithHash } from '#types/typeGuards'

self.onmessage = ({ data }: MessageEvent<unknown>) => {
  if (isContentWithHash(data)) {
    const { content, hash } = data

    void markdownToHast(content)
      .then((root) => {
        self.postMessage({ hash, root })
        return undefined
      })
      .catch((error) => {
        if (isError(error)) {
          self.postMessage({ hash, error: error.message })
        } else {
          console.error(`markdownToHastWorker: Unable to handle error object`, error)
        }
      })
  }
}
