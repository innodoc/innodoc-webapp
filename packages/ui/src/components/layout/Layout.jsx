import { Layout as AntLayout } from 'antd'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import cookies from 'react-cookies'
import { useDispatch, useSelector } from 'react-redux'

import { childrenType } from '@innodoc/misc/propTypes'
import { closeMessage } from '@innodoc/store/actions/ui'
import getLatestUserMessages from '@innodoc/store/selectors/getLatestUserMessages'
import { getApp } from '@innodoc/store/selectors/misc'

import Toc from '../Toc/Toc.jsx'

import DataProtectionModal from './DataProtectionModal/DataProtectionModal.jsx'
import Footer from './Footer/Footer.jsx'
import Header from './Header/Header.jsx'
import css from './Layout.module.sss'
import MessageModal from './MessageModal/MessageModal.jsx'
import Sidebar from './Sidebar/Sidebar.jsx'

const DATA_CONSENT_ACCESS_COOKIE = 'data-consent'

function Layout({ children, disableSidebar }) {
  const { ftSearchEnabled, loggedInEmail } = useSelector(getApp)
  const message = useSelector(getLatestUserMessages)
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
  children: childrenType,
  disableSidebar: PropTypes.bool,
}

export default Layout
