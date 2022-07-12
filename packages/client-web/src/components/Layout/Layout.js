import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Layout as AntLayout } from 'antd'

import cookies from 'react-cookies'

import { propTypes } from '@innodoc/client-misc'
import { closeMessage } from '@innodoc/client-store/src/actions/ui'
import appSelectors from '@innodoc/client-store/src/selectors'
import userMessageSelectors from '@innodoc/client-store/src/selectors/userMessage'

import DataProtectionModal from './DataProtectionModal'
import Footer from './Footer'
import Header from './Header'
import MessageModal from './MessageModal'
import Sidebar from './Sidebar'
import Toc from '../Toc'
import css from './Layout.module.sss'

const DATA_CONSENT_ACCESS_COOKIE = 'data-consent'

const Layout = ({ children, disableSidebar }) => {
  const { ftSearchEnabled, loggedInEmail } = useSelector(appSelectors.getApp)
  const message = useSelector(userMessageSelectors.getLatest)
  const dispatch = useDispatch()
  const [showConsentModal, setShowConsent] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  // Show consent dialog on first view.
  useEffect(() => {
    if (!loggedInEmail && !cookies.load(DATA_CONSENT_ACCESS_COOKIE)) {
      setShowConsent(true)
    }
  }, [loggedInEmail])

  // Save consent to cookie on accept.
  useEffect(() => {
    if (consentGiven) {
      const now = new Date()
      const expires = new Date(now.getFullYear() + 100, now.getMonth(), now.getDate())
      cookies.save(DATA_CONSENT_ACCESS_COOKIE, true, {
        expires,
        maxAge: Math.round(expires - now / 1000),
        path: '/',
        httpOnly: false,
      })
      setShowConsent(false)
    }
  }, [consentGiven])

  const sidebar = disableSidebar ? null : (
    <Sidebar>
      <Toc />
    </Sidebar>
  )

  const modal = message ? (
    <MessageModal message={message} onClose={() => dispatch(closeMessage(message.id))} />
  ) : null

  const dataProtectionModal = showConsentModal ? (
    <DataProtectionModal onAccept={() => setConsentGiven(true)} />
  ) : null

  return (
    <>
      <AntLayout hasSider={false}>
        <Header enableSearch={ftSearchEnabled} />
        <AntLayout hasSider={!disableSidebar}>
          {sidebar}
          <AntLayout>
            <div className={css.content}>{children}</div>
          </AntLayout>
        </AntLayout>
        <Footer />
      </AntLayout>
      {modal}
      {dataProtectionModal}
    </>
  )
}

Layout.defaultProps = {
  children: null,
  disableSidebar: false,
}

Layout.propTypes = {
  children: propTypes.childrenType,
  disableSidebar: PropTypes.bool,
}

export default Layout
