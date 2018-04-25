import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'

import Header from './Header'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  render() {
    return (
      <div>
        <Head>
          <title key="title">innoDoc web app</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Header />
        {this.props.children}
      </div>
    )
  }

}
