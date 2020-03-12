import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Menu } from 'antd'
import {
  LineChartOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'

const UserMenuLoggedIn = (props) => {
  const { email, ...restProps } = props

  const { t } = useTranslation()
  const userMenuTitle = (
    <span>
      <UserOutlined />
      <strong>{email}</strong>
    </span>
  )
  return (
    <Menu.SubMenu
      title={userMenuTitle}
      // antd menu is passing a bunch of props
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restProps}
    >
      <Menu.Item key="results">
        <Link href="/results">
          <a>
            <LineChartOutlined />
            {t('user.resultsTitle')}
          </a>
        </Link>
      </Menu.Item>
      <Menu.Item key="logout">
        <Link href="/logout">
          <a>
            <LogoutOutlined />
            {t('user.logoutTitle')}
          </a>
        </Link>
      </Menu.Item>
    </Menu.SubMenu>
  )
}

UserMenuLoggedIn.propTypes = {
  email: PropTypes.string.isRequired,
}

export default UserMenuLoggedIn
