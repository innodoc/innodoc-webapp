import { LoginOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

const useRequireLogin = (requireLogin = true) => {
  const { t } = useTranslation()
  const modal = useRef(null)
  const router = useRouter()

  // TODO: loggedInEmail
  const loggedInEmail = undefined

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
