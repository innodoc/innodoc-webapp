import { Menu } from 'antd'
import PropTypes from 'prop-types'

import LanguageSwitcher from './LanguageSwitcher.jsx'
import css from './SecondMenu.module.sss'
import UserMenu from './UserMenu.jsx'

function SecondMenu({ menuMode }) {
  return (
    <Menu className={css.secondMenu} mode={menuMode} selectable={false}>
      <LanguageSwitcher />
      <UserMenu />
    </Menu>
  )
}

SecondMenu.propTypes = {
  menuMode: PropTypes.string.isRequired,
}

export default SecondMenu
