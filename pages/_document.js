import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

export default class InnodocDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title key="title">innoDoc web app</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
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
