import React from 'react'
import PropTypes from 'prop-types'

import { childrenType } from '../../lib/propTypes'
import Header from './Header'
import Content from './Content'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children, sidebar }) => {
  const ContentWrapper = sidebar ? Sidebar : Content
  return (
    <div>
      <Header />
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: childrenType.isRequired,
  sidebar: PropTypes.bool.isRequired,
}

Layout.defaultProps = {
  ...React.Component.defaultProps,
  sidebar: false,
}

export default Layout
