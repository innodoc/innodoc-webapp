import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { Layout as AntLayout } from 'antd'

import { MESSAGE_TYPES_MODAL } from '@innodoc/client-misc/src/messageDef'
import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { closeMessage } from '@innodoc/client-store/src/actions/ui'

import useUserMessage from '../../hooks/useUserMessage'
import Footer from './Footer'
import Header from './Header'
import MessageModal from './MessageModal'
import Sidebar from './Sidebar'
import Toc from '../Toc'
import css from './style.sss'

const Layout = ({ children, disableSidebar }) => {
  const message = useUserMessage(MESSAGE_TYPES_MODAL)
  const dispatch = useDispatch()

  const sidebar = disableSidebar ? null : (
    <Sidebar>
      <Toc />
    </Sidebar>
  )

  const modal = message ? (
    <MessageModal
      message={message}
      onClose={() => dispatch(closeMessage(message.id))}
    />
  ) : null

  return (
    <>
      <AntLayout hasSider={false}>
        <Header />
        <AntLayout hasSider={!disableSidebar}>
          {sidebar}
          <AntLayout>
            <div className={css.content}>{children}</div>
          </AntLayout>
        </AntLayout>
        <Footer />
      </AntLayout>
      {modal}
    </>
  )
}

Layout.defaultProps = {
  children: null,
  disableSidebar: false,
}

Layout.propTypes = {
  children: childrenType,
  disableSidebar: PropTypes.bool,
}

export default Layout
