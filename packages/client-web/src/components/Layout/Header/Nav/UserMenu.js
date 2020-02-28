import React from 'react'
import Link from 'next/link'
import { Menu } from 'antd'
import { LoginOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

const UserMenu = (props) => {
  const { t } = useTranslation()
  const userMenuTitle = (
    <span>
      <UserOutlined />
      <span>{t('user.loginTitle')}</span>
    </span>
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
            <span>{t('user.loginTitle')}</span>
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="register">
        <Link href="/register">
          <a>
            <UserAddOutlined />
            <span>{t('user.registerTitle')}</span>
          </a>
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default UserMenu
