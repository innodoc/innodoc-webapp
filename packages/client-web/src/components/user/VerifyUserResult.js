import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Button, Result } from 'antd'
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons'

import { verifyUser } from '@innodoc/client-misc/src/api'
import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

const VerifyUserResult = ({ token }) => {
  const { appRoot, csrfToken } = useSelector(appSelectors.getApp)
  const [status, setStatus] = useState('pending')
  const { t } = useTranslation()
  useEffect(() => {
    verifyUser(appRoot, csrfToken, token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [appRoot, csrfToken, token])

  const extra =
    status === 'success' ? (
      <Link href="/login">
        <Button icon={<LoginOutlined />} type="primary" key="console">
          {t('user.login.title')}
        </Button>
      </Link>
    ) : null

  const icon = status === 'pending' ? <LoadingOutlined /> : null

  return (
    <Result
      extra={extra}
      icon={icon}
      status={status !== 'pending' ? status : 'info'}
      subTitle={t(`user.verification.${status}.subTitle`)}
      title={t(`user.verification.${status}.title`)}
    />
  )
}

VerifyUserResult.propTypes = {
  token: PropTypes.string.isRequired,
}

export default VerifyUserResult
