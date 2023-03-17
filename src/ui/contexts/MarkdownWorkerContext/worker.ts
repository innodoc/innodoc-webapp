import { markdownToHast } from '#markdown/markdownToHast'

self.onmessage = (event) => {
  if (typeof event.data === 'string') {
    void markdownToHast(event.data).then((hast) => {
      self.postMessage(hast)
      return undefined
    })
  }
}
