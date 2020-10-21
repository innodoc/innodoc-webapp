import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'

import LanguageSwitcher from './LanguageSwitcher'
import UserMenu from './UserMenu'
import css from './style.sss'

const SecondMenu = ({ menuMode }) => (
  <Menu className={css.secondMenu} mode={menuMode} selectable={false}>
    <LanguageSwitcher />
    <UserMenu />
  </Menu>
)

SecondMenu.propTypes = {
  menuMode: PropTypes.string.isRequired,
}

export default SecondMenu
