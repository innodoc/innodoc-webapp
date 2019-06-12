import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

const UserMenu = ({ t, ...otherProps }) => {
  const userMenuTitle = (
    <span>
      <Icon type="user" />
      <span>
        {t('header.login')}
      </span>
    </span>
  )
  return (
    <Menu.SubMenu title={userMenuTitle} {...otherProps}>
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

UserMenu.propTypes = {
  t: PropTypes.func.isRequired,
}

export default UserMenu
