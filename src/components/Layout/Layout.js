import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { childrenType, messageType } from '../../lib/propTypes'
import { selectors as uiSelectors } from '../../store/reducers/ui'
import { clearMessage } from '../../store/actions/ui'
import Header from './Header'
import Main from './Main'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MessageModal from '../MessageModal'

const Layout = ({
  children,
  sidebar,
  message,
  onMessageModalClosed,
}) => {
  const ContentWrapper = sidebar ? Sidebar : Main
  const modal = message
    ? <MessageModal message={message} onClose={onMessageModalClosed} />
    : null
  return (
    <React.Fragment>
      <Header />
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <Footer />
      {modal}
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: childrenType.isRequired,
  sidebar: PropTypes.bool.isRequired,
  message: messageType,
  onMessageModalClosed: PropTypes.func.isRequired,
}

Layout.defaultProps = {
  ...React.Component.defaultProps,
  sidebar: false,
}

const mapDispatchToProps = dispatch => ({
  onMessageModalClosed: () => { dispatch(clearMessage()) },
})

const mapStateToProps = state => ({
  message: uiSelectors.getMessage(state),
})

export { Layout } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(Layout)
