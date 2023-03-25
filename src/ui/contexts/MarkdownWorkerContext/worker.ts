import markdownToHast from '#markdown/markdownToHast/markdownToHast'

self.onmessage = (event) => {
  if (typeof event.data === 'string') {
    void markdownToHast(event.data)
      .then((root) => {
        self.postMessage({ root })
        return undefined
      })
      .catch((error) => {
        self.postMessage({ error })
      })
  }
}
