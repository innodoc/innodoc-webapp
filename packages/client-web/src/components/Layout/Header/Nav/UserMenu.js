import React from 'react'
import { Icon, Menu } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

const UserMenu = (props) => {
  const { t } = useTranslation()
  const userMenuTitle = (
    <span>
      <Icon type="user" />
      <span>
        {t('header.login')}
      </span>
    </span>
  )
  return (
    <Menu.SubMenu
      title={userMenuTitle}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Menu.Item key="login">
        <Icon type="login" />
        <span>
          {t('header.login')}
        </span>
      </Menu.Item>
      <Menu.Item key="register">
        <Icon type="user-add" />
        <span>
          {t('header.createAccount')}
        </span>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

export default UserMenu