import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'

// `onClick`, `href`, and `ref` need to be passed to the DOM element
// for proper handling
const WrappedLoginButton = React.forwardRef(({ href, onClick }, ref) => {
  const { t } = useTranslation()
  return (
    <Button href={href} icon={<LoginOutlined />} onClick={onClick} ref={ref}>
      {t('user.login.title')}
    </Button>
  )
})

WrappedLoginButton.propTypes = {
  href: PropTypes.string.isRequired,
  onClick: PropTypes.function.isRequired,
}

const LoginButton = () => (
  <Link href="/login">
    <WrappedLoginButton />
  </Link>
)

export default LoginButton
