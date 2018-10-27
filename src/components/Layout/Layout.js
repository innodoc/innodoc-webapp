import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Layout as AntLayout } from 'antd'

import { childrenType, messageType } from '../../lib/propTypes'
import { clearMessage } from '../../store/actions/ui'
import uiSelectors from '../../store/selectors/ui'
import Header from './Header'
// import Sidebar from './Sidebar'
// import Footer from './Footer'
// import MessageModal from '../MessageModal'

const Layout = ({
  children,
  message,
  onMessageModalClosed,
}) => {
  // const modal = message
  //   ? <MessageModal message={message} onClose={onMessageModalClosed} />
  //   : null
  return (
    <AntLayout>
      <Header />
    </AntLayout>
  )
}
// {modal}
// <Sidebar>
//   {children}
// </Sidebar>
// <Footer />

Layout.propTypes = {
  children: childrenType.isRequired,
  message: messageType,
  onMessageModalClosed: PropTypes.func.isRequired,
}

Layout.defaultProps = {
  ...React.Component.defaultProps,
}

const mapStateToProps = state => ({
  message: uiSelectors.getMessage(state),
})

const mapDispatchToProps = {
  onMessageModalClosed: clearMessage,
}

export { Layout } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(Layout)
