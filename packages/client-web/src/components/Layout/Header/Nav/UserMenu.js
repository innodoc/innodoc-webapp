import React from 'react'
import { Menu } from 'antd'
import { LoginOutlined, UserAddOutlined, UserOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

const UserMenu = (props) => {
  const { t } = useTranslation()
  const userMenuTitle = (
    <span>
      <UserOutlined />
      <span>{t('header.login')}</span>
    </span>
  )
  return (
    <Menu.SubMenu
      title={userMenuTitle}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Menu.Item key="login">
        <LoginOutlined />
        <span>{t('header.login')}</span>
      </Menu.Item>
      <Menu.Item key="register">
        <UserAddOutlined />
        <span>{t('header.createAccount')}</span>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default UserMenu
