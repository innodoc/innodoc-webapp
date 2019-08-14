// this is only rendered server-side

import React from 'react'
import Document, { Main, NextScript } from 'next/document'
import { lngFromReq } from 'next-i18next/dist/commonjs/utils'

import Head from './head'

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
