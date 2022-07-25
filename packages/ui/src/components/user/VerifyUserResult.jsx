import { LoadingOutlined } from '@ant-design/icons'
import { Result } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { verifyUser } from '@innodoc/misc/api'
import { getApp } from '@innodoc/store/selectors/misc'

import LoginButton from '../common/LoginButton.jsx'
import PageTitle from '../common/PageTitle.jsx'

function VerifyUserResult({ token }) {
  const { csrfToken } = useSelector(getApp)
  const [status, setStatus] = useState('pending')
  const { t } = useTranslation()
  const title = t(`user.verification.${status}.title`)

  useEffect(() => {
    verifyUser(csrfToken, token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [csrfToken, token])

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
