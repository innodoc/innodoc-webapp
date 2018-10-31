import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import AntLayout from 'antd/lib/layout'

import { childrenType, messageType } from '../../lib/propTypes'
import { clearMessage } from '../../store/actions/ui'
import uiSelectors from '../../store/selectors/ui'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MessageModal from '../MessageModal'

const Layout = ({
  children,
  message,
  onMessageModalClosed,
  disableSidebar,
}) => {
  const modal = message
    ? <MessageModal message={message} onClose={onMessageModalClosed} />
    : null

  return (
    <React.Fragment>
      <AntLayout>
        <Header disableSidebar={disableSidebar} />
        <AntLayout>
          {disableSidebar ? null : <Sidebar />}
          <AntLayout>
            {children}
          </AntLayout>
        </AntLayout>
        <Footer />
      </AntLayout>
      {modal}
    </React.Fragment>
  )
}

Layout.propTypes = {
  children: childrenType.isRequired,
  message: messageType,
  onMessageModalClosed: PropTypes.func.isRequired,
  disableSidebar: PropTypes.bool,
}

Layout.defaultProps = {
  ...React.Component.defaultProps,
  disableSidebar: false,
}

const mapStateToProps = state => ({
  message: uiSelectors.getMessage(state),
})

const mapDispatchToProps = {
  onMessageModalClosed: clearMessage,
}

export { Layout } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(Layout)
