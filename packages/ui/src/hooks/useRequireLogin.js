import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Modal } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { getApp } from '@innodoc/store/selectors/misc'
import { useTranslation } from 'next-i18next'

const useRequireLogin = (requireLogin = true) => {
  const { t } = useTranslation()
  const { loggedInEmail } = useSelector(getApp)
  const modal = useRef(null)
  const router = useRouter()

  useEffect(() => {
    if (requireLogin && !loggedInEmail && !modal.current) {
      modal.current = Modal.warning({
        content: t('useRequireLogin.text'),
        keyboard: false,
        okButtonProps: { icon: <LoginOutlined /> },
        okText: t('user.login.title'),
        onOk: (close) => {
          router.push('/login')
          close()
        },
        title: t('useRequireLogin.title'),
      })
    }

    return () => {
      if (modal.current) {
        modal.current.destroy()
        modal.current = null
      }
    }
  }, [loggedInEmail, requireLogin, router, t])
}

export default useRequireLogin
