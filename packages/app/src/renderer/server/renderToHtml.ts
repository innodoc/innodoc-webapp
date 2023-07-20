import { Writable } from 'stream'

import type { ReactNode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'

class HtmlWritable extends Writable {
  chunks: Uint8Array[] = []
  html = ''

  getHtml() {
    return this.html
  }

  _write(chunk: Uint8Array, _: BufferEncoding, callback: (error?: Error | null) => void) {
    this.chunks.push(chunk)
    callback()
  }

  _final(callback: (error?: Error | null) => void) {
    this.html = Buffer.concat(this.chunks).toString()
    callback()
  }
}

/** Render to HTML string using `renderToPipeableStream` under the hood */
const renderToHtml = (children: ReactNode): Promise<string> =>
  new Promise((resolve, reject) => {
    const writable = new HtmlWritable()
    const stream = renderToPipeableStream(children, {
      onAllReady() {
        stream.pipe(writable)
      },
      onError(err) {
        reject(err)
      },
    })
    writable.on('finish', () => {
      resolve(writable.getHtml())
    })
  })

export default renderToHtml
