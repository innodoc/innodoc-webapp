import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

// TODO: set html lang attribute from i18n store

export default class InnodocDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title key="title">innoDoc web app</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css" />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
