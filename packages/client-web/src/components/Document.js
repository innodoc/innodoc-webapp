// this is only rendered server-side

import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import { lngFromReq } from 'next-i18next/dist/commonjs/utils'

export default class InnodocDocument extends Document {
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
      <Html lang={language}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
