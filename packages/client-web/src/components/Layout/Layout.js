import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import AntLayout from 'antd/lib/layout'

import { childrenType } from '@innodoc/client-misc/src/propTypes'
import { clearMessage } from '@innodoc/client-store/src/actions/ui'
import appSelectors from '@innodoc/client-store/src/selectors'

import css from './style.sass'
import Footer from './Footer'
import Header from './Header'
import MessageModal from '../MessageModal'
import Sidebar from './Sidebar'
import Toc from '../Toc'

const Layout = ({ children, disableSidebar }) => {
  const { message } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

  const modal = message
    ? <MessageModal message={message} onClose={() => dispatch(clearMessage())} />
    : null

  const sidebar = disableSidebar
    ? null
    : (
      <Sidebar>
        <Toc />
      </Sidebar>
    )

  return (
    <>
      <AntLayout hasSider={false}>
        <Header />
        <AntLayout hasSider={!disableSidebar}>
          {sidebar}
          <AntLayout>
            <div className={css.content}>
              {children}
            </div>
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
