// this is only rendered server-side

import React from 'react'
import Document, { Main, Head as NextHead, NextScript } from 'next/document'
import { lngFromReq } from 'next-i18next/dist/commonjs/utils'

// TODO: remove this workaround if possible
// CSS links are in wrong order in production build.
// https://github.com/zeit/next.js/issues/3575
class Head extends NextHead {
  getCssLinks() {
    return super.getCssLinks().reverse()
  }
}

class InnodocDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      language: lngFromReq(ctx.req),
    }
  }

  render() {
    const { language } = this.props
    return (
      <html lang={language}>
        <Head>
          <meta
            content="initial-scale=1.0, width=device-width"
            key="viewport"
            name="viewport"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default InnodocDocument
