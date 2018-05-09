import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  }

  render() {
    return (
      <div>
        <Header />
        <Sidebar>
          {this.props.children}
        </Sidebar>
        <Footer />
      </div>
    )
  }
}
