import { LoginOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

function LoginButton() {
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <Button icon={<LoginOutlined />} onClick={() => router.push('/login')}>
      {t('user.login.title')}
    </Button>
  )
}

export default LoginButton
