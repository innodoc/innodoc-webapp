import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { Button, Result } from 'antd'
import { LoadingOutlined, LoginOutlined } from '@ant-design/icons'

import { verifyUser } from '@innodoc/client-misc/src/api'
import { useTranslation } from '@innodoc/common/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'

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

  // Wrap inside <>
  // https://github.com/zeit/next.js/issues/7915#issuecomment-573397162
  const extra =
    status === 'success' ? (
      <Link href="/login">
        <div>
          <Button icon={<LoginOutlined />} type="primary" key="console">
            {t('user.login.title')}
          </Button>
        </div>
      </Link>
    ) : null

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
