import React from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import Content from './Content'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    sidebar: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    sidebar: false,
  }

  render() {
    const ContentWrapper = this.props.sidebar ? Sidebar : Content

    return (
      <div>
        <Header />
        <ContentWrapper>
          {this.props.children}
        </ContentWrapper>
        <Footer />
      </div>
    )
  }
}
