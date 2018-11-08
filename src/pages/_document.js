// this is only rendered server-side

import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

class InnodocDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      language: ctx.req.i18n.language,
    }
  }

  render() {
    const { language } = this.props
    return (
      <html lang={language}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
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
