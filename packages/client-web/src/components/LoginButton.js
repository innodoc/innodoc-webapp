import React from 'react'
import { useRouter } from 'next/router'
import { Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'

const LoginButton = () => {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button icon={<LoginOutlined />} onClick={() => router.push('/login')}>
      {t('user.login.title')}
    </Button>
  )
}

export default LoginButton
