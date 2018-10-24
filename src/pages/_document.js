import React from 'react'
import Document, { Main, NextScript } from 'next/document'
import Head from 'next/head'

import withI18next from '../components/hoc/withI18next'

class InnodocDocument extends Document {
  render() {
    const { language } = this.props.i18n
    return (
      <html lang={language}>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.0/semantic.min.css" key="semantic-style" />
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
