import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Menu } from 'antd'
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import css from './style.sss'

const UserMenu = (props) => {
  const { email, ...restProps } = props

  const { t } = useTranslation()
  const userMenuTitle = email ? (
    <span>
      <UserOutlined />
      <strong>{email}</strong>
    </span>
  ) : (
    <Link href="/login">
      <a className={css.loginLink}>
        <UserOutlined />
        {t('user.login.title')}
      </a>
    </Link>
  )

  const items = email
    ? [
        <Menu.Item key="changePassword">
          <Link href="/change-password">
            <a>
              <LockOutlined />
              {t('user.changePassword.title')}
            </a>
          </Link>
        </Menu.Item>,
        <Menu.Item key="delete-account">
          <Link href="/delete-account">
            <a>
              <UserDeleteOutlined />
              {t('user.deleteAccount.title')}
            </a>
          </Link>
        </Menu.Item>,
        <Menu.Item key="logout">
          <Link href="/logout">
            <a>
              <LogoutOutlined />
              {t('user.logout.title')}
            </a>
          </Link>
        </Menu.Item>,
      ]
    : [
        <Menu.Item key="login">
          <Link href="/login">
            <a>
              <LoginOutlined />
              {t('user.login.title')}
            </a>
          </Link>
        </Menu.Item>,
        <Menu.Item key="register">
          <Link href="/register">
            <a>
              <UserAddOutlined />
              {t('user.registration.title')}
            </a>
          </Link>
        </Menu.Item>,
      ]

  return (
    <Menu.SubMenu
      title={userMenuTitle}
      // antd menu is passing a bunch of props
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    >
      {items}
    </Menu.SubMenu>
  )
}

UserMenu.defaultProps = {
  email: null,
}

UserMenu.propTypes = {
  email: PropTypes.string,
}

export default UserMenu
