import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

class InnodocDocument extends Document {
  static getInitialProps({ req }) {
    // render correct lang attribute (only SSR)
    return { language: req.i18n.language }
  }

  render() {
    const { language } = this.props
    return (
      <html lang={language}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css" key="semantic-style" />
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
