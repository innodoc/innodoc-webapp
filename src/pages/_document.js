import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

import withI18next from '../components/hoc/withI18next'

class InnodocDocument extends Document {
  render() {
    const { language } = this.props.i18n
    return (
      <html lang={language}>
        <Head>
          <title key="title">
            innoDoc web app
          </title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.1/semantic.min.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default withI18next()(InnodocDocument)
