import React from 'react'
import Link from 'next/link'
import { Menu } from 'antd'
import { LoginOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import css from './style.sss'

const UserMenuLoggedOut = (props) => {
  const { t } = useTranslation()
  const userMenuTitle = (
    <Link href="/login">
      <a className={css.loginLink}>
        <UserOutlined />
        {t('user.login.title')}
      </a>
    </Link>
  )
  return (
    <Menu.SubMenu
      title={userMenuTitle}
      // antd menu is passing a bunch of props
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Menu.Item key="login">
        <Link href="/login">
          <a>
            <LoginOutlined />
            {t('user.login.title')}
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link href="/register">
          <a>
            <UserAddOutlined />
            {t('user.registration.title')}
          </a>
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default UserMenuLoggedOut
