import React from 'react'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import { useTranslation } from '../../../../lib/i18n'

const UserMenu = () => {
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
    <Menu.SubMenu title={userMenuTitle}>
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
