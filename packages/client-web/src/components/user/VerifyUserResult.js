import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { verifyUser } from '@innodoc/client-misc/src/api'
import { useTranslation } from 'next-i18next'
import appSelectors from '@innodoc/client-store/src/selectors'

import LoginButton from '../LoginButton'
import PageTitle from '../PageTitle'

const VerifyUserResult = ({ token }) => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const [status, setStatus] = useState('pending')
  const { t } = useTranslation()
  const title = t(`user.verification.${status}.title`)

  useEffect(() => {
    verifyUser(appRoot, csrfToken, token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [appRoot, csrfToken, token])

  const extra = status === 'success' ? <LoginButton /> : null
  const icon = status === 'pending' ? <LoadingOutlined /> : null

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <Result
        extra={extra}
        icon={icon}
        status={status !== 'pending' ? status : 'info'}
        subTitle={t(`user.verification.${status}.subTitle`)}
        title={title}
      />
    </>
  )
}

VerifyUserResult.propTypes = {
  token: PropTypes.string.isRequired,
}

export default VerifyUserResult
