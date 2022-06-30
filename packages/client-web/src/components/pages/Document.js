// this is only rendered server-side

import React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default class InnodocDocument extends Document {
  // TODO: Document does not support data fetching methods
  // static async getServerSideProps({ locale }) {
  //   return {
  //     props: {
  //       ...(await serverSideTranslations(locale, ['common'])),
  //     },
  //   }
  // }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
    // const { language } = this.props
    // return (
    //   <Html lang={language}>
    //     <Head />
    //     <body>
    //       <Main />
    //       <NextScript />
    //     </body>
    //   </Html>
    // )
  }
}
